import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { useState } from "react";
import DrawerSection from "~/components/drawer";
import type {loader as rootloader} from "./$city"
import { useHydrateAtoms } from "jotai/utils"
import { busAtom, directionAtom } from "~/state/BusAtom";

export async function loader({ params }: LoaderFunctionArgs) {

  

  return {
    bus: params.bus,
    direction: params.direction,
  };
}

export default function Page() {
  const params = useLoaderData<typeof loader>();
  useHydrateAtoms([
    [busAtom, params.bus ?? ""],
    [directionAtom, params.direction ?? ""]
  ])
  const props = useRouteLoaderData<typeof rootloader>("routes/$city");
  const [open, setOpen] = useState(false)
  return (
    <div className="md:w-[25rem] md:h-screen flex flex-col w-screen h-[50vh] bg-white text-black">
      <div className="flex h-8 w-full items-center justify-center gap-2 bg-slate-700 p-1 font-bold text-white ">
        <button onClick={() => setOpen(true)}>{params.bus ? params.bus : "選擇公車..."}</button>
      </div>
          
      <DrawerSection
        // eslint-disable-next-line react/prop-types
        city={props?.city ?? ""}
        // eslint-disable-next-line react/prop-types
        initBusList={props?.busList ?? undefined}
        drawerOpen={open}
        setDrawerOpen={setOpen}
      />
      
    </div>
  );
}
