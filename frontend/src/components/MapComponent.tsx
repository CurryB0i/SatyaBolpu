import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaLock, FaLockOpen, FaPlus, FaMinus } from "react-icons/fa";
import { MapComponentProps } from "../types/globals";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

//this is beacuse icons dont load in prod, some bs idk
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

//the below line is because someone caches something
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = ({
  children,
  className = "w-full h-full relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden",
  geoJsonData,
  onMapReady,
  zoom: externalZoom,
  onZoomChange,
  lock: externalLock,
  onLockChange,
  showControls = true,
  center = [13.006995870591474, 75.07172913896241],
  maxBounds = [
    [14.025289007277138, 73.94617968510107],
    [11.98870273390581, 76.19727859282375],
  ],
  minZoom = 9,
  initialZoom = 9,
  ref,
  gestureHandling = true
} : MapComponentProps) => {
  
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [internalLock, setInternalLock] = useState<boolean>(false);
  const [internalZoom, setInternalZoom] = useState<number>(initialZoom);

  const lock = externalLock !== undefined ? externalLock : internalLock;
  const zoom = externalZoom !== undefined ? externalZoom : internalZoom;
  
  const setLock = (value: boolean) => {
    if (onLockChange) {
      onLockChange(value);
    } else {
      setInternalLock(value);
    }
  };

  const setZoom = (value: number) => {
    if (onZoomChange) {
      onZoomChange(value);
    } else {
      setInternalZoom(value);
    }
  };

  const MapEvents = () => {
    const map = useMap();
    mapRef.current = map;

    useEffect(() => {
      setMapInstance(map);
      if (onMapReady) onMapReady(map);

      if (!map.hasEventListeners('gestureHandling')) {
        map.addHandler('gestureHandling', GestureHandling);
      }

      if (gestureHandling) {
        (map as any).gestureHandling?.enable();
      } else {
        (map as any).gestureHandling?.disable();
      }

      return () => {
        (map as any).gestureHandling?.disable();
      };
    }, [map, gestureHandling]);

    useEffect(() => {
      if (map) {
        const handleZoom = () => setZoom(map.getZoom());
        map.on("zoomend", handleZoom);
        return () => {
          map.off("zoomend", handleZoom);
        };
      }
    }, [map]);

    useEffect(() => {
      if(!map) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey) {
          map.scrollWheelZoom.enable();
        } else {
          map.scrollWheelZoom.disable();
        }
      };

      const handleKeyUp = () => {
        if (map) {
          map.scrollWheelZoom.disable();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, [map]);

    useEffect(() => {
      if (map) {
        if (lock) {
          map.dragging.disable();
          map.touchZoom.disable();
          map.scrollWheelZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();
        } else {
          map.dragging.enable();
          map.touchZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
        }
      }
    }, [map, lock]);

    return null;
  };

  const handleZoomChange = (delta: number) => mapInstance && mapInstance.setZoom(zoom + delta);

  return (
    <div data-lenis-prevent className={className} ref={ref}>
      {showControls && (
        <div className="z-10 absolute flex flex-col justify-center items-center gap-2 left-7 top-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className={`flex h-14 flex-col gap-2 bg-slate-100 rounded-md ${lock ? 'pointer-events-none' : ''}`}>
            <div className="h-1/2 p-1 pl-2 pr-2" onClick={() => handleZoomChange(1)}>
              <FaPlus className={`${lock ? 'text-slate-300' : 'text-black'}`} />
            </div>
            <div className="h-1/2 p-1 pl-2 pr-2" onClick={() => handleZoomChange(-1)}>
              <FaMinus className={`${lock ? 'text-slate-300' : 'text-black'}`} />
            </div>
          </div>
          <IoLocationSharp
            className={`${lock ? 'text-slate-300 pointer-events-none' : 'text-red-500'}`}
            size={32}
            onClick={() => mapInstance && mapInstance.setView(center, initialZoom, { animate: true })}
          />

          {lock ? (
            <FaLock
              className="text-slate-500"
              size={24}
              onClick={() => setLock(false)}
            />
          ) : (
            <FaLockOpen
              className="text-slate-500"
              size={24}
              onClick={() => setLock(true)}
            />
          )}
        </div>
      )}

      <MapContainer
        className="z-0 relative w-full h-full"
        center={center}
        zoom={initialZoom}
        maxBounds={maxBounds}
        minZoom={minZoom}
        scrollWheelZoom={false}
        zoomControl={false}
        doubleClickZoom={false}
        touchZoom={true}
      >
        <MapEvents />

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a class="pr-2" target="_blank" href="https://www.esri.com/">Esri</a>'
        />

        {geoJsonData?.districts && (
          <GeoJSON 
            data={geoJsonData.districts} 
            style={{ color: "var(--primary)", fillColor: "transparent", opacity: 0.5 }} 
          />
        )}

        {React.Children.toArray(children)}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
