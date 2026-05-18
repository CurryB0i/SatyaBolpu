import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Title from "../../components/Title";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDialog } from "../../context/DialogBoxContext";
import useApi from "../../hooks/useApi";
import ProgressBar from "../../components/ProgressBar";
import { toast } from "react-toastify";
import { CultureState } from "../../types/globals";
import { validateCultureDetails } from "../../utils/validate";

const NewCulture = () => {
  
  const { id } = useParams();

  const [progress,setProgress] = useState<number>(0);
  const [cultureState, setCultureState] = useState<CultureState | null>(null);

  const dialog = useDialog();
  const draftsApi = useApi('/drafts', { auto: false });
  const culturesApi = useApi('/cultures', { auto: false })
  const { state: authState } = useAuth();

  const steps = {
    'Culture Details': 'details',
    'Editor': 'editor',
  };

  useEffect(() => {
    const fetchDraft = async () => {
      const res = await draftsApi.refetch({ endpoint: `/drafts/${id}`, method: 'GET' });
      if (!res) return;
      setCultureState({
        details: validateCultureDetails(res.draft.details) ? res.draft.details : null,
        content: res.draft.content ?? ''
      });
    }

    fetchDraft();
  }, [id]);

  const handleUpload = () => {
    const uploadCulture = async () => {
      if(!cultureState) return;
      const res = await culturesApi.refetch({ endpoint: '/cultures', method: 'POST', body: cultureState });
      if(res) {
        toast.success(`Culture-${res.culture.title} successfully uploaded.`)
        draftsApi.refetch({ endpoint: `/drafts/${id}`, method: "DELETE" });
        setCultureState(null);
      }
    }

    dialog.popup({
      title: "Culture Upload.",
      description:
        "Are you sure you want to add this culture? The saved draft will be cleared on upload.",
      onConfirm: uploadCulture,
    });
  }

  useEffect(() => {
    if (culturesApi.error) {
      toast.error(culturesApi.error);
      console.error(culturesApi.error);
    }

    if(draftsApi.error) {
      toast.error(draftsApi.error);
      console.error(draftsApi.error);
    }
  }, [culturesApi.error, draftsApi.error]);

  const handleClearProgress = async () => {
    await culturesApi.refetch({ endpoint: `/cultures/draft/${id}/details`, method: "DELETE" });
    await culturesApi.refetch({ endpoint: `/cultures/draft/${id}/content`, method: "DELETE" });
  }
  
  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  if(!cultureState) return;

  return (
    <div className="mt-20 mb-40 flex flex-col gap-20 items-center justify-center">
      <Title title={cultureState.details ? `New Culture - ${cultureState.details.title}` : 'New Draft Culture'}/>
      
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
                  culturesApi.loading     
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
