import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-green-500">Início</Link>
        </li>
        <li>
          <Link to="/podcast" className="text-white hover:text-green-500">Podcasts</Link>
        </li>
        <li>
          <Link to="/sports" className="text-white hover:text-green-500">Esportes</Link>
        </li>
        <li>
          <Link to="/nearby" className="text-white hover:text-green-500">Próximo</Link>
        </li>
        <li>
          <Link to="/genres" className="text-white hover:text-green-500">Gêneros</Link>
        </li>
        <li>
          <Link to="/themes" className="text-white hover:text-green-500">Contato</Link>
        </li>
      </ul>
    </nav>
  );
}
