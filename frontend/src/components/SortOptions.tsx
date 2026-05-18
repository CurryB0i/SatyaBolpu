import { TbSortAscending2Filled, TbSortDescending2Filled } from "react-icons/tb";

export type SortOptionsProps = {
  sortOptions: Record<string, string>,
  selectedSortOption: string,
  setSelectedSortOption: React.Dispatch<React.SetStateAction<string>>,
  order: "asc" | "desc",
  setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>
};

const SortOptions = ({
  sortOptions,
  selectedSortOption,
  setSelectedSortOption,
  order,
  setOrder
} : SortOptionsProps) => {
  return (
    <div
      className="flex p-2 gap-3 z-0 mx-auto"
    > 
      <div
        className="text-white flex items-center justify-center text-[1.5rem] cursor-pointer"
      >
        {
          order === "asc" ?
            <TbSortAscending2Filled 
              onClick={() => setOrder("desc")}
            /> :
            <TbSortDescending2Filled 
              onClick={() => setOrder("asc")}
            />
        }
      </div>
      {
        Object.entries(sortOptions).map((entry, id) => (
          <div
            key={id}
            className="text-primary flex gap-1 items-center justify-center p-1 rounded-lg
              cursor-pointer"
            style={{
              backgroundColor: selectedSortOption === entry[1] ? 'var(--primary)' : '',
              color: selectedSortOption === entry[1] ? 'black' : 'var(--primary)'
            }}
            onClick={() => setSelectedSortOption(entry[1])}
          >
            {entry[0]}
          </div> 
        ))
      }
    </div>
  )
}

export default SortOptions;