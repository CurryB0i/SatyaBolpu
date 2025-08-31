import { Navigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CultureType } from "./Explore";
import { useLoading } from "../context/LoadingContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

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

        const tl = gsap.timeline();
        
        tl.to(sections, {
          xPercent: -100 * (totalSections - 1),
          ease: "none",
        });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: () => "+=" + ((totalSections - 1) * window.innerHeight * 1.5),
          pin: true,
          animation: tl,
          scrub: 1,
          snap: {
            snapTo: (progress) => {
              const snapPoints = [];
              for (let i = 0; i < totalSections; i++) {
                snapPoints.push(i / (totalSections - 1));
              }
              
              let closest = snapPoints[0];
              let minDistance = Math.abs(progress - closest);
              
              for (let point of snapPoints) {
                const distance = Math.abs(progress - point);
                if (distance < minDistance) {
                  minDistance = distance;
                  closest = point;
                }
              }
              
              return closest;
            },
            duration: { min: 0.1, max: 0.3 },
            ease: "none"
          },
          markers: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const progressRate = 100/(totalSections-1);
            
            sections.forEach((section, index) => {
              const isActive = (Math.floor(progress*100)/progressRate === index);
              gsap.to(section, {
                opacity: isActive ? 1 : 0.7,
                scale: isActive ? 1 : 0.9,
                borderRadius: isActive ? 0 : 100,
                duration: 0.3
              });
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
          className="w-full h-screen flex"
          style={{ width: `${3 * 100}vw` }}
        >
          {/* Section 1 */}
          <div 
            className="w-screen h-screen bg-white text-primary/70 flex justify-center items-center font-black flex-shrink-0"
            ref={(el) => { if(el) sectionsRef.current[0] = el }}
          >
            <div className="text-center">
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
              <p className="text-lg mt-8 opacity-70">Section 1 - Introduction</p>
            </div>
          </div>

          {/* Section 2 */}
          <div 
            className="w-screen h-screen bg-white text-primary/70 flex justify-center items-center font-black flex-shrink-0"
            ref={(el) => { if(el) sectionsRef.current[1] = el }}
          >
            <div className="text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="80vw" 
                height="50vh" 
                style={{ strokeDasharray: '400', animation: 'showText 2s linear forwards 0.5s' }}
              >
                <text 
                  x='50%' 
                  y='50%' 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="stroke-primary fill-transparent"
                  style={{ fontSize: 'clamp(2rem,8vw,8rem)' }}
                >
                  History
                </text>
              </svg>
              <p className="text-lg mt-8 opacity-70">Section 2 - Historical Background</p>
            </div>
          </div>

          {/* Section 3 */}
          <div 
            className="w-screen h-screen bg-white text-primary/70 flex justify-center items-center font-black flex-shrink-0"
            ref={(el) => { if(el) sectionsRef.current[2] = el }}
          >
            <div className="text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="80vw" 
                height="50vh" 
                style={{ strokeDasharray: '400', animation: 'showText 2s linear forwards 1s' }}
              >
                <text 
                  x='50%' 
                  y='50%' 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="stroke-primary fill-transparent"
                  style={{ fontSize: 'clamp(2rem,8vw,8rem)' }}
                >
                  Traditions
                </text>
              </svg>
              <p className="text-lg mt-8 opacity-70">Section 3 - Cultural Practices</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Culture;
