'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import axios from 'axios';

interface DecodedToken extends JwtPayload {
  id: string; 
}

const CreateListing = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let userId = '';

  if (token) {
    try {
      const decoded = jwt.decode(token) as DecodedToken; 
      console.log(decoded);
      userId = decoded?.id || ''; 
      console.log(userId);
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  } else {
    router.push('/');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/jobpostings/jobpostings', {
        title,
        description,
        company,
        location,
        createdBy: userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      console.log('Job posting created:', response.data);
    } catch (error) {
      console.error('Error creating job posting:', error);
      setError('Failed to create job posting. Please try again.');
    }
  };

  const handleAilisting = () => {
    router.push('/ai-listing');
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-24">
      <div className='flex justify-center mb-4'>
        <button className='rounded-md bg-black text-white p-4 w-full md:w-auto' onClick={handleAilisting}>
          Use AI to create listing
        </button>
      </div>
      <h2 className='flex justify-center mb-2'>or</h2>
      <h1 className="text-2xl font-bold mb-6 text-center">Create Job Posting Manually</h1>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
            Company
          </label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-500"
        >
          Create Job Posting
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
