import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
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
import FooterMobile from "./components/FooterMobile";
import DriverMode from "./components/DriverMode";

function App() {
  return (
    <Router basename="/radiosgeorgefctech">
      <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
        {/* TopBar com relógio, calendário e clima - FIXO */}
        <div className="flex-shrink-0">
          <TopBar />
        </div>
        
        {/* Player sempre fixo - FIXO */}
        <div className="flex-shrink-0 mt-[88px]">
          <Player />
        </div>

        {/* Header com logo - FIXO */}
        <div className="flex-shrink-0">
          <Header />
        </div>

        {/* Navegação - FIXO */}
        <div className="flex-shrink-0">
          <Navigation />
        </div>

        {/* Conteúdo principal com scroll APENAS na área de listagem */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<RadioGrid />} />
            <Route path="/podcast" element={<PodcastPage />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/nearby" element={<NearbyPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/themes" element={<ThemesPage />} />
          </Routes>
        </main>

        {/* Rodapé - FIXO */}
        <div className="flex-shrink-0 hidden md:block">
          <Footer />
        </div>
        <div className="flex-shrink-0 md:hidden">
          <FooterMobile />
        </div>
        
        {/* Modo Motorista */}
        <DriverMode />
      </div>
    </Router>
  );
}

export default App;
