import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MinimalCardProps } from "../types/globals";

export const MinimalSkeletonCard = () => {
  return (
    <div className="w-[90%] h-15 lg:w-2/3 p-2 flex bg-gray-700 animate-pulse">
    </div>
  )
}

export const MinimalCard = ({ id, title, handleEdit, handleDelete }: MinimalCardProps) => {
  return (
    <div className="w-[90%] lg:w-1/2 flex items-cente justify-between">
      <div className="text-primary text-[2rem] font-bold">
        {title || 'Empty Draft'}
      </div>
      <div className="flex gap-2">
        <div
          className="border-primary text-primary border rounded-lg p-1 hover:bg-white 
        hover:text-black cursor-pointer"
          onClick={() => handleEdit?.(id)}
        >
          <RiEdit2Fill
            className="text-[1.5rem] md:text-[2rem]"
          />
        </div>
        <div
          className="border-primary text-primary border rounded-lg p-1 hover:bg-white 
        hover:text-black cursor-pointer"
          onClick={() => handleDelete?.(id)}
        >
          <MdDelete
            className="text-[1.5rem] md:text-[2rem]"
          />
        </div>
      </div>
    </div>
  )
};