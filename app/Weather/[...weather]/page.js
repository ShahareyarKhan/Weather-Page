"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WiHumidity } from "react-icons/wi";
import ClipLoader from "react-spinners/ClipLoader";
import { FaSearch } from 'react-icons/fa';

const WeatherPage = ({ params }) => {
  const city = params.weather[0];
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const API_KEY = process.env.API_KEY;
  const [loading, setLoading] = useState(false);
  const [forecastVisible, setForecastVisible] = useState(false); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError('Error fetching weather data');
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
      );
      setForecast(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching forecast data');
      console.error('Error fetching forecast data:', error);
    }
  };

  useEffect(() => {
    const fetchDataAndForecast = async () => {
      await fetchData();
      await fetchForecast();
    };
    fetchDataAndForecast();
  }, [city]); 

  const getNextFiveDaysForecast = () => {
    if (!forecast || !forecast.list) return [];

    const now = new Date();
    const nextFiveDays = [];
    for (let i = 1; i <= 5; i++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + i);
      const filteredForecast = forecast.list.filter(item => {
        const itemDate = new Date(item.dt * 1000);
        return (
          itemDate.getDate() === targetDate.getDate() &&
          itemDate.getMonth() === targetDate.getMonth() &&
          itemDate.getFullYear() === targetDate.getFullYear()
        );
      });
      if (filteredForecast.length > 0) {
        nextFiveDays.push(filteredForecast);
      }
    }
    return nextFiveDays;
  };

  const nextFiveDaysForecast = getNextFiveDaysForecast();

  return (
    <div className='bg-[#8ec6ff]'>
      {!forecastVisible && (
        <div className='relative w-4/5 max-w-[900px] mx-auto flex flex-col justify-center py-9'>
          <h1 className='text-center text-2xl md:text-3xl font-semibold p-9'>
            Weather
          </h1>
          <a
            href="/"
            className='text-center font-semibold md:text-md lg:text-xl border-2 border-black rounded-lg p-2 hover:bg-white cursor-pointer w-[200px] lg:w-[300px] mx-auto my-5 flex justify-around items-center'
          >
            Search <FaSearch />
          </a>
          {loading && (
            <div className='text-center'>
              <ClipLoader
                color="black"
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
          <div className="weather-display">
            {weatherData && (
              <div>
                <div className='flex justify-between gap-4'>
                  <div className='w-full max-w-[800px] mx-auto boxi flex flex-col items-center justify-around text-xl rounded-2xl p-3'>
                    <div>
                      <h2 className="text-3xl font-semibold text-center my-9">
                        {city}
                      </h2>
                    </div>
                    <div className='flex flex-col items-center'>
                      <div className='text-3xl font-bold'>
                        {Math.round(weatherData.main.temp - 273.15)} °C
                      </div>
                    </div>
                    <div className='text-center flex items-center gap-5'>
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                        alt={weatherData.weather[0].description}
                        width={50}
                        height={50}
                      />
                      <div className='font-semibold'>
                        {weatherData.weather[0].main}
                      </div>
                    </div>
                    <div className='w-full flex justify-around'>
                      <div className='flex flex-col items-center'>
                        <div className='font-semibold'>Min</div>
                        <div>
                          {Math.round(weatherData.main.temp_min - 273.15)} °C
                        </div>
                      </div>
                      <div className='flex flex-col items-center'>
                        <div className='font-semibold'>Feels</div>
                        <div>
                          {Math.round(weatherData.main.feels_like - 273.15)} °C
                        </div>
                      </div>
                      <div className='flex flex-col items-center'>
                        <div className='font-semibold'>Max</div>
                        <div>
                          {Math.round(weatherData.main.temp_max - 273.15)} °C
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-2 my-6 gap-5 max-w-[800px] mx-auto'>
                  <div className='flex justify-center flex-col items-center text-xl gap-3 rounded-2xl p-3 boxi'>
                    <div className='font-semibold'>Humidity</div>
                    <div>{weatherData.main.humidity} %</div>
                  </div>
                  <div className='flex justify-center flex-col items-center text-xl gap-3 rounded-2xl p-3 boxi'>
                    <div className='font-semibold'>Wind Speed</div>
                    <div>{weatherData.wind.speed} m/s</div>
                  </div>
                  <div className='flex justify-center flex-col items-center text-xl gap-3 rounded-2xl p-3 boxi'>
                    <div className='font-semibold'>Degree</div>
                    <div>{weatherData.wind.deg}°</div>
                  </div>
                  <div className='flex justify-center flex-col items-center text-xl gap-3 rounded-2xl p-3 boxi'>
                    <div className='font-semibold'>Pressure</div>
                    <div>{weatherData.main.pressure} hPa</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className='text-center font-semibold md:text-md lg:text-xl border-2 border-black rounded-lg p-2 hover:bg-blue-400 cursor-pointer w-[200px] lg:w-[300px] mx-auto'
            onClick={() => setForecastVisible(true)}
          >
            Check 5 days Forecast
          </div>
        </div>
      )}
      {forecastVisible && (
        <div className='py-9 mx-3'>
          <div className='text-2xl text-center font-semibold py-9'>
            5 days forecast weather {city}
          </div>
          {nextFiveDaysForecast &&
            nextFiveDaysForecast.map((dayForecast, index) => (
              <div
                key={index}
                className='bg-[#c2535325] max-w-[800px] mx-auto rounded-lg p-3 mb-5 border border-black'
              >
                <h2 className="text-center my-5 font-semibold mb-3 ">
                  {new Date(dayForecast[0].dt * 1000).toDateString()}
                </h2>
                <div className="flex justify-around mx-auto overflow-auto">
                  {dayForecast.map((item, subIndex) => (
                    <div key={subIndex} className="flex flex-col items-center xs">
                      <div className="text-center font-semibold text-xs">
                        {new Date(item.dt * 1000).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                        width={50}
                        height={50}
                      />
                      <div className='text-center font-bold'>
                        {Math.round(item.main.temp - 273.15)} °c
                      </div>
                      <div className='text-center text-sm flex items-center gap-1 justify-center'>
                        <WiHumidity />
                        {item.main.humidity}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {error && (
            <div className="text-red-500 text-center text-2xl font-semibold">
              {error}
            </div>
          )}
          <div
            className='text-center font-semibold md:text-md lg:text-xl border-2 border-black rounded-lg p-2 hover:bg-blue-400 cursor-pointer w-[200px] lg:w-[300px] mx-auto'
            onClick={() => setForecastVisible(false)}
          >
            Back to weather
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
