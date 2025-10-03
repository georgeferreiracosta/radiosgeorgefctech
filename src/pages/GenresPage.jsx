import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getStationsByGenre } from '../services/radioService';
import RadioCard from '../components/RadioCard';
import useRadioStore from '../store/radioStore';

export default function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const { setStations: setStationsInStore } = useRadioStore();
  const scrollRef = useRef(null);

  const genres = [
    { name: 'Top 40 & Charts', tag: 'top 40', icon: '🎵' },
    { name: 'Pop', tag: 'pop', icon: '🎤' },
    { name: 'Rock', tag: 'rock', icon: '🎸' },
    { name: 'Sertanejo', tag: 'sertanejo', icon: '🤠' },
    { name: 'Bossa Nova', tag: 'bossa nova', icon: '🎺' },
    { name: 'Hip Hop', tag: 'hip hop', icon: '🎧' },
    { name: 'Reggaeton', tag: 'reggaeton', icon: '💃' },
    { name: 'Kizomba', tag: 'kizomba', icon: '🕺' },
    { name: 'Música Cristã', tag: 'christian', icon: '🙏' },
    { name: 'Dance', tag: 'dance', icon: '💫' },
    { name: 'Funk', tag: 'funk', icon: '🔥' },
    { name: 'House', tag: 'house', icon: '🏠' },
    { name: 'Electro', tag: 'electronic', icon: '⚡' },
    { name: 'Alternativo', tag: 'alternative', icon: '🎭' },
    { name: 'Música Latina', tag: 'latin', icon: '🌶️' },
    { name: 'R&B', tag: 'rnb', icon: '🎹' },
    { name: 'Oldies', tag: 'oldies', icon: '📻' },
    { name: 'Jazz', tag: 'jazz', icon: '🎷' },
    { name: 'Indie', tag: 'indie', icon: '🎨' },
    { name: 'Soul', tag: 'soul', icon: '💜' },
    { name: 'Techno', tag: 'techno', icon: '🤖' },
    { name: 'Clássico', tag: 'classical', icon: '🎻' },
    { name: 'Anos 80', tag: '80s', icon: '🕹️' },
    { name: 'Tradicional', tag: 'traditional', icon: '🎼' },
    { name: 'World', tag: 'world', icon: '🌍' },
  ];

  const handleGenreClick = async (genre) => {
    setSelectedGenre(genre);
    setLoading(true);
    setSearchQuery("");
    setCurrentPage(1);
    // Colapsa o cabeçalho em todas as telas para priorizar a grade
    setIsHeaderCollapsed(true);
    try {
      const data = await getStationsByGenre(genre.tag);
      setStations(data);
      setFilteredStations(data);
      setStationsInStore(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setStations([]);
      setFilteredStations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setFilteredStations(stations);
      setCurrentPage(1);
      return;
    }

    const filtered = stations.filter((station) =>
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      (station.tags && station.tags.toLowerCase().includes(query.toLowerCase())) ||
      (station.country && station.country.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredStations(filtered);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredStations(stations);
    setCurrentPage(1);
  };

  // Define quantidade de itens por página de forma responsiva
  useEffect(() => {
    const computeItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 400) return 12; // celulares pequenos: 2 colunas x 6 linhas
      if (width < 640) return 16; // celulares médios: 2 colunas x 8 linhas
      if (width < 1024) return 24; // tablets
      return 30; // desktop
    };
    const onResize = () => setItemsPerPage(computeItemsPerPage());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Colapsar cabeçalho automaticamente ao rolar (apenas mobile)
  const onScrollableAreaScroll = (e) => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 640) return; // só mobile
    const top = e.target.scrollTop;
    if (top > 20 && !isHeaderCollapsed) setIsHeaderCollapsed(true);
  };

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredStations.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = filteredStations.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const safe = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safe);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Seleção de Gêneros (colapsável em todas as telas) */}
      {!isHeaderCollapsed && (
        <div className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700 p-4 flex-shrink-0">
          <div className="container mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              🎵 Gêneros Musicais
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.tag}
                  onClick={() => handleGenreClick(genre)}
                  className={`p-3 rounded-lg text-left transition-all transform hover:scale-105 ${
                    selectedGenre?.tag === genre.tag
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{genre.icon}</span>
                    <span className="text-sm font-medium truncate">{genre.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtro de Busca - FIXO (aparece apenas quando um gênero é selecionado) */}
      {selectedGenre && !isHeaderCollapsed && (
        <div className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700 p-3 sm:p-4 flex-shrink-0">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Busca */}
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={`🔍 Buscar em ${selectedGenre.name}...`}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Modo de visualização */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
                  title="Visualização em Grade"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
                  title="Visualização em Lista"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Título e contador */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {selectedGenre.icon} {selectedGenre.name}
              </h3>
              <span className="text-gray-400 text-xs sm:text-sm">
                {filteredStations.length} estações
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Barra compacta para reabrir filtros (mobile) */}
      {selectedGenre && isHeaderCollapsed && (
        <div className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-white text-sm">
              {selectedGenre.icon} <span className="font-semibold">{selectedGenre.name}</span>
              <span className="text-gray-400 ml-2">{filteredStations.length} estações</span>
            </div>
            <button
              onClick={() => setIsHeaderCollapsed(false)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-500"
            >
              Filtro
            </button>
          </div>
        </div>
      )}

      {/* Lista de estações com SCROLL */}
      <div ref={scrollRef} onScroll={onScrollableAreaScroll} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="container mx-auto">
          {!selectedGenre ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl text-white mb-2">Selecione um Gênero Musical</h3>
              <p className="text-gray-400">
                Escolha um gênero acima para descobrir estações de rádio
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-white text-xl">Carregando estações de {selectedGenre.name}...</div>
            </div>
          ) : filteredStations.length > 0 ? (
            <div className={`
              ${viewMode === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6" 
                : "space-y-3 sm:space-y-4"
              }
            `}>
              {pageItems.map((station, index) => (
                <RadioCard
                  key={station.stationuuid}
                  station={station}
                  rank={startIndex + index + 1}
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
                  ? `Não encontramos resultados para "${searchQuery}" em ${selectedGenre.name}`
                  : `Não há estações disponíveis para ${selectedGenre.name}`
                }
              </p>
            </div>
          )}
          {/* Controles de Paginação */}
          {selectedGenre && filteredStations.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3 select-none">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md text-sm font-medium border border-gray-600 ${currentPage === 1 ? 'text-gray-500 bg-gray-800 cursor-not-allowed' : 'text-white bg-gray-700 hover:bg-gray-600'}`}
                aria-label="Primeira página"
              >
                «
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md text-sm font-medium border border-gray-600 ${currentPage === 1 ? 'text-gray-500 bg-gray-800 cursor-not-allowed' : 'text-white bg-gray-700 hover:bg-gray-600'}`}
                aria-label="Página anterior"
              >
                ‹
              </button>
              <span className="px-3 py-2 text-sm text-gray-300">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md text-sm font-medium border border-gray-600 ${currentPage === totalPages ? 'text-gray-500 bg-gray-800 cursor-not-allowed' : 'text-white bg-gray-700 hover:bg-gray-600'}`}
                aria-label="Próxima página"
              >
                ›
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md text-sm font-medium border border-gray-600 ${currentPage === totalPages ? 'text-gray-500 bg-gray-800 cursor-not-allowed' : 'text-white bg-gray-700 hover:bg-gray-600'}`}
                aria-label="Última página"
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
