import { ScrollArea } from "@radix-ui/react-scroll-area";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { FaSpinner, FaSearch } from "react-icons/fa";
// eslint-disable-next-line import/no-named-as-default
import Popup from "reactjs-popup";
import { ClientOnly } from "~/components/client-only";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { env } from "~/env";
import { stationAtom } from "~/state/BusAtom";
import { type BusStopSearchResult } from "~/type/busType";

export async function loader({ params }: LoaderFunctionArgs) {

  return {
    city: params.city,
    url: env.url,
  };
}

export default function Station() {
  const params = useLoaderData<typeof loader>();
  const { city } = params;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<BusStopSearchResult[] | null>(null);
  const setStation = useSetAtom(stationAtom);
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
          {"選擇站牌..."}
        </button>
        {params.city}
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
