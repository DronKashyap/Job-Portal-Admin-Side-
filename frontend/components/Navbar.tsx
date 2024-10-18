"use client";

import React from 'react';
import LoginButton from './ui/Loginbtn';
import { useRouter } from 'next/navigation';

function Navbar() {
  const router = useRouter();

  const handleLogo = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 bg-white bg-opacity-0 z-20 shadow-md">
      <h1
        onClick={handleLogo}
        className="text-2xl hover:cursor-pointer font-extrabold bg-gradient-to-r from-purple-300 via-green-300 to-indigo-300 text-transparent bg-clip-text"
      >
        Job Portal
      </h1>
      <h1 className="text-lg">Dashboard</h1>
      <LoginButton />
    </div>
  );
}

export default Navbar;
