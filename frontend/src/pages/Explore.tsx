import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { useLoading } from "../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import useApi from "../hooks/useApi";
import { BASE_URL } from "../App";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(useGSAP); 
gsap.registerPlugin(ScrollTrigger);

type CultureType = {
  name: string;
  description: string;
  image: string | File;
  posts: number;
}

const Explore = () => {
  const culturesApi = useApi('/cultures');
  const [cultures,setCultures] = useState<CultureType[]>([]);
  const culturesRef = useRef<HTMLDivElement[]>([]);
  const { setLoading } = useLoading();
  const navigate = useNavigate();

useLayoutEffect(() => {
  if (cultures.length > 0 && culturesRef.current.length > 0) {
    let ctx = gsap.context(() => {
      culturesRef.current.forEach((culture) => {
        if (!culture) return;
        gsap.fromTo(culture, 
          {
            opacity: 1,
            scale: 1,
          },
          {
            opacity: 0,
            scale: 0.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: culture,
              start: 'bottom center',
              scrub: true,
              toggleActions: 'play none none reverse'
            },
          });
      });
    });

    return () => ctx.revert();
  }
}, [cultures]);

  useEffect(() => {
    setLoading(culturesApi.loading)
  },[culturesApi.loading])

  useEffect(() => {
    if(culturesApi.data)
      setCultures(culturesApi.data.cultures);
  },[culturesApi.data])

  
  return (
    <div className="explore w-screen relative bg-black">
      {cultures.length > 0 && cultures.map((culture, index) => (
        <div key={index} className="w-full min-h-screen sticky top-0 flex
          items-center justify-center text-primary bg-no-repeat bg-center bg-cover"
          ref={(el) => {
            if(el) 
              culturesRef.current[index] = el
          }}
          style={{
            backgroundImage: `url(${BASE_URL}${culture.image})`
          }}>
            <div className="w-[95%] md:w-2/3 lg:w-1/2 flex flex-col items-center justify-center bg-black/70
              rounded-2xl p-3 gap-5">
              <div className="text-[3rem] font-black">
                <h1>{culture.name}</h1>
              </div>
              <div className="w-full text-justify">
                <p>{culture.description}</p>
              </div>
              <Button 
                content="Explore"
                onClick={() => navigate(`/explore/${culture.name.toLowerCase()}`)}
              />
            </div>
        </div> 
      ))}
    </div>
  )
};

export default Explore;

