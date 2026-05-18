import { BaseCardProps, CardListProps } from "../types/globals";
import { useEffect, useRef, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import useApi from "../hooks/useApi";
import { toast } from "react-toastify";
import { Option } from "./DropDown";
import { FaSortAmountDown } from "react-icons/fa";
import Filters from "./Filters";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import SortOptions from "./SortOptions";

const Pagination = ({
  pageNo,
  totalPages,
  handleArrows,
  handlePageChange,
}: {
  pageNo: string,
  totalPages: number,
  handleArrows: (action: "+" | "-") => void,
  handlePageChange: (val: string) => void,
}) => {
  const isPrevDisabled = Number(pageNo) <= 1;
  const isNextDisabled = Number(pageNo) >= totalPages;

  return (
    <div className="w-full flex items-center justify-center">
      <div className="text-[2rem] text-black flex items-center justify-center gap-3">
        <GrFormPrevious
          className={`bg-white py-2 rounded-2xl cursor-pointer transition-colors ${isPrevDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-primary"
            }`}
          onClick={() => !isPrevDisabled && handleArrows("-")}
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            min={1}
            max={totalPages}
            className="bg-white text-[1.5rem] w-10 h-10 text-center rounded-full hover:bg-primary cursor-pointer"
            value={pageNo}

            onChange={(e) => handlePageChange((e.target as HTMLInputElement).value)}
          />
          <span className="text-white text-lg">
            / {totalPages}
          </span>
        </div>
        <GrFormNext
          className={`bg-white py-2 rounded-2xl cursor-pointer transition-colors ${isNextDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-primary"
            }`}
          onClick={() => !isNextDisabled && handleArrows("+")}
        />
      </div>
    </div>
  );
};

const PaginationSkeleton = () => (
  <div className="w-full flex items-center justify-center">
    <div className="text-[2rem] text-black flex items-center justify-center gap-3">
      <GrFormPrevious
        className="bg-gray-700 w-8 h-8 py-2 rounded-2xl cursor-pointer transition-colors"
      />
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-700 animate-pulse rounded-full"></div>
        <span className="text-white text-lg">
          / ...
        </span>
      </div>
      <GrFormNext
        className="bg-gray-700 w-8 h-8 py-2 rounded-2xl cursor-pointer transition-colors"
      />
    </div>
  </div>
);

const CardList = <T extends BaseCardProps>({
  Card,
  SkeletonCard,
  apiEndpoint,
  dataKey,
  selectFields,
  orientation,
  cardsPerPage,
  handleEdit,
  handleDelete,
  pagination = true,
  filterGroups,
  sortOptions
}: CardListProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [pageNo, setPageNo] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(sessionStorage.getItem("showFilters") === "true" || false);
  const [showSortOptions, setShowSortOptions] = useState<boolean>(sessionStorage.getItem("showSortOptions") === "true" || false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Option<string>[]>>(JSON.parse(sessionStorage.getItem("filters") ?? "{}"));
  const [selectedSortOption, setSelectedSortOption] = useState<string>(sessionStorage.getItem("sortOption") ?? "createdAt");
  const [order, setOrder] = useState<"asc" | "desc">((sessionStorage.getItem("orderBy") ?? "desc") as "asc" | "desc");

  const filtersRef = useRef<HTMLDivElement>(null);

  const endpoint = 
    `/${apiEndpoint}` +
    `${pagination ? `?page=${pageNo}&limit=${cardsPerPage}` : ""}` +
    `${selectFields ? `${pagination ? '&' : '?'}${selectFields}` : '' }`;
  const api = useApi(endpoint, { auto: false });

  useEffect(() => {
    if (!pageNo) return;
    api.refetch();
  }, [pageNo, apiEndpoint]);

  useEffect(() => {
    setLoading(api.loading);
  }, [api.loading]);

  const handleInternalDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
    handleDelete?.(id);
  }

  const toggleSortOptions = () => {
    if(showSortOptions) {
      setSelectedSortOption("createdAt");
      sessionStorage.removeItem("showSortOptions");
    } else {
      sessionStorage.setItem("showSortOptions", "true");
    }
    setShowSortOptions(!showSortOptions);
  }

  const toggleFilters = () => {
    if (showFilters) {
      setSelectedFilters({});
      sessionStorage.removeItem("showFilters");
    } else {
      sessionStorage.setItem("showFilters", "true");
    }
    setShowFilters(!showFilters);
  }

  const toCamelCase = (str: string) => {
    str = str.toLowerCase();
    return str.split(" ")[0] + str.split(" ").slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  }

  useEffect(() => {
    const fetchFilteredData = async () => {
      let queryString = 
      Object.entries(selectedFilters).filter(
        entry => entry[1].length > 0
      ).map(
        entry => `${toCamelCase(entry[0])}s=${entry[1].map(
          v => v.value
        ).join(",")}`
      ).join("&");

      queryString += (queryString ? '&' : '') + `sortBy=${selectedSortOption}&orderBy=${order}`;
      await api.refetch({
        endpoint: 
          endpoint +
          `${queryString ? `${pagination ? '&' : `${selectFields ? '&' : '?'}`}${queryString}` : ""}`,
        method: "GET"
      });
    }

    if (Object.values(selectedFilters).some(f => f.length > 0)) {
      sessionStorage.setItem("filters", JSON.stringify(selectedFilters));
    } else {
      sessionStorage.removeItem("filters");
    }

    fetchFilteredData();
  }, [selectedFilters, selectedSortOption, order]);

  useEffect(() => {
    if(selectedSortOption === "createdAt") {
      sessionStorage.removeItem("sortOption");
    } else {
      sessionStorage.setItem("sortOption", selectedSortOption);
    }
  }, [selectedSortOption]);

  useEffect(() => {
    if(order === "asc") {
      sessionStorage.setItem("orderBy", "asc");
    } else {
      sessionStorage.removeItem("orderBy");
    }
  }, [order]);

  useEffect(() => {
    if (api.data) {
      setData(
        api.data[dataKey].map(
          (d: Omit<T, "handleEdit" | "handleDelete">) => ({
            handleEdit, handleDelete: handleInternalDelete, ...d
          })
        )
      );
    }

    if (api.error) {
      console.error(api.error);
      toast.error(api.error);
    }
  }, [api.data, api.error]);

  const totalPages = api.data?.totalPages;

  const handlePageChange = (val: string) => {
    const num = parseInt(val);
    if (!val) {
      setPageNo("");
      setLoading(true);
      return;
    }
    if (isNaN(num)) return;
    if (num < 1 || num > totalPages) {
      return;
    }
    setPageNo(num.toString());
  };

  const handleArrows = (action: "+" | "-") => {
    const num = parseInt(pageNo);
    if (isNaN(num)) return setPageNo("1");
    if (action === "-") {
      if (num - 1 < 1) return setPageNo("1");
      setPageNo((num - 1).toString());
    } else {
      if (num + 1 > data.length) return setPageNo(totalPages.toString());
      setPageNo((num + 1).toString())
    }
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-2/3 flex items-center justify-between mx-auto">
        <div className="w-2/3 flex items-center gap-2">
          <input
            className="w-full rounded-2xl bg-white p-2"
            placeholder="Search..."
            type="text"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="text-primary">
            {
              showFilters ?
                <MdFilterAltOff
                  className="hover:scale-110 transition-all cursor-pointer"
                  size={"35px"}
                  onClick={toggleFilters}
                /> :
                <MdFilterAlt
                  className="hover:scale-110 transition-all cursor-pointer"
                  size={"35px"}
                  onClick={toggleFilters}
                />
            }
          </div>
          <div className="text-primary cursor-pointer hover:scale-110 transition-all">
            <FaSortAmountDown
              size={"25px"}
              onClick={toggleSortOptions}
            />
          </div>
        </div>
      </div>

      {
        filterGroups &&
        <div
          className="w-2/3 mx-auto overflow-hidden transition-all flex flex-col"
          ref={filtersRef}
          style={{
            height: showFilters ? "auto" : "0"
          }}
        >
          <div className="text-primary text-[1.25rem] text-left">Filters:</div>
          <Filters
            filterGroups={filterGroups}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            ref={filtersRef}
          />
        </div>
      }

      {
        sortOptions &&
        <div
          className="w-2/3 mx-auto overflow-hidden transition-all flex flex-col"
          style={{
            height: showSortOptions ? "auto" : "0"
          }}
        >
          <div className="text-primary text-[1.25rem] text-left">Sort:</div>
          <SortOptions
            sortOptions={sortOptions}
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={setSelectedSortOption}
            order={order}
            setOrder={setOrder}
          />
        </div>
      }

      {
        pagination && (
          api.loading ?
            <PaginationSkeleton /> : (
              data.length > 0 &&
              <Pagination
                pageNo={pageNo}
                totalPages={totalPages}
                handleArrows={handleArrows}
                handlePageChange={handlePageChange}
              />
            )
        )
      }

      <div
        className="w-full my-10 flex flex-wrap gap-10 items-center justify-center"
        style={{
          flexDirection: orientation
        }}
      >
        {
          loading ? (
            Array.from({ length: pagination ? cardsPerPage! : data.length }).map((_, id) => (
              <SkeletonCard key={id} />
            ))
          ) : (
            data.length > 0
              ?
                data.map((cardProps, id) => (
                  <Card {...cardProps} key={id} />
                ))
              : (
                <p className="text-gray-400">No Data available</p>
              )
          )
        }
      </div>

      {
        pagination && (
          api.loading ?
            <PaginationSkeleton /> : (
              data.length > 0 &&
              <Pagination
                pageNo={pageNo}
                totalPages={totalPages}
                handleArrows={handleArrows}
                handlePageChange={handlePageChange}
              />
            )
        )
      }
    </div>
  );
}

export default CardList;
