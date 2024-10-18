import React from 'react';
import LoginButton from './ui/Loginbtn';

function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 backdrop-blur-md z-10 ">
      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-300 via-green-300 to-indigo-300 text-transparent bg-clip-text">
        Job Portal
      </h1>
      <h1 className="text-lg">Dashboard</h1>
      <LoginButton />
    </div>
  );
}

export default Navbar;
