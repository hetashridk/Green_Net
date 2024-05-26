
'use client'
// imports
// import { useState } from "https://deno.land/x/std@0.126.0/fmt/colors.ts";
import { isLoading } from "../store.ts";

// Props Type
interface LocationData {
  latitude: number | string;
  longitude: number | string;
  name: string;
  country: string;
}

// Simulate useState hook
function useState<T>(initialValue: T): [T, (newValue: T) => void] {
  let value: T = initialValue;
  return [
    value,
    (newValue: T) => {
      value = newValue;
    },
  ];
}

/**
 * Search Location
 */
export default function LocationButton(
  { latitude, longitude, name, country }: LocationData,
) {

  // const [loading, setLoading] = useState(false);

  /**
   * Fetched data for location
   */
  const handleLocation = async () => {
    isLoading.value = true;
    try {
      const response = await fetch('/api', {
        method: "POST",
        body: JSON.stringify({
          longitude: longitude,
          latitude: latitude,
        }),
      });
      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      alert(error);
    } finally {
      isLoading.value = false;
    }
    // console.log(window.location);
    console.log(window);
    
    
  };

  return (
    <button
      type="button"
      onClick={handleLocation}
      className={`btn btn-lg text-white break-words `}
    >
      {name} - {country}
    </button>
  );
}

