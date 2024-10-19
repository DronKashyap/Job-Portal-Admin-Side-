'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Candidate {
  _id: string;
  name: string;
  email: string;
  resume: string;
}

interface JobPosting {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  createdAt: string;
  candidates: Candidate[];
}

const JobPostingPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [error, setError] = useState('');

  const jobId = params.id;

  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/jobpostings/jobpostings/${jobId}`);
        console.log(response.data);
        setJobPosting(response.data);
      } catch (error) {
        console.error('Error fetching job posting:', error);
        setError('Failed to fetch job posting. Please try again.');
      }
    };

    if (jobId) {
      fetchJobPosting();
    }
  }, [jobId]);

  const handleScheduleInterview = (candidateId: string) => {
    alert(`Schedule interview for candidate: ${candidateId}`);
  };

  if (!jobPosting) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-20">
        {error ? <div className="text-red-500">{error}</div> : <p>Loading job posting...</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{jobPosting.title}</h1>
      <p className="text-gray-700 mb-2 text-sm md:text-base">{jobPosting.description}</p>
      <p className="text-gray-500 text-sm md:text-base">Company: {jobPosting.company}</p>
      <p className="text-gray-500 text-sm md:text-base">Location: {jobPosting.location}</p>
      <p className="text-gray-400 text-xs md:text-sm">
        Posted on: {new Date(jobPosting.createdAt).toLocaleDateString()}
      </p>

      {/* Candidates Section */}
      <div className="mt-6 md:mt-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">Candidates who applied</h2>
        {jobPosting.candidates.length === 0 ? (
          <p>No candidates have applied for this job yet.</p>
        ) : (
          <ul className="space-y-4">
            {jobPosting.candidates.map((candidate) => (
              <li key={candidate._id} className="bg-white p-4 rounded shadow-md flex flex-col md:flex-row justify-between items-center">
                <div className="flex-1 mb-2 md:mb-0">
                  <p className="text-lg md:text-xl font-semibold">{candidate.name}</p>
                  <p className="text-gray-500 text-sm md:text-base">{candidate.email}</p>
                  <a href={candidate.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Resume
                  </a>
                </div>
                <button
                  onClick={() => handleScheduleInterview(candidate._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                >
                  Schedule Interview
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => router.back()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
      >
        Go Back
      </button>
    </div>
  );
};

export default JobPostingPage;
