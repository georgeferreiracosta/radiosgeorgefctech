import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import RadioCard from "./RadioCard";
import { getTopStations, getBrazilianStations, getRandomStations } from "../services/radioService";

// Estações personalizadas para incluir sempre na lista
const customStations = [
  {
    stationuuid: 'custom-rliberda',
    name: 'Rádio Liberdade 96.3 FM',
    url: 'https://r14.ciclano.io/proxy/rliberda/stream?1759420076357',
    homepage: '',
    favicon: '',
    country: 'Brasil',
    countrycode: 'BR',
    state: 'Pombal',
    language: 'portuguese',
    tags: 'pombal,liberdade,fm',
    votes: 0,
    codec: 'MP3',
    bitrate: 128,
    lastcheckok: true,
    lastchecktime: new Date().toISOString(),
    lastcheckoktime: new Date().toISOString(),
    clicktimestamp: new Date().toISOString(),
    clickcount: 0,
    clicktrend: 0
  }
];

export default function RadioGrid() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' ou 'list'
  const [filterType, setFilterType] = useState("top"); // 'top', 'brazil', 'random'

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        let data;
        switch (filterType) {
          case "brazil":
            data = await getBrazilianStations();
            break;
          case "random":
            data = await getRandomStations();
            break;
          default:
            data = await getTopStations();
        }
        setStations([...customStations, ...data]);
        setFilteredStations([...customStations, ...data]);
      } catch (error) {
        console.error("Erro ao buscar estações:", error);
        setStations(customStations);
        setFilteredStations(customStations);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [filterType]);

  // Filtra estações conforme o termo de busca
  useEffect(() => {
    const filtered = stations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (station.tags && station.tags.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredStations(filtered);
  }, [searchQuery, stations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getFilterTitle = () => {
    switch (filterType) {
      case "brazil":
        return "Rádios do Brasil";
      case "random":
        return "Descobrir Rádios";
      default:
        return "Top Rádios Mundiais";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando estações...</div>
          <div className="text-gray-400 text-sm mt-2">Conectando aos servidores de rádio</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎵 Rádios GeorgeFctéch
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Descubra e ouça milhares de estações de rádio de todo o mundo
          </p>
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar estações ou gêneros..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="top">Top Mundial</option>
                <option value="brazil">Brasil</option>
                <option value="random">Aleatório</option>
              </select>
            </div>

            {/* Modo de visualização */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Título da seção */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {getFilterTitle()}
        </h2>
        <span className="text-gray-400 text-sm">
          {filteredStations.length} estações encontradas
        </span>
      </div>

      {/* Grid de estações */}
      {filteredStations.length > 0 ? (
        <div className={`
          ${viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" 
            : "space-y-4"
          }
        `}>
          {filteredStations.map((station, index) => (
            <RadioCard
              key={station.stationuuid}
              station={station}
              rank={index + 1}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl text-white mb-2">Nenhuma estação encontrada</h3>
          <p className="text-gray-400">
            {searchQuery 
              ? `Não encontramos resultados para "${searchQuery}"`
              : "Tente ajustar os filtros ou buscar por outro termo"
            }
          </p>
        </div>
      )}
    </div>
  );
}
