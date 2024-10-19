"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AIListing = () => {
  const [prompt, setPrompt] = useState('');
  const [jobPosting, setJobPosting] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullPrompt = `${prompt}. Generate a job posting for the following position. Please provide output strictly in the following format: title, description, company, and location. provide no fields other than format`;

    try {
      const response = await axios.post(
        'https://chat-gpt26.p.rapidapi.com/',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: fullPrompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'chat-gpt26.p.rapidapi.com',
            'x-rapidapi-key': process.env.NEXT_PUBLIC_AI_API_KEY,
          },
        }
      );
      console.log(response);

      const { title, description, company, location } = parseJobPostingResponse(response.data);
      setJobPosting({ title, description, company, location });
    } catch (err) {
      setError('Error fetching data from AI model');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to parse the AI response
  const parseJobPostingResponse = (data: any) => {
    const content = data.choices[0].message.content;

    const titleMatch = content.match(/Title:\s*(.*?)(?=\n|$)/);
    const descriptionMatch = content.match(/Description:\s*(.*?)(?=\n*Company:|$)/);
    const companyMatch = content.match(/Company:\s*(.*?)(?=\n*Location:|$)/);
    const locationMatch = content.match(/Location:\s*(.*)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : 'Untitled',
      description: descriptionMatch ? descriptionMatch[1].trim() : 'No description provided',
      company: companyMatch ? companyMatch[1].trim() : 'Unknown Company',
      location: locationMatch ? locationMatch[1].trim() : 'Unknown Location',
    };
  };

  type CustomJwtPayload = {
    id: string;
  };

  const handleCreateListing = async () => {
    setCreating(true);
    setError('');

    const token = localStorage.getItem('token');
    let userId;

    if (!token) {
      setError('User not authenticated. Please log in.');
      setCreating(false);
      return;
    }

    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error('Failed to decode token:', error);
      setError('Failed to retrieve user information.');
      setCreating(false);
      return;
    }

    const jobData = {
      title: jobPosting.title,
      description: jobPosting.description,
      company: jobPosting.company,
      location: jobPosting.location,
      createdBy: userId,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/jobpostings/jobpostings', jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Job posting created:', response.data);
      setError('Job posting created successfully!');
    } catch (error) {
      console.error('Error creating job posting:', error);
      setError('Failed to create job posting. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 p-5 md:mt-20">
      <h1 className="text-2xl font-bold mb-4">Generate Job Posting with AI</h1>
      <form onSubmit={handleSubmit} className="mb-4 w-full max-w-md">
        <input
          placeholder="Enter the prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border-2 border-black w-full p-2 mb-2 rounded-md"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {jobPosting.title && (
        <div className="border-2 border-gray-300 p-4 w-full max-w-md">
          <h2 className="text-lg font-bold">Job Posting Details:</h2>
          <p><strong>Title:</strong> {jobPosting.title}</p>
          <p><strong>Company:</strong> {jobPosting.company}</p>
          <p><strong>Location:</strong> {jobPosting.location}</p>
          <p><strong>Description:</strong> {jobPosting.description}</p>
          <button
            onClick={handleCreateListing}
            className="bg-green-500 text-white py-2 px-4 rounded mt-2 w-full"
          >
            Create Listing
          </button>
        </div>
      )}
    </div>
  );
};

export default AIListing;
