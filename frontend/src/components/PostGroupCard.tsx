import { useState } from "react";
import { PostGroupProps } from "../types/globals";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const PostGroupSkeleton = () => {
  return (
    <div className="w-2/3 h-16 bg-gray-400 opacity-50 animate-pulse"></div>
  )
}

const PostGroupCard = ({ name, posts } : PostGroupProps) => {
  const [dropped, setDropped] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="w-2/3 text-primary">
      <div
        className="border border-primary w-full flex items-center justify-center
          p-2 text-[2rem] font-bold cursor-pointer hover:bg-primary hover:text-black relative"
        onClick={() => setDropped(!dropped)}
      >
        <p
          className="mx-auto"
        >
          {name}
        </p>
        <IoIosArrowDown 
          className="transition-all absolute right-5"
          style={{
            rotate: dropped ? '180deg' : '0deg'
          }}
        />
      </div>

      <div
        className="transition-all overflow-hidden border border-primary"
        style={{
          height: dropped ? 'auto' : '0'
        }}
      >
        {
          posts.map((post, id) => (
            <div 
              className="w-full p-2 cursor-pointer hover:bg-white flex items-center justify-center"
              key={id}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.title}
            </div>
          ))
        }
      </div>

    </div>
  );
}

export default PostGroupCard;