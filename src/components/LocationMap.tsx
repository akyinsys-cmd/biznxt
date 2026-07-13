import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  '';

export default function LocationMap({ locationString }: { locationString: string }) {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 20.5937, lng: 78.9629 }); // Default center: India
  const [zoom, setZoom] = useState(5);
  const [error, setError] = useState<string | null>(null);

  if (!API_KEY) {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-center text-xs text-slate-500">
        Google Maps API key not found in environment. Please configure GOOGLE_MAPS_PLATFORM_KEY.
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-sm">
      <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Venture Location Suitability Map</span>
        <span className="text-[10px] font-mono text-slate-500 bg-white px-2.5 py-0.5 rounded-2xl border border-slate-200 truncate max-w-[200px]">
          {locationString}
        </span>
      </div>
      
      <div className="h-[300px] w-full relative">
        <APIProvider apiKey={API_KEY} version="weekly">
          <MapWithGeocoding 
            locationString={locationString} 
            center={center} 
            setCenter={setCenter} 
            zoom={zoom} 
            setZoom={setZoom} 
            setError={setError} 
          />
        </APIProvider>
      </div>
      {error && (
        <div className="p-2 text-center text-[10px] bg-red-50 text-red-500 border-t border-slate-200">
          {error}
        </div>
      )}
    </div>
  );
}

interface MapProps {
  locationString: string;
  center: { lat: number; lng: number };
  setCenter: (c: { lat: number; lng: number }) => void;
  zoom: number;
  setZoom: (z: number) => void;
  setError: (e: string | null) => void;
}

function MapWithGeocoding({ 
  locationString, 
  center, 
  setCenter, 
  zoom, 
  setZoom,
  setError 
}: MapProps) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!locationString) return;

    // Direct fallbacks for major Indian cities to ensure robust loading even if geocoding has latency or limit errors
    const lowerLoc = locationString.toLowerCase();
    let fallbackCenter = null;
    if (lowerLoc.includes('mumbai')) fallbackCenter = { lat: 19.0760, lng: 72.8777 };
    else if (lowerLoc.includes('delhi') || lowerLoc.includes('ncr')) fallbackCenter = { lat: 28.6139, lng: 77.2090 };
    else if (lowerLoc.includes('bengaluru') || lowerLoc.includes('bangalore')) fallbackCenter = { lat: 12.9716, lng: 77.5946 };
    else if (lowerLoc.includes('hyderabad')) fallbackCenter = { lat: 17.3850, lng: 78.4867 };
    else if (lowerLoc.includes('chennai')) fallbackCenter = { lat: 13.0827, lng: 80.2707 };
    else if (lowerLoc.includes('kolkata')) fallbackCenter = { lat: 22.5726, lng: 88.3639 };
    else if (lowerLoc.includes('pune')) fallbackCenter = { lat: 18.5204, lng: 73.8567 };
    else if (lowerLoc.includes('ahmedabad')) fallbackCenter = { lat: 23.0225, lng: 72.5714 };

    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        geocoder.geocode({ address: locationString }, (results: any, status: any) => {
          if (status === 'OK' && results && results[0]) {
            const loc = results[0].geometry.location;
            const latLng = { lat: loc.lat(), lng: loc.lng() };
            setCenter(latLng);
            setMarkerPosition(latLng);
            setZoom(14);
            if (map) {
              map.setCenter(latLng);
              map.setZoom(14);
            }
            setError(null);
          } else {
            console.warn('Geocoding fallback triggered because status is:', status);
            if (fallbackCenter) {
              setCenter(fallbackCenter);
              setMarkerPosition(fallbackCenter);
              setZoom(12);
              if (map) {
                map.setCenter(fallbackCenter);
                map.setZoom(12);
              }
              setError(null);
            } else {
              setError(`Location found via default projection map.`);
            }
          }
        });
      } catch (err) {
        console.error('Error running geocoder:', err);
        if (fallbackCenter) {
          setCenter(fallbackCenter);
          setMarkerPosition(fallbackCenter);
          setZoom(12);
        }
      }
    } else {
      if (fallbackCenter) {
        setCenter(fallbackCenter);
        setMarkerPosition(fallbackCenter);
        setZoom(12);
      }
    }
  }, [locationString, map, mapsLib, setError, setCenter, setZoom]);

  return (
    <Map
      center={center}
      zoom={zoom}
      mapId="DEMO_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      {markerPosition && (
        <AdvancedMarker position={markerPosition}>
          <Pin background="#2563eb" glyphColor="#fff" borderColor="#1d4ed8" />
        </AdvancedMarker>
      )}
    </Map>
  );
}
