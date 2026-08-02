import { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState();

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear sky';
    if (code < 3) return 'Partly cloudy';
    if (code < 5) return 'Cloudy';
    return 'Rainy';
  };

  const searchCity = async (city) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const data = await response.json();
    setSuggestion(data.results || []);
  };

  async function fetchWeather(lat, lon) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.log('Error aaya:', err);
      setError('Weather load nahi hosaka');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mx-5">
      <h1 className="text-3xl font-bold mb-5">Weather App</h1>

      <input className="rounded-lg shadow-md hover:shadow-xl p-2 mt-5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full max-w-md lg:w-1/2 md:w-1/2 sm:w-full"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchCity(e.target.value);
        }}
      />

      {suggestion.length > 0 && (
        <ul className="shadow-md border rounded-lg mt-2 max-h-60 overflow-y-auto w-full max-w-md lg:w-1/2 md:w-1/2 sm:w-full bg-white z-10 relative">
          {suggestion.map((city) => (
            <li className="border-b p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-300"
              key={city.id}
              onClick={() => {
                setSelectedCity(city);
                setSuggestion([]);
                setQuery('');
                fetchWeather(city.latitude, city.longitude);
              }}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-blue-500">Loading weather...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {weather && !loading && (
        <div>
          <h2 className="text-2xl font-bold">{selectedCity.name}</h2>
          <h3 className="text-xl">{weather.current.temperature_2m}°C</h3>
          <p className="text-gray-600">{getWeatherDescription(weather.current.weather_code)}</p>
          {weather.daily.time.map((date, i) => (
            <div key={date} className="border-b p-2">
              <p className="font-semibold">{date}</p>
              <p>Maximum: {weather.daily.temperature_2m_max[i]}°</p>
              <p>Minimum: {weather.daily.temperature_2m_min[i]}°</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default App;
