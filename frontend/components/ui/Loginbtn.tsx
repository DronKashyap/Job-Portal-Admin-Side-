'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa'; 

interface DecodedToken {
  id: number;
  username: string;
}

const LoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Invalid token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      router.push('/login');
    }
  };

  const handleCreateListing = () => {
    router.push('/create-listing');
  };

  const handleMyListings = () => {
    router.push('/my-listing');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div className="relative  flex">
      <button
        onClick={handleButtonClick}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
        className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        {isLoggedIn ?  <span className="mr-2 text-2xl">
            <FaUserCircle /> 
          </span>: 'Login'}
        {isLoggedIn ? 'User' : null}
      </button>

      {isLoggedIn && (
        <button
          onClick={handleCreateListing}
          className="ml-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
        >
          Create Listing
        </button>
      )}

      {isDropdownOpen && isLoggedIn && (
        <div
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          className="absolute right-0 mt-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
        >
          <ul>
            <li
              onClick={handleMyListings}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              My Listings
            </li>
            <li
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
