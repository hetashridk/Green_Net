import { useContext, useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";
import * as Leaflet from "npm:leaflet";

// Create a context to hold Leaflet data/functions
const LeafletContext = createContext<typeof Leaflet | null>(null);

// LeafletProvider component manages Leaflet loading and context
function LeafletProvider(props: { children: ComponentChildren }) {
  const [leaflet, setLeaflet] = useState<typeof Leaflet | null>(null);

  useEffect(() => {
    if (window.L) {
      setLeaflet(window.L);
    } else {
      const loadLeaflet = async () => {
        const L = await import("leaflet");
        window.L = L;
        setLeaflet(L);
      };
      loadLeaflet();
    }
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <LeafletContext.Provider value={leaflet}>
        {props.children}
      </LeafletContext.Provider>
    </>
  );
}

function MapComponent({ latitude, longitude }: { latitude: string; longitude: string }) {
  const leaflet = useContext(LeafletContext);

  useEffect(() => {
    if (!leaflet) return;

    // const map = leaflet.map("map").setView([parseFloat(latitude), parseFloat(longitude)], 13);

    // leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // }).addTo(map);

    // leaflet.marker([parseFloat(latitude), parseFloat(longitude)]).addTo(map)
    //   .bindPopup("Your Location")
    //   .openPopup();
      
      //////
      const center = [parseFloat(latitude), parseFloat(longitude)];
        const map = leaflet.map('map', {
          crs: leaflet.CRS.EPSG3857,
          minZoom: 17
        }).setView(center, 13);
  
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 25,
          minZoom: 17,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
  
        const wmsOptions = {
          layers: 'NDVI',
          transparent: true,
          format: 'image/png',
          maxcc: 20,
          time: '2022-01-01/2022-12-31',
          attribution: '&copy; <a href="https://www.sentinel-hub.com">Sentinel Hub</a>',
          // styles: 'INDEX'
        };
  
        const wmsLayer = leaflet.tileLayer.wms('https://services.sentinel-hub.com/ogc/wms/8d759ba6-0717-4467-ae5d-05e7ee796229', wmsOptions);
        wmsLayer.setOpacity(1);
        wmsLayer.addTo(map);
      }

  , [leaflet, latitude, longitude]);

  return <div id="map" className="relative w-full h-96" />;
}

export function MapIsland({ latitude, longitude }: { latitude: string; longitude: string }) {
  return (
    <LeafletProvider>
      <MapComponent latitude={latitude} longitude={longitude} />
    </LeafletProvider>
  );
}
