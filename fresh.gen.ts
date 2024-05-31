// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_index from "./routes/api/index.ts";
import * as $index from "./routes/index.tsx";
import * as $results from "./routes/results.tsx";
import * as $Loading from "./islands/Loading.tsx";
import * as $LocationButton from "./islands/LocationButton.tsx";
import * as $MapIsland from "./islands/MapIsland.tsx";
import * as $SearchForLocation from "./islands/SearchForLocation.tsx";
import * as $ShareButton from "./islands/ShareButton.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/api/index.ts": $api_index,
    "./routes/index.tsx": $index,
    "./routes/results.tsx": $results,
  },
  islands: {
    "./islands/Loading.tsx": $Loading,
    "./islands/LocationButton.tsx": $LocationButton,
    "./islands/MapIsland.tsx": $MapIsland,
    "./islands/SearchForLocation.tsx": $SearchForLocation,
    "./islands/ShareButton.tsx": $ShareButton,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
