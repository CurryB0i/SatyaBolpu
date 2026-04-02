import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import { useEvent } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { getFile, saveFile } from "../../utils/FileStore";
import { FaEdit, FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { EventDetailsType, ICulture } from "../../types/globals";
import { useLoading } from "../../context/LoadingContext";

type FormErrorType = {
  name: string;
  description: string;
  culture: string;
  start: string,
  end: string,
  docs: string
};

const initialFormData: EventDetailsType = {
  name: '',
  description: '',
  culture: null,
  duration: {
    start: null,
    end: null
  },
  docs: []
};

const initialFormErrors: FormErrorType = {
  name: '',
  description: '',
  culture: '',
  start: '',
  end: '',
  docs: ''
};

const EventDetails = () => {
  const [formData,setFormData] = useState<EventDetailsType>(initialFormData);
  const [errors,setErrors] = useState<FormErrorType>(initialFormErrors);
  const [submitted, setSubmitted] = useState(false);
  const [saving,setSaving] = useState<boolean>(false);
  const [cultures, setCultures] = useState<string[]>([]);

  const culturesApi = useApi('/cultures');
  const { setLoading } = useLoading();
  const { state: authState } = useAuth();
  const { state: eventState, dispatch: eventDispatch } = useEvent();
  const navigate = useNavigate();

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const loadFiles = async () => {
      const { docs, ...remainingEventState } = eventState.details!;
      let docsFileObjs: File[] = [];

      if(docs.length > 0) {
        docsFileObjs = (
          await Promise.all(
            docs.map(doc => getFile({ entity: "event", type: "details" }, Number(doc)))
          )
        ).filter((file): file is File => file !== null);
      }

      setFormData({
        docs: docsFileObjs,
        ...remainingEventState,
      });
    }

    if(!eventState.details)
      return;
    loadFiles();
    setSubmitted(true);
  }, [eventState]);

  useEffect(() => {
    setLoading(culturesApi.loading);
  },[culturesApi.loading]);

  useEffect(() => {
    if(culturesApi.data && culturesApi.data.cultures)
      setCultures(culturesApi.data.cultures.map((c: ICulture) => c.name).sort());
  },[culturesApi.data])

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  },[formData.description]);

  useEffect(() => {
    return () => {
      if(formData.docs.length > 0) {
        formData.docs.forEach((doc) => {
          if (doc instanceof File) URL.revokeObjectURL(URL.createObjectURL(doc));
        });
      }
    };
  }, [formData.docs]);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if(name.startsWith("duration")) {
      const type = name.slice(8).toLowerCase();
      setErrors((prev) => ({
        ...prev,
          [type]: ''
      }));

      setFormData((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          [type]: value
        }
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    
    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
    
    setFormData((prev) => ({
      ...prev,
      [name]: [
        ...(prev[name as keyof EventDetailsType] as File[]), 
        ...Array.from(files)
      ]
    }));
    
    setTimeout(() => e.target.value = '',0);
  };

  const handleRemoveImage = (key: keyof EventDetailsType, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as File[]).filter((_,id) => id !== index)
    }))
  }

  const handleFormSubmit = async (e: FormEvent) => {
    setSaving(true);
    e.preventDefault();
    const newErrors: FormErrorType = {
      name: '',
      description: '',
      culture: '',
      start: '',
      end: '',
      docs: ''
    };

    if(!formData.name.trim()) {
      newErrors.name = "Event name is required.";
    }

    if(formData.name && formData.name.length < 5) {
      newErrors.name = "Event name should be atleast 5 characters long.";
    }

    if(!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if(formData.description.split(' ').length < 5) {
      newErrors.description = "Description should be atleast 5 words long.";
    }

    if(!formData.culture) {
      newErrors.culture = "Event Culture is required";
    }

    if(!formData.duration?.start) {
      newErrors.start = "Event Start Date is required.";
    }

    if(!formData.duration?.end) {
      newErrors.end = "Event End Date is required.";
    }

    if(formData.duration.start && formData.duration.end) {
      if(formData.duration.start > formData.duration.end) {
        newErrors.start = "Event Start Date cannot be after Event End Date.";
        newErrors.end = "Event End Date cannot be before Event Start Date.";
      }
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if(hasErrors) {
      setSaving(false)
      return 
    }

    let docsIdbKeys: number[] = [];
    if(formData.docs.length > 0) {
      docsIdbKeys = (
        await Promise.all(
          formData.docs.map(async (doc) => {
            if (doc instanceof File) {
              return await saveFile({ entity: "event", type: "details" }, doc);
            }
            return null;
          })
        )
      ).filter((key): key is number => key !== null);
    }
    
    eventDispatch({
      type: 'SAVE_EVENT_DETAILS',
      payload: {
        details: {
          ...formData,
          docs: docsIdbKeys
        }
      }
    });
    setSubmitted(true);
    setSaving(false);
  };

  const handleEditAgain = () => {
    setSubmitted(false);
    eventDispatch({
      type: 'CLEAR_EVENT',
    });
  }

  const handleNext = () => {
    if(submitted) {
      navigate('/create/event/map')
    } else {
      toast.error("You need to submit the form first!");
    }
  }

  if(!authState.token || authState.user?.role !== 'admin') {
    return <Navigate to={'/404'} replace/>
  }

  return (
    <div className="w-full">
      <div className="my-20">
        <Title title="New Event"/>
      </div>

      <form 
        className="flex w-3/4 md:w-1/2 flex-col gap-10 items-center justify-center mx-auto my-20"
        onSubmit={handleFormSubmit}
      >
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            Name
          </label>
          <input 
            className={`text-black font-semibold p-2 bg-white disabled:bg-gray-400`} 
            type="text" 
            id="name" 
            disabled={submitted}
            name="name" 
            value={formData.name}
            onChange={handleFormChange}
          />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            Description
          </label>
          <textarea
            className={`text-black bg-white font-semibold p-2 disabled:bg-gray-400 resize-none`} 
            rows={1}
            disabled={submitted}
            id="description" 
            name="description" 
            ref={descriptionRef}
            value={formData.description}
            onChange={handleFormChange}
          />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            Culture
          </label>
          <select 
            disabled={submitted}
            name="culture" 
            id="culture"
            className="p-2 cursor-pointer bg-white disabled:bg-gray-300"
            value={formData.culture ?? ''}
            onChange={handleFormChange}
          >
            <option value="" hidden className="text-white">-- Choose a culture --</option>
            {
              cultures.map((culture,idx) => (
                <option key={idx} value={culture.toLowerCase()}>{culture}</option>
              ))
            }
          </select>
          {errors.culture && <p className="text-red-500">{errors.culture}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            Start Date
          </label>
          <input 
            className={`text-black font-semibold p-2 cursor-pointer bg-white disabled:bg-gray-400`} 
            type="date" 
            id="durationStart" 
            disabled={submitted}
            name="durationStart" 
            value={formData.duration.start?.toString()}
            onChange={handleFormChange}
          />
            {errors.start && <p className="text-red-500">{errors.start}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            End Date
          </label>
          <input 
            className={`text-black font-semibold p-2 cursor-pointer bg-white disabled:bg-gray-400`} 
            type="date" 
            id="durationEnd" 
            disabled={submitted}
            name="durationEnd" 
            value={formData.duration.end?.toString()}
            onChange={handleFormChange}
          />
            {errors.end && <p className="text-red-500">{errors.end}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]">
            Related Documents
          </label>
          <label htmlFor="docs" className="w-fit">
            <div className={`text-black w-fit p-5 rounded-lg flex flex-col items-center 
              justify-center border-3 border-solid border-primary  
              ${submitted ? 'bg-white/70 cursor-not-allowed' : 'bg-white hover:bg-white/70 cursor-pointer'}`}>
              <FaUpload />
              <p>Upload Document</p>
            </div>
          </label>
          <input
            className="hidden"
            disabled={submitted}
            type="file"
            accept="image/*,application/pdf"
            id="docs"
            name="docs"
            multiple
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap text-white">
          {
            formData.docs.length > 0 && formData.docs.map((doc,index) => {
              if(doc instanceof File) {
                return (
                <div className="border-2 border-solid border-white flex relative" key={index}>
                  {
                    doc.type.startsWith("image") ? 
                    <img 
                      className="w-full aspect-square object-cover object-center" 
                      src={URL.createObjectURL(doc)} alt={`doc-${index}`} 
                    /> :
                    <iframe
                      style={{
                        scrollbarWidth: 'none'
                      }}
                      className="w-full aspect-square object-cover object-center" 
                      src={URL.createObjectURL(doc)}
                    />
                  }
                  {
                    !submitted &&
                      <MdCancel 
                        className="absolute bg-black rounded-full top-2 right-2 cursor-pointer hover:text-primary"
                        onClick={() => handleRemoveImage('docs',index)}
                      />
                  }
                </div>
                )
              }
              return null;
            })
          }
          </div>
          {errors.docs && <p className="text-red-500">{errors.docs}</p>}
        </div>

        {

          submitted ? 
            <FaEdit
              className={`text-[2.5rem] cursor-pointer m-5 bg-black 
                         text-white hover:scale-110 hover:text-primary z-50`}
              id='edit'
              onClick={handleEditAgain}/>
            :
            <Button 
              content="Save"
              className="text-[1.5rem] mx-auto"
              type="submit"
              loading={saving}
              loadingText="Saving"
            />
        }

      </form>

      <div className="flex w-screen items-center justify-between p-10">
        <div 
          className={`text-[1.2rem] sm:text-[1.75rem] hover:text-primary text-white cursor-pointer`}
          onClick={() => navigate('/create/event')}>
            {`< Progress`}
        </div>
        <div 
          className={`text-[1.2rem] sm:text-[1.75rem]
          ${submitted ? 'hover:text-primary text-white cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
          onClick={handleNext}>
            {`Map >`}
          </div>
      </div>

    </div>
  )
}

export default EventDetails;
