import React from "react";

export default function ThemesPage() {
  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: "url(/path/to/your/image.jpg)",
        backgroundSize: "cover",
      }}
    >
      <h2 className="text-2xl text-white mb-6">
        George Ferreira Costa - Desenvolvedor FullStack
      </h2>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-300 text-lg">
          <strong>Precisa transformar sua ideia em realidade?</strong> Conte
          comigo! Crio sites e aplicativos personalizados que entregam
          resultados.
          <a
            href="https://wa.me/5515992485695"
            className="text-blue-500 underline"
          >
            Fale comigo agora!
          </a>
        </p>
      </div>
    </div>
  );
}
