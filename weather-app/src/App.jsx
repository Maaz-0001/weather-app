import { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState();

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
    <div>
      <h1 className="">Weather App</h1>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchCity(e.target.value);
        }}
      />

      {suggestion.length > 0 && (
        <ul>
          {suggestion.map((city) => (
            <li
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

      {loading && <p>Loading weather...</p>}

      {error && <p>{error}</p>}

      {weather && !loading && (
        <div>
          <h2>{selectedCity.name}</h2>
          <h3>{weather.current.temperature_2m}°C</h3>
          {weather.daily.time.map((date, i) => (
            <div key={date}>
              <p>{date}</p>
              <p>Maximum{weather.daily.temperature_2m_max[i]}°</p>
              <p>Minimum{weather.daily.temperature_2m_min[i]}°</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default App;
