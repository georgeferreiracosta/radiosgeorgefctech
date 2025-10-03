import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import RadioCard from "./RadioCard";
import { getTopStations, getBrazilianStations, getRandomStations, searchStations } from "../services/radioService";
import useRadioStore from "../store/radioStore";

// Estações personalizadas para incluir sempre na lista
const customStations = [
  {
    stationuuid: 'custom-rliberda',
    name: 'Rádio Liberdade 96.3 FM',
    url: 'https://r14.ciclano.io/proxy/rliberda/stream?1759420076357',
    url_resolved: 'https://r14.ciclano.io/proxy/rliberda/stream?1759420076357',
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
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("top");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { setCurrentStation, setIsPlaying, setStations: setStationsInStore } = useRadioStore();

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
        const allStations = [...customStations, ...data];
        setStations(allStations);
        setFilteredStations(allStations);
        setStationsInStore(allStations);
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

  // Busca em tempo real
  useEffect(() => {
    const searchInRealTime = async () => {
      if (searchQuery.length > 2) {
        try {
          const results = await searchStations(searchQuery);
          setSearchResults(results.slice(0, 10));
          setShowSearchResults(true);
        } catch (error) {
          console.error("Erro ao buscar estações:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const timeoutId = setTimeout(searchInRealTime, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filtra estações localmente
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStations(stations);
      return;
    }

    const filtered = stations.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (station.tags && station.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (station.country && station.country.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredStations(filtered);
  }, [searchQuery, stations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStationSelect = (station) => {
    setCurrentStation(station);
    setIsPlaying(true);
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
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

  const getStationIcon = (station) => {
    if (station.favicon) {
      return station.favicon;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=1f2937&color=ffffff&size=40&format=png`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando estações...</div>
          <div className="text-gray-400 text-sm mt-2">Conectando aos servidores de rádio</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filtro Unificado - FIXO */}
      <div className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700 p-3 sm:p-4 sticky top-0 z-30">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            {/* Busca Unificada */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="🔍 Buscar por nome da rádio ou gênero musical..."
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}

              {/* Resultados da busca em tempo real */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-600 shadow-xl max-h-80 overflow-y-auto z-50">
                  <div className="p-2">
                    <div className="text-gray-400 text-xs uppercase tracking-wide px-3 py-2 border-b border-gray-700">
                      Resultados da Busca ({searchResults.length})
                    </div>
                    {searchResults.map((station) => (
                      <div
                        key={station.stationuuid || station.id}
                        onClick={() => handleStationSelect(station)}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                      >
                        <img
                          src={getStationIcon(station)}
                          alt={station.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=1f2937&color=ffffff&size=40&format=png`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate text-sm">{station.name}</h4>
                          <p className="text-gray-400 text-xs truncate">
                            {station.country || 'País não informado'} 
                            {station.tags && ` • ${station.tags.split(',')[0]}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Controles de Filtro e Visualização */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Filtro por categoria */}
              <div className="flex items-center space-x-2 flex-1 lg:flex-initial">
                <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hidden sm:block" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm flex-1 lg:flex-initial"
                >
                  <option value="top">🌍 Top Mundial</option>
                  <option value="brazil">🇧🇷 Brasil</option>
                  <option value="random">🎲 Aleatório</option>
                </select>
              </div>

              {/* Modo de visualização */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
                  title="Visualização em Grade"
                >
                  <Squares2X2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
                  title="Visualização em Lista"
                >
                  <ListBulletIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Título e contador */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {getFilterTitle()}
            </h2>
            <span className="text-gray-400 text-xs sm:text-sm">
              {filteredStations.length} estações
            </span>
          </div>
        </div>
      </div>

      {/* Lista de estações com SCROLL */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="container mx-auto">
          {filteredStations.length > 0 ? (
            <div className={`
              ${viewMode === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6" 
                : "space-y-3 sm:space-y-4"
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
      </div>
    </div>
  );
}
