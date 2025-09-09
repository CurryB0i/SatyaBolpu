import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaPencilAlt, FaStar, FaHandsHelping } from "react-icons/fa";
import Button from "../components/Button";

const data = [
  { month: 'Jan 2025', posts: 4 },
  { month: 'Feb 2025', posts: 7 },
  { month: 'Mar 2025', posts: 20 },
  { month: 'Apr 2025', posts: 4 },
  { month: 'May 2025', posts: 7 },
  { month: 'Jun 2025', posts: 20 },
];

const Dashboard = () => {
  const { state } = useAuth();

  if (!state.token) return <Navigate to='/login' replace />
  
  return (
    <>
      <div className="max-w-screen xl:px-10 text-primary my-10 mb-20 flex flex-col 
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

          <Button content="View All" />

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
