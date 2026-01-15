import React, { useState, useEffect } from 'react';
import { 
  TruckIcon, 
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/solid';
import useRadioStore from '../store/radioStore';
import useVoiceControl from '../hooks/useVoiceControl';

const DriverMode = () => {
  const [isDriverMode, setIsDriverMode] = useState(false);
  const { currentStation, isPlaying, setIsPlaying, volume, setVolume, stations } = useRadioStore();
  const [isMuted, setIsMuted] = useState(false);
  const { isListening, isSupported, transcript, toggleListening, startListening } = useVoiceControl();

  // Detectar orientação do dispositivo
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.screen && window.screen.orientation) {
        const isLandscape = window.screen.orientation.angle === 90 || window.screen.orientation.angle === -90;
        if (isLandscape && window.innerWidth > 600) {
          console.log('📱 Dispositivo em modo paisagem - Modo motorista disponível');
        }
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  const toggleDriverMode = () => {
    setIsDriverMode(!isDriverMode);
    
    if (!isDriverMode) {
      document.body.style.backgroundColor = '#000';
      console.log('🚗 Modo motorista ativado');
      if (isSupported && !isListening) {
        startListening();
      }
    } else {
      document.body.style.backgroundColor = '';
      console.log('🚗 Modo motorista desativado');
    }
  };

  const handleNextStation = () => {
    if (!stations || stations.length === 0 || !currentStation) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === currentStation.stationuuid);
    const nextIndex = (currentIndex + 1) % stations.length;
    useRadioStore.getState().setCurrentStation(stations[nextIndex]);
    setIsPlaying(true);
  };

  const handlePreviousStation = () => {
    if (!stations || stations.length === 0 || !currentStation) return;
    const currentIndex = stations.findIndex(s => s.stationuuid === currentStation.stationuuid);
    const prevIndex = currentIndex === 0 ? stations.length - 1 : currentIndex - 1;
    useRadioStore.getState().setCurrentStation(stations[prevIndex]);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 50 : 0);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  if (!isDriverMode) {
    return (
      <button
        onClick={toggleDriverMode}
        className="fixed bottom-20 sm:bottom-6 right-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 animate-pulse"
        title="Ativar Modo Motorista"
      >
        <TruckIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50 flex flex-col overflow-hidden">
      {/* Header do modo motorista */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 p-4 sm:p-6 flex justify-between items-center border-b-2 border-blue-500 shadow-lg">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="bg-white/10 p-2 sm:p-3 rounded-full backdrop-blur-sm">
            <TruckIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Modo Motorista</h1>
            <p className="text-xs sm:text-sm text-blue-200">
              {isSupported ? '🎤 Controle por voz ativo' : '🎛️ Controle manual'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleDriverMode}
          className="bg-red-600 hover:bg-red-700 text-white p-2 sm:p-3 rounded-full transition-all transform hover:scale-110 shadow-lg"
          title="Sair do Modo Motorista"
        >
          <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Área principal */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 overflow-y-auto">
        {currentStation ? (
          <div className="text-center max-w-4xl w-full">
            {/* Logo da estação com efeito neon */}
            <div className="mb-6 sm:mb-8 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <img
                src={currentStation.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=1f2937&color=ffffff&size=300&format=png`}
                alt={currentStation.name}
                className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full object-cover shadow-2xl border-4 border-blue-500/50 relative z-10"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=1f2937&color=ffffff&size=300&format=png`;
                }}
              />
            </div>

            {/* Informações da estação */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 px-4">
              {currentStation.name}
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-2">
              {currentStation.country}
            </p>
            {currentStation.tags && (
              <p className="text-base sm:text-lg text-blue-300 mb-6 sm:mb-8">
                🎵 {currentStation.tags.split(',')[0]}
              </p>
            )}

            {/* Status de reprodução */}
            <div className="mb-6 sm:mb-8">
              {isPlaying ? (
                <div className="flex items-center justify-center space-x-3 text-green-400">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xl sm:text-2xl font-bold">AO VIVO</span>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <div className="text-gray-400 text-lg sm:text-xl">
                  ⏸️ Pausado
                </div>
              )}
            </div>

            {/* Controles grandes para toque */}
            <div className="flex justify-center items-center space-x-4 sm:space-x-8 mb-8 sm:mb-12">
              <button
                onClick={handlePreviousStation}
                className="bg-gray-700 hover:bg-gray-600 text-white p-4 sm:p-6 rounded-full transition-all transform hover:scale-110 shadow-lg"
                title="Estação Anterior"
              >
                <BackwardIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-6 sm:p-8 rounded-full transition-all transform hover:scale-110 shadow-2xl ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                } text-white`}
                title={isPlaying ? "Pausar" : "Tocar"}
              >
                {isPlaying ? (
                  <PauseIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                ) : (
                  <PlayIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                )}
              </button>
              
              <button
                onClick={handleNextStation}
                className="bg-gray-700 hover:bg-gray-600 text-white p-4 sm:p-6 rounded-full transition-all transform hover:scale-110 shadow-lg"
                title="Próxima Estação"
              >
                <ForwardIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>

            {/* Controle de volume */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <button 
                  onClick={toggleMute}
                  className="p-2 sm:p-3 hover:bg-gray-700 rounded-full transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <SpeakerXMarkIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  ) : (
                    <SpeakerWaveIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  )}
                </button>
                <input
                  type="range"
                  className="flex-1 h-2 accent-blue-500"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />
                <span className="text-white text-base sm:text-lg font-bold w-12 sm:w-16 text-right">
                  {volume}%
                </span>
              </div>
            </div>

            {/* Controle de voz */}
            {isSupported && (
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={toggleListening}
                  className={`p-6 sm:p-8 rounded-full transition-all transform hover:scale-110 shadow-2xl ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600'
                  } text-white`}
                  title={isListening ? "Parar escuta" : "Ativar comando de voz"}
                >
                  <span className="text-3xl sm:text-4xl">🎤</span>
                </button>
                <p className="text-white text-sm sm:text-base">
                  {isListening ? '🔴 Escutando...' : '⚪ Toque para falar'}
                </p>
                {transcript && (
                  <div className="bg-blue-900/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-500">
                    <p className="text-blue-200 text-xs sm:text-sm">
                      "{transcript}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl sm:text-8xl mb-6">📻</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Nenhuma estação selecionada
            </h2>
            <p className="text-base sm:text-xl text-gray-300 mb-8">
              {isSupported 
                ? 'Use o comando de voz "Sintonizar [nome da estação]" para começar' 
                : 'Selecione uma estação para começar a ouvir'
              }
            </p>
            {isSupported && (
              <button
                onClick={toggleListening}
                className={`p-6 sm:p-8 rounded-full transition-all transform hover:scale-110 shadow-2xl ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                } text-white`}
              >
                <span className="text-3xl sm:text-4xl">🎤</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Instruções de voz na parte inferior */}
      {isSupported && (
        <div className="bg-gray-900/95 backdrop-blur-sm p-3 sm:p-4 border-t border-gray-700">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-sm sm:text-lg font-bold text-white mb-2 sm:mb-3 text-center">
              🎤 Comandos de Voz Disponíveis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="text-center bg-gray-800/50 rounded-lg p-2">
                <span className="text-green-300 font-medium block mb-1">"Tocar"</span>
                <p className="text-gray-400 text-xs">Iniciar</p>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-2">
                <span className="text-green-300 font-medium block mb-1">"Pausar"</span>
                <p className="text-gray-400 text-xs">Pausar</p>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-2">
                <span className="text-green-300 font-medium block mb-1">"Próxima"</span>
                <p className="text-gray-400 text-xs">Avançar</p>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-2">
                <span className="text-green-300 font-medium block mb-1">"Anterior"</span>
                <p className="text-gray-400 text-xs">Voltar</p>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-2">
                <span className="text-green-300 font-medium block mb-1">"Mudar"</span>
                <p className="text-gray-400 text-xs">Aleatório</p>
              </div>
              <div className="text-center bg-gray-800/50 rounded-lg p-2">
                <span className="text-green-300 font-medium block mb-1">"Rock"</span>
                <p className="text-gray-400 text-xs">Gênero</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverMode;
