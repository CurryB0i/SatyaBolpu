import { useEffect, useState } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogBoxContext";
import useApi from "../hooks/useApi";
import { clearEntityStore, getFile } from "../utils/FileStore";
import ProgressBar from "../components/ProgressBar";
import { CultureState, useCulture } from "../context/CultureContext";
import { toast } from "react-toastify";

const NewCulture = () => {
  
  const [progress,setProgress] = useState<number>(0);
  const dialog = useDialog();
  const uploadMultipleApi = useApi('/upload/multiple',{ auto: false });
  const uploadSingleApi = useApi('/upload/single',{ auto: false });
  const culturesApi = useApi('/cultures', { auto: false })
  const { state: authState } = useAuth();
  const { state: cultureState, dispatch: cultureDispatch } = useCulture();

  const steps = {
    'Culture Details': 'culture-details',
    'Editor': 'editor',
  };

  const handleUpload = () => {
    const uploadCulture = async () => {
      let uploadData: CultureState = cultureState;

      if(cultureState.details) {
        if (cultureState.details.coverImages.length > 0) {
          const files = await Promise.all(
            cultureState.details.coverImages.map(async (coverImage) => {
              return await getFile({ entity: "culture", type: "details" },Number(coverImage));
            })
          );
          const validFiles = files.filter((f): f is File => f !== null);
          if (validFiles.length > 0) {
            const formData = new FormData();
            validFiles.forEach((file) => {
              formData.append("files", file);
            });
            const res = await uploadMultipleApi.post(formData);
            uploadData = {
              ...uploadData,
              details: { ...uploadData.details!, coverImages: res.paths },
            };
          }
        }

        if (cultureState.details.galleryImages.length > 0) {
          const files = await Promise.all(
            cultureState.details.galleryImages.map(async (galleryImage) => {
              return await getFile({ entity: "culture", type: "details" },Number(galleryImage));
            })
          );
          const validFiles = files.filter((f): f is File => f !== null);
          if (validFiles.length > 0) {
            const formData = new FormData();
            validFiles.forEach((file) => {
              formData.append("files", file);
            });
            const res = await uploadMultipleApi.post(formData);
            uploadData = {
              ...uploadData,
              details: { ...uploadData.details!, galleryImages: res.paths },
            };
          }
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(cultureState.content, "text/html");
        const body = doc.body;

        for (let i = 0; i < body.children.length; i++) {
          const child = body.children[i];

          if (child.className.includes("file")) {
            const fileEl = child.querySelector<HTMLElement>("[data-idbkey]");
            if (fileEl) {
              const idbKey = fileEl.getAttribute("data-idbkey");
              if (!idbKey) continue;
              const file = await getFile({ entity: "culture", type: "editor" },Number(idbKey));
              if (!file) continue;
              const formData = new FormData();
              formData.append("file", file);
              const res = await uploadSingleApi.post(formData);
              fileEl.setAttribute("src", res.path);
              fileEl.removeAttribute("data-idbkey");
            }
          }
        }

        uploadData = { ...uploadData, content: body.innerHTML };
        await culturesApi.post(uploadData);
      }
    };

    dialog.popup({
      title: "Culture Upload.",
      descr:
        "Are you sure you want to add this culture? All saved drafts will be cleared on upload.",
      onConfirm: uploadCulture,
    });
  }

  useEffect(() => {
    if(culturesApi.data) {
       toast.success(`Culture-${culturesApi.data.culture.name} successfully uploaded.`)
       cultureDispatch({
         type: 'CLEAR_CULTURE'
       });
       (async () => await clearEntityStore({ entity: "culture" }))();
    }
    if(culturesApi.error) console.log(culturesApi.error)
  },[culturesApi.data, culturesApi.error])

  const handleClearProgress = async () => {
    cultureDispatch({
      type: 'CLEAR_CULTURE'
    });
    await clearEntityStore({ entity: "culture" });
  }
  
  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  return (
    <div className="mt-20 mb-40 flex flex-col gap-20 items-center justify-center">
      <Title title={cultureState.details ? `New Culture - ${cultureState.details.name}` : 'New Draft Culture'}/>
      
      <div className="w-full flex flex-col items-center justify-center gap-20">
        <ProgressBar 
          progress={progress} 
          setProgress={setProgress} 
          state={cultureState} 
          steps={steps}
        />
        <div className="flex gap-10">
          {
            progress > 100 &&
              <Button 
                content="Upload Culture" 
                onClick={handleUpload}
                loading={
                  culturesApi.loading ||        
                  uploadMultipleApi.loading || 
                  uploadSingleApi.loading
                }
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

)};

export default NewCulture;
