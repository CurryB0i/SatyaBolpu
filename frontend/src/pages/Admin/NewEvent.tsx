import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Title from "../../components/Title";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDialog } from "../../context/DialogBoxContext";
import useApi from "../../hooks/useApi";
import { clearEntityStore, getFile } from "../../utils/FileStore";
import ProgressBar from "../../components/ProgressBar";
import { useEvent } from "../../context/EventContext";
import { toast } from "react-toastify";
import { EventState } from "../../types/globals";

const NewEvent = () => {
  
  const [progress,setProgress] = useState<number>(0);
  const dialog = useDialog();
  const uploadMultipleApi = useApi('/upload/multiple',{ auto: false });
  const uploadSingleApi = useApi('/upload/single',{ auto: false });
  const eventsApi = useApi('/events', { auto: false })
  const { state: authState } = useAuth();
  const { state: eventState, dispatch: eventDispatch } = useEvent();

  const steps = {
    'Event Details': 'details',
    'Map': 'map',
  };

  const handleUpload = () => {
    const uploadEvent = async () => {
      let uploadData: EventState = eventState;

      if(!eventState.location || !eventState.details) {
        toast.error("Missing required files in Event state.");
        return;
      }

      if(eventState.details.docs.length > 0) {
        const files = await Promise.all(
          eventState.details.docs.map(async (doc) => {
            return await getFile({ entity: 'event', type: 'details' }, Number(doc));
          })
        )

        const validFiles = files.filter((f): f is File => f !== null);
        if(validFiles.length <= 0) {
          toast.error("Invalid files.");
          return;
        }

        const formData = new FormData();
        validFiles.forEach((file) => {
          formData.append("files", file);
        });

        const res = await uploadMultipleApi.post(formData);
        uploadData = {
          ...uploadData,
          details: { ...uploadData.details!, docs: res.paths }
        };
      }

      await eventsApi.post(uploadData);
    };

    dialog.popup({
      title: "Event Upload.",
      description:
        "Are you sure you want to add this event? All saved drafts will be cleared on upload.",
      onConfirm: uploadEvent,
    });
  }

  useEffect(() => {
    if(eventsApi.data) {
       toast.success(`Event-${eventsApi.data.event.name} successfully uploaded.`)
       eventDispatch({
         type: 'CLEAR_EVENT'
       });
       (async () => await clearEntityStore({ entity: "event" }))();
    }
    if(eventsApi.error) toast.error(eventsApi.error);
  },[eventsApi.data, eventsApi.error])

  const handleClearProgress = async () => {
    eventDispatch({
      type: 'CLEAR_EVENT'
    });
    await clearEntityStore({ entity: "event" });
  }
  
  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  return (
    <div className="mt-20 mb-40 flex flex-col gap-20 items-center justify-center">
      <Title title={eventState.details ? `New Event - ${eventState.details.name}` : 'New Draft Event'}/>
      
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
