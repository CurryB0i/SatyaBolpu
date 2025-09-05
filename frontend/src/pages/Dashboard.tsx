import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaPencilAlt, FaStar, FaHandsHelping, FaHashtag } from "react-icons/fa";
import Button from "../components/Button";
import { useEffect, useRef, useState } from "react";
import useApi from "../hooks/useApi";
import { toast } from "react-toastify";
import { FaSquarePlus } from "react-icons/fa6";
import { PiHandsPrayingBold } from "react-icons/pi";
import { CultureType } from "./Explore";
import Form, { FormField } from "../components/Form";

const data = [
  { month: 'Jan 2025', posts: 4 },
  { month: 'Feb 2025', posts: 7 },
  { month: 'Mar 2025', posts: 20 },
  { month: 'Apr 2025', posts: 4 },
  { month: 'May 2025', posts: 7 },
  { month: 'Jun 2025', posts: 20 },
];

const initialCultureFormData = {
  name: '',
  descr: '',
  image: ''
}

const Dashboard = () => {
  const { state } = useAuth();
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [tagFormData, setTagFormData] = useState<{ tag: string }>({ tag: '' });
  const [tagError, setTagError] = useState<string>('');
  const [cultureFormData, setCultureFormData] = useState<Omit<CultureType, "posts">>(initialCultureFormData);
  const [cultureError, setCultureError] = useState<string>('');
  const [activeForm, setActiveForm] = useState<'tag' | 'culture' | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const tagsApi = useApi('/tags', { auto: false });
  const uploadApi = useApi('/upload',{ auto: false });
  const culturesApi = useApi('/cultures', { auto: false });
  
  const tagFormFields: FormField[] = [
    {
      name: 'tag',
      label: 'Tag Name',
      type: 'text',
      placeholder: 'Enter tag name...',
      required: true,
      validation: (value) => {
        if (!value || !value.trim()) {
          return 'Tag name cannot be empty';
        }
        return null;
      }
    }
  ];

  const cultureFormFields: FormField[] = [
    {
      name: 'name',
      label: 'Culture Name',
      type: 'text',
      placeholder: 'Enter culture name...',
      required: true
    },
    {
      name: 'descr',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter culture description...',
      required: true,
      rows: 4
    },
    {
      name: 'image',
      label: 'Image',
      type: 'file',
      accept: 'image/*',
      required: true
    }
  ];
  
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    }

    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();

    setTagError('');
    await tagsApi.post({ tag: tagFormData.tag.trim() });
  };

  const handleAddCulture = async (e: React.FormEvent) => {
    e.preventDefault();

    setCultureError('');
    const formData = new FormData();
    formData.append('file',cultureFormData.image);
    const res = await uploadApi.post(formData);
    await culturesApi.post({...cultureFormData, image: res.path});
  };

  const handleTagFormChange = (name: string, value: any) => {
    setTagFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCultureFormChange = (name: string, value: any) => {
    setCultureFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeForm = () => {
    setActiveForm(null);
    setTagFormData({ tag: '' });
    setTagError('');
    setCultureFormData(initialCultureFormData);
    setCultureError('');
  };

  useEffect(() => {
    if (tagsApi.error) {
      setTagError(tagsApi.error);
    }

    if (tagsApi.data && tagFormData.tag) {
      toast.success(`'${tagFormData.tag}' tag successfully added`);
      setTagFormData({ tag: '' });
      setActiveForm(null);
    }
  }, [tagsApi.data, tagsApi.error])

  useEffect(() => {
    if (culturesApi.error) {
      setCultureError(culturesApi.error);
    }

    if (culturesApi.data && cultureFormData.name) {
      toast.success(`'${cultureFormData.name}' culture successfully added`);
      setCultureFormData(initialCultureFormData);
      setActiveForm(null);
    }
  }, [culturesApi.data, culturesApi.error])

  if (!state.token) return <Navigate to='/login' replace />
  
  return (
    <>
      <div className="max-w-screen xl:px-10 text-primary my-20 flex flex-col 
        gap-10 xl:gap-0 xl:flex-row flex-wrap items-center justify-center">

        <div className="w-full xl:w-2/3 flex flex-col items-center justify-between gap-5">
          <div className="w-[95%] flex items-center gap-5 p-5 xl:text-nowrap">

            <div className="relative w-1/3 min-h-36 lg:min-h-24 xl:min-h-fit flex flex-col
              justify-center text-center p-3 outline outline-white rounded-2xl 
              cursor-pointer hover:-mt-5 transition-all duration-300">
              <h1 className="text-[1.5rem]">All Time Posts</h1>
              <p className="text-white text-[2rem]">1902</p>
            </div>

            <div className="relative w-1/3 min-h-36 lg:min-h-24 xl:min-h-fit flex
              flex-col justify-center text-center p-3 outline outline-white rounded-2xl 
              cursor-pointer hover:-mt-5 transition-all duration-300">
              <h1 className="text-[1.5rem]">Regions Covered</h1>
              <p className="text-white text-[2rem]">1902</p>
            </div>

            <div className="relative w-1/3 min-h-36 lg:min-h-24 xl:min-h-fit flex flex-col
              justify-center text-center p-3 outline outline-white rounded-2xl 
              cursor-pointer hover:-mt-5 transition-all duration-300">
              <h1 className="text-[1.5rem]">Active Users</h1>
              <p className="text-white text-[2rem]">1902</p>
            </div>

          </div>

          <div className="w-[90%] h-[50vh] p-5 mx-auto border-5 border-solid border-white rounded-2xl">
            <ResponsiveContainer width="100%" height={"100%"}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="white" />

                <XAxis dataKey="month" tick={{ fill: "white", fontSize: 12 }} />
                <YAxis tick={{ fill: "white", fontSize: 12 }} />

                <Tooltip
                  itemStyle={{ color: 'black' }}
                  contentStyle={{ backgroundColor: "white", borderRadius: "10px", border: "3px solid #E88138" }}
                  labelStyle={{ color: "black", fontWeight: 1000 }}
                  cursor={{ stroke: "white", strokeWidth: 2 }}
                />

                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="#E88138"
                  strokeWidth={3}
                  style={{ cursor: 'pointer' }}
                  dot={{ r: 6, stroke: "white", strokeWidth: 2, fill: "black" }}
                  activeDot={{ r: 8, cursor: 'pointer' }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div data-lenis-prevent className="w-[90%] xl:w-1/3 h-[75vh] py-10 flex flex-col gap-5 items-center 
          justify-center outline outline-white rounded-2xl">
          <h1 className="text-[2rem] font-semibold">Recent Updates</h1>
          <div className="w-4/5 p-5 h-full flex flex-col items-center gap-5 
            overflow-y-scroll [scrollbar-width:none]">

            <div className="w-full relative flex items-center justify-evenly shadow-[1px_1px_6px] 
              shadow-white py-3 rounded-2xl cursor-pointer hover:scale-[1.025] transition-all duration-100">
              <div className="w-1/4 rounded-full overflow-hidden">
                <img className="w-full aspect-square object-cover" src="/assets/Explore/daivaradhane.jpg" alt="" />
              </div>
              <div className="text-center text-white">
                <h1 className="text-primary text-[1.25rem]">Hello World!</h1>
              </div>
            </div>

            <div className="w-full flex items-center justify-evenly shadow-[1px_1px_6px] 
              shadow-white py-3 rounded-2xl cursor-pointer hover:scale-[1.025] transition-all duration-100">
              <div className="w-1/4 rounded-full overflow-hidden">
                <img className="w-full aspect-square object-cover" src="/assets/Explore/daivaradhane.jpg" alt="" />
              </div>
              <div className="text-center text-white">
                <h1 className="text-primary text-[1.25rem]">Hello World!</h1>
              </div>
            </div>

            <div className="w-full flex items-center justify-evenly shadow-[1px_1px_6px] 
              shadow-white py-3 rounded-2xl cursor-pointer hover:scale-[1.025] transition-all duration-100">
              <div className="w-1/4 rounded-full overflow-hidden">
                <img className="w-full aspect-square object-cover" src="/assets/Explore/daivaradhane.jpg" alt="" />
              </div>
              <div className="text-center text-white">
                <h1 className="text-primary text-[1.25rem]">Hello World!</h1>
              </div>
            </div>

            <div className="w-full flex items-center justify-evenly shadow-[1px_1px_6px] 
              shadow-white py-3 rounded-2xl cursor-pointer hover:scale-[1.025] transition-all duration-100">
              <div className="w-1/4 rounded-full overflow-hidden">
                <img className="w-full aspect-square object-cover" src="/assets/Explore/daivaradhane.jpg" alt="" />
              </div>
              <div className="text-center text-white">
                <h1 className="text-primary text-[1.25rem]">Hello World!</h1>
              </div>
            </div>

            <div className="w-full flex items-center justify-evenly shadow-[1px_1px_6px] 
              shadow-white py-3 rounded-2xl cursor-pointer hover:scale-[1.025] transition-all duration-100">
              <div className="w-1/4 rounded-full overflow-hidden">
                <img className="w-full aspect-square object-cover" src="/assets/Explore/daivaradhane.jpg" alt="" />
              </div>
              <div className="text-center text-white">
                <h1 className="text-primary text-[1.25rem]">Hello World!</h1>
              </div>
            </div>

          </div>

          <Button className="sticky bottom-0" content="View All" />

        </div>

        <div className="w-full flex flex-wrap items-center justify-evenly gap-5 mt-20
          text-[1.5rem] text-center font-semibold text-black">

          <div className="w-2/5 xl:w-1/5 relative outline outline-white rounded-2xl bg-white p-5 flex 
            items-center justify-center gap-1 cursor-pointer transition-all duration-150 
            hover:bg-black hover:text-primary">
            <FaPencilAlt />
            <p>Feedback</p>
          </div>

          <div className="w-2/5 xl:w-1/5 relative outline outline-white rounded-2xl bg-white p-5 flex 
            items-center justify-center gap-1 cursor-pointer transition-all duration-150 
            hover:bg-black hover:text-primary">
            <FaStar />
            <p>Review</p>
          </div>

          <div className="w-2/5 xl:w-1/5 relative outline outline-white rounded-2xl bg-white p-5 flex 
            items-center justify-center gap-1 cursor-pointer transition-all duration-150 
            hover:bg-black hover:text-primary">
            <FaHandsHelping />
            <p>Contribute</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
