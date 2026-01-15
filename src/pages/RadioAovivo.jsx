import React from 'react';

export default function RadioAovivo() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700 p-4 flex-shrink-0">
        <div className="container mx-auto">
          <h2 className="text-xl sm:text-2xl text-white font-bold">Rádio Ao Vivo</h2>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">Ouça as melhores rádios ao vivo.</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          src="https://radiogeorgefctechfm.netlify.app/"
          title="Rádio Ao Vivo"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}