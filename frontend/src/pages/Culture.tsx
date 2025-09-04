import { Navigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CultureType } from "./Explore";
import { useLoading } from "../context/LoadingContext";
import gsap from "gsap";
import Button from "../components/Button";

const Culture = () => {
  const { culture } = useParams();
  const { isLoading, setLoading } = useLoading();
  const culturesApi = useApi(`/cultures/${culture}`);
  const [cultureData, setCultureData] = useState<CultureType | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    setLoading(culturesApi.loading);
  }, [culturesApi.loading]);
  
  useEffect(() => {
    if (culturesApi.data) {
      setCultureData(culturesApi.data.culture);
    }
  }, [culturesApi.data]);

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
            markers: true
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

        sections.forEach((section) => {
          gsap.fromTo(section, 
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "left center",
                toggleActions: "play none none reverse"
              }
            }
          );
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
            className="w-screen h-screen text-primary/70 flex items-center justify-center font-black overflow-hidden"
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
            className="w-screen h-screen text-primary font-black overflow-hidden"
            ref={(el) => { if(el) sectionsRef.current[1] = el }}
          >
            <div 
              className="w-screen h-screen text-center absolute left-0 flex gap-5 flex-col justify-center items-center"
            >
              <div className="text-[2rem]">
                The Deity Worship
              </div>
              <div className="w-1/2 text-justify text-[1.25rem]">
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
            className="w-screen h-screen text-primary font-black overflow-hidden"
            ref={(el) => { if(el) sectionsRef.current[2] = el }}
          >
            <div 
              className="w-screen h-screen text-center absolute left-0 flex gap-5 flex-col justify-center items-center"
            >
            </div>
          </div>


        </div>
      </div>
    )
  );
};

export default Culture;
