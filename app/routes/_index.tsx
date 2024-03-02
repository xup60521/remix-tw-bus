import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import ReactSelect from "react-select"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const list = [
    { label: "台北市", value: "Taipei" },
    { label: "新北市", value: "NewTaipei" },
    { label: "桃園市", value: "Taoyuan" },
    { label: "台中市", value: "Taichung" },
    { label: "台南市", value: "Tainan" },
    { label: "高雄市", value: "Kaohsiung" },
    { label: "基隆市", value: "Keelung" },
    { label: "金門縣", value: "KinmenCounty" },
    { label: "新竹市", value: "Hsinchu" },
    { label: "新竹縣", value: "HsinchuCounty" },
    { label: "苗栗縣", value: "MiaoliCounty" },
    { label: "彰化縣", value: "ChanghuaCounty" },
    { label: "南投縣", value: "NantouCounty" },
    { label: "雲林縣", value: "YunlinCounty" },
    { label: "嘉義縣", value: "ChiayiCounty" },
    { label: "嘉義市", value: "Chiayi" },
    { label: "屏東縣", value: "PingtungCounty" },
    { label: "宜蘭縣", value: "YilanCounty" },
    { label: "花蓮縣", value: "HualienCounty" },
    { label: "台東縣", value: "TaitungCounty" },
    { label: "澎湖縣", value: "PenghuCounty" },
  ];
  return (
    <main className="h-screen flex-col items-center justify-center gap-4 overflow-x-hidden overflow-y-scroll bg-slate-700 text-white scroll-smooth">
      <section className="relative flex min-h-screen w-full flex-col items-center gap-8 overflow-y-clip bg-gradient-to-b from-gray-900 to-slate-700 px-4 pt-[20vh] md:pt-[30vh]">
        <nav className="absolute left-0 top-0 flex w-screen items-center justify-between p-8">
          <span className="flex h-full items-center gap-4">
            <span className="font-mono text-xl">Remix Taiwan Bus</span>
          </span>
          <a
            href={"https://github.com/xup60521/t3-taiwan-bus"}
            target="_blank"
            className="flex h-full items-center"
            rel="noreferrer"
          >
            <FaGithub className="text-xl text-gray-300 hover:text-white" />
          </a>
        </nav>
        <div
          className={
            "flex w-[60rem] max-w-[100vw] flex-col  items-center gap-8 text-center font-mono"
          }
        >
          <h1 className="text-6xl font-black px-4">
            Taking the bus without all the pain.
          </h1>
          <p className="mx-16">
            A web app with various built in function that optimizes user
            experiance of searching, finding the correct{" "}
            <span className="text-sky-300">bus</span> routes.
          </p>
        </div>
        <a
          href="#start"
          className="rounded-lg bg-sky-500 p-3 px-6 font-bold text-white transition-all hover:bg-sky-400"
        >
          Get started
        </a>
      </section>
      <SelectCity list={list} />
    </main>
  );
}

function SelectCity({
  list,
}: {
  list: {
    label: string;
    value: string;
  }[];
}) {
  const [value, setValue] = useState("");

  return (
    <section
      id="start"
      className="flex h-screen w-screen flex-col items-center justify-start gap-4 pt-[10vh]"
    >
      <h2 className="font-mono text-3xl">Select a city</h2>
      <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row">
        <ReactSelect
          placeholder="選擇城市..."
          className="w-48 text-black"
          options={list}
          onChange={(e) => setValue(e?.value ?? "")}
        />
        {list.map((item) => {
          if (!value) {
            return null;
          }
          if (item.value === value) {
            return (
              <>
                <Link
                  className="rounded-lg bg-sky-500 p-2 px-6 font-bold text-white transition-all hover:bg-sky-400"
                  key={item.value}
                  to={`/${item.value}`}
                >
                  進入
                </Link>
              </>
            );
          }
        })}
      </div>
    </section>
  );
}

