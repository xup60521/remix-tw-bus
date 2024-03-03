import { useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import { busAtom, directionAtom, busStopsAtom, busShapeAtom } from "~/state/BusAtom";
import ShowMarker from "./ShowMarker";

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
      <ShowPolyLines />
      <ShowStops />
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

const ShowPolyLines = () => {
  const bus = useAtomValue(busAtom);
  const direction = useAtomValue(directionAtom);
  const busStops = useAtomValue(busStopsAtom);
  const busShape = useAtomValue(busShapeAtom);
  const map = useMap();

  useEffect(() => {
    if (busShape) {
      const positionStr = busShape[Number(direction)]?.Geometry;
      const regex = /[A-Z()]/g;
      const positionArr = positionStr
        ?.replace(regex, "")
        .split(",")
        .map((f) =>
          f
            .split(" ")
            .reverse()
            .map((item) => Number(item)),
        ) as [number, number][];
      if (positionArr) {
        const center = { lat: 0, lng: 0 } as { lat: number; lng: number };
        positionArr.forEach((d, _i, arr) => {
          center.lat += d[0] / arr.length;
          center.lng += d[1] / arr.length;
        });
        map.flyTo(center, 13);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busShape]);

  if (!busShape || bus === "" || direction === "") {
    return "";
  }
  const positionStr =
    busShape[Number(direction)]?.Geometry ?? busShape[0]?.Geometry;
  if (positionStr) {
    const regex = /[A-Z()]/g;
    const positionArr = positionStr
      .replace(regex, "")
      .split(",")
      .map((f) =>
        f
          .split(" ")
          .reverse()
          .map((item) => Number(item)),
      ) as [number, number][];
    const thisStops = busStops?.find(
      (item) =>
        item.Direction === Number(direction) && item.RouteName.Zh_tw === bus,
    )?.Stops;

    return (
      <>
        <Polyline
          positions={positionArr}
          pathOptions={{
            opacity: 0.6,
            color: "#809fff",
            weight: 8,
          }}
        >
          <Tooltip sticky>
            {thisStops
              ? `${bus}（${thisStops[0].StopName.Zh_tw} - ${thisStops[thisStops.length - 1].StopName.Zh_tw}）`
              : bus}
          </Tooltip>
        </Polyline>
      </>
    );
  }
  return "";
};

const ShowStops = () => {
  const bus = useAtomValue(busAtom);
  const direction = useAtomValue(directionAtom);
  const busStops = useAtomValue(busStopsAtom);

  if (!bus || direction === "") {
    return null;
  }

  if (busStops && bus && direction) {
    const thisDirection = busStops.find(
      (item) => item.Direction === Number(direction),
    );
    return (
      <>
        {thisDirection?.Stops.map((item) => {
          return (
            <ShowMarker
              item={item}
              key={`${item.StopSequence} ${item.StopName.Zh_tw}`}
            />
          );
        })}
      </>
    );
  }

  return null;
};