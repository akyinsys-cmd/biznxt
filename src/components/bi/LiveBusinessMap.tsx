import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { GEO_DATA } from '../../data/biData';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export function LiveBusinessMap() {
  if (!hasValidKey) {
    return (
      <div className="bg-slate-100 rounded-[2rem] h-[400px] flex items-center justify-center p-8 text-center border-2 border-dashed border-slate-200">
        <div>
          <h3 className="text-lg font-black text-slate-500 mb-2">Live Business Map</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mb-4">
            Connect your Google Maps Platform key in Settings to see real-time business distribution.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {GEO_DATA.map((city, i) => (
              <span key={i} className="px-3 py-1 bg-white rounded-2xl text-[10px] font-bold text-slate-500 border border-slate-200 shadow-sm">
                {city.city}: {city.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-lg h-[400px] relative">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 20.5937, lng: 78.9629 }} // Center of India
          defaultZoom={4}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
        >
          {GEO_DATA.map((loc, i) => (
            <AdvancedMarker 
              key={i} 
              position={getCoords(loc.city)}
            >
              <Pin 
                background={loc.type === 'Customer' ? '#3B82F6' : loc.type === 'Manufacturer' ? '#F59E0B' : '#8B5CF6'} 
                glyphColor="#fff" 
                scale={0.8}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-slate-200 z-10">
        <h4 className="text-xs font-black text-slate-900 mb-2 uppercase tracking-wider">Live Distribution</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold text-slate-600">Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold text-slate-600">Manufacturers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-[10px] font-bold text-slate-600">Partners</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCoords(city: string) {
  const coords: Record<string, { lat: number, lng: number }> = {
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Surat': { lat: 21.1702, lng: 72.8311 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
  };
  return coords[city] || { lat: 20, lng: 78 };
}
