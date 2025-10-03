import React, { useState } from 'react';
import { PlayIcon, PauseIcon, SignalIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import useRadioStore from '../store/radioStore';

export default function RadioCard({ station, rank, viewMode = 'grid' }) {
  const { currentStation, isPlaying, setCurrentStation, setIsPlaying } = useRadioStore();
  const [imageError, setImageError] = useState(false);
  
  const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
  const isCurrentlyPlaying = isCurrentStation && isPlaying;

  const handlePlay = () => {
    if (isCurrentStation) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getStationImage = () => {
    if (imageError || !station.favicon) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=1f2937&color=ffffff&size=200&format=png`;
    }
    return station.favicon;
  };

  const formatBitrate = (bitrate) => {
    return bitrate ? `${bitrate} kbps` : 'N/A';
  };

  if (viewMode === 'list') {
    return (
      <div className={`
        group bg-gradient-to-r from-gray-800 to-gray-900 
        rounded-xl p-4 border border-gray-700 hover:border-blue-500/50
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:shadow-blue-500/20
        ${isCurrentlyPlaying ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''}
      `}>
        <div className="flex items-center space-x-4">
          {/* Ranking */}
          <div className="flex-shrink-0">
            <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              #{rank}
            </span>
          </div>

          {/* Imagem */}
          <div className="flex-shrink-0 relative">
            <img
              src={getStationImage()}
              alt={station.name}
              onError={handleImageError}
              className="w-12 h-12 object-cover rounded-lg"
            />
            {isCurrentlyPlaying && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Informações */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate group-hover:text-blue-300 transition-colors">
              {station.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
              <div className="flex items-center space-x-1">
                <GlobeAltIcon className="h-4 w-4" />
                <span>{station.country || 'N/A'}</span>
              </div>
              <span>{formatBitrate(station.bitrate)}</span>
              {isCurrentlyPlaying && (
                <span className="text-green-400 font-medium">AO VIVO</span>
              )}
            </div>
            {station.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {station.tags.split(',').slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botão de play */}
          <div className="flex-shrink-0">
            <button
              onClick={handlePlay}
              className={`
                rounded-full p-3 transition-all duration-200
                ${isCurrentlyPlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }
                transform hover:scale-110 shadow-lg
              `}
            >
              {isCurrentlyPlaying ? (
                <PauseIcon className="h-6 w-6 text-white" />
              ) : (
                <PlayIcon className="h-6 w-6 text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className={`
        bg-gradient-to-br from-gray-800 to-gray-900 
        rounded-xl overflow-hidden 
        transition-all duration-300 ease-in-out
        hover:shadow-2xl hover:shadow-blue-500/20
        border border-gray-700 hover:border-blue-500/50
        ${isCurrentlyPlaying ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''}
        transform hover:scale-[1.02]
      `}>
        {/* Header com ranking */}
        <div className="flex items-center justify-between p-3 bg-gray-900/50">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              #{rank}
            </span>
            {isCurrentlyPlaying && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">AO VIVO</span>
              </div>
            )}
          </div>
          <SignalIcon className="h-4 w-4 text-gray-400" />
        </div>

        {/* Imagem da estação */}
        <div className="relative aspect-square bg-gray-700">
          <img
            src={getStationImage()}
            alt={station.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay com botão de play */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className={`
                rounded-full p-4 transition-all duration-200
                ${isCurrentlyPlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }
                transform hover:scale-110 shadow-lg
              `}
            >
              {isCurrentlyPlaying ? (
                <PauseIcon className="h-8 w-8 text-white" />
              ) : (
                <PlayIcon className="h-8 w-8 text-white ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Informações da estação */}
        <div className="p-4 space-y-2">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
            {station.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <GlobeAltIcon className="h-3 w-3" />
              <span>{station.country || 'N/A'}</span>
            </div>
            <span className="bg-gray-700 px-2 py-1 rounded">
              {formatBitrate(station.bitrate)}
            </span>
          </div>

          {station.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {station.tags.split(',').slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
