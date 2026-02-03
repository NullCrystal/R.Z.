
import { LocationData, WeatherType } from './types';

export const DHAKA_COORDS = { lat: 23.8103, lon: 90.4125 };
export const FALLBACK_LOCATION: LocationData = { name: 'Gazipur', lat: 23.9989, lon: 90.4264 };

export const MAJOR_BD_CITIES = [
  { name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { name: 'Chattogram', lat: 22.3569, lon: 91.7832 },
  { name: 'Sylhet', lat: 24.8949, lon: 91.8687 },
  { name: 'Rajshahi', lat: 24.3745, lon: 88.6042 },
  { name: 'Khulna', lat: 22.8456, lon: 89.5403 },
  { name: 'Rangpur', lat: 25.7439, lon: 89.2752 },
];

export const BANGLADESH_DISTRICTS: LocationData[] = [
  { name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { name: 'Gazipur', lat: 23.9989, lon: 90.4264 },
  { name: 'Chittagong', lat: 22.3569, lon: 91.7832 },
  { name: 'Rajshahi', lat: 24.3745, lon: 88.6042 },
  { name: 'Khulna', lat: 22.8456, lon: 89.5403 },
  { name: 'Sylhet', lat: 24.8949, lon: 91.8687 },
  { name: 'Barisal', lat: 22.7010, lon: 90.3535 },
  { name: 'Rangpur', lat: 25.7439, lon: 89.2752 },
  { name: 'Mymensingh', lat: 24.7471, lon: 90.4203 },
  { name: 'Cumilla', lat: 23.4607, lon: 91.1809 },
  { name: 'Narayanganj', lat: 23.6238, lon: 90.5000 },
  { name: 'Tangail', lat: 24.2513, lon: 89.9167 },
  { name: 'Faridpur', lat: 23.6071, lon: 89.8429 },
  { name: 'Bogura', lat: 24.8481, lon: 89.3730 },
  { name: 'Kushtia', lat: 23.9013, lon: 89.1204 },
  { name: 'Jessore', lat: 23.1664, lon: 89.2100 },
  { name: 'Dinajpur', lat: 25.6217, lon: 88.6354 },
  { name: 'Noakhali', lat: 22.8696, lon: 91.0993 },
  { name: 'Feni', lat: 23.0159, lon: 91.3976 },
  { name: 'Brahmanbaria', lat: 23.9571, lon: 91.1167 },
  { name: 'Chandpur', lat: 23.2333, lon: 90.6500 },
  { name: 'Lakshmipur', lat: 22.9429, lon: 90.8411 },
  { name: 'Pabna', lat: 24.0064, lon: 89.2381 },
  { name: 'Sirajganj', lat: 24.4534, lon: 89.7077 },
  { name: 'Naogaon', lat: 24.8109, lon: 88.9414 },
  { name: 'Natore', lat: 24.4111, lon: 88.9911 },
  { name: 'Joypurhat', lat: 25.1011, lon: 89.0225 },
  { name: 'Chapai Nawabganj', lat: 24.5965, lon: 88.2707 },
  { name: 'Panchagarh', lat: 26.3333, lon: 88.5500 },
  { name: 'Thakurgaon', lat: 26.0333, lon: 88.4667 },
  { name: 'Nilphamari', lat: 25.9310, lon: 88.8560 },
  { name: 'Lalmonirhat', lat: 25.9167, lon: 89.4500 },
  { name: 'Kurigram', lat: 25.8054, lon: 89.6361 },
  { name: 'Gaibandha', lat: 25.3288, lon: 89.5422 },
  { name: 'Sherpur', lat: 25.0189, lon: 90.0175 },
  { name: 'Jamalpur', lat: 24.9197, lon: 89.9454 },
  { name: 'Netrokona', lat: 24.8705, lon: 90.7273 },
  { name: 'Kishoreganj', lat: 24.4449, lon: 90.7766 },
  { name: 'Manikganj', lat: 23.8644, lon: 90.0047 },
  { name: 'Munshiganj', lat: 23.5422, lon: 90.5305 },
  { name: 'Rajbari', lat: 23.7574, lon: 89.6444 },
  { name: 'Madaripur', lat: 23.1641, lon: 90.1896 },
  { name: 'Gopalganj', lat: 23.0059, lon: 89.8267 },
  { name: 'Shariatpur', lat: 23.2423, lon: 90.4348 },
  { name: 'Satkhira', lat: 22.7185, lon: 89.0710 },
  { name: 'Bagerhat', lat: 22.6516, lon: 89.7859 },
  { name: 'Narail', lat: 23.1725, lon: 89.5126 },
  { name: 'Magura', lat: 23.4875, lon: 89.4192 },
  { name: 'Meherpur', lat: 23.7622, lon: 88.6318 },
  { name: 'Chuadanga', lat: 23.6401, lon: 88.8418 },
  { name: 'Jhenaidah', lat: 23.5450, lon: 89.1726 },
  { name: 'Bhola', lat: 22.6859, lon: 90.6483 },
  { name: 'Patuakhali', lat: 22.3596, lon: 90.3297 },
  { name: 'Pirojpur', lat: 22.5841, lon: 89.9720 },
  { name: 'Jhalokati', lat: 22.6422, lon: 90.2003 },
  { name: 'Barguna', lat: 22.1591, lon: 90.1121 },
  { name: 'Cox\'s Bazar', lat: 21.4272, lon: 92.0058 },
  { name: 'Bandarban', lat: 22.1953, lon: 92.2184 },
  { name: 'Rangamati', lat: 22.6547, lon: 92.1747 },
  { name: 'Khagrachhari', lat: 23.1192, lon: 91.9841 },
  { name: 'Maulvibazar', lat: 24.4829, lon: 91.7476 },
  { name: 'Habiganj', lat: 24.3749, lon: 91.4133 },
  { name: 'Sunamganj', lat: 25.0658, lon: 91.3950 }
];

export const getWeatherType = (code: number): WeatherType => {
  if (code === 0) return WeatherType.Sunny;
  if ([1, 2, 3].includes(code)) return WeatherType.Cloudy;
  if ([45, 48].includes(code)) return WeatherType.Fog;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return WeatherType.Rain;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return WeatherType.Snow;
  if ([95, 96, 99].includes(code)) return WeatherType.Storm;
  return WeatherType.Sunny;
};

export const getWeatherGradient = (type: WeatherType): string => {
  switch (type) {
    case WeatherType.Sunny: return 'from-amber-100 to-sky-200';
    case WeatherType.Cloudy: return 'from-slate-200 to-blue-300';
    case WeatherType.Fog: return 'from-gray-300 to-zinc-400';
    case WeatherType.Rain: return 'from-blue-200 to-indigo-400';
    case WeatherType.Storm: return 'from-slate-700 to-indigo-900';
    default: return 'from-blue-50 to-sky-100';
  }
};

export const getWeatherEmoji = (type: WeatherType): string => {
  switch (type) {
    case WeatherType.Sunny: return '☀️';
    case WeatherType.Cloudy: return '☁️';
    case WeatherType.Fog: return '🌫️';
    case WeatherType.Rain: return '🌧️';
    case WeatherType.Storm: return '⛈️';
    default: return '⛅';
  }
};

export const WEEKDAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
