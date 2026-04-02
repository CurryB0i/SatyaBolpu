import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLoading } from '../context/LoadingContext'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react';
import { Swiper , SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Keyboard, Navigation, Pagination } from 'swiper/modules';
import Button from '../components/Button';
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import 'swiper/swiper-bundle.css';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import { buildAnimationProps } from '../constants/Animations';
import { useNavigate } from 'react-router-dom';
import { Marker, Popup } from 'react-leaflet';
import SVGHeader2 from '../constants/SVGHeader2';

gsap.registerPlugin(useGSAP); 
gsap.registerPlugin(ScrollTrigger);

type swiperDataType = {
  title : string;
  images : string[];
  descr : string;
}

type landmarksDataType = {
  title : string;
  image : string;
  descr : string;
}

const Home = () => {
  const { setLoading} = useLoading();
  const scrollWatcherRef = useRef<HTMLDivElement[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const headingRefs = useRef<HTMLDivElement[]>([]);
  const foliageRefs = useRef<HTMLImageElement[]>([]);
  const imgRefs = useRef<HTMLImageElement[]>([]);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const swiperOverlayRef = useRef<HTMLDivElement>(null);
  const landmarksRefs = useRef<HTMLDivElement[]>([]);
  const bgRefs = useRef<HTMLDivElement[]>([]);

  const [swiperData,setSwiperData] = useState<swiperDataType[]>([]);
  const [landmarksData,setRecentData] = useState<landmarksDataType[]>([]);
  const [isHovering,setHovering] = useState<boolean>(false);

  const navigate = useNavigate();
  const {state} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/assets/data/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const data = await response.json();
        if (data.cultures && data.landmarks) {
          setSwiperData(data.cultures);
          setRecentData(data.landmarks);
        } else {
          console.error('Invalid data format');
        }
      } catch (error) {
        console.error(error);
      } finally {
          setLoading(false)
      }
    };
  
    fetchData();
  }, []);

  useLayoutEffect(() => {

    const ctx = gsap.context(() => {
      const runAnimations = (isMobile: boolean) => {

        const animations = buildAnimationProps(
          scrollWatcherRef,
          headingRefs,
          foliageRefs,
          overlayRef,
          imgRefs,
          svgRef,
          mapRef,
          swiperOverlayRef,
          bgRefs,
          landmarksRefs,
          buttonRefs,
          isMobile
        );

        animations.forEach(({ ref, fromVars, toVars }) => {
          gsap.fromTo(ref, fromVars, toVars);
        });

      };

      const mm = gsap.matchMedia();
      mm.add("(max-width:768px)", () => runAnimations(true));
      mm.add("(min-width:769px)", () => runAnimations(false));

    });

    return () => ctx.revert();

  }, [landmarksData, swiperData]);

    return (
      <div className='home w-screen bg-black'>
        
        <div className='relative w-full h-screen'>
          <div className='w-full h-screen absolute grid place-items-center top-0 left-0 z-0'
            style={{
              clip: 'rect(0, auto, auto, 0)',
            }}
          >
            <div 
              className="fixed inset-0 w-full h-full flex items-center justify-center bg-no-repeat bg-cover bg-center -z-10
                before:content-[''] before:fixed before:inset-0 before:opacity-60 before:z-10 before:bg-black"
              style={{
                backgroundImage: "url('/assets/Home/hero/bg2.webp')",
              }}
              ref={(el) => { if(el) scrollWatcherRef.current[0] = el; }}
            >
            </div>
            <div className='fixed w-full z-10 flex items-center justify-center gap-5'>
              <div 
                className='absolute text-[3.5rem] md:text-[5rem] lg:text-[7.5rem] font-black
                text-center text-transparent [-webkit-text-stroke:2px_var(--primary)]
                md:[-webkit-text-stroke:5px_var(--primary)]'
              >
                <p 
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%]'
                  ref={(el) => { if(el) headingRefs.current[0] = el; }}
                >
                  Welcome
                </p>
                <p
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[50%]' 
                  ref={(el) => { if(el) headingRefs.current[1] = el; }}
                >
                  To
                </p>
                <p
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[50%]' 
                  ref={(el) => { if(el) headingRefs.current[2] = el; }}
                >
                  Tulunadu
                </p>
              </div>
              <SVGHeader2 ref={svgRef}/>
            </div>
          </div>
        </div>

        <div className='relative w-full h-[600vh]'>
          <div className='absolute w-full h-full top-0 left-0'
            style={{
              clip: 'rect(0, auto, auto, 0)',
            }}
            ref={(el) => {if(el) scrollWatcherRef.current[1] = el }}
          >
            <img 
              className='fixed top-0 w-full h-full object-cover z-40'
              src="/assets/Home/hero/foliage.png" alt="foliage"
              ref={(el) => { if(el) foliageRefs.current[0] = el; }}
            />
            <div
              className='fixed top-0 w-full h-full bg-black/50 z-10'
              ref={overlayRef}
            ></div>
            <div
              className='fixed w-full text-wrap text-[3.5rem] md:text-[5rem] lg:text-[7.5rem] 
              font-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              text-primary text-center z-30'
              ref={(el) => { if(el) headingRefs.current[3] = el; }}
            >
              <p>
                From The
              </p>
              <p>
                Western Ghats
              </p>
            </div>
            <img
              className='fixed top-0 left-0 w-full h-full object-cover object-center bg-white z-0'
              src="/assets/Home/hero/mountain.png" 
              alt="western ghats"
              ref={(el) => { if(el) imgRefs.current[0] = el; }}
            />
            <img 
              className='fixed top-0 left-0 w-full h-full object-cover object-center bg-white z-0'
              src="/assets/Home/hero/bg1.webp" 
              alt="eastern coast" 
              ref={(el) => { if(el) imgRefs.current[1] = el; }}
            />
            <div
              className='fixed w-full text-[3.5rem] md:text-[5rem] lg:text-[7.5rem] 
              font-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              text-primary text-center z-30'
              ref={(el) => { if(el) headingRefs.current[4] = el; }}
            >
              <p>
                To The
              </p>
              <p>
                Eastern Coast
              </p>
            </div>
            <img 
              className='fixed top-0 w-full h-full object-cover z-40 opacity-0 scale-[2]'
              src="/assets/Home/hero/foliage.png" alt="foliage"
              ref={(el) => { if(el) foliageRefs.current[1] = el; }}
            />
            <img 
              className='fixed top-0 w-full h-full object-cover z-0'
              src="/assets/Home/hero/dasara.jpg" alt="" 
              ref={(el) => { if(el) imgRefs.current[2] = el; }}
            />
            <div
              className='fixed w-full h-full text-[3.5rem] md:text-[5rem] lg:text-[7.5rem] 
              top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
              flex-col text-primary text-center  z-10 font-black '
              ref={(el) => { if(el) headingRefs.current[5] = el; }}
            >
              <p>Enter The</p>
              <p>Sacred Realm</p>
            </div>
          </div>
        </div>
  
        <div className='w-full h-[200vh] top-0 flex flex-col lg:flex-row gap-5 items-center justify-center p-10'
             ref={(el) => {if(el) scrollWatcherRef.current[2] = el }}>
          <div className='w-full lg:w-1/2 lg:h-full flex items-center justify-center text-center text-primary text-[1.5rem]
                          md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] xl:p-20' 
                ref={(el) => {if(el) headingRefs.current[6] = el }}>
            The Spiritual Hub is Spread Across Two States And Three Districts
          </div>
          <div className='w-full lg:w-2/3 xl:w-1/2 h-[40%]'>
            <MapComponent ref={mapRef}>
              <Marker position={[13.3409, 74.7421]}>
                  <Popup>Udupi - The Heart of Tulunadu</Popup>
              </Marker>
              <Marker position={[12.8701, 74.8419]}>
                  <Popup>Mangaluru - The Heart of Tulunadu</Popup>
              </Marker>
              <Marker position={[12.4996,74.9869]}>
                  <Popup>Kasargod - The Heart of Tulunadu</Popup>
              </Marker>
            </MapComponent>
          </div>
        </div>

        <div className='cultures w-full h-[150vh] md:h-[200vh] flex flex-col gap-10 items-center justify-center' 
             ref={(el) => {if(el) scrollWatcherRef.current[3] = el }}>

          <div className='text-primary text-center text-[2.25rem]/[2.25rem] md:text-[3rem] xl:text-[5rem] '
               ref={(el) => {if(el) headingRefs.current[7] = el }}>
            Cultures And Traditions
          </div>
          
          <div className='w-full h-full relative flex'>
          <div className='absolute top-0 w-screen h-screen z-10 bg-black' ref={swiperOverlayRef}></div>

          <Swiper
            className='absolute top-0 z-0 w-screen h-screen'
            spaceBetween={50}
            slidesPerView={1}
            loop={swiperData.length > 1}
            autoplay = {{delay: 10000 }}
            keyboard = {{enabled :true, onlyInViewport: true}}
            pagination = {{
              clickable: true,
              type: 'bullets',
              el: '.custom-pagination',
              bulletClass: 'w-2 h-2 bg-white z-10 transition-all duration-150 rounded',
              bulletActiveClass: 'w-5 !bg-primary'
            }}
            navigation = {{
              nextEl: '.custom-nav-next',
              prevEl: '.custom-nav-prev'
            }}
            modules={[Pagination, Navigation, Keyboard, EffectCoverflow, Autoplay]}
            onSlideChange={() => 
              console.log('slide change')
            }
            onSwiper={(swiper) => {
              console.log(swiper)
            }}
            effect='coverflow'>
            <div className='absolute top-0 w-full h-screen bg-black z-0'>
            {
              swiperData && swiperData.map((slide,index) => (
                <SwiperSlide key={index}>
                  <div className='z-0 relative w-screen h-screen lg:flex-row flex flex-col-reverse justify-center
                                  lg:justify-around items-center md:p-5 md:gap-0'>
                    <div className='lg:w-1/3 md:w-5/6 w-full lg:h-full h-full flex flex-col items-center justify-center md:gap-5'>
                      <h1 className='text-[2rem] lg:text-[3rem]/[3rem] text-primary'>{slide.title}</h1>
                      <p className='text-justify text-white text-[1rem] p-10'>{slide.descr}</p>
                      <Button content="Explore" onClick={()=>navigate(`/explore/${slide.title}`)}/>
                    </div>
                    <div className='flex lg:flex-col items-center justify-center lg:w-2/5 lg:h-full w-[125vw] h-[75%]
                                    cursor-pointer' 
                         onMouseEnter={() => setHovering(true)}
                         onClick={() => setHovering(!isHovering)}
                         onMouseLeave={() => setHovering(false)}>
                      <img loading='lazy' className={`relative lg:w-3/5 w-1/2 aspect-video object-cover z-0 transition-all duration-300 
                                       ${isHovering ? 'lg:translate-y-0 lg:-rotate-12 lg:translate-x-0 -translate-y-28 -rotate-20 translate-x-[90%] ' 
                                                    : '-translate-y-5 rotate-10 translate-x-[90%] lg:translate-x-0 lg:translate-24 lg:rotate-12'}`}
                            src={slide.images[0]} alt={slide.title} />
                      <img loading='lazy' className={`relative lg:w-3/5 w-1/2 aspect-video object-cover z-10 `} 
                           src={slide.images[1]} alt={slide.title} />
                      <img loading='lazy' className={`relative lg:w-3/5 w-1/2 aspect-video object-cover z-0 transition-all duration-300
                                     ${isHovering ? 'lg:translate-y-0 lg:-rotate-12 translate-y-28 -translate-x-[90%] -rotate-20 lg:translate-x-0' 
                                                  : 'translate-y-5 rotate-10 -translate-x-[90%] lg:translate-x-0 lg:-translate-y-24 lg:rotate-12'}`}
                           src={slide.images[2]} alt={slide.title} />
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }
            </div>

            <div className="flex relative bottom-13 md:bottom-16 gap-3 flex-col-reverse">
              <div className="nav w-full text-black flex items-center justify-center gap-2 text-3xl">
                <div className='custom-nav-prev z-10 cursor-pointer rounded-[999px] bg-white hover:bg-primary'>
                  <GrFormPreviousLink />
                </div>
                <div className='custom-nav-next z-10 cursor-pointer rounded-[9999px] bg-white hover:bg-primary'>
                  <GrFormNextLink />
                </div>
              </div>
              <div className="custom-pagination w-full h-auto  flex items-center justify-center gap-2">
              </div>
            </div>
          </Swiper>
          </div>
        
        </div>

        <div className='w-full md:my-52 flex flex-col items-center justify-center gap-10 md:gap-32' 
             ref={(el) => {if(el) scrollWatcherRef.current[4] = el }}>
          <div className='text-primary text-center text-[2.5rem] sm:text-[4rem] md:text-[4rem] xl:text-[5rem]' 
               ref={(el) => {if(el) headingRefs.current[8] = el} }>
            Cutural Landmarks
          </div>
          <div className='flex flex-col w-full p-2 md:p-10 items-center justify-center gap-5 md:gap-16'>
          {
            landmarksData && landmarksData.map((data,index) => (
              <div key={index} className='w-full flex border-4 border-primary'
                ref={(el) => { if(el) landmarksRefs.current[index] = el; }}
                style={{
                  flexDirection: index%2 === 0 ? 'row' : 'row-reverse'
                }}
              >
                <img 
                  className='w-1/3 aspect-square object-cover'
                  src={data.image} 
                  alt={data.title}
                />
                <div className='w-2/3 flex flex-col items-center justify-center'>
                  <p className='text-primary text-[1.2rem] md:text-[2rem]'>{data.title}</p>
                  <p className='text-white'>{data.descr}</p>
                </div>
              </div>
            ))
          }
          <Button 
            className='text-center md:text-[1.25rem] p-3' 
            content='View All'
            index={0}
            ref={buttonRefs}
          />
          </div>
        </div>

        <div className='cta relative w-screen h-[350vh] mt-[50vh] mb-[50vh]' ref={(el) => {if(el) scrollWatcherRef.current[5] = el}}>
          <div className="sticky top-0 w-full h-screen">
            <div className='overlay w-full h-screen absolute top-0 bg-[rgba(0,0,0,0.5)] z-10'></div>
            <div className="w-screen h-1/4 md:w-1/4 md:h-screen top-0 left-0 absolute
                            [background-image:url('/assets/Home/cta/daivaradhane.jpg')] bg-no-repeat
                            bg-cover bg-center transition-all duration-300" 
                 ref={(el) => {if(el) bgRefs.current[0] = el}}></div>
            <div className="w-screen h-1/4 md:w-1/2 md:h-screen top-[25%] md:top-0 md:left-[12.5%] absolute
                            [background-image:url('/assets/Home/cta/Kambala.webp')] bg-no-repeat
                            bg-cover bg-center transition-all duration-300"
                 ref={(el) => {if(el) bgRefs.current[1] = el}}></div>
            <div className="w-screen h-1/4 md:w-1/2 md:h-screen bottom-[25%] md:top-0 md:right-[12.5%] absolute
                            [background-image:url('/assets/Home/cta/yakshagana.jpg')] bg-no-repeat
                            bg-cover md:bg-center transition-all duration-300"
                 ref={(el) => {if(el) bgRefs.current[2] = el}}></div>
            <div className="w-screen h-1/4 md:w-1/4 md:h-screen bottom-0 right-0 absolute
                            [background-image:url('/assets/Home/cta/nagaradhane.jpg')] bg-no-repeat
                            bg-cover bg-center md:bg-[40%] transition-all duration-300"
                 ref={(el) => {if(el) bgRefs.current[3] = el}}></div>
          </div>
          <div className='sticky top-0 w-full h-screen flex flex-col items-center justify-center gap-3 text-center z-20 p-5'>
            <h1 className='text-white text-[2rem]'>
            {
                state.token ?
                "Embrace The Land of Faith"
                    :
                "Fully Experience The World Of Faith"
            }
            </h1>
            {
                state.token ? <Button content='Go To Dashboard'/> : <Button content='Get Started'/>
            }
          </div>
        </div>

        <div className="quote w-fit ml-auto mr-auto pb-[75vh] text-white">
          <h1 className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-cursive">"Tuluva Manna Satyole Chitta"</h1>
          <p className='md:text-right text-center font-cursive'>- Vijeth M Shetty Manjanady</p>
        </div>

      </div>
    )
}

export default Home;
