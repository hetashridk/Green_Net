

import { Handlers } from "$fresh/server.ts";
import { LocationScheme } from "../../islands/SearchForLocation.tsx";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const genAI = new GoogleGenerativeAI(Deno.env.get("API_KEY") ?? "");

const PROMPT = `Act as a farmer, botanist, and help suggest at least 1 or max 10 vegetables, fruits, or any other plants that can be grown with a minimum time span. Make sure to analyze weather data below of the location and suggest plantation that can be grown well in that weather. include plant name, type of it, growth time, emoji & extra medium-length note for it, in JSON Array format following scheme below, without including it in code block.
  FOLLOW THIS SCHEME:-
  {
    "emoji":"appropirate emoji according to plant, only one emoji, don't include text, only EMOJI",
    "name": "Plant Name",
    "type": "Plant Type",
    "growth_time": "Growth timings in string",
    "note": "Extra Note"
  },
  WEATHER DATA:-`;

async function getDataForPlants(data: object) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(PROMPT + JSON.stringify(data));
  const response = await result.response;
  const res = response.text();
  return JSON.parse(res.replaceAll("`", "").trim());
}

export const handler: Handlers<LocationScheme> = {
  async POST(req, _ctx) {
    const prms = await req.json().catch((e) => {
      return new Response(null, {
        status: 400,
        statusText: e.message,
      });
    });

    const { latitude, longitude } = prms;

    if (latitude === undefined || longitude === undefined) {
      return new Response(null, {
        status: 400,
        statusText: "Coordinates Missing!",
      });
    }

    const weatherReq = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&past_days=14`,
    );
    const weatherData = await weatherReq.json();

    const RESULTS = await getDataForPlants(weatherData);

    const encryptedData = btoa(encodeURIComponent(JSON.stringify(RESULTS)));

    const headers = new Headers();
    headers.set(
      "location",
      `/results?data=${encryptedData}&latitude=${latitude}&longitude=${longitude}`,
    );
    return new Response(null, {
      status: 301, // See Other
      headers,
    });
  },
  GET(_, ctx) {
    return Response.redirect(ctx.url.origin, 302);
  },
};
