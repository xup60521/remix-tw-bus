import { type LoaderFunctionArgs, type LinksFunction } from "@remix-run/node";
import { Map } from "app/components/map.client";
import { ClientOnly } from "app/components/client-only";
import {
  Link,
  type MetaFunction,
  Outlet,
  useLocation,
  useLoaderData,
} from "@remix-run/react";
import { getAllBus } from "app/server_action/getAllBus";
import { useAtomValue, useSetAtom } from "jotai";
import * as BusAtom from "app/state/BusAtom";
import { useEffect } from "react";
import { BusGeo, BusStops } from "~/type/busType";
import { env } from "~/env";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const busList = await getAllBus(params.city);
  return { city: params.city, busList: busList, url: env.url };
}

export default function Page() {
  const mapHeight = "400px";
  const { pathname } = useLocation();
  const params = useLoaderData<typeof loader>();
  const { city } = params
  const regex = new RegExp(`/${city}`);
  const p = pathname.replace(regex, "");
  const bus = useAtomValue(BusAtom.busAtom);
  const station = useAtomValue(BusAtom.stationAtom)
  const direction = useAtomValue(BusAtom.directionAtom);
  const setBusShape = useSetAtom(BusAtom.busShapeAtom);
  const setBusStops = useSetAtom(BusAtom.busStopsAtom);

  useEffect(() => {
    if (bus) {
      fetch(
        `${params.url}/${city}/resource?action=get_stops_and_shape&bus=${bus}&direction=${direction}`
      )
        .then((res) => res.json())
        .then((data: {
          "stops": BusStops[],
          "shapes": BusGeo[]
        }) => {
          
          setBusStops([...data.stops])
          setBusShape([...data.shapes])
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bus]);

  return (
    <main className="box-border w-screen h-screen bg-slate-800 text-white overflow-hidden flex-col flex md:flex-row">
      <ClientOnly
        fallback={
          <div
            id="skeleton"
            style={{ height: mapHeight, background: "#d1d1d1" }}
          />
        }
      >
        {() => <Map />}
      </ClientOnly>
      <div className="absolute left-[50vw] top-2 box-border flex items-center h-8 -translate-x-[50%] rounded-xl bg-white text-sm text-black md:top-[calc(100vh-2.5rem)]">
        <Link
          to={`/${city}${
            bus !== "" && direction !== ""
              ? `/${bus}?direction=${direction}`
              : ""
          }`}
          className="z-20 h-8 w-12 text-center font-bold flex items-center justify-center"
        >
          公車
        </Link>
        <Link
          to={`/${city}/station${station ? "/"+station : ""}`}
          className="z-20 h-8 w-12 text-center font-bold flex items-center justify-center"
        >
          站牌
        </Link>
        <Link
          to={`/${city}/note`}
          className="z-20 h-8 w-12 text-center font-bold flex items-center justify-center"
        >
          筆記
        </Link>
        <Link
          to={`/${city}/overlay`}
          className="z-20 h-8 w-12 text-center font-bold flex items-center justify-center"
        >
          疊加
        </Link>
        <div
          className={`
        absolute left-0 z-10 h-8 w-12 rounded-xl bg-orange-100 transition-all duration-300 
        ${
          p.includes("/station")
            ? "translate-x-[100%]"
            : `${
                p === "/note"
                  ? "translate-x-[200%]"
                  : `${p === "/overlay" ? "translate-x-[300%]" : ""}`
              }`
        }`}
        />
      </div>
      <Outlet />
    </main>
  );
}
