import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import RadioGrid from "./components/RadioGrid";
import Player from "./components/Player";
import PodcastPage from "./pages/PodcastPage";
import SportsPage from "./pages/SportsPage";
import NearbyPage from "./pages/NearbyPage";
import GenresPage from "./pages/GenresPage";
import ThemesPage from "./pages/ThemesPage";
import Footer from "./components/Footer";
import FooterMobile from "./components/FooterMobile"; // Certifique-se de usar o caminho correto.

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900">
        {/* Player sempre fixo no topo */}
        <Player />

        {/* Conteúdo principal */}
        <div className="flex-grow pt-32 px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho */}
          <Header />

          {/* Navegação */}
          <Navigation />

          {/* Rotas principais */}
          <main className="pb-20">
            <Routes>
              <Route path="/" element={<RadioGrid />} />
              <Route path="/podcast" element={<PodcastPage />} />
              <Route path="/sports" element={<SportsPage />} />
              <Route path="/nearby" element={<NearbyPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/themes" element={<ThemesPage />} />
            </Routes>
          </main>
        </div>

        {/* Rodapé */}
        <Footer />
        <FooterMobile />
      </div>
    </Router>
  );
}

export default App;
