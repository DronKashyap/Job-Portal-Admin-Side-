"use client";

import React, { useState } from 'react';
import LoginButton from './ui/Loginbtn';
import { useRouter } from 'next/navigation';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogo = () => {
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 bg-white bg-opacity-0 z-20 shadow-md">
      <h1
        onClick={handleLogo}
        className="text-2xl hover:cursor-pointer font-extrabold bg-gradient-to-r from-purple-300 via-green-300 to-indigo-300 text-transparent bg-clip-text"
      >
        Job Portal
      </h1>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-gray-700 hover:text-gray-900"
      >
        {isMenuOpen ? '✖' : '☰'} {/* Hamburger icon */}
      </button>

      <div className={`flex flex-col md:flex-row md:items-center ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <LoginButton />
      </div>
    </nav>
  );
}

export default Navbar;
