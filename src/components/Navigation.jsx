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
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500">YouTube</a>
        </li>
        <li>
          <a href="https://g1.globo.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500">G1</a>
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
