'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <button 
      onClick={handleButtonClick} 
      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
    >
      {isLoggedIn ? 'Profile' : 'Login'}
    </button>
  );
};

export default LoginButton;
