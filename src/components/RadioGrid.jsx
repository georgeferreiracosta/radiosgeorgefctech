import React, { useEffect, useState } from 'react';
import RadioCard from './RadioCard';
import { getTopStations } from '../services/radioService';

export default function RadioGrid() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getTopStations();
        setStations(data);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-white">Loading stations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl text-white mb-6">Top 100 rádios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stations.map((station, index) => (
          <RadioCard key={station.stationuuid} station={station} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}