import { ChangeEvent, SubmitEvent, useEffect, useLayoutEffect, useState } from "react";
import Title from "../../components/Title";
import Button from "../../components/Button";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";

type FormDataType = {
  postGroup: string;
};

const initialFormData: FormDataType = {
  postGroup: ''
};

const NewPostGroup = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [existingPostGroups, setExistingPostGroups] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormDataType>(initialFormData);

  const postGroupsApi = useApi('/others/post-groups');
  const postGroupsPostApi = useApi('/others/post-groups', { auto: false });
  const { setLoading } = useLoading();

  useLayoutEffect(() => {
    setLoading(postGroupsApi.loading);
  }, [postGroupsApi.loading]);

  useEffect(() => {
    if (postGroupsApi.data) {
      setExistingPostGroups(postGroupsApi.data.postGroups.map((pg: any) => pg.name));
    }
  }, [postGroupsApi.data]);

  useEffect(() => {
    if (postGroupsApi.error) {
      console.error(postGroupsApi.error);
      toast.error(postGroupsApi.error);
    }

    if (postGroupsPostApi.error) {
      console.error(postGroupsPostApi.error);
      toast.error(postGroupsPostApi.error);
    }
  }, [postGroupsApi.error, postGroupsPostApi.error]);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handlePostGroupSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors = { ...initialFormData };
    if (!formData.postGroup.trim())
      newErrors.postGroup = "PostGroup is required.";

    if (existingPostGroups.some(pg => pg.toLowerCase() === formData.postGroup.toLowerCase()))
      newErrors.postGroup = `PostGroup ${formData.postGroup} already exists.`

    setErrors(newErrors);
    if (Object.values(newErrors).some(v => v !== '')) return;

    const res = await postGroupsPostApi.post({ ...formData });
    if (!res) return;
    toast.success(`PostGroup ${res.postGroup} successfully added.`);
    setFormData(initialFormData);
  }

  return (
    <div className="w-full my-20">
      <div className="w-full mb-20">
        <Title title="New PostGroup" />
      </div>

      <form
        className="w-3/4 md:w-1/2 lg:w-1/3 flex flex-col gap-5 items-center justify-center mx-auto"
        onSubmit={handlePostGroupSubmit}>
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="postGroup">
            Post Group
          </label>
          <input
            className={`w-full text-black bg-white font-semibold p-2`}
            type="text"
            id="postGroup"
            name="postGroup"
            value={formData.postGroup ?? ""}
            onChange={handleFormChange} />
          {errors.postGroup && <p className="text-red-500">{errors.postGroup}</p>}
        </div>

        <Button
          content="Add Post group"
          type="submit"
          loading={postGroupsPostApi.loading}
          loadingText="Adding Post group"
        />
      </form>
    </div>
  )
}

export default NewPostGroup;
