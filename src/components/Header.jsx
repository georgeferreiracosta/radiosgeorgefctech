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

  return (
    <header className="bg-gray-900 p-4">
      <div className="flex items-center">
        <MagnifyingGlassIcon className="h-6 w-6 text-white" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Procurar estações, podcasts..."
          className="ml-2 w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          aria-label="Buscar estações de rádio"
        />
      </div>
      {searchResults.length > 0 && (
        <ul className="mt-2 bg-gray-700 rounded-lg">
          {searchResults.map((station) => (
            <li key={station.id} className="p-2 hover:bg-gray-600 cursor-pointer" onClick={() => {
              setCurrentStation(station);
              setIsPlaying(true);
            }}>
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
