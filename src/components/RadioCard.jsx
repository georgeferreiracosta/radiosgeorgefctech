import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import useRadioStore from '../store/radioStore';

export default function RadioCard({ station, rank }) {
  const { setCurrentStation, setIsPlaying } = useRadioStore();

  const handlePlay = () => {
    setCurrentStation(station);
    setIsPlaying(true);
  };

  return (
    <div className="relative group">
      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-200 group-hover:scale-105">
        <div className="relative">
          <img
            src={station.favicon || `https://placehold.co/400x400/111827/FFFFFF/png?text=${station.name}`}
            alt={station.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity">
            <button
              onClick={handlePlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <PlayIcon className="h-8 w-8 text-white" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <span className="text-green-500 font-bold">{rank}</span>
          <h3 className="text-white font-semibold mt-2">{station.name}</h3>
          <p className="text-gray-400 text-sm">{station.country}</p>
        </div>
      </div>
    </div>
  );
}