import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { EventDetailsType } from "../../types/globals";
import { useLoading } from "../../context/LoadingContext";
import { validateEventDetails } from "../../utils/validate";

type FormErrorType = {
  title: string;
  description: string;
  culture: string;
  start: string,
  end: string,
  docs: string
};

const initialFormData: EventDetailsType = {
  title: '',
  description: '',
  culture: '',
  duration: {
    start: null,
    end: null
  },
  docs: []
};

const initialFormErrors: FormErrorType = {
  title: '',
  description: '',
  culture: '',
  start: '',
  end: '',
  docs: ''
};

const EventDetails = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState<EventDetailsType>(initialFormData);
  const [errors, setErrors] = useState<FormErrorType>(initialFormErrors);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [cultures, setCultures] = useState<{_id: string, title: string}[]>([]);

  const culturesApi = useApi('/cultures');
  const uploadMultipleApi = useApi('/upload/multiple', { auto: false });
  const eventsApi = useApi('/events', { auto: false });
  const draftsApi = useApi('/drafts', { auto: false });
  const { setLoading } = useLoading();
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setLoading(culturesApi.loading);
  }, [culturesApi.loading]);

  useEffect(() => {
    if (culturesApi.data && culturesApi.data.cultures)
      setCultures(culturesApi.data.cultures.sort((a: any, b: any) => a.title < b.title));
  }, [culturesApi.data]);

  useEffect(() => {
    const fetchDraft = async () => {
      const res = await draftsApi.refetch({ endpoint: `/drafts/${id}`, method: "GET" });
      if (!res) return;
      if (res.draft) {
        setFormData(res.draft.details);
        if (validateEventDetails(res.draft.details)) {
          setSubmitted(true)
        }
      } else
        toast.error("Failed to fetch draft.");
    }

    fetchDraft();
  }, [id]);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [formData.description]);

  // useEffect(() => {
  //   return () => {
  //     if(formData.docs.length > 0) {
  //       formData.docs.forEach((doc) => {
  //         if (doc instanceof File) URL.revokeObjectURL(URL.createObjectURL(doc));
  //       });
  //     }
  //   };
  // }, [formData.docs]);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("duration")) {
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

    setTimeout(() => e.target.value = '', 0);
  };

  const handleRemoveImage = (key: keyof EventDetailsType, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as File[]).filter((_, id) => id !== index)
    }))
  }

  const handleFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    setSaving(true);
    e.preventDefault();
    const newErrors: FormErrorType = {
      title: '',
      description: '',
      culture: '',
      start: '',
      end: '',
      docs: ''
    };

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required.";
    }

    if (formData.title && formData.title.length < 5) {
      newErrors.title = "Event title should be atleast 5 characters long.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (formData.description.split(' ').length < 5) {
      newErrors.description = "Description should be atleast 5 words long.";
    }

    if (!formData.culture) {
      newErrors.culture = "Event Culture is required";
    }

    if (!formData.duration?.start) {
      newErrors.start = "Event Start Date is required.";
    }

    if (!formData.duration?.end) {
      newErrors.end = "Event End Date is required.";
    }

    if (formData.duration.start && formData.duration.end) {
      if (formData.duration.start > formData.duration.end) {
        newErrors.start = "Event Start Date cannot be after Event End Date.";
        newErrors.end = "Event End Date cannot be before Event Start Date.";
      }
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if (hasErrors) {
      setSaving(false)
      return
    }

    const uploadData = { ...formData };
    if (formData.docs.length > 0) {
      const docsData = new FormData();
      const existingDocs: string[] = [];
      formData.docs.forEach(doc => { 
        if(doc instanceof File) 
          docsData.append("files", doc) 
        else
          existingDocs.push(doc)
      });
      const res = await uploadMultipleApi.post(docsData);
      if (!res) {
        setSaving(false);
        return;
      }
      uploadData.docs = [...existingDocs, ...res.paths];
    }

    const res = await eventsApi.refetch({ endpoint: `/events/draft/${id}/details`, method: "POST", body: { details: uploadData } });
    if (!res) {
      setSaving(false);
      return;
    }

    setSubmitted(true);
    setSaving(false);
  };

  const handleEditAgain = async () => {
    setSubmitted(false);
    await eventsApi.refetch({ endpoint: `/events/draft/${id}/details`, method: "DELETE" });
  }

  const handleNext = () => {
    if (submitted) {
      navigate(`/create/event/${id}/map`);
    } else {
      toast.error("You need to submit the form first!");
    }
  }

  if (!authState.token || authState.user?.role !== 'admin') {
    return <Navigate to={'/404'} replace />
  }

  return (
    <div className="w-full">
      <div className="my-20">
        <Title title="New Event" />
      </div>

      <form
        className="flex w-3/4 md:w-1/2 flex-col gap-10 items-center justify-center mx-auto my-20"
        onSubmit={handleFormSubmit}
      >
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="title">
            Name
          </label>
          <input
            className={`text-black font-semibold p-2 bg-white disabled:bg-gray-400`}
            type="text"
            id="title"
            disabled={submitted}
            name="title"
            value={formData.title ?? ""}
            onChange={handleFormChange}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="description">
            Description
          </label>
          <textarea
            className={`text-black bg-white font-semibold p-2 disabled:bg-gray-400 resize-none`}
            rows={1}
            disabled={submitted}
            id="description"
            name="description"
            ref={descriptionRef}
            value={formData.description ?? ""}
            onChange={handleFormChange}
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="culture">
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
              cultures.map((culture, idx) => (
                <option key={idx} value={culture._id}>{culture.title}</option>
              ))
            }
          </select>
          {errors.culture && <p className="text-red-500">{errors.culture}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="durationStart">
            Start Date
          </label>
          <input
            className={`text-black font-semibold p-2 cursor-pointer bg-white disabled:bg-gray-400`}
            type="date"
            id="durationStart"
            disabled={submitted}
            name="durationStart"
            value={formData.duration.start?.toString() ?? ""}
            onChange={handleFormChange}
          />
          {errors.start && <p className="text-red-500">{errors.start}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="durationEnd">
            End Date
          </label>
          <input
            className={`text-black font-semibold p-2 cursor-pointer bg-white disabled:bg-gray-400`}
            type="date"
            id="durationEnd"
            disabled={submitted}
            name="durationEnd"
            value={formData.duration.end?.toString() ?? ""}
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
              formData.docs.length > 0 && formData.docs.map((doc, index) => {
                if (doc instanceof File) {
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
                          onClick={() => handleRemoveImage('docs', index)}
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
              onClick={handleEditAgain}
            />
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
          onClick={() => navigate(`/create/event/${id}`)}>
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
