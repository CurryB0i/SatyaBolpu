import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import { PostState, usePost } from "../context/PostContext";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogBoxContext";
import useApi from "../hooks/useApi";
import { clearIDB, getFile } from "../utils/FileStore";
import ProgressBar from "../components/ProgressBar";
import { toast } from "react-toastify";

const NewPost = () => {
  
  const [progress,setProgress] = useState<number>(0);
  const dialog = useDialog();
  const uploadApi = useApi('/upload/single',{ auto: false });
  const postsApi = useApi('/posts', { auto: false })
  const { state: authState } = useAuth();
  const { state: postState, dispatch: postDispatch } = usePost();

  const steps = useMemo(() => ({
    'Post Details': 'post-details',
    'Editor': 'editor',
    ...(postState.details?.locationSpecific && { 'Map Details': 'map' })
  }), [postState.details?.locationSpecific]);

  const handleUpload = () => {
    const uploadPost = async () => {
      let uploadData: PostState = postState;

      if (postState.details?.image) {
        const file = await getFile(Number(postState.details.image));
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await uploadApi.post(formData);
          uploadData = {
            ...uploadData,
            details: { ...uploadData.details!, image: res.path },
          };
        }
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(postState.content, "text/html");
      const body = doc.body;

      for (let i = 0; i < body.children.length; i++) {
        const child = body.children[i];
        if (child.className.includes("file")) {
          const fileEl = child.querySelector<HTMLElement>("[data-idbkey]");
          if (fileEl) {
            const idbKey = fileEl.getAttribute("data-idbkey");
            if (!idbKey) continue;
            const file = await getFile(Number(idbKey));
            if (!file) continue;
            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadApi.post(formData);
            fileEl.setAttribute("src", res.path);
            fileEl.removeAttribute("data-idbkey");
          }
        }
      }

      uploadData = { ...uploadData, content: body.innerHTML };
      await postsApi.post(uploadData);
    };

    dialog.popup({
      title: "Post Upload.",
      descr:
        "Are you sure you want to upload the post? All saved drafts will be cleared on upload.",
      onConfirm: uploadPost,
    });
  };

  useEffect(() => {
    if(postsApi.data) {
       toast.success(`Post-${postsApi.data.shortTitle} successfully uploaded.`)
       postDispatch({
         type: 'CLEAR_POST'
       });
       (async () => await clearIDB())();
    }
    if(postsApi.error) console.log(postsApi.error)
  },[postsApi.data, postsApi.error])

  const handleClearProgress = async () => {
    postDispatch({
      type: 'CLEAR_POST'
    });
    await clearIDB();
  }
  
  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  return (
    <div className="mt-20 mb-40 flex flex-col gap-20 items-center justify-center">
      <Title title={postState.details ? `New Post - ${postState.details.mainTitle}` : 'New Draft Post'}/>
      
      <div className="w-full flex flex-col items-center justify-center gap-20">
        <ProgressBar 
          progress={progress} 
          setProgress={setProgress} 
          state={postState} 
          steps={steps}
        />
        <div className="flex gap-10">
          {
            progress > 100 &&
              <Button 
                content="Upload Post" 
                onClick={handleUpload}
                loading={postsApi.loading || uploadApi.loading}
                loadingText="Uploading"
              />
          }
          
          <Button 
            content="Clear Progress"
            onClick={handleClearProgress}
          />
        </div>

      </div>
    </div>
  )
}

export default NewPost;
