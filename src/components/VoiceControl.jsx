import React, { useState } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import useVoiceControl from '../hooks/useVoiceControl';

const VoiceControl = ({ className = "" }) => {
  const { 
    isListening, 
    isSupported, 
    transcript, 
    toggleListening 
  } = useVoiceControl();
  
  const [showCommands, setShowCommands] = useState(false);

  if (!isSupported) {
    return (
      <div className={`text-gray-400 text-sm ${className}`}>
        <span>🎤 Não suportado</span>
      </div>
    );
  }

  const commands = [
    { command: "Tocar / Pausar", description: "Controla a reprodução" },
    { command: "Próxima / Anterior", description: "Navega entre estações" },
    { command: "Mudar estação", description: "Troca para estação aleatória" },
    { command: "Sintonizar [nome]", description: "Busca estação específica" },
    { command: "Rock / Pop / Jazz", description: "Busca por gênero musical" }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Botão principal */}
      <button
        onClick={toggleListening}
        onMouseEnter={() => setShowCommands(true)}
        onMouseLeave={() => setShowCommands(false)}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
        `}
        title={isListening ? "Clique para parar" : "Clique para ativar comando de voz"}
      >
        {isListening ? (
          <StopIcon className="w-5 h-5" />
        ) : (
          <MicrophoneIcon className="w-5 h-5" />
        )}
        <span className="font-medium">
          {isListening ? 'Ouvindo...' : 'Comando de Voz'}
        </span>
      </button>

      {/* Indicador de transcrição */}
      {isListening && transcript && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 text-white p-2 rounded-lg shadow-lg z-50">
          <div className="text-xs text-gray-400 mb-1">Comando detectado:</div>
          <div className="text-sm font-medium">"{transcript}"</div>
        </div>
      )}

      {/* Lista de comandos */}
      {showCommands && !isListening && (
        <div className="absolute top-full left-0 mt-2 bg-gray-800 text-white p-4 rounded-lg shadow-xl z-50 min-w-80">
          <div className="text-sm font-bold text-blue-300 mb-3 flex items-center">
            🚗 Modo Motorista - Comandos de Voz
          </div>
          <div className="space-y-2">
            {commands.map((cmd, index) => (
              <div key={index} className="flex justify-between items-start">
                <span className="text-green-300 font-medium text-sm">
                  "{cmd.command}"
                </span>
                <span className="text-gray-400 text-xs ml-3 text-right">
                  {cmd.description}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
            💡 Mantenha o mouse sobre o botão para ver os comandos
          </div>
        </div>
      )}

      {/* Indicador visual quando está ouvindo */}
      {isListening && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default VoiceControl;
