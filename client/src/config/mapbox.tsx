import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_Mapbox_Key

export const accessToken = mapboxgl.accessToken;