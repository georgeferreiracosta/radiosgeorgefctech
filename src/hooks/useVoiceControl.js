import { useState, useEffect, useCallback } from 'react';
import useRadioStore from '../store/radioStore';

const useVoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  
  const { 
    currentStation, 
    isPlaying, 
    setCurrentStation, 
    setIsPlaying,
    stations 
  } = useRadioStore();

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'pt-BR';
      recognitionInstance.maxAlternatives = 1;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('🎤 Reconhecimento de voz iniciado');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        console.log('🎤 Reconhecimento de voz finalizado');
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('❌ Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript.toLowerCase().trim();
          setTranscript(command);
          processVoiceCommand(command);
        }
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      console.warn('⚠️ Reconhecimento de voz não suportado neste navegador');
      setIsSupported(false);
    }
  }, []);

  // Processar comandos de voz
  const processVoiceCommand = useCallback((command) => {
    console.log('🗣️ Comando recebido:', command);
    
    // Comandos de controle básico
    if (command.includes('tocar') || command.includes('play') || command.includes('reproduzir')) {
      if (currentStation && !isPlaying) {
        setIsPlaying(true);
        console.log('▶️ Reprodução iniciada por comando de voz');
      }
      return;
    }
    
    if (command.includes('pausar') || command.includes('pause') || command.includes('parar')) {
      if (isPlaying) {
        setIsPlaying(false);
        console.log('⏸️ Reprodução pausada por comando de voz');
      }
      return;
    }
    
    // Comandos de navegação entre estações
    if (command.includes('próxima') || command.includes('próximo') || command.includes('avançar')) {
      changeToNextStation();
      return;
    }
    
    if (command.includes('anterior') || command.includes('voltar')) {
      changeToPreviousStation();
      return;
    }
    
    // Comando para mudar estação
    if (command.includes('mudar') || command.includes('trocar') || command.includes('estação')) {
      changeToRandomStation();
      return;
    }
    
    // Busca por nome da estação
    if (command.includes('sintonizar') || command.includes('buscar') || command.includes('encontrar')) {
      const stationName = extractStationName(command);
      if (stationName) {
        findAndPlayStation(stationName);
      }
      return;
    }

    // Caso o usuário apenas diga o nome da estação (ex.: "Antena 1")
    if (!['tocar','play','reproduzir','pausar','pause','parar','próxima','próximo','avançar','anterior','voltar','mudar','trocar','estação'].some(k => command.includes(k))) {
      if (command && command.length >= 2) {
        findAndPlayStation(command);
        return;
      }
    }
    
    // Comandos de gênero musical
    const genres = ['rock', 'pop', 'jazz', 'clássica', 'eletrônica', 'sertanejo', 'funk', 'rap'];
    const foundGenre = genres.find(genre => command.includes(genre));
    if (foundGenre) {
      findStationByGenre(foundGenre);
      return;
    }
    
    console.log('❓ Comando não reconhecido:', command);
  }, [currentStation, isPlaying, setIsPlaying, setCurrentStation, stations]);

  // Extrair nome da estação do comando
  const extractStationName = (command) => {
    const patterns = [
      /sintonizar (.+)/,
      /buscar (.+)/,
      /encontrar (.+)/,
      /tocar (.+)/,
      /estação (.+)/
    ];
    
    for (const pattern of patterns) {
      const match = command.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  };

  // Encontrar e tocar estação por nome
  const findAndPlayStation = useCallback((stationName) => {
    if (!stations || stations.length === 0) return;
    
    const foundStation = stations.find(station => 
      station.name.toLowerCase().includes(stationName.toLowerCase())
    );
    
    if (foundStation) {
      setCurrentStation(foundStation);
      setIsPlaying(true);
      console.log(`📻 Sintonizando: ${foundStation.name}`);
    } else {
      console.log(`❌ Estação não encontrada: ${stationName}`);
    }
  }, [stations, setCurrentStation, setIsPlaying]);

  // Encontrar estação por gênero
  const findStationByGenre = useCallback((genre) => {
    if (!stations || stations.length === 0) return;
    
    const stationsWithGenre = stations.filter(station => 
      station.tags && station.tags.toLowerCase().includes(genre.toLowerCase())
    );
    
    if (stationsWithGenre.length > 0) {
      const randomStation = stationsWithGenre[Math.floor(Math.random() * stationsWithGenre.length)];
      setCurrentStation(randomStation);
      setIsPlaying(true);
      console.log(`🎵 Tocando ${genre}: ${randomStation.name}`);
    } else {
      console.log(`❌ Nenhuma estação de ${genre} encontrada`);
    }
  }, [stations, setCurrentStation, setIsPlaying]);

  // Mudar para próxima estação
  const changeToNextStation = useCallback(() => {
    if (!stations || stations.length === 0 || !currentStation) return;
    
    const currentIndex = stations.findIndex(s => s.stationuuid === currentStation.stationuuid);
    const nextIndex = (currentIndex + 1) % stations.length;
    const nextStation = stations[nextIndex];
    
    setCurrentStation(nextStation);
    setIsPlaying(true);
    console.log(`⏭️ Próxima estação: ${nextStation.name}`);
  }, [stations, currentStation, setCurrentStation, setIsPlaying]);

  // Mudar para estação anterior
  const changeToPreviousStation = useCallback(() => {
    if (!stations || stations.length === 0 || !currentStation) return;
    
    const currentIndex = stations.findIndex(s => s.stationuuid === currentStation.stationuuid);
    const prevIndex = currentIndex === 0 ? stations.length - 1 : currentIndex - 1;
    const prevStation = stations[prevIndex];
    
    setCurrentStation(prevStation);
    setIsPlaying(true);
    console.log(`⏮️ Estação anterior: ${prevStation.name}`);
  }, [stations, currentStation, setCurrentStation, setIsPlaying]);

  // Mudar para estação aleatória
  const changeToRandomStation = useCallback(() => {
    if (!stations || stations.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * stations.length);
    const randomStation = stations[randomIndex];
    
    setCurrentStation(randomStation);
    setIsPlaying(true);
    console.log(`🔀 Estação aleatória: ${randomStation.name}`);
  }, [stations, setCurrentStation, setIsPlaying]);

  // Iniciar reconhecimento
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento:', error);
      }
    }
  }, [recognition, isListening]);

  // Parar reconhecimento
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  // Toggle reconhecimento
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening
  };
};

export default useVoiceControl;
