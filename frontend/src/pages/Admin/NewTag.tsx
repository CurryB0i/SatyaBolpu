import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import Title from "../../components/Title";
import Button from "../../components/Button";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const NewTag = () => {
  const [tag, setTag] = useState<string>('');
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const tagsApi = useApi('/others/tags');
  const tagsPostApi = useApi('/others/tags', { auto: false });

  useEffect(() => {
    if(tagsApi.data) {
      setExistingTags(tagsApi.data.tags);
    }
  }, [tagsApi.data]);

  useEffect(() => {
    if (tagsApi.error) {
      console.error(tagsApi.error);
      toast.error(tagsApi.error);
    }

    if (tagsPostApi.error) {
      console.error(tagsPostApi.error);
      toast.error(tagsPostApi.error);
    }
  }, [tagsApi.error, tagsPostApi.error]);

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  }

  const handleTagSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newError: string = '';
    if (!tag.trim())
      newError = "Tag is required.";

    if (existingTags.includes(tag))
      newError = `Tag ${tag} already exists.`

    setError(newError);
    if (newError) return;

    const res = await tagsPostApi.post({ tag });
    if(!res) return;
    toast.success(`Tag ${res.tag} successfully added.`);
    setTag('');
  }

  return (
    <div className="w-full my-20">
      <div className="w-full mb-20">
        <Title title="New Tag" />
      </div>

      <form
        className="w-3/4 md:w-1/2 lg:w-1/3 flex flex-col gap-5 items-center justify-center mx-auto"
        onSubmit={handleTagSubmit}>
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="tag">
            Tag
          </label>
          <input
            className={`w-full text-black bg-white font-semibold p-2`}
            type="text"
            id="tag"
            name="tag"
            value={tag}
            onChange={handleTagChange} />
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <Button
          content="Add Tag"
          type="submit"
          loading={tagsPostApi.loading}
          loadingText="Adding Tag"
        />
      </form>
    </div>
  )
}

export default NewTag;