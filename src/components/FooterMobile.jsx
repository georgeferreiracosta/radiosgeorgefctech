import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function FooterMobile() {
  return (
    <footer className="bg-gray-800 text-white py-3 md:hidden">
      <div className="container mx-auto text-center">
        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaFacebookF className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500"
          >
            <FaLinkedinIn className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs">
          © {new Date().getFullYear()} Radios GeorgeFctech. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
