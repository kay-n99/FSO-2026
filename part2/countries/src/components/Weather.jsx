import { useState, useEffect } from "react";
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
import axios from "axios";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    console.log("fetching weather...");
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`,
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((err) => {
        console.error("fetch weather failed", err);
      });
  }, [capital]);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {weather.main.temp} C</p>
      <img
        src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
