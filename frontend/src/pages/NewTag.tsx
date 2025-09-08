import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import useApi from "../hooks/useApi";
import { toast } from "react-toastify";

const NewTag = () => {
  const [tag,setTag] = useState<string>('');
  const [existingTags,setExistingTags] = useState<string[]>([]);
  const [error,setError] = useState<string>('');

  const tagsApi = useApi('/tags');
  const tagsPostApi = useApi('/tags', { auto: false });

  useEffect(() => {
    if(tagsApi.data) {
      setExistingTags(tagsApi.data.tags);
    }
  },[tagsApi.data]);

  useEffect(() => {
    if(tag && tagsPostApi.data) {
      toast.success(`Tag ${tagsPostApi.data.tag} successfully added.`);
      setTag('');
    }
  },[tagsPostApi.data])

  useEffect(() => {
    if(tagsApi.error) {
      toast.error(tagsApi.error);
    }
    if(tagsPostApi.error) {
      toast.error(tagsPostApi.error);
    }
  },[tagsApi.error,tagsPostApi.error]);

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value.trim());
  }

  const handleTagSubmit = (e: FormEvent) => {
    e.preventDefault();
    let newError: string = '';
    if(!tag.trim())
      newError = "Tag is required.";

    if(existingTags.includes(tag)) 
      newError = `Tag ${tag} already exists.`

    setError(newError);
    if(newError) return;
    
    tagsPostApi.post({ tag }); 
  }

  return (
    <div className="w-full">
      <div className="w-full my-20">
        <Title title="New Tag"/>
      </div>

      <form 
        className="w-1/2 flex flex-col gap-5 items-center justify-center mx-auto"
        onSubmit={handleTagSubmit}>
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="tag">
            Tag
          </label>
          <input 
            className={`text-black w-1/3 font-semibold p-2`} 
            type="text" 
            id="tag" 
            name="tag" 
            value={tag}
            onChange={handleTagChange}/>
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
