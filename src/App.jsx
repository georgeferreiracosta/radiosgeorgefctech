import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import RadioGrid from "./components/RadioGrid";
import Player from "./components/Player";
import RadioAovivo from "./pages/RadioAovivo";
import NearbyPage from "./pages/NearbyPage";
import GenresPage from "./pages/GenresPage";
import ContactPage from "./pages/ContactPage";
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
        
        {/* Player fixo logo abaixo da TopBar */}
        <div className="fixed left-0 right-0 z-40" style={{ top: 88 }}>
          <Player />
        </div>
        {/* Espaçador para não sobrepor o conteúdo */}
        <div className="flex-shrink-0" style={{ height: 76 }}></div>

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
            <Route path="/radio-aovivo" element={<RadioAovivo />} />
            <Route path="/nearby" element={<NearbyPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
