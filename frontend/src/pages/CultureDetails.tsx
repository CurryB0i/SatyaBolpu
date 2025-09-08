import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import Title from "../components/Title";
import { CultureDetailsType, useCulture } from "../context/CultureContext";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { getFile, saveFile } from "../utils/FileStore";
import { FaEdit, FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Button from "../components/Button";
import { toast } from "react-toastify";

type FormErrorType = {
  name: string;
  descriptiveName: string;
  description: string;
  coverImages: string;
  galleryImages: string;
};

const initialFormData: CultureDetailsType = {
  name: '',
  descriptiveName: '',
  description: '',
  coverImages: [],
  galleryImages: []
};

const initialFormErrors: FormErrorType = {
  name: '',
  descriptiveName: '',
  description: '',
  coverImages: '',
  galleryImages: '',
};

const CultureDetails = () => {
  const [formData,setFormData] = useState<CultureDetailsType>(initialFormData);
  const [errors,setErrors] = useState<FormErrorType>(initialFormErrors);
  const [submitted, setSubmitted] = useState(false);
  const [saving,setSaving] = useState<boolean>(false);

  const { state: authState } = useAuth();
  const { state: cultureState, dispatch: cultureDispatch } = useCulture();
  const navigate = useNavigate();

  const descrRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (!cultureState.details) return;

    const loadFiles = async () => {
      const { coverImages, galleryImages, ...remainingCultureState } = cultureState.details!;
      
      if(coverImages && galleryImages) {
        const coverImagesFileObjs = (
          await Promise.all(
            coverImages.map((coverImage) => getFile({ entity: "culture", type: "details" },Number(coverImage)))
          )
        ).filter((file): file is File => file !== null);

      const galleryImagesFileObjs = (
        await Promise.all(
          galleryImages.map((galleryImage) => getFile({ entity: "culture", type: "details" },Number(galleryImage)))
        )
      ).filter((file): file is File => file !== null);

      setFormData({
        coverImages: coverImagesFileObjs,
        galleryImages: galleryImagesFileObjs,
        ...remainingCultureState,
      });

      setSubmitted(true);
      }
    };

    loadFiles();
  }, [cultureState]);

  useEffect(() => {
    const el = descrRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  },[formData.description]);

  useEffect(() => {
    return () => {
      if(formData.coverImages.length > 0 && formData.galleryImages.length > 0) {
        formData.coverImages.forEach((file) => {
          if (file instanceof File) URL.revokeObjectURL(URL.createObjectURL(file));
        });
        formData.galleryImages.forEach((file) => {
          if (file instanceof File) URL.revokeObjectURL(URL.createObjectURL(file));
        });
      }
    };
  }, [formData.coverImages, formData.galleryImages]);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

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
    
    console.log(e.target.value);
    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
    
    setFormData((prev) => ({
      ...prev,
      [name]: [
        ...(prev[name as keyof CultureDetailsType] as File[]), 
        ...Array.from(files)
      ]
    }));
    
    setTimeout(() => e.target.value = '',0);
  };

  const handleRemoveImage = (key: keyof CultureDetailsType,index: number) => {
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
      descriptiveName: '',
      description: '',
      coverImages: '',
      galleryImages: ''
    };

    if(!formData.name.trim()) {
      newErrors.name = "Culture name is required.";
    }

    if(formData.name && formData.name.length < 5) {
      newErrors.name = "Culture name should be atleast 5 characters long.";
    }

    if(!formData.descriptiveName.trim()) {
      newErrors.descriptiveName = "Descriptive name is required.";
    }

    if(formData.descriptiveName && formData.descriptiveName.length < 5) {
      newErrors.descriptiveName = "Descriptive name should be atleast 5 characters long.";
    }

    if(!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if(formData.description && formData.description.split(' ').length < 100) {
      newErrors.description = "Description should be atleast 100 words long.";
    }

    if(formData.coverImages.length < 4) {
      newErrors.coverImages = "Three cover images are required.";
    }

    if(formData.galleryImages.length < 15) {
      newErrors.galleryImages = "Atleast 15 gallery images are required.";
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if(hasErrors) {
      setSaving(false)
      return 
    }

    const cultureFormData = new FormData();
    cultureFormData.append('name',formData.name);
    cultureFormData.append('descriptiveName',formData.descriptiveName);
    cultureFormData.append('description',formData.description);

  const coverImagesIdbKeys = (
    await Promise.all(
      formData.coverImages.map(async (coverImage) => {
        if (coverImage instanceof File) {
          return await saveFile({ entity: "culture", type: "details" },coverImage);
        }
        return null;
      })
    )
  ).filter((key): key is number => key !== null);

    const galleryImagesIdbKeys = (
      await Promise.all(
        formData.galleryImages.map(async (galleryImage) => {
          if (galleryImage instanceof File) {
            return await saveFile({ entity: "culture", type: "details" },galleryImage);
          }
          return null;
        })
      )
    ).filter((key): key is number => key !== null);

    cultureDispatch({
      type: 'SAVE_CULTURE_DETAILS',
      payload: {
        details: {
          ...formData,
          coverImages: coverImagesIdbKeys,
          galleryImages: galleryImagesIdbKeys
        }
      }
    });
    setSubmitted(true);
    setSaving(false);
  };

  const handleEditAgain = () => {
    setSubmitted(false);
    cultureDispatch({
      type: 'CLEAR_CULTURE_DETAILS',
    });
  }

  const handleNext = () => {
    if(submitted) {
      navigate('/create/new-culture/editor')
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
        <Title title="New Culture"/>
      </div>

      <form 
        className="flex w-1/2 flex-col gap-10 items-center justify-center mx-auto my-20"
        onSubmit={handleFormSubmit}
      >
        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            Name
          </label>
          <input 
            className={`text-black font-semibold p-2 disabled:bg-gray-400`} 
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
            Descriptive Name
          </label>
          <input 
            className={`text-black font-semibold p-2 disabled:bg-gray-400`}
            disabled={submitted}
            type="text" 
            id="descriptiveName" 
            name="descriptiveName" 
            value={formData.descriptiveName}
            onChange={handleFormChange}
          />
            {errors.descriptiveName && <p className="text-red-500">{errors.descriptiveName}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]" htmlFor="mainTitle">
            Description
          </label>
          <textarea
            className={`text-black font-semibold p-2 disabled:bg-gray-400 resize-none`} 
            rows={1}
            disabled={submitted}
            id="description" 
            name="description" 
            ref={descrRef}
            value={formData.description}
            onChange={handleFormChange}
          />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]">
            Cover Images
          </label>
          <label htmlFor="coverImages" className="w-fit">
            <div className={`text-black w-fit p-5 rounded-lg flex flex-col items-center 
              justify-center border-3 border-solid border-primary  
              ${submitted || formData.coverImages.length >= 4 ?
                'bg-white/70 cursor-not-allowed' : 'bg-white hover:bg-white/70 cursor-pointer'}`}>
              <FaUpload />
              <p>Upload Image</p>
            </div>
          </label>
          <input
            className="hidden"
            disabled={submitted || formData.coverImages.length >= 4}
            type="file"
            accept="image/*"
            id="coverImages"
            name="coverImages"
            multiple
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap text-white">
          {
            formData.coverImages.length > 0 && formData.coverImages.map((coverImage,index) => {
              if(coverImage instanceof File) {
                return (
                <div className="w-1/2 border-2 border-solid border-white flex relative" key={index}>
                  <img 
                    className="w-full aspect-square object-cover object-center" 
                    src={URL.createObjectURL(coverImage)} alt="cover-image" />
                  <MdCancel 
                    className="absolute bg-black rounded-full text-[1.5rem] top-2 right-2 cursor-pointer hover:text-primary"
                    onClick={() => handleRemoveImage('coverImages',index)}
                  />
                </div>
                )
              }
            })
          }
          </div>
          {errors.coverImages && <p className="text-red-500">{errors.coverImages}</p>}
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="text-primary font-semibold text-[1.5rem]">
            Gallery Images
          </label>
          <label htmlFor="galleryImages" className="w-fit">
            <div className={`text-black w-fit p-5 rounded-lg flex flex-col items-center 
              justify-center border-3 border-solid border-primary  
              ${submitted ? 'bg-white/70 cursor-not-allowed' : 'bg-white hover:bg-white/70 cursor-pointer'}`}>
              <FaUpload />
              <p>Upload Image</p>
            </div>
          </label>
          <input
            className="hidden"
            disabled={submitted}
            type="file"
            accept="image/*"
            id="galleryImages"
            name="galleryImages"
            multiple
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap text-white">
          {
            formData.galleryImages.length > 0 && formData.galleryImages.map((galleryImage,index) => {
              if(galleryImage instanceof File) {
                return (
                <div className="w-1/6 border-2 border-solid border-white flex relative" key={index}>
                  <img 
                    className="w-full aspect-square object-cover object-center" 
                    src={URL.createObjectURL(galleryImage)} alt={`gallery-${index}`} />
                  <MdCancel 
                    className="absolute bg-black rounded-full top-2 right-2 cursor-pointer hover:text-primary"
                    onClick={() => handleRemoveImage('galleryImages',index)}
                  />
                </div>
                )
              }
              return null;
            })
          }
          </div>
          {errors.galleryImages && <p className="text-red-500">{errors.galleryImages}</p>}
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
          className={` text-[1.75rem] hover:text-primary text-white cursor-pointer`}
          onClick={() => navigate('/create/new-culture')}>
            {`< Progress`}
        </div>
        <div 
          className={` text-[1.75rem]
          ${submitted ? 'hover:text-primary text-white cursor-pointer' : 'text-gray-500 cursor-not-allowed'}`}
          onClick={handleNext}>
            {`Editor >`}
          </div>
      </div>

    </div>
  )
}

export default CultureDetails;
