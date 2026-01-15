import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import useRadioStore from "../store/radioStore";
import VoiceControl from "./VoiceControl";
import SpectrumAnalyzer from "./SpectrumAnalyzer";

export default function Player() {
  const audioRef = useRef(null);
  const { currentStation, isPlaying, volume, setIsPlaying, setVolume } =
    useRadioStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  // Função para tocar o áudio apenas quando estiver pronto
  const playAudio = useCallback(() => {
    if (audioRef.current && currentStation) {
      audioRef.current
        .play()
        .then(() => console.log("Reprodução iniciada com sucesso"))
        .catch((error) => console.error("Erro ao reproduzir o áudio:", error));
    }
  }, [currentStation]);

  // Atualiza a fonte do áudio quando a estação muda
  useEffect(() => {
    if (audioRef.current && currentStation) {
      audioRef.current.pause();
      audioRef.current.src = currentStation.url_resolved || currentStation.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.addEventListener("canplay", playAudio);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplay", playAudio);
      }
    };
  }, [currentStation, isPlaying, playAudio]);

  // Atualiza o volume e estado mute quando ele é alterado
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Alterna entre play e pause
  const togglePlay = () => {
    if (audioRef.current && currentStation) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Erro ao reproduzir o áudio:", error);
        });
      }
      setIsPlaying(!isPlaying);
      showControls();
    }
  };

  // Alterna mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Manipula a alteração do volume
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    setIsMuted(false);
    showControls();
  };

  // Função para mostrar controles e resetar timer
  const showControls = useCallback(() => {
    setIsTransparent(false);
    
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    if (isPlaying) {
      const newTimeout = setTimeout(() => {
        setIsTransparent(true);
      }, 3000);
      
      setHideTimeout(newTimeout);
    }
  }, [hideTimeout, isPlaying]);

  // Efeito para controlar transparência baseada no estado de reprodução
  useEffect(() => {
    if (isPlaying) {
      showControls();
    } else {
      setIsTransparent(false);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }
    }
    
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [isPlaying, showControls]);

  // Função para lidar com movimento do mouse
  const handleMouseMove = () => {
    if (isPlaying) {
      showControls();
    }
  };

  const renderEmptyBar = () => (
    <div className="bg-gray-800 border-b-2 border-gray-700">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-gray-700 flex items-center justify-center text-gray-300">📻</div>
            <div>
              <h3 className="text-white text-sm sm:text-base font-medium">Selecione uma estação</h3>
              <p className="text-gray-400 text-xs">Ou use comando de voz</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="sm:hidden">
              <VoiceControl />
            </div>
            <div className="hidden sm:block">
              <VoiceControl />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className={`bg-gray-800 border-b-2 border-green-500 transition-all duration-300 ${
        isTransparent 
          ? 'bg-opacity-30 backdrop-blur-sm' 
          : 'bg-opacity-100'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => showControls()}
    >
      {!currentStation && renderEmptyBar()}
      {currentStation && (
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo e nome da rádio */}
          <div className="flex items-center min-w-0 flex-1">
            <img
              src={
                currentStation.favicon ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=1f2937&color=ffffff&size=50&format=png`
              }
              alt="Station logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded flex-shrink-0"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}&background=1f2937&color=ffffff&size=50&format=png`;
              }}
            />
            <div className="ml-2 sm:ml-3 min-w-0 flex-1">
              <h3 className="text-white font-medium text-sm sm:text-base truncate">
                {currentStation.name}
              </h3>
              <p className="text-gray-400 text-xs truncate">{currentStation.country}</p>
            </div>
          </div>

          {/* Controles do player */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Botão Play/Pause */}
            <button
              onClick={togglePlay}
              className="bg-green-500 rounded-full p-2 sm:p-3 hover:bg-green-600 transition-colors flex-shrink-0"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              ) : (
                <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              )}
            </button>

            {/* Controle de Volume com Spectrum Analyzer */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Spectrum Analyzer */}
              <div className="bg-gray-900/50 rounded-lg p-2 border border-gray-700">
                <SpectrumAnalyzer 
                  audioRef={audioRef} 
                  volume={volume} 
                  isPlaying={isPlaying} 
                />
              </div>

              {/* Controles de volume */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleMute} 
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <input
                  type="range"
                  className="w-20 lg:w-24 accent-green-500"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />
                <span className="text-white text-sm font-medium w-8 text-right">
                  {volume}%
                </span>
              </div>
            </div>

            {/* Controle de volume mobile (simplificado) */}
            <div className="flex sm:hidden items-center gap-2">
              <button 
                onClick={toggleMute} 
                className="p-2"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            {/* Controle de Voz */}
            <div className="hidden lg:block">
              <VoiceControl />
            </div>
          </div>
        </div>

        {/* Barra de volume mobile (abaixo dos controles) */}
        <div className="sm:hidden mt-2 flex items-center gap-2">
          <SpectrumAnalyzer 
            audioRef={audioRef} 
            volume={volume} 
            isPlaying={isPlaying} 
          />
          <input
            type="range"
            className="flex-1 accent-green-500"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
          <span className="text-white text-xs font-medium w-8 text-right">
            {volume}%
          </span>
        </div>
      </div>
      )}
      <audio ref={audioRef} crossOrigin="anonymous"></audio>
    </div>
  );
}
