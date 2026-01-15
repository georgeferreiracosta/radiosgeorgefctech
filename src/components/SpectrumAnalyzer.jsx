import React, { useEffect, useRef, useState } from 'react';

export default function SpectrumAnalyzer({ audioRef, volume, isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!audioRef?.current || !canvasRef.current) return;

    // Criar contexto de áudio apenas uma vez
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 128; // Aumentado para melhor visualização
        analyserRef.current.smoothingTimeConstant = 0.7;
        analyserRef.current.minDecibels = -90;
        analyserRef.current.maxDecibels = -10;

        // Conectar fonte de áudio
        if (!sourceRef.current) {
          try {
            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
            setIsInitialized(true);
          } catch (error) {
            // Elemento já pode estar conectado
            console.log('Audio source already connected or error:', error.message);
          }
        }
      } catch (error) {
        console.error('Erro ao criar contexto de áudio:', error);
        return;
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      }

      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 10;
      const barWidth = (canvas.width / barCount) - 1;
      const gap = 1;

      for (let i = 0; i < barCount; i++) {
        let barHeight;
        
        if (isPlaying && analyser) {
          // Usar dados reais do áudio quando estiver tocando
          const dataIndex = Math.floor((i / barCount) * bufferLength);
          barHeight = (dataArray[dataIndex] / 255) * canvas.height;
          
          // Adicionar um mínimo de altura para visualização
          barHeight = Math.max(barHeight, (volume / 100) * canvas.height * 0.2);
        } else {
          // Animação simulada quando pausado
          const time = Date.now() / 1000;
          const wave = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.5;
          barHeight = (volume / 100) * canvas.height * 0.4 * wave;
        }

        const x = i * (barWidth + gap);
        const y = canvas.height - barHeight;

        // Definir cor baseada na altura (VU Meter style)
        let color;
        const heightPercent = (barHeight / canvas.height) * 100;
        
        if (heightPercent < 40) {
          // Verde para volumes baixos
          color = '#10b981'; // green-500
        } else if (heightPercent < 70) {
          // Amarelo para volumes médios
          color = '#fbbf24'; // yellow-400
        } else {
          // Vermelho para volumes altos
          color = '#ef4444'; // red-500
        }

        // Desenhar barra com gradiente
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, color + '60'); // Mais transparente no topo

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Adicionar brilho no topo
        if (barHeight > 3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(x, y, barWidth, 2);
        }

        // Adicionar reflexo na base
        if (isPlaying) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(x, canvas.height - 2, barWidth, 2);
        }
      }
    };

    // Retomar contexto de áudio se necessário
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        console.log('Audio context resumed');
      });
    }

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef, volume, isPlaying]);

  // Tentar retomar contexto quando o usuário interagir
  useEffect(() => {
    const resumeContext = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    document.addEventListener('click', resumeContext);
    document.addEventListener('touchstart', resumeContext);

    return () => {
      document.removeEventListener('click', resumeContext);
      document.removeEventListener('touchstart', resumeContext);
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={100}
        height={36}
        className="rounded bg-gray-900/50"
        style={{ imageRendering: 'crisp-edges' }}
      />
      {isPlaying && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
