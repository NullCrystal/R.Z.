
export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  admin1?: string;
  manual_search?: boolean;
}

export type LocationSource = 'auto' | 'manual' | 'fallback';

export interface WeatherAlert {
  source: string;
  type: string;
  description: string;
  severity: string;
  start?: string;
  end?: string;
  windSpeed?: string;
  landfallTime?: string;
  threatLevel?: string;
  instruction?: string;
}

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    isDay: number;
    cloudCover: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
  };
  hourly: Array<{
    time: string;
    temp: number;
    weatherCode: number;
    precipProb: number;
  }>;
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    rainProb: number;
    sunrise: string;
    sunset: string;
    uvIndexMax: number;
  }>;
  alerts: WeatherAlert[];
}

export interface Earthquake {
  id: string;
  originalMag: number;
  feltMag: number;
  place: string;
  nearestCity: string;
  distanceFromNearestCity: number;
  time: number;
  depth: number;
  countriesAffected: string[];
  rms: number;
  status: 'reviewed' | 'automatic' | string;
}

export interface TouristSpot {
  name: string;
  description: string;
  descriptionBn: string;
  distance: string;
  rating: string;
  category: string;
  mapUrl?: string;
  imageUrl?: string;
}

export interface TouristSpotResult {
  spots: TouristSpot[];
  heroImage?: string;
  rawText?: string;
}

export interface CycloneData {
  active: boolean;
  alerts: WeatherAlert[];
}

export enum WeatherType {
  Sunny = 'Sunny',
  Cloudy = 'Cloudy',
  Rain = 'Rain',
  Storm = 'Storm',
  Fog = 'Fog',
  Snow = 'Snow'
}
