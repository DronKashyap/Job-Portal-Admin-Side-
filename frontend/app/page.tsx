"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface JobPosting {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  createdAt: string;
}

function Page() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/jobpostings/jobpostings');
        setJobPostings(response.data);
      } catch (error) {
        console.error('Error fetching job postings:', error);
        setError('Failed to load job postings.');
      }
    };

    fetchJobPostings();
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <div className="relative h-[400px] sm:h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="/banner.jpg"
            fill
            objectFit="cover"
            alt="Banner image"
            className="z-0"
          />
        </div>
        <div className="absolute inset-0 flex justify-center items-center z-10 hover:backdrop-blur-sm bg-black/50">
          <h1 className="text-white text-2xl sm:text-4xl font-bold text-center">Find Your Perfect Candidate</h1>
        </div>
      </div>

      {/* Job Postings Section */}
      <div className="container mx-auto px-4 py-10 sm:py-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Job Postings</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {jobPostings.length === 0 ? (
          <div className="text-center">No job postings available at the moment.</div>
        ) : (
          <ul className="space-y-4">
            {jobPostings.map((job) => (
              <li key={job._id} className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-95">
                <h3 className="text-xl font-semibold">
                  <a href={`/job-postings/${job._id}`} className="text-blue-500 hover:underline">
                    {job.title}
                  </a>
                </h3>
                <p className="text-gray-700">{job.description}</p>
                <p className="text-gray-500">Company: {job.company}</p>
                <p className="text-gray-500">Location: {job.location}</p>
                <p className="text-gray-400 text-sm">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Page;
