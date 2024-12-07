import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 hidden md:block">
      <div className="container mx-auto text-center">
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaFacebookF className="w-6 h-6" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaTwitter className="w-6 h-6" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaLinkedinIn className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} GeorgeFctech Programador FullStack. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
