import { Navigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import gsap from "gsap";
import Button from "../components/Button";
import { CultureDetailsType } from "../types/globals";

const Culture = () => {
  const { culture } = useParams();
  const { setLoading } = useLoading();
  const culturesApi = useApi(`/cultures/${culture}`);
  const [cultureData, setCultureData] = useState<CultureDetailsType | null>(null);
  const [imgCount, setImgCount] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const imagesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    console.log(imgCount)
    if(imagesRef.current.length <= 0) return;

    let imgWidth = 0;
    const ww = window.innerWidth;
    if(ww < 768) {
      imgWidth = ww*0.2;
    } else if (ww < 1280) {
      imgWidth = ww*0.15;
    } else {
      imgWidth = ww*0.1;
    }

    const c = (window.innerWidth/imgWidth) * (window.innerHeight/imgWidth);
    console.log(imgWidth, c)
    setImgCount(Math.round(c));
  }, [cultureData, window.innerWidth, window.innerHeight]);

  useEffect(() => {
    setLoading(culturesApi.loading);
  }, [culturesApi.loading]);
  
  useEffect(() => {
    if (culturesApi.data) {
      setCultureData(culturesApi.data.culture);
    }
  }, [culturesApi.data]);

  const shuffle = useCallback((array: HTMLDivElement[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },[]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current && sectionsRef.current.length > 0) {
        const sections = sectionsRef.current;
        const totalSections = sections.length;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => "+=" + ((totalSections-1) * window.innerHeight),
            pin: true,
            scrub: true,
            snap: {
              snapTo: (progress) => {
                const snapPoints = [];
                for (let i = 0; i < totalSections; i++) {
                  snapPoints.push(i / (totalSections - 1));
                }
                return snapPoints.reduce((prev, curr) =>
                  Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
                );
              },
              duration: { min: 0.3, max: 0.5 },
              ease: "power2.inOut"
            },
            onUpdate: ({progress}) => {
              const activeIndex = Math.round(progress*(totalSections-1));
              sections.forEach((section,index) => {
                const isActive = index === activeIndex;
                gsap.to(section,
                  {
                    opacity: isActive ? 1 : 0,
                  }
                );
              })

              const shuffledImages = shuffle(imagesRef.current);
              if(activeIndex === totalSections-1) {
                gsap.to(shuffledImages,
                  {
                    scale: 1,
                    stagger: 0.25,
                    duration: 0.25,
                  }
                )
              }
            }
          }
        });

        sections.forEach((section, index) => {
          if(index !== sections.length-1) {
            tl.to(section, {
              width: 0,
              ease: "power1.inOut"
            });
          }
        });


      }
    });

    return () => ctx.revert();
  }, [cultureData]);
 
  if (culturesApi.error) {
    return <Navigate to={'/404'} replace />;
  }

  return (
    cultureData && (
      <div className="w-full">
        <style>{`
          @keyframes showText {
            0% {
              stroke-dashoffset: 400;
              fill: transparent;
            }
            80% {
              stroke-dashoffset: 20;
              fill: transparent;
            }
            100% {
              stroke-dashoffset: 0;
              fill: var(--primary);
            }
          }
        `}</style>

        <div 
          ref={containerRef}
          className="w-full h-screen flex relative"
          style={{ width: `${3 * 100}vw` }}
        >
          <div 
            className="w-screen h-screen text-primary/70 flex relative items-center justify-center font-black overflow-hidden"
            ref={(el) => { if(el) sectionsRef.current[0] = el }}
          >
            <div 
              className="w-screen h-screen text-center absolute left-0 flex flex-col justify-center items-center"
              style={{
                background: 'url()' 
              }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                width="80vw" 
                height="50vh" 
                  style={{ strokeDasharray: '400', animation: 'showText 2s linear forwards' }}
                >
                  <text 
                    x='50%' 
                    y='50%' 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    className="stroke-primary"
                    style={{ fontSize: 'clamp(2rem,10vw,10rem)' }}
                  >
                    {cultureData.name}
                  </text>
                </svg>
            </div>
          </div>

          <div 
            className="w-screen h-screen text-primary relative font-black overflow-hidden"
            ref={(el) => { if(el) sectionsRef.current[1] = el }}
          >
            <div 
              className="w-screen h-screen text-center absolute left-0 flex gap-5 flex-col justify-center items-center"
            >
              <div className="text-[2rem]">
                The Deity Worship
              </div>
              <div className="w-[95%] md:w-[80%] px-2 md:px-0 lg:w-3/4 2xl:w-3/5 text-justify text-sm md:text-[1.25rem]">
                Daivaradhane / Bhootaradhane is practiced in the coastal region of Karnataka which is still practiced today.
                Daivardhane refers to the worship of the divine power of guardians and ancestors by conducting rituals and ceremonies.
                In Tulunadu, Daivardhane is a non-Vedic ritual. Early Tuluvas were not practitioners of the Vedas and Shastra,
                which place a greater emphasis on Yajnas, shlokas, and fire sacrifices.

                Daivaradhane plays a much more important part in the religious life of the people of Tulu Nadu.
                It is really very difficult to decide how old this custom or practice of worshipping the Daiva is. 
                but believed to be one of the time-honored Dravidian cults. Daivas also plays an important role in the administration and 
                judiciary system of Tulu Nadu.

                Dravidians worship their ancestors. It is believed that there are more than 1000+ Daiva's in Tulu Nadu.
                But only a few are more popular and worshipped in all parts of Tulu Nadu. while other spirits are worshipped by 
                certain individual families or in certain regions only in a modest way. Each Daiva's has its own story and Reason for worshipping.
              </div>
              <Button 
                content="View More"
              />
            </div>
          </div>

          <div 
            className="w-screen h-screen text-primary relative font-black overflow-hidden"
            ref={(el) => { if(el) sectionsRef.current[2] = el }}
          >
            <div 
              className="w-screen h-screen text-center absolute left-0 flex flex-wrap
                justify-evenly items-center"
            >
              {
                Array(imgCount).fill(`/assets/Explore/daivaradhane.jpg`).map((item,index) => (
                  <div 
                    key={index} 
                    className="w-[20%] md:w-[15%] xl:w-[10%] scale-0 opacity-50" 
                    ref={(el) => {if(el) imagesRef.current[index] = el }}>
                    <img className="w-full aspect-square object-cover object-center" src={item} alt="" />
                  </div>
                ))
              }
              <Button 
                className="absolute text-[1.5rem]"
                content="View Gallery"
              />
            </div>
          </div>


        </div>
      </div>
    )
  );
};

export default Culture;
