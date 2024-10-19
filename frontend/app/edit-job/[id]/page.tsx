'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

interface JobPosting {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
}

const EditJobPosting = () => {
  const router = useRouter();
  const params = useParams(); 
  const { id } = params; 
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
   
  useEffect(() => {
    const fetchJobPosting = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/jobpostings/jobpostings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jobData = response.data;
        setJobPosting(jobData);
        setTitle(jobData.title);
        setDescription(jobData.description);
        setCompany(jobData.company);
        setLocation(jobData.location);
      } catch (error) {
        console.error('Error fetching job posting:', error);
        setError('Failed to load job posting data.');
      }
    };

    if (id) {
      fetchJobPosting();
    }
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3001/api/jobpostings/jobpostings/${id}`,
        { title, description, company, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push('/my-listing'); 
    } catch (error) {
      console.error('Error updating job posting:', error);
      setError('Failed to update job posting.');
    } finally {
      setLoading(false);
    }
  };

  if (!jobPosting) {
    return <div>Loading job posting...</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-2xl font-bold mb-6">Edit Job Posting</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Update Job Posting'}
        </button>
      </form>
    </div>
  );
};

export default EditJobPosting;
