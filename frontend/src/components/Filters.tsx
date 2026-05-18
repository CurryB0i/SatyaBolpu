import { ChangeEvent, useEffect, useState } from "react";
import { Option } from "./DropDown";
import { MdArrowDropDown, MdCancel } from "react-icons/md";

export type FilterGroups = Record<string, { options: Option<string>[], color: string }>;

export type FilterProps = {
  filterGroups: FilterGroups,
  selectedFilters: Record<string, Option<string>[]>,
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, Option<string>[]>>>,
  ref: React.RefObject<HTMLDivElement | null>
};

export type FilterGroupProps = {
  name: string,
  options: Option<string>[],
  selected: Option<string>[],
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, Option<string>[]>>>,
  parentRef: React.RefObject<HTMLDivElement | null>
};

const FilterGroup = ({
  name,
  options,
  selected,
  setSelectedFilters,
  parentRef
}: FilterGroupProps) => {
  const [dropped, setDropped] = useState<boolean>(false);

  useEffect(() => {
    if (!parentRef.current) return;

    const handleClickOutside = (e: Event) => {
      if (!parentRef.current?.contains(e.target as Node)) {
        setDropped(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: optName, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]:
        prev?.[name]?.some(f => f.value === value)
          ?
          prev[name].filter(f => f.value !== value)
          :
          [
            ...(prev?.[name] ?? []),
            { name: optName, value }
          ]
    }));
  }

  return (
    <div
      className="text-white"
    >
      <div
        className="flex gap-2 items-center justify-center cursor-pointer"
        onClick={() => setDropped(!dropped)}
      >
        {name}
        <MdArrowDropDown
          className="transition-all z-0"
          style={{
            rotate: dropped ? '180deg' : '0deg'
          }}
          size={'25px'}
        />
      </div>
      <div
        className="transition-all text-white overflow-y-scroll max-h-60 overscroll-none"
        style={{
          height: dropped ? 'auto' : '0',
          scrollbarWidth: 'none'
        }}
      >
        {
          options.map((opt, id) => (
            <label key={id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.some(s => s.value === opt.value)}
                onChange={handleCheck}
                id={opt.name}
                name={opt.name}
                value={opt.value}
                className="peer hidden"
              />

              <div
                className="w-4 h-4 rounded border border-white peer-checked:bg-primary
                peer-checked:border-primary after:content-['✓'] after:text-xs
                after:text-white after:opacity-0 after:flex after:items-center after:justify-center
                  peer-checked:after:opacity-100"
              />

              <span>{opt.name}</span>
            </label>
          ))
        }
      </div>
    </div>
  )
}

const Filters = ({ filterGroups, selectedFilters, setSelectedFilters, ref }: FilterProps) => {
  const handleRemoveFilter = (filterName: string, filterOption: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].filter(f => f.name !== filterOption)
    }));
  }

  return (
    <div
      className="w-full flex flex-col z-0"
    >
      <div
        className="w-full mx-auto text-black flex flex-wrap gap-2 overflow-hidden transition-all"
        style={{
          height: Object.values(selectedFilters).some(f => f.length > 0) ? 'auto' : '0'
        }}
      >
        {
          Object.entries(selectedFilters).map(entry => (
            entry[1].map(filter => (
              <div
                style={{
                  backgroundColor: filterGroups?.[entry[0]]?.color
                }}
                className="rounded-lg p-1 font-bold flex items-center justify-between gap-1"
                key={filter.value}
              >
                {filter.name}
                <MdCancel
                  onClick={() => handleRemoveFilter(entry[0], filter.name)}
                  className="hover:scale-110 transition-all cursor-pointer"
                />
              </div>
            ))
          ))
        }
      </div>

      <div
        className="w-full flex p-2 gap-3 justify-center"
      >
        {
          Object.entries(filterGroups).map((entry, id) => (
            <FilterGroup
              key={id}
              name={entry[0]}
              options={entry[1].options}
              selected={selectedFilters?.[entry[0]] ?? []}
              setSelectedFilters={setSelectedFilters}
              parentRef={ref}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Filters;