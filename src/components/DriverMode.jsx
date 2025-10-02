import React, { useState, useEffect } from 'react';
import { 
  TruckIcon, 
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon
} from '@heroicons/react/24/solid';
import useRadioStore from '../store/radioStore';
import VoiceControl from './VoiceControl';

const DriverMode = () => {
  const [isDriverMode, setIsDriverMode] = useState(false);
  const { currentStation, isPlaying, setIsPlaying } = useRadioStore();

  // Detectar se está em tela cheia ou modo paisagem (indicativo de uso no carro)
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.screen && window.screen.orientation) {
        const isLandscape = window.screen.orientation.angle === 90 || window.screen.orientation.angle === -90;
        if (isLandscape && window.innerWidth > 600) {
          // Sugerir modo motorista em dispositivos em paisagem
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
      // Entrar no modo motorista
      document.body.style.backgroundColor = '#000';
      console.log('🚗 Modo motorista ativado');
    } else {
      // Sair do modo motorista
      document.body.style.backgroundColor = '';
      console.log('🚗 Modo motorista desativado');
    }
  };

  if (!isDriverMode) {
    return (
      <button
        onClick={toggleDriverMode}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
        title="Ativar Modo Motorista"
      >
        <TruckIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header do modo motorista */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <TruckIcon className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Modo Motorista</h1>
            <p className="text-blue-200">Controle por voz ativado</p>
          </div>
        </div>
        <button
          onClick={toggleDriverMode}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
          title="Sair do Modo Motorista"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Área principal */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        {currentStation ? (
          <div className="text-center max-w-2xl">
            {/* Logo da estação */}
            <div className="mb-8">
              <img
                src={currentStation.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=1f2937&color=ffffff&size=200&format=png`}
                alt={currentStation.name}
                className="w-48 h-48 mx-auto rounded-full object-cover shadow-2xl"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=1f2937&color=ffffff&size=200&format=png`;
                }}
              />
            </div>

            {/* Informações da estação */}
            <h2 className="text-4xl font-bold text-white mb-2">
              {currentStation.name}
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              {currentStation.country}
            </p>
            {currentStation.tags && (
              <p className="text-lg text-blue-300 mb-8">
                {currentStation.tags.split(',')[0]}
              </p>
            )}

            {/* Status de reprodução */}
            <div className="mb-8">
              {isPlaying ? (
                <div className="flex items-center justify-center space-x-3 text-green-400">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold">AO VIVO</span>
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <div className="text-gray-400 text-xl">
                  Pausado
                </div>
              )}
            </div>

            {/* Controles grandes para toque */}
            <div className="flex justify-center space-x-8 mb-12">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-full transition-colors"
                title="Estação Anterior"
              >
                <BackwardIcon className="w-8 h-8" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-8 rounded-full transition-colors ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
                title={isPlaying ? "Pausar" : "Tocar"}
              >
                {isPlaying ? (
                  <PauseIcon className="w-12 h-12" />
                ) : (
                  <PlayIcon className="w-12 h-12" />
                )}
              </button>
              
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-full transition-colors"
                title="Próxima Estação"
              >
                <ForwardIcon className="w-8 h-8" />
              </button>
            </div>

            {/* Controle de voz */}
            <div className="flex justify-center">
              <VoiceControl className="scale-125" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Nenhuma estação selecionada
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Use o comando de voz "Sintonizar [nome da estação]" para começar
            </p>
            <VoiceControl className="scale-125" />
          </div>
        )}
      </div>

      {/* Instruções de voz na parte inferior */}
      <div className="bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-3 text-center">
            🎤 Comandos de Voz Disponíveis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <span className="text-green-300 font-medium">"Tocar"</span>
              <p className="text-gray-400">Iniciar reprodução</p>
            </div>
            <div className="text-center">
              <span className="text-green-300 font-medium">"Pausar"</span>
              <p className="text-gray-400">Pausar reprodução</p>
            </div>
            <div className="text-center">
              <span className="text-green-300 font-medium">"Próxima"</span>
              <p className="text-gray-400">Próxima estação</p>
            </div>
            <div className="text-center">
              <span className="text-green-300 font-medium">"Anterior"</span>
              <p className="text-gray-400">Estação anterior</p>
            </div>
            <div className="text-center">
              <span className="text-green-300 font-medium">"Mudar estação"</span>
              <p className="text-gray-400">Estação aleatória</p>
            </div>
            <div className="text-center">
              <span className="text-green-300 font-medium">"Rock / Pop / Jazz"</span>
              <p className="text-gray-400">Buscar por gênero</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverMode;
