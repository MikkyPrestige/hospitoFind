import { useState, useEffect } from "react";

interface GeolocationState {
  lat: number | null;
  lon: number | null;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<GeolocationState>({ lat: null, lon: null });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        // Silently fail – distance just won't show
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  return coords;
}