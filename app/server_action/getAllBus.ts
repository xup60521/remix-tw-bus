'use server'

import {type BusList } from "type/busType"
import { get_access_token } from "./get_access_token"

export async function getAllBus(city?: string) {
    const access_token_res = (await get_access_token())
    const access_token = access_token_res.access_token
    const initBusList_res = await fetch(`https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/${city ?? "Taichung"}?&$select=SubRoutes,RouteName`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
    }).then(res => res) 
    const initBusList = await initBusList_res.json() as BusList[]
    return initBusList
}