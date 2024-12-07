import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { searchStations } from "../services/radioService";
import useRadioStore from "../store/radioStore";
import { Link } from "react-router-dom";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setCurrentStation, setIsPlaying } = useRadioStore();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchStations(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Erro ao buscar estações:", error);
      }
      setIsSearching(false);
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

  return (
    <header className="bg-gray-900 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto p-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        {/* Logo */}
        <Link
          to="/"
          className="text-green-500 text-2xl font-bold text-center sm:text-left"
        >
          Radios GeorgeFctech!
        </Link>

        {/* Campo de busca */}
        <div className="relative flex-1 max-w-3xl">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Procurar estações, podcasts..."
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <MagnifyingGlassIcon className="h-6 w-6 absolute right-3 top-2 text-gray-500" />
          </div>

          {/* Resultados da busca */}
          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {searchResults.map((station) => (
                <button
                  key={station.stationuuid}
                  onClick={() => handleStationSelect(station)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        station.favicon ||
                        "https://placehold.co/40x40/111827/FFFFFF/png?text=Radio"
                      }
                      alt={station.name}
                      className="w-10 h-10 rounded mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {station.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {station.tags}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
