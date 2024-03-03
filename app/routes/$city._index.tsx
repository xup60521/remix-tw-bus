import { useRouteLoaderData } from "@remix-run/react";
import { useState } from "react";
import { type loader } from "./$city";
import DrawerSection from "~/components/drawer";

export default function Index() {
  const props = useRouteLoaderData<typeof loader>("routes/$city");
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`bottom-0 left-0 box-border h-[50vh] w-screen transition duration-300 ease-in-out md:absolute md:h-screen md:w-[25rem] md:p-2 `}
    >
      <div className="flex h-full w-full flex-col gap-1 rounded-lg bg-white pb-1 text-black md:opacity-90">
        <div className="flex h-8 w-full items-center justify-center gap-2 bg-slate-700 p-1 font-bold text-white md:rounded-t-lg">
          <button onClick={() => setOpen(true)}>
            { "選擇公車..."}
          </button>
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
    </div>
  );
}

