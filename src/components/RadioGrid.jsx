import React, { useEffect, useState } from 'react';
import RadioCard from './RadioCard';
import { getTopStations } from '../services/radioService';

export default function RadioGrid() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para a busca
  const [filteredStations, setFilteredStations] = useState([]); // Estado para estações filtradas

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getTopStations();
        setStations(data);
        setFilteredStations(data); // Inicialmente, exibe todas as estações
      } catch (error) {
        console.error('Erro ao buscar estações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Filtra estações conforme o termo de busca
  useEffect(() => {
    const filtered = stations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStations(filtered);
  }, [searchQuery, stations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="text-white text-xl">Carregando estações...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Imagem no topo da página */}
      <div className="mb-6">
        <img
          src="https://s2.glbimg.com/Z4sqYVJ1cMYokTz2NoUnB7bOGsw=/s.glbimg.com/og/rg/f/original/2014/11/13/eswe.jpg" // Substitua pelo URL da imagem que você deseja
          alt="Imagem de topo"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Campo de busca fixo */}
      <div className="sticky top-0 bg-gray-900 z-50 py-4">
        <div className="flex items-center space-x-2 border-b border-gray-700 pb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar estações..."
            className="flex-grow bg-gray-800 text-white placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-500 p-2 rounded-md hover:bg-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.768-1.768L21 21z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de estações */}
      <h2 className="text-2xl text-white font-semibold mt-6 mb-4 text-center lg:text-left">
        Top 100 rádios
      </h2>
      {filteredStations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredStations.map((station, index) => (
            <RadioCard key={station.stationuuid} station={station} rank={index + 1} />
          ))}
        </div>
      ) : (
        <div className="text-white text-center mt-8">
          Nenhuma estação encontrada para "{searchQuery}".
        </div>
      )}
    </div>
  );
}
