import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Title from "../../components/Title";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDialog } from "../../context/DialogBoxContext";
import useApi from "../../hooks/useApi";
import ProgressBar from "../../components/ProgressBar";
import { toast } from "react-toastify";
import { EventState } from "../../types/globals";
import { validateEventDetails } from "../../utils/validate";

const NewEvent = () => {
  
  const { id } = useParams();
  const [progress,setProgress] = useState<number>(0);
  const [eventState, setEventState] = useState<EventState | null>(null);

  const dialog = useDialog();
  const draftsApi = useApi('/drafts', { auto: false });
  const uploadMultipleApi = useApi('/upload/multiple',{ auto: false });
  const uploadSingleApi = useApi('/upload/single',{ auto: false });
  const eventsApi = useApi('/events', { auto: false })
  const { state: authState } = useAuth();

  const steps = {
    'Event Details': 'details',
    'Map': 'map'
  };

  useEffect(() => {
    const fetchDraft = async () => {
      const res = await draftsApi.refetch({ endpoint: `/drafts/${id}`, method: 'GET' });
      if (!res) return;
      setEventState({
        details: validateEventDetails(res.draft.details) ? res.draft.details : null,
        location: res.draft.location ?? null
      });
    }

    fetchDraft();
  }, [id]);

  const handleUpload = () => {
    const uploadCulture = async () => {
      if(!eventState) return;
      const res = await eventsApi.refetch({ endpoint: '/events', method: 'POST', body: eventState });
      if(res) {
        toast.success(`Event-${res.event.title} successfully uploaded.`)
        draftsApi.refetch({ endpoint: `/drafts/${id}`, method: "DELETE" });
        setEventState(null);
      }
    }

    dialog.popup({
      title: "Event Upload.",
      description:
        "Are you sure you want to add this event? The saved draft will be cleared on upload.",
      onConfirm: uploadCulture,
    });
  }

  useEffect(() => {
    if (eventsApi.error) {
      toast.error(eventsApi.error);
      console.error(eventsApi.error);
    }

    if (draftsApi.error) {
      toast.error(draftsApi.error);
      console.error(draftsApi.error);
    }

    if (uploadMultipleApi.error) {
      toast.error(uploadMultipleApi.error);
      console.error(uploadMultipleApi.error);
    }

    if (uploadSingleApi.error) {
      toast.error(uploadSingleApi.error);
      console.error(uploadSingleApi.error);
    }
  }, [eventsApi.error, uploadMultipleApi, uploadSingleApi, draftsApi]);

  const handleClearProgress = async () => {
    await eventsApi.refetch({ endpoint: `/events/draft/${id}/details`, method: "DELETE" });
    await eventsApi.refetch({ endpoint: `/events/draft/${id}/location`, method: "DELETE" });
    setEventState({
      details: null,
      location: null
    });
  }
  
  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  if(!eventState) return;

  return (
    <div className="mt-20 mb-40 flex flex-col gap-20 items-center justify-center">
      <Title title={eventState.details ? `New Event - ${eventState.details.title}` : 'New Draft Event'}/>
      
      <div className="w-full flex flex-col items-center justify-center gap-20">
        <ProgressBar 
          progress={progress} 
          setProgress={setProgress} 
          state={eventState} 
          steps={steps}
        />
        <div className="flex gap-10">
          {
            progress > 100 &&
              <Button 
                content="Upload Event" 
                onClick={handleUpload}
                loading={
                  eventsApi.loading ||        
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

export default NewEvent;
