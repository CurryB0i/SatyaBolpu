import { CardListProps, CardProps } from "../types/globals";
import { CardType } from "../types/enums";
import { NormalCard, NormalSkeletonCard } from "./NormalCard";
import { JSX, useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import RotatingCard, { RotatingSkeletonCard } from "./RotatingCard";
import { CollapsingCard, CollapsingSkeletonCard } from "./CollapsingCard";

const Pagination = ({ 
  pageNo, 
  totalPages, 
  handleArrows, 
  handlePageChange, 
} : {
  pageNo: string,
  totalPages: number,
  handleArrows: (action: "+" | "-") => void,
  handlePageChange: (val: string) => void,
}) => {
  const isPrevDisabled = Number(pageNo) <= 1;
  const isNextDisabled = Number(pageNo) >= totalPages;

  return (
    <div className="w-full flex items-center justify-center">
      <div className="text-[3rem] text-black flex items-center justify-center gap-3">
        <GrFormPrevious 
          className={`bg-white w-12 p-2 rounded-2xl cursor-pointer transition-colors ${
            isPrevDisabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-primary'
          }`}
          onClick={() => !isPrevDisabled && handleArrows('-')}
        />    
        <div className="flex items-center gap-2">
          <input
            type="text"
            min={1}
            max={totalPages}
            className="bg-white text-[2rem] w-12 h-12 text-center rounded-2xl hover:bg-primary cursor-pointer" 
            value={pageNo}
            
            onChange={(e) => handlePageChange((e.target as HTMLInputElement).value)}
          />
          <span className="text-white text-lg">
            / {totalPages}
          </span>
        </div>
        <GrFormNext 
          className={`bg-white w-12 p-2 rounded-2xl cursor-pointer transition-colors ${
            isNextDisabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-primary'
          }`}
          onClick={() => !isNextDisabled && handleArrows('+')}
        />
      </div>
    </div>
  );
};

const PaginationSkeleton = () => (
  <div className="w-full flex items-center justify-center">
    <div className="flex text-[3rem] text-black items-center justify-center gap-3">
      <GrFormPrevious 
        className="bg-gray-700 w-12 p-2 rounded-2xl cursor-pointer transition-colors"
      />    
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-gray-700 animate-pulse rounded-2xl"></div>
        <span className="text-white text-lg">
          /
        </span>
        <div className="w-12 h-12 bg-gray-700 animate-pulse rounded-2xl"></div>
      </div>
      <GrFormNext 
        className="bg-gray-700 w-12 p-2 rounded-2xl cursor-pointer transition-colors"
      />
    </div>
  </div>
);

const CardList = ({ cardsDataList, cardType, loading, orientation, cardsPerPage } : CardListProps) => {
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [pageNo,setPageNo] = useState<string>('1');
  const [pageData,setPageData] = useState<CardProps[]>([]);

  let Card: (props: CardProps) => JSX.Element;
  let SkeletonCard: () => JSX.Element;

  switch(cardType) {
    case CardType.NORMAL_CARD: 
      Card = NormalCard;
      SkeletonCard = NormalSkeletonCard;
      break;

    case CardType.ROTATING_CARD:
      Card = RotatingCard;
      SkeletonCard = RotatingSkeletonCard;
      break;

    case CardType.COLLAPSING_CARD:
      Card = CollapsingCard;
      SkeletonCard = CollapsingSkeletonCard;
      break;

    default:
      Card = NormalCard;
      SkeletonCard = NormalSkeletonCard;
      break;
  }


  useEffect(() => {
    if(cardsDataList.length <= 0) return; 

    setPaginationLoading(true);
    const page = parseInt(pageNo);
    if(!page) return;

    setPageData([]);
    setTimeout(() => {
      setPageData(cardsDataList.slice((page - 1)*cardsPerPage, page*cardsPerPage));
      setPaginationLoading(false);
    },1000);
   
  },[pageNo, cardsDataList])

  const totalPages = Math.ceil(cardsDataList.length / cardsPerPage);

  const handlePageChange = (val: string) => {
    const num = parseInt(val);
    if(!val) {
      setPageNo('');
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
    if(action === '-') {
      if(num - 1 < 1) return setPageNo('1');
      setPageNo((num - 1).toString());
    } else {
      if(num + 1 > cardsDataList.length) return setPageNo(totalPages.toString());
      setPageNo((num + 1).toString())
    }
  }

  return (
    <div>
      { !loading && cardsDataList.length > 0 ?
        <Pagination  
          pageNo={pageNo}
          totalPages={totalPages}
          handleArrows={handleArrows}
          handlePageChange={handlePageChange}
        /> :
        <PaginationSkeleton />
      }

      <div 
        className="w-full my-20 flex flex-wrap gap-24 items-center justify-center"
        style={{
          flexDirection: orientation
        }}
      >
      {
        loading || paginationLoading ? (
          Array.from({ length: cardsPerPage }).map((_, id) => (
              <SkeletonCard key={id} />
            ))
          ) : (
          pageData.map((cardProps, id) => (
            <Card {...cardProps} key={id}/>
          ))
      )}
      </div>

      { !loading && cardsDataList.length > 0 ?
        <Pagination  
          pageNo={pageNo}
          totalPages={totalPages}
          handleArrows={handleArrows}
          handlePageChange={handlePageChange}
        /> :
        <PaginationSkeleton />
      }
    </div>
  );
}

export default CardList;
