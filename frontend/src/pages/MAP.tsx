import { Marker, GeoJSON } from "react-leaflet";
import { ChangeEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Layer, LeafletMouseEvent, Map, Polygon, Tooltip } from "leaflet";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { useLoading } from "../context/LoadingContext";
import MapComponent from "../components/MapComponent";
import Button from "../components/Button";
import { MdCancel } from "react-icons/md";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import { IoMdDoneAll } from "react-icons/io";
import { MapDetailsType, usePost } from "../context/PostContext";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

type coordinatesErrorType = {
  lat: string;
  lng: string;
}

const initialMapDetails = {
  district: '',
  taluk: '',
  village: '',
  lat: null,
  lng: null
}

const MAP = ({ editMode = false } : { editMode?: boolean }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { state, dispatch } = usePost();
  const [map, setMap] = useState<Map | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<{ [key: string]: any }>({});
  const [lock, setLock] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(9);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const toolTipPane = useRef<Element>();
  const activeLayerRef = useRef<Polygon | null>(null);
  const [activeVillage,setActiveVillage] = useState<GeoJSON.Feature | null>(null);
  const [askForCoordinates,setAskForCoordinates] = useState<boolean>(false);
  const [coordinateErrors,setCoordinateErrors] = useState<coordinatesErrorType>({lat: '', lng: ''});
  const [mapDetails,setMapDetails] = useState<MapDetailsType>(initialMapDetails);
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if(state.mapDetails) {
      setMapDetails(state.mapDetails);
    }
  },[]);

  useEffect(() => {
    const fetchGeoJson = async (name: string) => {
      setLoading(true);
      try {
        const response = await fetch(`/assets/Map/${name}.geojson`);
        if (!response.ok) throw new Error(`Failed to fetch ${name}`);
        const data = await response.json();
        setGeoJsonData(prev => ({ ...prev, [name]: data }));
      } catch (error) {
        console.error(`Error loading ${name} GeoJSON:`, error);
      } finally {
        setLoading(false);
      }
    };

    ["districts", "dakshina_kannada", "udupi", "kasaragod"].forEach(fetchGeoJson);
  }, []);

  useEffect(() => {
    return () => {
      if (toolTipPane.current) {
        toolTipPane.current.innerHTML = '';
      }
    };
  }, [map]);

  useEffect(() => {
    if(map && zoom > 15)
      setActiveVillage(null);
  },[zoom]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFs = document.fullscreenElement === mapRef.current;
      setFullScreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      if (fullScreen && document.fullscreenElement !== mapRef.current) {
        mapRef.current.requestFullscreen();
      } else if (!fullScreen && document.fullscreenElement === mapRef.current) {
        document.exitFullscreen();
      }
    }
  }, [fullScreen]);

  const handleMapReady = (mapInstance: Map) => {
    setMap(mapInstance);
    
    const tooltips = document.querySelector(".leaflet-tooltip-pane");
    if (tooltips) {
      toolTipPane.current = tooltips;
    }

    mapInstance.on("zoomstart", () => {
      if (toolTipPane.current) {
        toolTipPane.current.innerHTML = '';
      }
    });
  };

  const styles = {
    default: {
      color: "black",
      weight: 1,
      fillColor: "transparent",
      opacity: 0.5,
    },
    hover: {
      color: "red",
      weight: 2,
      fillColor: "pink",
      fillOpacity: 0.5,
      opacity: 1,
    },
    click: {
      color: "red",
      weight: 2,
      fillColor: "blue",
      fillOpacity: 0.5,
      opacity: 1,
    },
  };

  const onEachVillage = (feature: GeoJSON.Feature, layer: Layer) => {
    if(layer instanceof Polygon) {
      layer.setStyle(styles.default);
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          if (feature.properties?.VILLAGE && layer !== activeLayerRef.current) {
            if (toolTipPane.current) {
              const existingTooltips = toolTipPane.current.querySelectorAll('.leaflet-tooltip:not(.permanent-tooltip)');
              existingTooltips.forEach((tooltip: Element) => tooltip.remove());
            }

            const tooltip = new Tooltip({
              permanent: false,
              direction: "top",
              className: "global-tooltip"
            })
            .setContent(feature.properties.VILLAGE)
            .setLatLng(e.latlng);

            if (map) {
              tooltip.addTo(map);
            }
          }

          if (layer !== activeLayerRef.current) {
            layer.setStyle(styles.hover);
          }
        },

        mouseout: () => {
          if (layer !== activeLayerRef.current) {
            layer.setStyle(styles.default);
          }
        },

        click: (e: LeafletMouseEvent) => {
          if (toolTipPane.current) {
            toolTipPane.current.innerHTML = '';
          }

          if (activeLayerRef.current && activeLayerRef.current !== layer) {
            activeLayerRef.current.setStyle(styles.default);
          }

          if (layer === activeLayerRef.current) {
            layer.setStyle(styles.default);
            activeLayerRef.current = null;
            setActiveVillage(null);
          } else {
            layer.setStyle(styles.click);
            activeLayerRef.current = layer;
            setActiveVillage(feature)
            if (feature.properties?.VILLAGE && map) {
              const permanentTooltip = new Tooltip({
                permanent: true,
                direction: "top",
                className: "global-tooltip permanent-tooltip"
              })
              .setContent(feature.properties.VILLAGE)
              .setLatLng(e.latlng);

              permanentTooltip.addTo(map);
            }
          }
        },
      });
    }
  };

  const districtKeys = ["dakshina_kannada", "udupi", "kasaragod"];
  const onEachUniteractiveVillage = (feature: GeoJSON.Feature,layer: Layer) => {
    if(editMode) {
      layer.on({
        click: (e: LeafletMouseEvent) => {
          setMapDetails({
            district: feature.properties?.DISTRICT,
            taluk: feature.properties?.TALUK,
            village: feature.properties?.VILLAGE,
            lat: e.latlng.lat,
            lng: e.latlng.lng
          });
        }
      })
    }
  }

  const uninteractiveVillageLayers = useMemo(() => (
    <>
      {districtKeys.map((key) => 
        geoJsonData[key] && (
          <GeoJSON
            key={`u${key}`}
            data={geoJsonData[key]}
            style={{
              color: "black",
              weight: 1,
              fillColor: "transparent",
              opacity: 0.5
            }}
            onEachFeature={onEachUniteractiveVillage}
          />
        )
      )}
    </>
  ), [geoJsonData]);

  const villageLayers = useMemo(() => (
    <>
      {districtKeys.map((key) => 
        geoJsonData[key] && (
          <GeoJSON
            key={key}
            data={geoJsonData[key]}
            style={{
              color: "black",
              weight: 1,
              fillColor: "transparent",
              opacity: 0.5
            }}
            onEachFeature={onEachVillage}
          />
        )
      )}
    </>
  ), [geoJsonData]);

  const handleVillageExit = () => {
    if(map && activeVillage) {
      setActiveVillage(null);
      activeLayerRef.current?.setStyle(styles.default);
      activeLayerRef.current = null;
    }
  }

  const handleView = () => {
    if(map && activeVillage) {
      const [xmin,ymin,xmax,ymax] = activeVillage.bbox!;
      map.flyTo([(ymin+ymax)/2, (xmin+xmax)/2], 14)
    }
  }

   const handleCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoordinateErrors((prev) => ({
      ...prev,
      [name] : ''
    }))

    const {name, value} = e.target;

    if(isNaN(Number(value)))
      return

    setMapDetails((prev) => ({
      ...prev,
      [name] : value
    }))
  };

  const pointInPolygon = (point: number[], polygon: number[][]) => {
    const x = point[0], y = point[1];
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  };

  const findLayerContainingCoordinates = (lat: number, lng: number, geoJsonData: any) => {
    const point = [lng, lat];
    const districtKeys = ["dakshina_kannada", "udupi", "kasaragod"];
    
    for (const key of districtKeys) {
      const data = geoJsonData[key];
      if (!data || !data.features) continue;
      
      for (const feature of data.features) {
        if (!feature.geometry) continue;
        
        const { geometry } = feature;
        
        if (geometry.type === 'Polygon') {
          const coordinates = geometry.coordinates[0];
          if (pointInPolygon(point, coordinates)) {
            return {
              layerKey: key,
              feature: feature,
              properties: feature.properties
            };
          }
        } else if (geometry.type === 'MultiPolygon') {
          for (const polygon of geometry.coordinates) {
            const coordinates = polygon[0];
            if (pointInPolygon(point, coordinates)) {
              return {
                layerKey: key,
                feature: feature,
                properties: feature.properties
              };
            }
          }
        }
      }
    }

    return null;
  };

  const handleCoordinatesSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    const newErrors = {
      lat: '',
      lng: ''
    }

    if(!mapDetails.lat) {
      newErrors.lat = 'Latitude is required.'
    }

    if(!mapDetails.lng) {
      newErrors.lng = 'Longitude is required.'
    }

    const maxBounds = [
      [14.025289007277138, 73.94617968510107],
      [11.98870273390581, 76.19727859282375],
    ];

    if(mapDetails.lat && (mapDetails.lat! > maxBounds[0][0] || mapDetails.lat! < maxBounds[1][0])) {
      newErrors.lat = 'Latitude exceeds max bounds.'
    }

    if(mapDetails.lng && (mapDetails.lng! > maxBounds[1][1] || mapDetails.lng! < maxBounds[0][1])) {
      newErrors.lng = 'Longitude exceeds max bounds.'
    }

    setCoordinateErrors(newErrors);
    const hasError = Object.values(newErrors).some(err => err !== '');
    if(hasError)
      return

    const containingLayer = findLayerContainingCoordinates(
      mapDetails.lat!, 
      mapDetails.lng!, 
      geoJsonData
    );

    if (!containingLayer) {
      toast.error('Somethig went wrong! Try again later');
    }

    map?.flyTo([mapDetails.lat!, mapDetails.lng!], 18);
    setMapDetails((prev) => ({
      ...prev,
      district: containingLayer?.properties.DISTRICT,
      taluk: containingLayer?.properties.TALUK,
      village: containingLayer?.properties.VILLAGE
    }));
  };

  const handleSubmit = () => {
    if(!mapDetails.district) {
      toast.error("You need to submit the location details first.")
      return;
    }

    dispatch({
      type: 'SAVE_MAP_DETAILS',
      payload: {
        mapDetails: mapDetails
      }
    });
    toast.success("Map Details stored successfully.");
    setTimeout(() => navigate('/new-post'),3000)
  }

  if(editMode && (!state.content || !state.details?.locationSpecific)) {
    return <Navigate to={'/new-post/editor'} replace/>
  }

  return (
    <div className="w-screen h-screen relative" ref={mapRef}>
      <style>
        {`
          .leaflet-interactive:focus{
            outline: none;
          }
          .global-tooltip {
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 20;
          }
          .global-tooltip:before {
            border-top-color: rgba(0, 0, 0, 0.8);
          }
          .permanent-tooltip {
            z-index: 30;
          }
        `}
      </style>

      <div className="z-10 absolute flex flex-col justify-center items-center
        gap-2 right-0 top-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        {fullScreen ? (
          <AiOutlineFullscreenExit 
            className="text-white text-[2.5rem] stroke-2 hover:scale-110" 
            onClick={() => setFullScreen(false)} 
          />
        ) : (
          <AiOutlineFullscreen 
            className="text-white text-[2.5rem] stroke-2 hover:scale-110" 
            onClick={() => setFullScreen(true)} 
          />
        )}
        {
          editMode &&
            <IoMdDoneAll
              className={`text-[2.5rem] 
                ${mapDetails.district ? 'text-white hover:scale-110' : 'cursor-not-allowed text-gray-400'}`}
              onClick={handleSubmit}
            />
        }
      </div>

      {
        editMode && (
          !fullScreen && !askForCoordinates ?
            (
              <div 
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:scale-105 
                  p-2 rounded-xl hover:bg-primary text-back cursor-pointer text-[2rem]" 
                onClick={() => setAskForCoordinates(true)} 
              >
                <FaMagnifyingGlassLocation className=""/>
              </div>
            ) :

            (
              <form 
                className="absolute flex flex-col gap-3 left-5 top-1/2 -translate-y-1/2 z-10 bg-black
                  p-6 rounded-xl text-back cursor-pointer" 
                onSubmit={handleCoordinatesSubmit}>
                <MdCancel 
                  className="absolute top-1 right-1 fill-white hover:fill-primary" 
                  onClick={() => setAskForCoordinates(false)}
                />
                <div className="w-full flex flex-col items-center justify-between gap-2">
                  <label className="text-white" htmlFor="lat">Latitude</label>
                  <input
                    className="p-1"
                    type="text"
                    id="lat"
                    name="lat"
                    autoComplete="off"
                    value={mapDetails?.lat ?? ''}
                    onChange={handleCoordinateChange}
                  />        
                  {coordinateErrors.lat && <p className="text-red-500">{coordinateErrors.lat}</p>}
                </div>
                <div className="w-full flex flex-col items-center justify-between gap-2">
                  <label className="text-white" htmlFor="lng">Longitude</label>
                  <input 
                    className="p-1 rounded"
                    type="text"
                    id="lng"
                    name="lng"
                    autoComplete="off"
                    value={mapDetails?.lng ?? ''}
                    onChange={handleCoordinateChange}
                  />
                  {coordinateErrors.lng && <p className="text-red-500">{coordinateErrors.lng}</p>}
                </div>
                <Button content="Find" type="submit" className="w-fit mx-auto"/>
              </form>
            )
          )
      }

      {
        activeVillage && (
          <div className="absolute bottom-0 bg-black m-5 p-5 text-white z-[1000]
             flex flex-col gap-2 rounded-2xl">
            <MdCancel 
              className="absolute top-3 right-3 cursor-pointer hover:fill-primary"
              onClick={handleVillageExit}/>
            <h1>Village : {activeVillage.properties?.VILLAGE}</h1>
            <h2>District: {activeVillage.properties?.DISTRICT}</h2>
            <h2>Taluk: {activeVillage.properties?.TALUK}</h2>
            <p className="italic">lorem ipsum</p>
            <p>No of covered locations: {0}</p>
            <Button content="View More" className="mx-auto" onClick={handleView}/>
          </div>
        )
      }

      <MapComponent
        className={`z-0 relative w-full h-full`}
        geoJsonData={geoJsonData}
        onMapReady={handleMapReady}
        zoom={zoom}
        onZoomChange={setZoom}
        lock={lock}
        onLockChange={setLock}
        showControls={true}
        minZoom={9}
        initialZoom={9}
      >
        {zoom >= 11 && (
          zoom > 15 ? 
            uninteractiveVillageLayers
              :
            villageLayers
        )}
        {
          editMode && mapDetails.district &&
            <Marker 
              position={[mapDetails.lat!, mapDetails.lng!]}
            />
        }
        {
          editMode &&
            <div 
              className="absolute text-[1.75rem] text-white z-[400] bottom-0 m-5
               cursor-pointer hover:text-primary"
              onClick={() => navigate('/new-post/editor')}>
              {`< Editor`}
            </div>
        }
      </MapComponent>

    </div>
  );
};

export default MAP;
