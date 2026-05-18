import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import { MdCancel } from "react-icons/md";
import { FaUpload } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import useApi from "../../hooks/useApi";
import { useLoading } from "../../context/LoadingContext";
import { IPostGroup, IPostType, ITag, PostDetailsType } from "../../types/globals";
import { BASE_URL } from "../../App";
import { validatePostDetails } from "../../utils/validate";

type FormErrorType = {
  title: string;
  shortTitle: string;
  culture: string;
  postGroup: string;
  postType: string;
  description: string;
  tags: string;
  image: string;
}

const initialFormData: PostDetailsType = {
  title: '',
  shortTitle: '',
  culture: '',
  postGroup: '',
  postType: '',
  description: '',
  tags: [],
  locationSpecific: false,
  image: null
}

const initialFormErrors: FormErrorType = {
  title: '',
  shortTitle: '',
  culture: '',
  postGroup: '',
  postType: '',
  description: '',
  tags: '',
  image: ''
}

const PostDetails = () => {
  const { id } = useParams();

  const [errors, setErrors] = useState<FormErrorType>(initialFormErrors);
  const [formData, setFormData] = useState<PostDetailsType>(initialFormData);
  const [allowedTags, setAllowedTags] = useState<ITag[]>([]);
  const [cultures, setCultures] = useState<{_id: string, title: string}[]>([]);
  const [postGroups, setPostGroups] = useState<IPostGroup[]>([]);
  const [postTypes, setPostTypes] = useState<IPostType[]>([]);
  const [activeTag, setActiveTag] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [visibleStart, setVisibleStart] = useState<number>(0);
  const [showTags, setShowTags] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);

  const { state: authState } = useAuth();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const tagsApi = useApi('/others/tags');
  const culturesApi = useApi('/cultures');
  const postGroupsApi = useApi('/others/post-groups');
  const postTypesApi = useApi('/others/post-types');
  const uploadApi = useApi('/upload/single', { auto: false });
  const postsApi = useApi('/posts', { auto: false });
  const draftsApi = useApi('/drafts', { auto: false });

  const descrRef = useRef<HTMLTextAreaElement | null>(null);
  const tagRef = useRef<HTMLInputElement | null>(null);

  const pageSize = 10;

  useEffect(() => {
    setLoading(tagsApi.loading || postGroupsApi.loading || postTypesApi.loading || culturesApi.loading);
  }, [tagsApi.loading, postGroupsApi.loading, postTypesApi.loading, culturesApi.loading]);

  useEffect(() => {
  }, [tagsApi.data])

  useEffect(() => {
    if(culturesApi.data)
      setCultures(culturesApi.data.cultures.sort((a: any, b: any) => a.title < b.title));

    if (tagsApi.data && tagsApi.data.tags)
      setAllowedTags(tagsApi.data.tags.sort((a: ITag, b: ITag) => a.tag.localeCompare(b.tag)))

    if(postGroupsApi.data)
      setPostGroups(
        postGroupsApi.data.postGroups.sort((a: IPostGroup, b: IPostGroup) => a.name.localeCompare(b.name))
      ); 

    if(postTypesApi.data)
      setPostTypes(
        postTypesApi.data.postTypes.sort((a: IPostType, b: IPostType) => a.name.localeCompare(b.name))
      );
  }, [postGroupsApi.data, postTypesApi.data, tagsApi.data, culturesApi.data]);

  useEffect(() => {
    if(culturesApi.error) {
      toast.error(culturesApi.error);
      console.error(culturesApi.error);
    }

    if (tagsApi.error) {
      toast.error(tagsApi.error);
      console.error(tagsApi.error);
    }

    if (uploadApi.error) {
      toast.error(uploadApi.error);
      console.error(uploadApi.error);
    }

    if (postsApi.error) {
      toast.error(postsApi.error);
      console.error(postsApi.error);
    }

    if (draftsApi.error) {
      toast.error(draftsApi.error);
      console.error(draftsApi.error);
    }
  }, [tagsApi.error, uploadApi.error, postsApi.error, draftsApi.error, culturesApi.error]);

  useEffect(() => {
    const fetchDraft = async () => {
      const res = await draftsApi.refetch({ endpoint: `/drafts/${id}`, method: "GET" });
      if (!res) return;
      if (res.draft) {
        setFormData(res.draft.details);
        if (validatePostDetails(res.draft.details)) {
          setSubmitted(true)
        }
      } else
        toast.error("Failed to fetch draft.");
    }

    fetchDraft();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setShowTags(false);
      }
    }

    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect(() => {
    const el = descrRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [formData.description])

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value.toLowerCase();
    if (!tag)
      setAllowedTags(prev =>
        prev
          .filter((t: ITag) => !formData.tags.includes(t.tag))
      );
    else
      setAllowedTags(prev =>
        prev
          .filter((t: ITag) => t.tag.startsWith(tag) && !formData.tags.includes(t.tag))
      );
    setActiveTag(tag);
  }

  const handleAddTag = (tag: ITag) => {
    setErrors(prev => ({
      ...prev,
      tags: ""
    }));

    if (tagRef.current) {
      if (!formData.tags.includes(tag._id)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag._id]
        }));
        tagRef.current.value = '';
        setActiveTag('');
        const index = allowedTags.indexOf(tag);
        setAllowedTags(prev => prev.filter((_, i) => i !== index));
        setActiveIndex(0);
        setVisibleStart(0);
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!allowedTags.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (activeIndex + 1) % allowedTags.length;
      setActiveIndex(newIndex);

      if (newIndex === 0) {
        setVisibleStart(0);
      } else if (newIndex >= visibleStart + pageSize) {
        setVisibleStart(visibleStart + 1);
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = (activeIndex - 1 + allowedTags.length) % allowedTags.length;
      setActiveIndex(newIndex);

      if (newIndex === allowedTags.length - 1) {
        setVisibleStart(Math.max(0, allowedTags.length - pageSize));
      } else if (newIndex < visibleStart) {
        setVisibleStart(visibleStart - 1);
      }
    }

    if (e.key === "Enter" && allowedTags[activeIndex]) {
      e.preventDefault();
      handleAddTag(allowedTags[activeIndex]);
    }

  };

  const handleRemoveTag = (index: number) => {
    setAllowedTags(
      (prev) => [
        ...prev, 
        tagsApi.data.tags
          .find((t: ITag) => t._id === formData.tags[index])
      ]
    );
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, id) => id !== index)
    }));
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({
      ...prev,
      image: ''
    }));

    setFormData((prev) => ({
      ...prev,
      image: e.target.files![0]
    }))
  }

  const handleFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    setSaving(true);
    e.preventDefault();
    const newErrors = { ...initialFormErrors };

    if (!formData.title?.trim()) {
      newErrors.title = "Main Title cannot be empty!";
    }

    if (!newErrors.title && formData.title.length < 5) {
      newErrors.title = "Main Title should be at least 5 characters long!";
    }

    if (!formData.shortTitle?.trim()) {
      newErrors.shortTitle = "Short Title cannot be empty!";
    }

    if (!newErrors.shortTitle && formData.shortTitle.length < 3) {
      newErrors.shortTitle = "Short Title should be at least 3 characters long!";
    }

    if(!formData.culture?.trim()) 
      newErrors.culture = 'Culture is required.';

    if (!formData.postGroup) {
      newErrors.postGroup = "Please choose a post group.";
    }

    if (!formData.postType) {
      newErrors.postType = "Please choose a post type.";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description cannot be empty!";
    }

    if (formData.description && formData.description.split(' ').length < 10) {
      newErrors.description = "Description should be atleast 10 words long.";
    }

    if (formData.tags.length < 1) {
      newErrors.tags = "Add at least one tag.";
    }

    if (!formData.image) {
      newErrors.image = "Please upload a image.";
    }

    if (!(formData.image instanceof File) && typeof formData.image !== "string") {
      newErrors.image = 'Uploaded image is not a file.';
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if (hasErrors) {
      setSaving(false);
      return;
    }

    let res;
    if(formData.image instanceof File) {
      const imageData = new FormData();
      imageData.append("file", formData.image as File);
      res = await uploadApi.post(imageData);
      if (!res) {
        setSaving(false);
        return;
      };
    }

    const details = {
      ...formData,
      image: res ? res.path : formData.image
    };
    res = await postsApi.refetch({ endpoint: `/posts/draft/${id}/details`, method: "POST", body: { details } });
    if (!res) {
      setSaving(false);
      return;
    }

    setSubmitted(true);
    setSaving(false);
  }

  const handleNext = () => {
    if (submitted) {
      navigate(`/create/post/${id}/editor`)
    } else {
      toast.error("You need to submit the form first!");
    }
  }

  const handleEditAgain = async () => {
    setSubmitted(false);
    await postsApi.refetch({ endpoint: `/posts/draft/${id}/details`, method: "DELETE" });
  }

  if (!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace />

  return (
    <div className="w-full mt-20">
      <Title title="Post Details" />

      <form
        className="w-4/5 md:w-2/3 lg:w-1/2 flex flex-col gap-20 mx-auto py-10 justify-center"
        onSubmit={handleFormSubmit}>
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="title">
            Main Title
          </label>
          <input
            className={`text-black font-semibold bg-white p-2 disabled:bg-gray-400`}
            disabled={submitted}
            type="text"
            id="title"
            name="title"
            value={formData.title ?? ""}
            onChange={handleFormChange} />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="shortTitle">
            Short Title
          </label>
          <input
            className={`text-black font-semibold bg-white p-2 disabled:bg-gray-400`}
            disabled={submitted}
            type="text"
            id="shortTitle"
            name="shortTitle"
            value={formData.shortTitle ?? ""}
            onChange={handleFormChange} />
          {errors.shortTitle && <p className="text-red-500">{errors.shortTitle}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="culture">
            Culture
          </label>
          <select
            name="culture"
            id="culture"
            className="p-2 cursor-pointer disabled:bg-gray-300 bg-white"
            value={formData.culture ?? ""}
            onChange={handleFormChange}
          >
            <option value="" hidden className="text-white">-- Choose a culture --</option>
            {
              cultures.map((culture, idx) => (
                <option key={idx} value={culture._id}>{culture.title}</option>
              ))
            }
          </select>
          {errors.culture && <p className="text-red-500">{errors.culture}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="culture">
            Post Group
          </label>
          <select
            disabled={submitted}
            name="postGroup"
            id="postGroup"
            className="p-2 cursor-pointer disabled:bg-gray-300 bg-white"
            value={formData.postGroup ?? ""}
            onChange={handleFormChange}
          >
            <option value="" hidden className="text-white">-- Choose a Post group --</option>
            {
              postGroups.map((pg, idx) => (
                <option key={idx} value={pg._id}>{pg.name}</option>
              ))
            }
          </select>
          {errors.postGroup && <p className="text-red-500">{errors.postGroup}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="culture">
            Post Type
          </label>
          <select
            disabled={submitted}
            name="postType"
            id="postType"
            className="p-2 cursor-pointer disabled:bg-gray-300 bg-white"
            value={formData.postType ?? ""}
            onChange={handleFormChange}
          >
            <option value="" hidden className="text-white">-- Choose a Post type --</option>
            {
              postTypes.map((pt, idx) => (
                <option key={idx} value={pt._id}>{pt.name}</option>
              ))
            }
          </select>
          {errors.postType && <p className="text-red-500">{errors.postType}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="description">
            Description
          </label>
          <textarea
            className="text-black font-semibold p-2 bg-white overflow-hidden resize-none disabled:bg-gray-400"
            rows={1}
            disabled={submitted}
            id="description"
            name="description"
            ref={descrRef}
            value={formData.description ?? ""}
            onChange={handleFormChange}
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="w-full relative flex flex-col gap-3">
            <label className="text-primary font-semibold text-[1.5rem]" htmlFor="tags">
              Tags
            </label>
            <div className="w-full flex gap-1 flex-wrap">
              {
                formData.tags.length > 0 && formData.tags.map((tag, index) => (
                  <div key={index} className="text-white max-w-full flex items-center justify-evenly gap-1 bg-gray-600 px-2 rounded-lg">
                    <p className="max-w-full wrap-break-word">{tagsApi.data?.tags.find((t: ITag) => t._id === tag)?.tag}</p>
                    {
                      !submitted &&
                      <MdCancel
                        className="fill-gray-400 cursor-pointer hover:fill-white"
                        onClick={() => handleRemoveTag(index)} />
                    }
                  </div>
                ))
              }
            </div>
            <input
              className="text-black w-1/2 font-semibold bg-white p-2 overflow-hidden resize-none disabled:bg-gray-400"
              type="text"
              id="tags"
              disabled={submitted}
              name="tags"
              ref={tagRef}
              autoComplete="off"
              onKeyDown={handleKeyDown}
              onFocus={() => setShowTags(true)}
              value={activeTag}
              onChange={handleTagChange}
            />
            <div
              className={`bg-white w-1/2 flex flex-col items-center justify-center absolute top-full 
                ${showTags ? "visible" : "hidden"}`}
            >
              {allowedTags
                .slice(visibleStart, visibleStart + pageSize)
                .map((tag: ITag, index: number) => {
                  const globalIndex = visibleStart + index;
                  return (
                    <div
                      key={globalIndex}
                      className={`w-full flex items-center justify-center cursor-pointer hover:bg-primary
                        ${globalIndex === activeIndex ? "bg-primary" : ""}`}
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag.tag}
                    </div>
                  );
                })}
            </div>
          </div>
          {errors.tags && <p className="text-red-500">{errors.tags}</p>}
        </div>

        <div className="flex flex-col w-full">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="locationSpecific-yes">
            Is the post location specific?
          </label>
          <div className="flex gap-10">
            <label className="text-white text-[1.5rem] cursor-pointer" htmlFor="locationSpecific-yes">
              <input
                className="cursor-pointer"
                type="radio"
                value="true"
                disabled={submitted}
                id="locationSpecific-yes"
                name="locationSpecific"
                checked={formData.locationSpecific ?? false}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  locationSpecific: (e.target as HTMLInputElement).value === "true"
                }))}
              />
              Yes
            </label>
            <label className="text-white text-[1.5rem] cursor-pointer" htmlFor="locationSpecific-no">
              <input
                className="cursor-pointer"
                type="radio"
                value="false"
                disabled={submitted}
                id="locationSpecific-no"
                name="locationSpecific"
                checked={!formData.locationSpecific}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  locationSpecific: !((e.target as HTMLInputElement).value === "false")
                }))}
              />
              No
            </label>
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]">
            Image
          </label>
          <label htmlFor="image" className="w-fit">
            <div className={`text-black w-fit p-5 rounded-lg flex flex-col items-center 
              justify-center border-3 border-solid border-primary  
              ${submitted ? 'bg-white/70 cursor-not-allowed' : 'bg-white hover:bg-white/70 cursor-pointer'}`}>
              <FaUpload />
              <p>Upload Image</p>
            </div>
          </label>
          <input
            className="hidden"
            disabled={submitted}
            type="file"
            accept="image/*"
            id="image"
            name="image"
            onChange={handleFileChange}
          />
          {
            formData.image &&
            <div className="w-1/2 border-2 border-solid border-white flex">
              <img
                className="w-full aspect-square object-cover object-center"
                src={
                  formData.image instanceof File ?
                    URL.createObjectURL(formData.image) :
                    `${BASE_URL}${formData.image}`
                } alt="" />
            </div>
          }
          {errors.image && <p className="text-red-500">{errors.image}</p>}
        </div>

        {

          submitted ?
            <FaEdit
              className={`text-[2.5rem] cursor-pointer m-5 bg-black mx-auto 
              text-white hover:scale-110 hover:text-primary z-50`}
              id='edit'
              onClick={handleEditAgain} />
            :
            <Button
              loading={saving}
              loadingText="Saving"
              content="Save"
              className="text-[1.5rem] w-2/5 sm:w-1/5 mx-auto"
              type="submit"
            />
        }

      </form>

      <div className="flex w-screen items-center justify-between p-10">
        <div
          className={`text-[1.2rem] sm:text-[1.75rem] hover:text-primary text-white cursor-pointer`}
          onClick={() => navigate(`/create/post/${id}`)}>
          {`< Progress`}
        </div>
        <div
          className={`text-[1.2rem] sm:text-[1.75rem]
          ${submitted ? 'hover:text-primary text-white cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
          onClick={handleNext}>
          {`Editor >`}
        </div>
      </div>

    </div>
  );
};

export default PostDetails;
