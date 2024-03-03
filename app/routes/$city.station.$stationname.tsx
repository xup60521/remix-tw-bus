import { type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useAtom } from "jotai";
import { useState, useRef, useEffect, SetStateAction } from "react";
import { FaSpinner, FaSearch } from "react-icons/fa";
import { ClientOnly } from "~/components/client-only";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { env } from "~/env";
import { busAtom, directionAtom, stationAtom } from "~/state/BusAtom";
import { BusRoutePassBy, BusStopSearchResult } from "~/type/busType";
// eslint-disable-next-line import/no-named-as-default
import Popup from "reactjs-popup";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useHydrateAtoms } from "jotai/utils";
import { getStationEst } from "~/server_action/getStationEst";
import { SetAtom } from "~/type/setAtom";
import { RNN } from "~/lib/utils";

import { FiMenu } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await getStationEst(params.stationname ?? "", params.city ?? "");

  return {
    city: params.city,
    stationname: params.stationname,
    url: env.url,
    stationEst: data,
  };
}

export default function Station() {
  const params = useLoaderData<typeof loader>();
  useHydrateAtoms([[stationAtom, params.stationname ?? ""]]);
  const { city } = params;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<BusStopSearchResult[] | null>(null);
  const [station, setStation] = useAtom(stationAtom);
  const [bus, setBus] = useAtom(busAtom);
  const [direction, setDirection] = useAtom(directionAtom);
  const handleSearch = async () => {
    if (inputRef.current?.value && city) {
      setLoading(true);
      fetch(
        `${params.url}/${city}/resource?action=search_stop&q=${inputRef.current.value}`
      )
        .then((res) => res.json())
        .then((data: BusStopSearchResult[]) => {
          setResult([...data]);
          setLoading(false);
        });
    }
  };

  const handleEnter = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputRef.current?.value && city) {
      await handleSearch();
    }
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <div
      className={`box-border md:h-screen h-[50%] md:w-[25rem] w-screen md:p-2 md:absolute left-0 bottom-0 transition duration-300 ease-in-out `}
    >
      <div className="w-full h-full rounded-lg md:opacity-90 bg-white text-black flex flex-col pb-1 gap-1">
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="h-8 w-full p-1 bg-slate-700 text-white font-bold md:rounded-t-lg"
        >
          {station ? station : "選擇站牌..."}
        </button>
        <ScrollArea className="w-full">
          <div className="w-full p-1 flex flex-col gap-1">
            <BusList
                city={city}
              bus={bus}
              setBus={setBus}
              direction={direction}
              setDirection={setDirection}
              list={params.stationEst}
            />
          </div>
        </ScrollArea>
      </div>
      <ClientOnly>
        {() => (
          <Popup open={open} onClose={() => setOpen(false)}>
            <div className="flex w-[95vw] flex-col  items-center gap-3 rounded-lg bg-white p-4 transition-all md:w-[40rem]">
              <h3 className="w-full text-center text-xl">搜尋站牌</h3>
              <div className="flex w-full gap-2">
                <Input
                  onKeyDown={handleEnter}
                  ref={inputRef}
                  className="flex-grow"
                />
                <Button onClick={handleSearch} className="bg-slate-700">
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSearch />
                  )}
                </Button>
              </div>
              <ScrollArea className="w-full">
                <div className="max-h-[70vh] w-full flex flex-col gap-0">
                  {result
                    ?.map((d) => d.StopName.Zh_tw)
                    .filter((d, i, arr) => arr.indexOf(d) === i)
                    .map((item, index) => {
                      return (
                        <>
                          {index !== 0 && (
                            <div className="mx-1 w-full border-t-[0.05rem] border-slate-100" />
                          )}
                          <Link
                            onClick={() => {
                              setOpen(false);
                              setStation(item);
                            }}
                            to={`/${city}/station/${item}`}
                            key={`${item}`}
                            className="rounded-md  w-full text-left p-2 py-3 transition-all hover:cursor-pointer hover:bg-slate-100"
                          >
                            {item}
                          </Link>
                        </>
                      );
                    })}
                </div>
              </ScrollArea>
              <Button className="w-fit" onClick={() => setOpen(false)}>
                取消
              </Button>
            </div>
          </Popup>
        )}
      </ClientOnly>
    </div>
  );
}

const BusList = ({
  list,
  setBus,
  setDirection,
  city,
  //   setPage,
  bus,
  direction,
}: {
  list?: BusRoutePassBy[];
  setBus: SetAtom<[SetStateAction<string>], void>;
  setDirection: SetAtom<[SetStateAction<string>], void>;
  city?: string;
  //   setPage: SetAtom<[SetStateAction<string>], void>;
  bus: string;
  direction: string;
}) => {
  // const [busOverlay] = useAtom(BusAtom.overlayAtom)

  // const add_remove_overlay = useOverlay()

  return (
    <>
      {list
        ?.sort(
          (a, b) =>
            Number(RNN(a.RouteName.Zh_tw)) - Number(RNN(b.RouteName.Zh_tw))
        )
        .map((item) => {
          // const isOverlayed = !!busOverlay.find(
          //     (d) => d.RouteName.Zh_tw === item.RouteName.Zh_tw && item.Direction === Number(direction),
          //   );
          return (
            <div
              key={`${item.Direction} ${item.RouteName.Zh_tw} ${item.StopSequence}`}
              className="w-full flex justify-between"
            >
              <div className="h-full flex items-center gap-2">
                <RemainningTime
                  EstimateTime={item.EstimateTime}
                  NextBusTime={item.NextBusTime}
                />
                <button
                  onClick={() => {
                    setBus(item.RouteName.Zh_tw);
                    setDirection(
                      String(item.Direction === 255 ? 0 : item.Direction)
                    );
                  }}
                  className="relative group"
                >
                  <span>{item.RouteName.Zh_tw}</span>
                  <span
                    className={`absolute -bottom-1 left-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all ${
                      bus === item.RouteName.Zh_tw &&
                      direction === `${item.Direction}` &&
                      "w-1/2"
                    }`}
                  ></span>
                  <span
                    className={`absolute -bottom-1 right-1/2 w-0 h-0.5 bg-red-400 group-hover:w-1/2 group-hover:transition-all ${
                      bus === item.RouteName.Zh_tw &&
                      direction === `${item.Direction}` &&
                      "w-1/2"
                    }`}
                  ></span>
                </button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="-translate-x-2 border-2  border-slate-700 hover:bg-slate-700 hover:text-white transition-all bg-transparant font-bold text-slate-700 p-1 w-fit rounded h-fit text-center">
                    <FiMenu />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      to={`/${city}/${item.RouteName.Zh_tw}?direction=${item.Direction}`}
                      onClick={() => {
                        setDirection(
                          String(item.Direction === 255 ? 0 : item.Direction)
                        );
                        setBus(item.RouteName.Zh_tw);
                        //   setPage("bus");
                      }}
                      className="w-full h-full"
                    >
                      查看路線
                    </Link>
                  </DropdownMenuItem>
                  {/* {bus === item.RouteName.Zh_tw &&
                    Number(direction) === item.Direction && (
                      <DropdownMenuItem onClick={add_remove_overlay}>
                        <span>
                          {isOverlayed ? "移除疊加路線" : "新增疊加路線"}
                        </span>
                      </DropdownMenuItem>
                    )} */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
    </>
  );
};

const RemainningTime = ({
  EstimateTime,
  NextBusTime,
}: {
  EstimateTime: BusRoutePassBy["EstimateTime"];
  NextBusTime: BusRoutePassBy["NextBusTime"];
}) => {
  const min = Math.floor(Number(EstimateTime ?? 0) / 60);
  const color =
    min > 5 ? "bg-slate-100 text-slate-600" : "bg-red-200 text-red-900";
  if (EstimateTime) {
    return (
      <div className={`w-20 p-1 text-center h-full rounded ${color}`}>
        {`${min}`.padEnd(3, " ")}分鐘
      </div>
    );
  }

  if (EstimateTime === 0) {
    return (
      <div className={`w-20 p-1 text-center h-full rounded ${color}`}>
        進站中
      </div>
    );
  }

  if (!EstimateTime && NextBusTime) {
    const date = new Date(NextBusTime);
    const time = `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return (
      <div className="w-20 p-1 py-[0.125rem] text-center rounded-md border-slate-100 border-2 text-slate-700">
        {time}
      </div>
    );
  }
  return (
    <div className="w-20 p-1 py-[0.125rem] text-center rounded-md border-slate-100 border-2 text-slate-500">
      末班駛離
    </div>
  );
};
