'use client'

import type { BusList } from "app/type/busType"
import { useState, useRef } from "react"
import { useSetAtom } from "jotai"
import * as BusAtom from "app/state/BusAtom"
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
  } from "~/components/ui/drawer"
  import { RNN } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Link } from "@remix-run/react"

export default function DrawerSection({
    initBusList,
    setDrawerOpen,
    drawerOpen,
    city
}: {
    initBusList?: BusList[],
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    drawerOpen: boolean,
    city?: string
}) {

    const [qString, setQString] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const closeBtnRef = useRef<HTMLButtonElement>(null)
    const setBus = useSetAtom(BusAtom.busAtom)
    const setDirection = useSetAtom(BusAtom.directionAtom)

    if (!city || !initBusList) {
        return null;
    }

    const data = structuredClone(initBusList).sort((a,b)=>Number(RNN(a.RouteName.Zh_tw)) - Number(RNN(b.RouteName.Zh_tw))).map(item=>{
        const headSign = `${item.RouteName.Zh_tw} ${item.SubRoutes[0].Headsign ?? ""}`
        return {
            headSign,
            ...item
        }
    }).filter(item=>{
        if (qString) {
            return item.headSign.includes(qString)
        }
        return true
    })

    return (
    <>
        <Drawer onClose={()=>setDrawerOpen(false)} open={drawerOpen} >
            <DrawerContent onInteractOutside={()=>setDrawerOpen(false)} onEscapeKeyDown={()=>setDrawerOpen(false)}>
                <DrawerHeader>
                    <DrawerTitle>選擇公車</DrawerTitle>
                </DrawerHeader>
                <DrawerFooter className="flex flex-col items-center">
                    <Input ref={inputRef} value={qString} onChange={(e)=>{setQString(e.target.value)}} placeholder="搜尋路線..." onKeyDown={(e)=>{
                        if (e.key === "Enter") {
                            inputRef.current?.blur()
                        }
                    }} />
                    <ScrollArea className="h-[60vh] w-full">
                        <div className="w-full flex flex-col">
                            {data.map((item, index) => {
                                return (
                                <>
                                    {index !== 0 && <div className="w-full border-t-[0.05rem] border-slate-100 mx-1" />}
                                    <Link 
                                        key={item.SubRoutes[0].SubRouteName.Zh_tw} 
                                        to={`/${city}/${item.RouteName.Zh_tw}/0`}
                                        onClick={()=>{
                                            setBus(item.RouteName.Zh_tw)
                                            setDirection("0")
                                            closeBtnRef.current?.click()
                                            setQString("")
                                        }}
                                        className="p-2 py-3 rounded-md hover:bg-slate-100 hover:cursor-pointer transition-all"
                                    >
                                        {item.headSign}
                                    </Link>
                                </>
                                )
                            })}
                        </div>
                    </ScrollArea>

                        <Button variant="outline" ref={closeBtnRef} onClick={()=>setDrawerOpen(false)} className="w-fit" >取消</Button>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>           
    )
}

