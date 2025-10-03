import React, { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon, CloudIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Buscar dados do clima
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Usando Open-Meteo API (gratuita, sem necessidade de chave)
        // Coordenadas padrão para São Paulo, Brasil
        const lat = -23.5505;
        const lon = -46.6333;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Sao_Paulo`
        );
        
        if (response.ok) {
          const data = await response.json();
          setWeather(data.current_weather);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do clima:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Atualizar clima a cada 30 minutos
    const weatherTimer = setInterval(fetchWeather, 30 * 60 * 1000);
    
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
          <div className="flex items-center justify-end space-x-3">
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
                    São Paulo, BR
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

