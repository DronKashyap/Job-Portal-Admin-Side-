'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import axios from 'axios';

interface DecodedToken extends JwtPayload {
  id: string; 
}

interface JobPosting {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  createdAt: string;
}

const MyListings = () => {
  const router = useRouter();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let userId = '';

  if (token) {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      userId = decoded?.id || ''; 
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  } else {
    router.push('/');
  }

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/jobpostings/jobpostings?createdBy=${userId}`); 
        setJobPostings(response.data);
      } catch (error) {
        console.error('Error fetching job postings:', error);
        setError('Failed to fetch job postings. Please try again.');
      }
    };

    if (userId) {
      fetchJobPostings();
    }
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6">My Job Postings</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {jobPostings.length === 0 ? (
        <div>No job postings found.</div>
      ) : (
        <ul className="space-y-4">
          {jobPostings.map((job) => (
            <li key={job._id} className="bg-white p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold">
                <a href={`/job-postings/${job._id}`} className="text-blue-500 hover:underline">
                  {job.title}
                </a>
              </h2>
              <p className="text-gray-700">{job.description}</p>
              <p className="text-gray-500">Company: {job.company}</p>
              <p className="text-gray-500">Location: {job.location}</p>
              <p className="text-gray-400 text-sm">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyListings;
