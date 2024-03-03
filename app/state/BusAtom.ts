import { atom } from "jotai";
import type { BusGeo, BusStops } from "~/type/busType";


export const busAtom = atom("")
export const directionAtom = atom("")
export const busStopsAtom = atom<BusStops[] | null>(null)
export const busShapeAtom = atom<BusGeo[]>([])
export const toggleStop = atom<{
    stopName?: string,
    id: number;
}>({stopName: undefined, id:0})
export const stationAtom = atom("")