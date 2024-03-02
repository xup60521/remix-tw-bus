import { useRouteLoaderData } from "@remix-run/react";
import { useState } from "react";
import { type loader } from "./$city";
import DrawerSection from "~/components/drawer";
import { BusList } from "~/type/busType";

export default function Index() {
  const props = useRouteLoaderData<typeof loader>("routes/$city");
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="md:w-[25rem] md:h-screen flex flex-col w-screen h-[50vh] bg-white text-black">
        <div className="flex h-8 w-full items-center justify-center gap-2 bg-slate-700 p-1 font-bold text-white ">
          <button onClick={()=>setOpen(true)}>{"選擇公車..."}</button>
        </div>
        {/* eslint-disable-next-line react/prop-types */}
        <DrawerSection city={props?.city ?? ""} initBusList={props?.busList as BusList[] | undefined} drawerOpen={open} setDrawerOpen={setOpen} />
      </div>
    </>
  );
}

