
import { LocationData } from './types';

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function calculateFeltMagnitude(originalMag: number, distanceKm: number, depthKm: number) {
  const distanceAttenuation = distanceKm / 150; 
  const depthAttenuation = depthKm / 80;
  const feltMag = originalMag - distanceAttenuation - depthAttenuation;
  return parseFloat(Math.max(0.1, feltMag).toFixed(1));
}

export function formatBnDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' });
}

export function getBnDayName(dateStr: string) {
  const date = new Date(dateStr);
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  return days[date.getDay()];
}

export function getTimeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export function getBangladeshTime() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getRelativeTime(targetDateStr: string) {
  const now = getBangladeshTime();
  const targetDate = new Date(new Date(targetDateStr).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Now';

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  if (hours === 0) {
    return `in ${minutes} min`;
  } else if (hours < 24) {
    return `in ${hours}h`;
  }
  return '';
}

export function getCycloneSeasonAlert() {
  const now = getBangladeshTime();
  const month = now.getMonth(); // 0-11
  const isSeason = (month >= 4 && month <= 5) || (month >= 9 && month <= 10);
  
  if (isSeason) {
    return {
      source: 'System',
      type: 'Cyclone Season',
      description: 'বর্তমানে বঙ্গোপসাগরে ঘূর্ণিঝড়ের মৌসুম চলছে। আবহাওয়ার আপডেট সতর্কতার সাথে অনুসরণ করুন। Currently in Bay of Bengal cyclone season. Stay alert for weather updates.',
      severity: 'Minor'
    };
  }
  return null;
}

/**
 * Robust reverse geocoding to handle BD district detection accurately.
 */
export async function reverseGeocodeHybrid(lat: number, lon: number, districts: LocationData[]): Promise<string> {
  try {
    // 1. Try Nominatim (Very accurate)
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const nomRes = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'AmarWeatherBD/1.0' }
    });
    
    if (nomRes.ok) {
      const data = await nomRes.json();
      const address = data.address;
      const placeName = address.city || address.town || address.municipality || address.county || address.state_district || address.state;
      if (placeName) {
        // Validation: If it returns Jamalpur but coordinates are in Mymensingh, fix it
        if (placeName === 'Jamalpur' && lat > 24.6 && lat < 24.85 && lon > 90.3 && lon < 90.5) {
          return 'Mymensingh';
        }
        return placeName;
      }
    }

    // 2. Try Open-Meteo Reverse
    const omUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=5&language=en&format=json`;
    const omRes = await fetch(omUrl);
    if (omRes.ok) {
      const data = await omRes.json();
      if (data.results && data.results.length > 0) {
        // Distance check for best match
        const best = data.results.sort((a: any, b: any) => {
          const distA = getDistance(lat, lon, a.latitude, a.longitude);
          const distB = getDistance(lat, lon, b.latitude, b.longitude);
          return distA - distB;
        })[0];
        
        if (best.name) return best.name;
      }
    }
  } catch (e) {
    console.error("Reverse geocoding APIs failed", e);
  }

  // 3. Fallback to closest hardcoded district
  let closest = districts[0];
  let minDistance = getDistance(lat, lon, districts[0].lat, districts[0].lon);
  
  districts.forEach(d => {
    const dist = getDistance(lat, lon, d.lat, d.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = d;
    }
  });

  return closest.name;
}
