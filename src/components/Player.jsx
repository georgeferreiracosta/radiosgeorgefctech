import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import useRadioStore from "../store/radioStore";

export default function Player() {
  const audioRef = useRef(null);
  const { currentStation, isPlaying, volume, setIsPlaying, setVolume } =
    useRadioStore();
  const [isMuted, setIsMuted] = useState(false); // Estado para mute

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
  };

  if (!currentStation) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 border-b-4 border-green-500 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
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
                disabled={isMuted}
              />
            </div>
          </div>
        </div>
        <audio ref={audioRef} />
      </div>
    </div>
  );
}
