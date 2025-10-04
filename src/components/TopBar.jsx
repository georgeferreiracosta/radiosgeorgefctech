import React, { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon, CloudIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Carregando...');

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Buscar dados do clima e localização
  useEffect(() => {
    const fetchWeatherAndLocation = async () => {
      if (!navigator.geolocation) {
        setLoading(false);
        setCity('Geolocalização não suportada');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Buscar clima
          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Sao_Paulo`
            );

            if (response.ok) {
              const data = await response.json();
              setWeather(data.current_weather);
            }
          } catch (error) {
            console.error("Erro ao buscar dados do clima:", error);
          }

          // Geocodificação reversa para obter nome da cidade
          try {
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
            );

            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              const cityName = geoData.display_name ? geoData.display_name.split(',')[0] : 'Localização desconhecida';
              const country = geoData.address?.country || '';
              setCity(`${cityName}, ${country}`);
            } else {
              setCity('Localização indisponível');
            }
          } catch (error) {
            console.error("Erro na geocodificação reversa:", error);
            setCity('Localização indisponível');
          }

          setLoading(false);
        },
        (error) => {
          console.error("Erro na geolocalização:", error);
          setLoading(false);
          setCity('Localização indisponível');
        }
      );
    };

    fetchWeatherAndLocation();
    // Atualizar clima e localização a cada 30 minutos
    const weatherTimer = setInterval(fetchWeatherAndLocation, 30 * 60 * 1000);

    return () => clearInterval(weatherTimer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWeatherIcon = (weatherCode) => {
    // Códigos de clima do Open-Meteo
    if (weatherCode === 0) return "☀️"; // Céu limpo
    if (weatherCode <= 3) return "⛅"; // Parcialmente nublado
    if (weatherCode <= 67) return "🌧️"; // Chuva
    if (weatherCode <= 77) return "🌨️"; // Neve
    if (weatherCode <= 82) return "🌦️"; // Chuviscos
    if (weatherCode <= 99) return "⛈️"; // Tempestade
    return "🌤️"; // Padrão
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Relógio */}
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-6 w-6 text-blue-300" />
            <div>
              <div className="text-2xl font-bold font-mono">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-blue-200">
                Horário Local
              </div>
            </div>
          </div>

          {/* Calendário */}
          <div className="flex items-center justify-center space-x-3">
            <CalendarIcon className="h-6 w-6 text-purple-300" />
            <div className="text-center">
              <div className="text-lg font-semibold">
                {formatDate(currentTime)}
              </div>
              <div className="text-sm text-purple-200">
                Data Atual
              </div>
            </div>
          </div>

          {/* Clima */}
          <div
            className="flex items-center justify-end space-x-3 cursor-pointer"
            onClick={() => window.open('https://www.msn.com/pt-br/clima/forecast/in-Boituva,S%C3%A3o-Paulo?loc=eyJsIjoiQm9pdHV2YSIsInIiOiJTw6NvIFBhdWxvIiwiYyI6IkJyYXNpbCIsImkiOiJCUiIsImciOiJwdC1iciIsIngiOiItNDcuNjg3NSIsInkiOiItMjMuMjkxMDk5NTQ4MzM5ODQ0In0%3D&weadegreetype=C&ocid=msnheader&cvid=68e05b6cffa54523884c89429435b04f', '_blank')}
          >
            <CloudIcon className="h-6 w-6 text-indigo-300" />
            <div className="text-right">
              {loading ? (
                <div className="text-lg">Carregando...</div>
              ) : weather ? (
                <>
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-2xl">
                      {getWeatherIcon(weather.weathercode)}
                    </span>
                    <span className="text-xl font-bold">
                      {Math.round(weather.temperature)}°C
                    </span>
                  </div>
                  <div className="text-sm text-indigo-200">
                    {city}
                  </div>
                </>
              ) : (
                <div className="text-lg text-red-300">
                  Clima indisponível
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

