import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import useRadioStore from "../store/radioStore";
import VoiceControl from "./VoiceControl";

export default function Player() {
  const audioRef = useRef(null);
  const { currentStation, isPlaying, volume, setIsPlaying, setVolume } =
    useRadioStore();
  const [isMuted, setIsMuted] = useState(false); // Estado para mute
  const [isTransparent, setIsTransparent] = useState(false); // Estado para transparência
  const [hideTimeout, setHideTimeout] = useState(null); // Timeout para ocultar controles

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
      audioRef.current.pause(); // Pausa antes de carregar a nova estação
      audioRef.current.src = currentStation.url_resolved;
      audioRef.current.load(); // Garante que a nova fonte será carregada
      if (isPlaying) {
        // Apenas tenta tocar se o estado for "playing"
        audioRef.current.addEventListener("canplay", playAudio);
      }
    }

    // Cleanup ao mudar de estação
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
      showControls(); // Mostrar controles ao interagir
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
    setIsMuted(false); // Desativa mute ao ajustar volume
    showControls(); // Mostrar controles ao interagir
  };

  // Função para mostrar controles e resetar timer
  const showControls = useCallback(() => {
    setIsTransparent(false);
    
    // Limpar timeout anterior
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Definir novo timeout para ocultar controles apenas se estiver tocando
    if (isPlaying) {
      const newTimeout = setTimeout(() => {
        setIsTransparent(true);
      }, 3000); // 3 segundos
      
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

  if (!currentStation) return null;

  return (
    <div 
      className={`fixed top-20 left-0 right-0 border-b-4 border-green-500 z-40 transition-all duration-300 ${
        isTransparent 
          ? 'bg-gray-800/30 backdrop-blur-sm' 
          : 'bg-gray-800'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => showControls()}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e nome da rádio */}
        <div className="flex items-center">
          <img
            src={
              currentStation.favicon ||
              "https://placehold.co/50x50/111827/FFFFFF/png?text=Radio"
            }
            alt="Station logo"
            className="w-12 h-12 rounded"
          />
          <div className="ml-4">
            <h3 className="text-white font-medium text-lg">
              {currentStation.name}
            </h3>
            <p className="text-gray-400 text-sm">{currentStation.country}</p>
          </div>
        </div>

        {/* Controles do player */}
        <div className="flex items-center space-x-4">
          {/* Equalizador dinâmico */}
          {isPlaying && (
            <img
              src="https://br.radio.net/assets/images/ani_equalizer_green.gif"
              alt="Equalizer"
              className="w-8 h-8"
            />
          )}

          {/* Botão Play/Pause */}
          <button
            onClick={togglePlay}
            className="bg-green-500 rounded-full p-3 hover:bg-green-600 transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6 text-white" />
            ) : (
              <PlayIcon className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Controle de Volume */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button onClick={toggleMute} className="p-2">
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-6 w-6 text-gray-400" />
                ) : (
                  <SpeakerWaveIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
              <input
                type="range"
                className="ml-2 w-24"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
            
            {/* Controle de Voz */}
            <VoiceControl />
          </div>
        </div>
      </div>
      <audio ref={audioRef}></audio>
    </div>
  );
}
