/*
const LoadingPage = () => {
    const flameRef = useRef<SVGPathElement | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (!flameRef.current) return;

        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(flameRef.current, {
            skewX: 0,
            transformOrigin: "center bottom",
            duration: 0.3,
            ease: "power2.inOut"
        })
        tl.to(flameRef.current, {
            skewX: 20,
            transformOrigin: "center bottom",
            duration: 0.4,
            ease: "power2.inOut"
        })
        tl.to(flameRef.current, {
            skewX: 35,
            transformOrigin: "center bottom",
            duration: 0.6,
            ease: "power2.inOut"
        })
        tl.to(flameRef.current, {
            skewX: 20,
            transformOrigin: "center bottom",
            duration: 0.4,
            ease: "power2.inOut"
        })
        tl.to(flameRef.current, {
            skewX: -20,
            transformOrigin: "center bottom",
            duration: 0.4,
            ease: "power2.inOut"
        })
    }, []);

  return (
    <div className={`w-screen h-screen flex flex-col items-center bottom-0 overflow-hidden z-[9997] bg-black`}>
      <svg 
        className='w-60' 
        id="e6RLSVEilXC1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 720 720" 
        shapeRendering="geometricPrecision" 
        textRendering="geometricPrecision" 
        project-id="e2297cd059194b72af4d010f5799bad9" 
        export-id="68df0f43f2ef477cbde5cec0945adf61">
        <g 
          fill='#FF6700' 
          transform="matrix(.225936 0 0 0.192842 265.277218 76.789268)">
          <path 
            ref={flameRef} 
            d="M216.02,611.195c5.978,3.178,12.284-3.704,8.624-9.4-19.866-30.919-38.678-82.947-8.706-149.952c49.982-111.737,80.396-169.609,80.396-169.609s16.177,67.536,60.029,127.585c42.205,57.793,65.306,130.478,28.064,191.029-3.495,5.683,2.668,12.388,8.607,9.349c46.1-23.582,97.806-70.885,103.64-165.017c2.151-28.764-1.075-69.034-17.206-119.851-20.741-64.406-46.239-94.459-60.992-107.365-4.413-3.861-11.276-.439-10.914,5.413c4.299,69.494-21.845,87.129-36.726,47.386-5.943-15.874-9.409-43.33-9.409-76.766c0-55.665-16.15-112.967-51.755-159.531-9.259-12.109-20.093-23.424-32.523-33.073-4.5-3.494-11.023.018-10.611,5.7c2.734,37.736.257,145.885-94.624,275.089-86.029,119.851-52.693,211.896-40.864,236.826c22.616,47.759,54.162,75.806,84.97,92.187Z" 
            transform="translate(-.353351 2.541781)"/>
        </g>
        <ellipse rx="24.803147" ry="14.173228" transform="matrix(1 0 0 1.666666 335.196853 579.527559)" fill="rgba(255,207,64,0.74)" strokeWidth="0"/>
        <ellipse rx="12.598426" ry="7.874021" transform="translate(335.196853 603.149596)" fill="rgba(255,207,64,0.74)" strokeWidth="0"/>
        <ellipse rx="42.986324" ry="12.179459" transform="matrix(1.138741 0 0 0.647064 335.196853 292.540996)" fill="rgba(255,207,64,0.74)" strokeWidth="0"/>
        <ellipse rx="24.409449" ry="15.748031" transform="translate(334.803154 473.228348)" fill="rgba(255,207,64,0.74)" strokeWidth="0"/>
        <ellipse rx="39.719612" ry="15.045213" transform="matrix(1.088096 0 0 0.515283 335.196853 359.757938)" fill="rgba(255,207,64,0.74)" strokeWidth="0"/>
        <rect width="34.645669" height="196.850393" rx="0" ry="0" transform="translate(317.480316 374.803151)" fill="rgba(255,207,64,0.83)" strokeWidth="0"/>
        <path d="" fill="none" stroke="#3f5787" strokeWidth="1.44"/>
        <path  d="M317.480316,525.984252h34.645669" transform="matrix(1 0 0 3 0.000001-1051.968504)" fill="none" stroke="#3f5787" strokeWidth="1.44"/>
        <rect width="72.440946" height="141.732283" rx="36.22" ry="36.22" transform="translate(298.582678 248.8189)" fill="rgba(255,207,64,0.88)" strokeWidth="0"/>
        <path d="M298.582678,321.259846h72.440946" transform="matrix(1 0 0 3 0-642.519692)" fill="none" stroke="#3f5787" strokeWidth="1.44"/>
        <path d="" fill="none" stroke="#3f5787" strokeWidth="1.44"/>
        <rect width="72.440946" height="144.881892" rx="0" ry="0" transform="matrix(1 0 0 0.592284 298.97638 206.72977)" fill="#b3b8b2" strokeWidth="0"/>
        <rect width="72.440946" height="52.461448" rx="8" ry="8" transform="matrix(1.182344 0 0 1 291.978092 180.499046)" stroke='#fff' strokeWidth="3px"/>
        <rect width="72.047244" height="7.880889" rx="0" ry="0" transform="translate(298.97638 292.540995)" fill="#fafafa" strokeWidth="0"/>
      </svg>
    </div>
  )
}
*/

const LoadingPage = () => {

    return (
        <div className={`w-screen h-screen flex flex-col fixed items-center justify-center 
            bottom-0 overflow-hidden z-9997 bg-black`}>
          <img 
           className='w-1/3'
           src="/assets/loading/gitige.gif" alt="loader" />
        </div>
    )
}

export default LoadingPage
