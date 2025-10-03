import React from "react";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            🎵 Rádios GeorgeFctéch
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Descubra e ouça milhares de estações de rádio de todo o mundo
          </p>
        </div>
      </div>
    </header>
  );
}
