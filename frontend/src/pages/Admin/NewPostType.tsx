import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import Title from "../../components/Title";
import Button from "../../components/Button";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const NewPostType = () => {
  const [postType, setPostType] = useState<string>('');
  const [existingPostTypes, setExistingPostTypes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const postTypesApi = useApi('/others/post-types');
  const postTypesPostApi = useApi('/others/post-types', { auto: false });

  useEffect(() => {
    if(postTypesApi.data) {
        setExistingPostTypes(postTypesApi.data.postTypes);
    }
  }, [postTypesApi.data]);

  useEffect(() => {
    if (postTypesApi.error) {
      console.error(postTypesApi.error);
      toast.error(postTypesApi.error);
    }

    if (postTypesPostApi.error) {
      console.error(postTypesPostApi.error);
      toast.error(postTypesPostApi.error);
    }
  }, [postTypesApi.error, postTypesPostApi.error]);

  const handlePostTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostType(e.target.value);
  }

  const handlePostTypeSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newError: string = '';
    if (!postType.trim())
      newError = "PostType is required.";

    if (existingPostTypes.includes(postType))
      newError = `PostType ${postType} already exists.`

    setError(newError);
    if (newError) return;

    const res = await postTypesPostApi.post({ postType });
    if(!res) return;
    toast.success(`PostType ${res.postType} successfully added.`);
    setPostType('');
  }

  return (
    <div className="w-full my-20">
      <div className="w-full mb-20">
        <Title title="New PostType" />
      </div>

      <form
        className="w-3/4 md:w-1/2 lg:w-1/3 flex flex-col gap-5 items-center justify-center mx-auto"
        onSubmit={handlePostTypeSubmit}>
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="postType">
            Post Type
          </label>
          <input
            className={`w-full text-black bg-white font-semibold p-2`}
            type="text"
            id="postType"
            name="postType"
            value={postType}
            onChange={handlePostTypeChange} />
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <Button
          content="Add Post type"
          type="submit"
          loading={postTypesPostApi.loading}
          loadingText="Adding Post type"
        />
      </form>
    </div>
  )
}

export default NewPostType;
