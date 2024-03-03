import { useAtomValue } from "jotai";
import { Icon } from "leaflet";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { useRef, useEffect } from "react";
import { BusStops } from "~/type/busType";
import { Unpacked } from "~/type/unpacked";
import pin_inv from "public/pin_inv.png";
import pin_blue from "public/pin_blue.png";
import { stationAtom, toggleStop as toggleStopAtom } from "~/state/BusAtom";

export default function ShowMarker({
  item,
}: {
  item: Unpacked<BusStops["Stops"]>;
}) {
  const ref = useRef<L.Marker>(null);
  const toggleStop = useAtomValue(toggleStopAtom);
  const station = useAtomValue(stationAtom);
  const icon = new Icon({
    iconUrl: pin_inv,
    iconSize: [16, 48],
  });
  const icon_blue = new Icon({
    iconUrl: pin_blue,
    iconSize: [16, 48],
  });

  useEffect(() => {
    if (toggleStop?.stopName === item.StopName.Zh_tw) {
      ref.current?.openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleStop]);

  return (
    <Marker
      ref={ref}
      riseOffset={-12}
      icon={station === item.StopName.Zh_tw ? icon_blue : icon}
      key={`${item.StopSequence}`}
      position={[item.StopPosition.PositionLat, item.StopPosition.PositionLon]}
    >
      <Popup>
        <div>
          <p>{`${item.StopSequence} ${item.StopName.Zh_tw}`}</p>
        </div>
      </Popup>
      <Tooltip permanent direction="bottom">
        <div>
          <p>{`${item.StopSequence}`}</p>
        </div>
      </Tooltip>
    </Marker>
  );
}
