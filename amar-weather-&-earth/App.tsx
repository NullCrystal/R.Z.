
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { LocationData, WeatherData, Earthquake, WeatherType, LocationSource, TouristSpotResult, TouristSpot } from './types';
import { BANGLADESH_DISTRICTS, FALLBACK_LOCATION, getWeatherType, getWeatherGradient, MAJOR_BD_CITIES } from './constants';
import { getDistance, calculateFeltMagnitude, getBangladeshTime, reverseGeocodeHybrid } from './utils';
import SearchInput from './components/SearchInput';
import WeatherHero from './components/WeatherHero';
import ForecastGrid from './components/ForecastGrid';
import EarthquakeList from './components/EarthquakeList';
import HourlyForecast from './components/HourlyForecast';
import LocationStatus from './components/LocationStatus';
import LocationModal from './components/LocationModal';
import Skeleton from './components/Skeleton';
import LiveMoodBadge from './components/LiveMoodBadge';
import TouristSuggestions from './components/TouristSuggestions';

const App: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [touristSpots, setTouristSpots] = useState<TouristSpotResult | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingQuakes, setLoadingQuakes] = useState(true);
  const [loadingSpots, setLoadingSpots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<LocationSource>('fallback');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const fetchTouristSpots = useCallback(async (lat: number, lon: number, cityName: string) => {
    setLoadingSpots(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Step 1: Get Data using Gemini 2.5 Flash + Maps Tool
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find the absolute best, highest-rated tourist spots, parks, or heritage sites within 1-hour travel (max 40km) from ${cityName}, Bangladesh (Location: ${lat}, ${lon}). 
                  Return exactly 3 spots in JSON format.
                  For each spot include: name, description (English), descriptionBn (Bangla), distance (e.g. "15 mins"), rating (e.g. "4.8/5"), and category (e.g. "Heritage", "Nature").`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: { latLng: { latitude: lat, longitude: lon } }
          },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                descriptionBn: { type: Type.STRING },
                distance: { type: Type.STRING },
                rating: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["name", "description", "descriptionBn", "distance", "rating", "category"]
            }
          }
        },
      });

      let spots: TouristSpot[] = [];
      try {
        spots = JSON.parse(response.text || "[]");
      } catch (e) {
        console.error("JSON parse failed", e);
      }

      // Add map links from grounding if available
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      spots = spots.map((spot, idx) => {
        const mapChunk = groundingChunks.find(c => c.maps && c.maps.title.toLowerCase().includes(spot.name.toLowerCase()));
        return {
          ...spot,
          mapUrl: mapChunk?.maps?.uri || `https://www.google.com/maps/search/${encodeURIComponent(spot.name + " " + cityName)}`
        };
      });

      // Step 2: Generate a beautiful hero image for the top spot
      let heroImage = "";
      if (spots.length > 0) {
        const imgResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `A world-class, breathtaking cinematic photography of ${spots[0].name} in ${cityName}, Bangladesh. Lush greenery, golden hour lighting, 8k resolution, serene atmosphere, travel magazine style.` }]
          }
        });
        
        for (const part of imgResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            heroImage = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      setTouristSpots({ spots, heroImage });
    } catch (e) {
      console.error("Tourist fetch failed", e);
    } finally {
      setLoadingSpots(false);
    }
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoadingWeather(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover,pressure_msl,visibility,is_day&hourly=temperature_2m,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=Asia/Dhaka&forecast_days=10&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&alerts=true`;
      const res = await fetch(url);
      const data = await res.json();
      const bdTime = getBangladeshTime();
      
      const filteredHourly = data.hourly.time.map((time: string, i: number) => ({
        time,
        temp: data.hourly.temperature_2m[i],
        weatherCode: data.hourly.weather_code[i],
        precipProb: data.hourly.precipitation_probability[i],
      })).filter((h: any) => {
        const hTime = new Date(new Date(h.time).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
        const nowTruncated = new Date(bdTime);
        nowTruncated.setMinutes(0, 0, 0);
        return hTime >= nowTruncated;
      }).slice(0, 24);

      setWeather({
        current: {
          temp: data.current.temperature_2m,
          feelsLike: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day,
          cloudCover: data.current.cloud_cover,
          pressure: data.current.pressure_msl,
          visibility: data.current.visibility / 1000, 
          uvIndex: data.hourly.uv_index[0] || 0,
        },
        hourly: filteredHourly,
        daily: data.daily.time.map((time: string, i: number) => ({
          date: time,
          maxTemp: data.daily.temperature_2m_max[i],
          minTemp: data.daily.temperature_2m_min[i],
          weatherCode: data.daily.weather_code[i],
          rainProb: data.daily.precipitation_probability_max[i],
          sunrise: data.daily.sunrise[i],
          sunset: data.daily.sunset[i],
          uvIndexMax: data.daily.uv_index_max[i],
        })),
        alerts: data.alerts || []
      });
    } catch (err) {
      console.error(err);
      setError("আবহাওয়ার তথ্য আনতে সমস্যা হয়েছে");
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const detectLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const placeName = await reverseGeocodeHybrid(lat, lon, BANGLADESH_DISTRICTS);
            const newLoc = { name: placeName, lat, lon, manual_search: false };
            setLocation(newLoc);
            setLocationSource('auto');
            localStorage.setItem('preferred_location', JSON.stringify(newLoc));
            fetchWeather(lat, lon);
            fetchTouristSpots(lat, lon, placeName);
          } catch (e) {
             setLocation(FALLBACK_LOCATION);
             setLocationSource('fallback');
             fetchWeather(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon);
             fetchTouristSpots(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon, FALLBACK_LOCATION.name);
          }
        },
        (err) => {
          setLocation(FALLBACK_LOCATION);
          setLocationSource('fallback');
          fetchWeather(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon);
          fetchTouristSpots(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon, FALLBACK_LOCATION.name);
        }
      );
    } else {
      setLocation(FALLBACK_LOCATION);
      setLocationSource('fallback');
      fetchWeather(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon);
      fetchTouristSpots(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon, FALLBACK_LOCATION.name);
    }
  }, [fetchWeather, fetchTouristSpots]);

  const fetchEarthquakes = useCallback(async () => {
    setLoadingQuakes(true);
    try {
      const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson');
      const data = await res.json();
      const processed: Earthquake[] = data.features
        .filter((f: any) => {
          const [lon, lat] = f.geometry.coordinates;
          return lat >= 15 && lat <= 32 && lon >= 80 && lon <= 100;
        })
        .map((f: any) => {
          const [lon, lat, depth] = f.geometry.coordinates;
          const originalMag = f.properties.mag;
          let minDistance = Infinity;
          let nearestCityName = 'Dhaka';
          MAJOR_BD_CITIES.forEach(city => {
            const dist = getDistance(lat, lon, city.lat, city.lon);
            if (dist < minDistance) {
              minDistance = dist;
              nearestCityName = city.name;
            }
          });
          const feltMag = calculateFeltMagnitude(originalMag, minDistance, depth);
          return {
            id: f.id, originalMag, feltMag, place: f.properties.place, nearestCity: nearestCityName,
            distanceFromNearestCity: minDistance, time: f.properties.time, depth,
            countriesAffected: f.properties.felt ? ['Bangladesh'] : [],
            rms: f.properties.rms || 0, status: f.properties.status || 'automatic',
          };
        })
        .filter((e: any) => e.feltMag >= 1.0)
        .sort((a, b) => b.time - a.time)
        .slice(0, 15);
      setEarthquakes(processed);
    } catch (e) { console.error(e); }
    setLoadingQuakes(false);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    const matched = BANGLADESH_DISTRICTS.find(d => d.name.toLowerCase().includes(query.toLowerCase()));
    if (matched) {
      const newLoc = { ...matched, manual_search: true };
      setLocation(newLoc);
      setLocationSource('manual');
      localStorage.setItem('preferred_location', JSON.stringify(newLoc));
      fetchWeather(matched.lat, matched.lon);
      fetchTouristSpots(matched.lat, matched.lon, matched.name);
    } else {
      setError("লোকেশন পাওয়া যায়নি");
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('preferred_location');
    if (saved) {
      const loc = JSON.parse(saved);
      setLocation(loc);
      if (loc.manual_search) {
        setLocationSource('manual');
        fetchWeather(loc.lat, loc.lon);
        fetchTouristSpots(loc.lat, loc.lon, loc.name);
      } else {
        detectLocation();
      }
    } else {
      setShowLocationModal(true);
    }
    fetchEarthquakes();
  }, [fetchWeather, fetchEarthquakes, detectLocation, fetchTouristSpots]);

  const weatherType = weather ? getWeatherType(weather.current.weatherCode) : WeatherType.Sunny;
  const gradientClass = getWeatherGradient(weatherType);

  return (
    <div className={`min-h-screen transition-all duration-1000 bg-gradient-to-br ${gradientClass} px-4 py-8 md:px-12 overflow-x-hidden relative`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }} className="orb w-[500px] h-[500px] bg-sky-400/20 top-[-10%] right-[-10%]" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 15, repeat: Infinity }} className="orb w-[600px] h-[600px] bg-indigo-500/10 bottom-[-20%] left-[-10%]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex flex-col items-center space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center space-x-3">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-2 border-white shadow-2xl">
              <span className="text-2xl">☀️</span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-3xl font-black tracking-tighter text-slate-900">R.Z.Weather</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 opacity-60">Bangladesh</span>
            </div>
          </motion.div>

          <SearchInput onSearch={handleSearch} />
          
          <div className="flex flex-col items-center gap-4">
             {location && <LocationStatus source={locationSource} name={location.name} />}
             {weather && <LiveMoodBadge weatherType={getWeatherType(weather.current.weatherCode)} />}
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold bg-white/60 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">{error}</p>}
        </header>

        <main className="space-y-16">
          <section>
            {loadingWeather ? (
              <Skeleton className="h-[360px] w-full rounded-[3.5rem]" />
            ) : weather && location ? (
              <WeatherHero weather={weather} location={location} />
            ) : null}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-center">
              <h2 className="text-[11px] font-black text-slate-900/40 uppercase tracking-[0.5em]">Hourly Updates</h2>
            </div>
            {loadingWeather ? (
              <div className="flex gap-4 overflow-hidden px-1">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 w-28 rounded-[2rem] flex-shrink-0" />)}
              </div>
            ) : weather ? (
              <HourlyForecast hourly={weather.hourly} />
            ) : null}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-center">
              <h2 className="text-[11px] font-black text-slate-900/40 uppercase tracking-[0.5em]">10-Day Deep Forecast</h2>
            </div>
            {loadingWeather ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-1">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-40 rounded-[2.5rem]" />)}
              </div>
            ) : weather ? (
              <ForecastGrid forecast={weather.daily} />
            ) : null}
          </section>

          <section>
            <TouristSuggestions data={touristSpots} loading={loadingSpots} />
          </section>

          <section className="space-y-8 bg-white/20 p-8 md:p-12 rounded-[3.5rem] border border-white/40 shadow-2xl backdrop-blur-3xl brilliant-edge">
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">ভূমিকম্পের সংবাদ</h2>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest opacity-60">Felt Intensity Monitor</p>
            </div>
            {loadingQuakes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-48 rounded-[2.5rem]" />)}
              </div>
            ) : <EarthquakeList earthquakes={earthquakes} onRefresh={fetchEarthquakes} />}
          </section>
        </main>

        <footer className="text-center pb-12 pt-10">
          <div className="inline-block px-8 py-3 glass rounded-full border border-white/40 shadow-sm">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em]">Nice day || Mahbub Khandaker</p>
          </div>
        </footer>
      </div>

      <LocationModal 
        show={showLocationModal} 
        onAllow={detectLocation} 
        onFallback={() => { 
          const loc = FALLBACK_LOCATION;
          setLocation(loc); 
          setLocationSource('fallback'); 
          fetchWeather(loc.lat, loc.lon); 
          fetchTouristSpots(loc.lat, loc.lon, loc.name);
          setShowLocationModal(false); 
        }} 
        onClose={() => setShowLocationModal(false)} 
      />

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => { 
          if (location) {
            fetchWeather(location.lat, location.lon); 
            fetchTouristSpots(location.lat, location.lon, location.name);
          }
          fetchEarthquakes(); 
        }} 
        className="fixed bottom-10 right-10 w-16 h-16 glass rounded-[2rem] flex items-center justify-center shadow-2xl border-2 border-white z-50 text-slate-800 transition-colors hover:bg-white active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
      </motion.button>
    </div>
  );
};

export default App;
