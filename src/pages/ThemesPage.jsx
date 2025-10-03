import React, { useState, useEffect } from "react";

export default function ThemesPage() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setIsHeaderCollapsed(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onScroll = (e) => {
    if (window.innerWidth >= 640) return;
    if (e.target.scrollTop > 20 && !isHeaderCollapsed) setIsHeaderCollapsed(true);
  };

  return (
    <div className="h-full flex flex-col">
      {!isHeaderCollapsed && (
        <div className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700 p-4 flex-shrink-0">
          <div className="container mx-auto">
            <h2 className="text-xl sm:text-2xl text-white font-bold">
              George Ferreira Costa - Desenvolvedor FullStack
            </h2>
          </div>
        </div>
      )}

      {isHeaderCollapsed && (
        <div className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur border-b border-gray-800 px-4 sm:px-6 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <span className="text-white text-sm font-semibold">Sobre / Temas</span>
            <button onClick={() => setIsHeaderCollapsed(false)} className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-500">Mostrar</button>
          </div>
        </div>
      )}

      <div onScroll={onScroll} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" style={{
        backgroundImage: "url(/path/to/your/image.jpg)",
        backgroundSize: "cover",
      }}>
        <div className="container mx-auto">
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-300 text-lg">
              <strong>Precisa transformar sua ideia em realidade?</strong> Conte
              comigo! Crio sites e aplicativos personalizados que entregam
              resultados. <a href="https://wa.me/5515992485695" className="text-blue-500 underline">Fale comigo agora!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
