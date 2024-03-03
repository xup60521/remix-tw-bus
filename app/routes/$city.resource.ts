import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getBusEst } from "~/server_action/getBusEst";
import { getBusShape } from "~/server_action/getBusShape";
import { getBusStops } from "~/server_action/getBusStops";
import { searchStop } from "~/server_action/searchStop";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const city = params.city ?? "";
  const action = url.searchParams.get("action");
  if (action === "get_est") {
    const bus = url.searchParams.get("bus") ?? "";
    const direction = url.searchParams.get("direction") ?? "";
    const data = await getBusEst(city, bus, direction);
    return json(data);
  }
  if (action === "get_stops_and_shape") {
    const bus = url.searchParams.get("bus") ?? "";
    const stops = await getBusStops(bus, city);
    const shapes = await getBusShape(bus, city);
    const withDirectionData = shapes
      ?.map((item, index, arr) => {
        const d0 = stops
          .find((d) => d.Direction === 0)
          ?.Stops.sort(
            (a, b) => a.StopSequence - b.StopSequence
          )[0].StopPosition;
        const d1 = stops
          .find((d) => d.Direction === 1)
          ?.Stops.sort(
            (a, b) => a.StopSequence - b.StopSequence
          )[0].StopPosition;
        if (item.Direction) {
          return item;
        } else if (arr.length === 2 && d0 && d1) {
          const regex = /[A-Z()]/g;
          const position = item.Geometry.replace(regex, "")
            .split(",")
            .map((f) =>
              f
                .split(" ")
                .reverse()
                .map((item) => Number(item))
            )[0] as [number, number];
          const length_to_d0 =
            (position[0] - d0.PositionLat) ** 2 +
            (position[1] - d0.PositionLon) ** 2;
          const length_to_d1 =
            (position[0] - d1.PositionLat) ** 2 +
            (position[1] - d1.PositionLon) ** 2;
          if (length_to_d0 >= length_to_d1) {
            item.Direction = 1;
          } else {
            item.Direction = 0;
          }

          return item;
        } else {
          item.Direction = index;
          return item;
        }
      })
      .sort((a, b) => a.Direction - b.Direction);
    return json({
      stops,
      shapes: withDirectionData,
    });
  }
  if (action === "search_stop") {
    const q = url.searchParams.get("q");
    const result = await searchStop(q ?? "", city);
    return json(result);
  }

  return new Response("invalid action type");
}
