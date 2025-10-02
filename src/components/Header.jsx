import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { searchStations } from "../services/radioService";
import useRadioStore from "../store/radioStore";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { setCurrentStation, setIsPlaying } = useRadioStore();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const results = await searchStations(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching stations:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleStationSelect = (station) => {
    setCurrentStation(station);
    setIsPlaying(true);
    setSearchResults([]);
    setSearchQuery("");
  };

  const getStationIcon = (station) => {
    if (station.favicon) {
      return station.favicon;
    }
    // Fallback para ícone gerado automaticamente
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=1f2937&color=ffffff&size=40&format=png`;
  };

  return (
    <header className="bg-gray-900 p-4 relative">
      <div className="flex items-center">
        <MagnifyingGlassIcon className="h-6 w-6 text-white" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Procurar estações, podcasts..."
          className="ml-2 w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Buscar estações de rádio"
        />
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-gray-800 rounded-lg border border-gray-600 shadow-xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-gray-400 text-xs uppercase tracking-wide px-3 py-2 border-b border-gray-700">
              Resultados da Busca ({searchResults.length})
            </div>
            {searchResults.slice(0, 10).map((station) => (
              <div
                key={station.stationuuid || station.id}
                onClick={() => handleStationSelect(station)}
                className="flex items-center space-x-3 p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
              >
                <img
                  src={getStationIcon(station)}
                  alt={station.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=1f2937&color=ffffff&size=40&format=png`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{station.name}</h4>
                  <p className="text-gray-400 text-sm truncate">
                    {station.country || 'País não informado'} 
                    {station.tags && ` • ${station.tags.split(',')[0]}`}
                  </p>
                </div>
                {station.countrycode && (
                  <span className="text-lg flex-shrink-0">
                    {getCountryFlag(station.countrycode)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// Função auxiliar para bandeiras de países
function getCountryFlag(countryCode) {
  const flagMap = {
    'BR': '🇧🇷', 'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
    'IT': '🇮🇹', 'ES': '🇪🇸', 'PT': '🇵🇹', 'AR': '🇦🇷', 'MX': '🇲🇽',
    'CA': '🇨🇦', 'AU': '🇦🇺', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳',
    'IN': '🇮🇳', 'RU': '🇷🇺', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭'
  };
  
  return flagMap[countryCode?.toUpperCase()] || '🌍';
}
