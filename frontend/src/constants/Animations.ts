export type PropsType = {
  ref: GSAPTweenTarget;
  fromVars: GSAPTweenVars;
  toVars: GSAPTweenVars;
};

const initalDesktopClipPaths = [
  "polygon(0% 100%,50% 100%,50% 100%,0% 100%)",
  "polygon(25% 0%,100% 0%,75% 0%,25% 0%)",
  "polygon(25% 100%,75% 100%,75% 100%,0% 100%)",
  "polygon(50% 0%,100% 0%,100% 0%,50% 0%)"
];
const finalDesktopClipPaths = [
  "polygon(0% 0%,100% 0%,50% 100%,0% 100%)",
  "polygon(25% 0%,100% 0%,50% 100%,0% 100%)",
  "polygon(50% 0%,100% 0%,75% 100%,0% 100%)",
  "polygon(50% 0%,100% 0%,100% 100%,0% 100%)"
];
const initalMobileClipPaths = [
  "inset(0% 100% 0% 0%)",
  "inset(0% 0% 0% 100%)",
  "inset(0% 100% 0% 0%)",
  "inset(0% 0% 0% 100%)"
];
const finalMobileClipPaths = [
  "inset(0% 0% 0% 0%)",
  "inset(0% 0% 0% 0%)",
  "inset(0% 0% 0% 0%)",
  "inset(0% 0% 0% 0%)"
];

export const buildAnimationProps = (
  scrollWatcherRef: React.MutableRefObject<HTMLDivElement[]>,
  headingRefs: React.MutableRefObject<HTMLDivElement[]>,
  foliageRefs: React.MutableRefObject<HTMLImageElement[]>,
  overlayRef: React.RefObject<HTMLDivElement | null>,
  imgRefs: React.MutableRefObject<HTMLImageElement[]>,
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  mapRef: React.MutableRefObject<HTMLDivElement | null>,
  swiperOverlayRef: React.MutableRefObject<HTMLDivElement | null>,
  bgRefs: React.MutableRefObject<HTMLDivElement[]>,
  landmarkRefs: React.MutableRefObject<HTMLDivElement[]>,
  buttonRefs: React.MutableRefObject<HTMLButtonElement[]>,
  isMobile: boolean
): PropsType[] => {

  const landmarksAnim: PropsType[] = landmarkRefs.current.map((ref, index) => ({
    ref,
    fromVars: {
      clipPath: index%2 === 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)"
    },
    toVars: {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.5,
      scrollTrigger: {
        trigger: ref,
        start: 'top center',
      },
    },
  }));

  return [
    {
      ref: headingRefs.current.slice(0, 3),
      fromVars: {
        opacity: 0 
      },
      toVars: { 
        opacity: 1, 
        stagger: 1, 
        duration: 2, 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[0], 
          start: "-10px top" 
        } 
      }
    },
    {
      ref: headingRefs.current.slice(0, 2),
      fromVars: {  },
      toVars: { 
        opacity: 0, 
        delay: 3.5, 
        duration: 2, 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[0], 
          start: "-10px top" 
        } 
      }
    },
    {
      ref: headingRefs.current[2],
      fromVars: {  },
      toVars: { 
        translateY: "-60%", 
        delay: 3.5, 
        duration: 2, 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[0], 
          start: "-10px top"
        } 
      }
    },
    { 
      ref: svgRef.current, 
      fromVars: { 
        strokeDashoffset: 400 
      }, 
      toVars: { 
        strokeDashoffset: 0, 
        duration: 2, 
        delay: 4, 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[0], 
          start: '-10px top' 
        } 
      } 
    },
    { 
      ref: foliageRefs.current[0], 
      fromVars: { 
        scale: 1 
      }, 
      toVars: { 
        scale: 2, 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '5% top', 
          end: '20% top', 
          scrub: true
        } 
      } 
    },
    { 
      ref: overlayRef.current, 
      fromVars: {}, 
      toVars: { 
        backgroundColor: 'rgba(0,0,0,0)', 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '5% top', 
          end: '20% top', 
          scrub: true, 
          toggleActions: 'play none none reverse'
        } 
      } 
    },
    { 
      ref: headingRefs.current[3], 
      fromVars: { 
        opacity: 0 
      }, 
      toVars: { 
        opacity: 1, 
        duration: 0.5,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '15% top',
          toggleActions: 'play none none reverse'
        }
      } 
    },
    { 
      ref: foliageRefs.current[0], 
      fromVars: { }, 
      toVars: { 
        opacity: 0,
        duration: 0.5,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '15% top', 
          toggleActions: 'play none none reverse'
        } 
      } 
    },
    {
      ref: imgRefs.current[0],
      fromVars: { 
        clipPath: "inset(0% 0% 0% 0%)" 
      },
      toVars: {  
        clipPath: "inset(0% 100% 0% 0%)",
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1],
          start: '30% top',
          end: '50% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        } 
      }
    },
    { 
      ref: headingRefs.current[3], 
      fromVars: { 
        clipPath: "inset(0% 0% 0% 0%)"
      }, 
      toVars: { 
        clipPath: "inset(0% 100% 0% 0%)",
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '30% top',
          end: '50% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        }
      } 
    },
    {
      ref: imgRefs.current[1],
      fromVars: { 
        clipPath: "inset(0% 0% 0% 100%)"
      },
      toVars: {  
        clipPath: "inset(0% 0% 0% 0%)" ,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1],
          start: '30% top',
          end: '50% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        } 
      }
    },
    { 
      ref: headingRefs.current[4], 
      fromVars: { 
        clipPath: "inset(0% 0% 0% 100%)"
      }, 
      toVars: { 
        clipPath: "inset(0% 0% 0% 0%)" ,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '30% top',
          end: '50% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        }
      } 
    },
    { 
      ref: foliageRefs.current[1], 
      fromVars: { }, 
      toVars: { 
        opacity: 1,
        duration: 0.5,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '55% top',
          toggleActions: 'play none none reverse'
        } 
      } 
    },
    { 
      ref: overlayRef.current, 
      fromVars: {}, 
      toVars: { 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1],
          start: '60% top',
          end: '70% top',
          scrub: true, 
          toggleActions: 'play none none reverse' 
        } 
      } 
    },
    { 
      ref: foliageRefs.current[1], 
      fromVars: { }, 
      toVars: { 
        scale: 1,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '60% top',
          end: '70% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        } 
      } 
    },
    { 
      ref: headingRefs.current[4], 
      fromVars: { }, 
      toVars: { 
        opacity: 0,
        duration: 0.5,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '60% top',
          toggleActions: 'play none none reverse'
        }
      } 
    },
    {
      ref: imgRefs.current[1],
      fromVars: { },
      toVars: {  
        clipPath: "inset(0% 0% 100% 0%)" ,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1],
          start: '70% top',
          end: '80% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        } 
      }
    },
    { 
      ref: foliageRefs.current[1], 
      fromVars: { }, 
      toVars: { 
        clipPath: "inset(0% 0% 100% 0%)" ,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '70% top',
          end: '80% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        } 
      } 
    },
    {
      ref: imgRefs.current[2],
      fromVars: { 
        clipPath: "inset(100% 0% 0% 0%)"
      },
      toVars: {  
        clipPath: "inset(0% 0% 0% 0%)" ,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1],
          start: '70% top',
          end: '80% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        } 
      }
    },
    { 
      ref: headingRefs.current[5], 
      fromVars: { 
        clipPath: "inset(100% 0% 0% 0%)"
      }, 
      toVars: { 
        clipPath: "inset(0% 0% 0% 0%)",
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[1], 
          start: '70% top',
          end: '80% top',
          scrub: true,
          toggleActions: 'play none none reverse'
        }
      } 
    },
    { 
      ref: headingRefs.current[6], 
      fromVars: { 
        opacity: 0
      }, 
      toVars: { 
        opacity: 1,
        duration: 0.5,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[2], 
          start: '-10% top',
        }
      } 
    },
    { 
      ref: mapRef.current, 
      fromVars: { 
        height: '0' 
      }, 
      toVars: { 
        height: '100%',
        duration: 0.5, 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[2],
          start: '-10% top'
        } 
      } 
    },
    { 
      ref: headingRefs.current[7], 
      fromVars: { 
        opacity: 0
      }, 
      toVars: { 
        opacity: 1,
        duration: 0.5,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[3], 
          start: '-20% top',
        }
      } 
    },
    { 
      ref: swiperOverlayRef.current, 
      fromVars: {
        opacity: 1
      }, 
      toVars: { 
        opacity: 0,
        zIndex: -10,
        duration: 0.5,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[3],
          start: '-10% top',
        } 
      } 
    },
    { 
      ref: headingRefs.current[8], 
      fromVars: { 
        opacity: 0
      }, 
      toVars: { 
        opacity: 1,
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[4], 
          start: '-20% top',
        }
      } 
    },

    ...landmarksAnim,

    {
      ref: buttonRefs.current,
      fromVars: {
        opacity: 0
      },
      toVars: {
        opacity: 1,
        duration: 0.25,
        scrollTrigger: {
          trigger: buttonRefs.current,
          start: 'top center',
        }
      }
    },
    {
      ref: bgRefs.current,
      fromVars: {
        clipPath: (index) => isMobile ? initalMobileClipPaths[index] : initalDesktopClipPaths[index]
      },
      toVars: {
        clipPath: (index) => isMobile ? finalMobileClipPaths[index] : finalDesktopClipPaths[index],
          duration: 0.25,
        stagger: 0.1, 
        scrollTrigger: { 
          trigger: scrollWatcherRef.current[5],
          start: 'top top',
          end: 'center top',
          toggleActions: 'play none none reverse'
        }
      }
    }
  ];
};
