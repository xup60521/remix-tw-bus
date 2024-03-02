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
import { useAtomValue } from "jotai";
import * as BusAtom from "app/state/BusAtom"

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
  console.log("fetch!")
  return { city: params.city,  "busList": busList};
}

export default function Page() {
  const mapHeight = "400px";
  const { pathname } = useLocation();
  const { city } = useLoaderData<typeof loader>();
  const regex = new RegExp(`/${city}`);
  const p = pathname.replace(regex, "");
  const bus = useAtomValue(BusAtom.busAtom)
  const direction = useAtomValue(BusAtom.directionAtom)

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
          to={`/${city}${bus!==""&&direction!=="" ? `/${bus}/${direction}` : ""}`}
          className="z-20 h-8 w-12 text-center font-bold flex items-center justify-center"
        >
          公車
        </Link>
        <Link
          to={`/${city}/station`}
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
          p === "/station"
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
