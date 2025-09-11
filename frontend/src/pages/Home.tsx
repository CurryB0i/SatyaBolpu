import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLoading } from '../context/LoadingContext'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react';
import { Swiper , SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Keyboard, Navigation, Pagination } from 'swiper/modules';
import Button from '../components/Button';
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { IoIosArrowDropright } from "react-icons/io";
import 'swiper/swiper-bundle.css';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import { buildAnimationProps } from '../constants/Animations';
import SVGHeader from '../constants/SVGHeader';
import { useNavigate } from 'react-router-dom';
import { Marker, Popup } from 'react-leaflet';

gsap.registerPlugin(useGSAP); 
gsap.registerPlugin(ScrollTrigger);

type swiperDataType = {
  title : string;
  images : string[];
  descr : string;
}

type recentDataType = {
  title : string;
  image : string;
  descr : string;
}

const Home = () => {
  const {isLoading, setLoading} = useLoading();
  const scrollWatcherRef = useRef<HTMLDivElement[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const headingRefs = useRef<HTMLDivElement[]>([]);
  const foliageRef = useRef<HTMLImageElement[]>([]);
  const overlayRef = useRef<HTMLDivElement[]>([]);
  const layer2Ref = useRef<HTMLDivElement | null>(null);
  const layer3Ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<HTMLDivElement | null>(null);
  const recentRefs = useRef<HTMLDivElement[]>([]);
  const bgRefs = useRef<HTMLDivElement[]>([]);

  const [swiperData,setSwiperData] = useState<swiperDataType[]>([]);
  const [recentData,setRecentData] = useState<recentDataType[]>([]);
  const [isHovering,setHovering] = useState<boolean>(false);
  const [openIndex,setOpenIndex] = useState<boolean[]>([]);

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
        if (data.cultures && data.recent) {
          setSwiperData(data.cultures);
          setRecentData(data.recent);
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

  useEffect(() => {
    if(recentData){
      setOpenIndex(Array(recentData.length).fill(false))
    }
  },[recentData])

  useLayoutEffect(() => {

      let ctx = gsap.context(() => {

          const animations = buildAnimationProps(
              scrollWatcherRef,
              headingRefs,
              overlayRef,
              foliageRef,
              layer2Ref,
              layer3Ref,
              svgRef,
              mapRef,
              swiperRef,
              bgRefs,
              recentRefs
          );

          animations.forEach(({ ref, fromVars, toVars }) => {
              gsap.fromTo(ref, fromVars, toVars);
          });
      })

    return () => ctx.revert();

  },[recentData,swiperData]);

    return (
      <div className='home w-screen bg-black'>
        
        <div className='relative w-full h-screen'>
          <div className='w-full h-screen absolute grid place-items-center top-0 left-0 z-0'
            style={{
              clip: 'rect(0, auto, auto, 0)',
            }}
          >
            <div 
              className="fixed inset-0 w-full h-screen bg-no-repeat bg-cover bg-center -z-10
                before:content-[''] before:fixed before:inset-0 before:opacity-60 before:z-10 before:bg-black"
              style={{
                backgroundImage: "url('/assets/Home/hero/bg2.webp')",
              }}>
            </div>
            <div className='fixed w-full z-10 grid place-items-center'>
              <div 
                className='text-[3.5rem]/[3.5rem] lg:text-[5rem] font-black text-black
                text-primary/75 text-center'
                ref={(el) => { if(el) headingRefs.current[0] = el }}>
                 Welcome To Tulunadu
              </div>
              <SVGHeader ref={svgRef}/>
            </div>
          </div>
        </div>

        <div className='relative w-full h-[100vh]'>
          <div className='w-full h-screen absolute top-0 left-0'
            style={{
              clip: 'rect(0, auto, auto, 0)',
            }}
          >
            <div 
              className='fixed top-0 w-full h-screen bg-no-repeat bg-cover bg-center bg-white'
              style={{
                backgroundImage: "url('/assets/Home/hero/mountain.png')",
              }}>
            </div>
          </div>
        </div>

        <div className='relative w-full h-screen'>
          <div className='w-full h-screen absolute top-0 left-0'
            style={{
              clip: 'rect(0, auto, auto, 0)',
            }}
          >
            <div 
              className='fixed top-0 w-full h-screen bg-no-repeat bg-cover bg-center'
              style={{
                backgroundImage: "url('/assets/Home/hero/bg1.webp')",
              }}>
            </div>
          </div>
        </div>

        <div className='map w-full h-screen flex flex-col lg:flex-row gap-5 items-center justify-center p-10 mb-[100vh]'
             ref={(el) => {if(el) scrollWatcherRef.current[1] = el }}>
          <div className='w-full lg:w-1/2 lg:h-full flex items-center justify-center text-center text-primary text-[1.5rem]
                          md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] xl:p-20 font-semibold' 
                ref={(el) => {if(el) headingRefs.current[4] = el }}>
            The Spiritual Hub is Spread Across Two States And Three Districts
          </div>
          <div className='w-full lg:w-2/3 xl:w-1/2 h-full'>
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

        <div className='cultures w-full flex flex-col items-center justify-center mb-[100vh]' 
             ref={(el) => {if(el) scrollWatcherRef.current[2] = el }}>

          <div className='text-primary text-center text-[2.25rem] md:text-[3rem] xl:text-[5rem] '
               ref={(el) => {if(el) headingRefs.current[5] = el }}>
            Cultures And Traditions
          </div>
          <Swiper
            className='relative w-screen h-screen'
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
              bulletActiveClass: '[backgroundColor:var(--primary)_!important] w-5'
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
            <div className='absolute top-0 w-full h-screen bg-black z-20' ref={swiperRef}></div>
            {
              swiperData && swiperData.map((slide,index) => (
                <SwiperSlide key={index}>
                  <div className='z-0 relative w-screen h-screen lg:flex-row flex flex-col-reverse justify-center
                                  lg:justify-around items-center p-5'>
                    <div className='lg:w-1/3 md:w-5/6 w-full lg:h-full h-1/3 flex flex-col items-center justify-center gap-5'>
                      <h1 className='text-[2rem]/[2rem] lg:text-[3rem]/[3rem] text-primary'>{slide.title}</h1>
                      <p className='text-justify text-white text-[1rem] p-10'>{slide.descr}</p>
                      <Button content="Explore" onClick={()=>navigate(`/explore/${slide.title}`)}/>
                    </div>
                    <div className='flex lg:flex-col items-center justify-center lg:w-2/5 lg:h-full w-full h-1/4 
                                    cursor-pointer overflow-hidden' 
                         onMouseEnter={() => setHovering(true)} 
                         onMouseLeave={() => setHovering(false)}>
                      <img className={`relative lg:w-3/5 w-1/3 aspect-video object-cover z-0 transition-all duration-300 
                                       ${isHovering ? 'lg:top-0 lg:-rotate-12 lg:left-0 top-5 left-5 ' 
                                                    : 'top-5 left-5 lg:left-0 lg:top-24 lg:rotate-12'}`}
                            src={slide.images[0]} alt={slide.title} />
                      <img className={`relative lg:w-3/5 w-1/3 aspect-video object-cover z-10 `} 
                           src={slide.images[1]} alt={slide.title} />
                      <img className={`relative lg:w-3/5 w-1/3 aspect-video object-cover z-0 transition-all duration-300
                                     ${isHovering ? 'lg:bottom-0 lg:-rotate-12 -bottom-5 right-5' 
                                                  : '-bottom-5 right-5 lg:right-0 lg:bottom-24 lg:rotate-12'}`}
                           src={slide.images[2]} alt={slide.title} />
                    </div>
                  </div>
                </SwiperSlide>
              ))
            }

            <div className="flex relative bottom-16 gap-3 flex-col-reverse">
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

        <div className='recent w-full flex flex-col items-center justify-center gap-32' 
             ref={(el) => {if(el) scrollWatcherRef.current[3] = el }}>
          <div className='text-primary text-center text-[2.5rem] sm:text-[4rem] md:text-[4rem] xl:text-[5rem]' 
               ref={(el) => {if(el) headingRefs.current[6] = el} }>
            Recent Updates
          </div>
          <div className='flex flex-col w-full p-10 items-center justify-center gap-16'>
          {
            recentData && recentData.map((data,index) => (
              <div key={index} className={`w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col cursor-pointer
                                           overflow-hidden transition-all duration-300`} 
                   ref={(el) => {if(el) recentRefs.current[index] = el }}>  
                <div className={`w-full h-[30rem] transition-all duration-75 flex ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  <img className={`${openIndex[index] ? 'w-1/2' : 'w-full'} object-cover object-center
                                   transition-all duration-300 overflow-hidden rounded-t-xl`} 
                       src={data.image} alt={data.title}/>
                  <div className={`${openIndex[index] ? 'w-1/2 border-2' : 'w-0 border-0'} text-[1.5rem]
                                   border-solid rounded-b-xl border-slate-800 flex flex-col items-center
                                   justify-center overflow-hidden transition-all duration-300 whitespace-nowrap`}>
                    <p className='text-white'>{data.descr}</p>
                  </div>
                </div>
                <div className={`w-full p-5 relative flex items-center justify-center text-[2rem] text-primary border-solid`}
                     onClick={()=>setOpenIndex((prev) => prev.map((val,id) => id === index ? !val : val))}>
                  {data.title}
                  <IoIosArrowDropright className={`text-white text-[3rem] absolute 
                                       ${index%2 === 0 ? 'right-5 rotate-180' : 'left-5 rotate-0'}
                                       transition-all duration-300 
                                       ${openIndex[index] ? index%2===0 ? 'rotate-[0deg]' : 'rotate-180' : ''}`}/>
                </div>
              </div>
            ))
          }
          <Button className='pl-10 pr-10 p-3 text-center' content='View All'/>
          </div>
        </div>

        <div className='cta relative w-screen h-[350vh] mt-[50vh] mb-[50vh]' ref={(el) => {if(el) scrollWatcherRef.current[4] = el}}>
          <div className="sticky top-0 w-full h-screen">
            <div className='overlay w-full h-screen absolute top-0 bg-[rgba(0,0,0,0.5)] z-10'></div>
            <div className="w-1/4 h-screen top-0 left-0 absolute
                            [background-image:url('/assets/Home/cta/daivaradhane.jpg')] bg-no-repeat
                            bg-cover bg-center transition-all duration-300" 
                 ref={(el) => {if(el) bgRefs.current[0] = el}}></div>
            <div className="w-1/2 h-screen bottom-0 left-[12.5%] absolute
                            [background-image:url('/assets/Home/cta/Kambala.webp')] bg-no-repeat
                            bg-cover bg-center transition-all duration-300"
                 ref={(el) => {if(el) bgRefs.current[1] = el}}></div>
            <div className="w-1/2 h-screen top-0 right-[12.5%] absolute
                            [background-image:url('/assets/Home/cta/yakshagana.jpg')] bg-no-repeat
                            bg-cover bg-center transition-all duration-300"
                 ref={(el) => {if(el) bgRefs.current[2] = el}}></div>
            <div className="w-1/4 h-screen bottom-0 right-0 absolute
                            [background-image:url('/assets/Home/cta/nagaradhane.jpg')] bg-no-repeat
                            bg-cover bg-[45%_0] transition-all duration-300"
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
                !state.token && <Button content='Get Started'/>
            }
          </div>
        </div>

        <div className="quote w-fit ml-auto mr-auto pb-[75vh] text-white">
          <h1 className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-cursive">"Tuluva Manna Satyole Chitta"</h1>
          <p className='text-right font-cursive'>- Vijeth M Shetty Manjanady</p>
        </div>

      </div>
    )
}

export default Home;
