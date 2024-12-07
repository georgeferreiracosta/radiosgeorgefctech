import React from "react";
import { NavLink } from "react-router-dom";

export default function Navigation() {
  const navItems = [
    { title: "Top 100 rádios", path: "/" },
    { title: "Podcast", path: "/podcast", badge: "novo" },
    { title: "Desporto ao vivo", path: "/sports" },
    { title: "Perto de Ti", path: "/nearby" },
    { title: "Géneros musicais", path: "/genres" },
    { title: "Contato", path: "/themes" },
  ];

  return (
    <nav className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <ul className="flex flex-wrap items-center justify-center md:justify-start space-x-6">
          {navItems.map((item, index) => (
            <li key={index} className="relative">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 px-3 ${
                    isActive
                      ? "text-green-500 border-b-2 border-green-500"
                      : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {item.title}
                {item.badge && (
                  <span className="absolute -top-2 -right-6 bg-green-500 text-xs px-1 rounded">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
