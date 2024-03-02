import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

export function Map() {
  const position = useMemo(
    () => ({ lat: 24.137396608878987, lng: 120.68692065044608 }), // [緯度, 經度]
    [],
  )
  

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      className="z-0 h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="absolute right-0"
      />
      <ToCurrentLocation />
    </MapContainer>
  );
}


function ToCurrentLocation() {
  const map = useMap();
  
    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          map.flyTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}