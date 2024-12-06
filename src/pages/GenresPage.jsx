import React, { useState } from 'react';
import { getStationsByGenre } from '../services/radioService';
import RadioCard from '../components/RadioCard';

export default function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [stations, setStations] = useState([]);

  const genres = [
    { name: 'Top 40 & Charts', tag: 'top 40' },
    { name: 'Pop', tag: 'pop' },
    { name: 'Rock', tag: 'rock' },
    { name: 'Sertanejo', tag: 'sertanejo' },
    { name: 'Bossa Nova', tag: 'bossa nova' },
    { name: 'Hip Hop', tag: 'hip hop' },
    { name: 'Reggaeton', tag: 'reggaeton' },
    { name: 'Kizomba', tag: 'kizomba' },
    { name: 'Música Cristã', tag: 'christian' },
    { name: 'Baladas', tag: 'dance' },
    { name: 'Funk', tag: 'funk' },
    { name: 'House', tag: 'house' },
    { name: 'Electro', tag: 'electronic' },
    { name: 'Alternativo', tag: 'alternative' },
    { name: 'Música latina', tag: 'latin' },
    { name: 'R&B', tag: 'rnb' },
    { name: 'Oldies', tag: 'oldies' },
    { name: 'Jazz', tag: 'jazz' },
    { name: 'Indie', tag: 'indie' },
    { name: 'Soul', tag: 'soul' },
    { name: 'Techno', tag: 'techno' },
    { name: 'Clássico', tag: 'classical' },
    { name: 'Anos 80', tag: '80s' },
    { name: 'Música tradicional', tag: 'traditional' },
    { name: 'World', tag: 'world' },
  ];

  const handleGenreClick = async (genre) => {
    setSelectedGenre(genre);
    try {
      const data = await getStationsByGenre(genre.tag);
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl text-white mb-6">Géneros musicais</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.tag}
            onClick={() => handleGenreClick(genre)}
            className={`p-4 rounded-lg text-left transition-colors ${
              selectedGenre?.tag === genre.tag
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {selectedGenre && (
        <div>
          <h3 className="text-xl text-white mb-6">
            Rádios de {selectedGenre.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stations.map((station, index) => (
              <RadioCard
                key={station.stationuuid}
                station={station}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}