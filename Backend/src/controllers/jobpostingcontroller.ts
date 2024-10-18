import { Request, Response } from 'express';
import { JobPosting, User, Candidate } from '../models/models';
import { z } from 'zod';

const jobPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  createdBy: z.string().length(24, 'Invalid user ID format'), // Assuming ObjectId is a 24 character string
});

export const createJobPosting = async (req: Request <{ id: string }>, res: Response): Promise<void> => {
  try {
    const parsedData = jobPostingSchema.parse(req.body);

    const newJobPosting = new JobPosting({
      title: parsedData.title,
      description: parsedData.description,
      company: parsedData.company,
      location: parsedData.location,
      createdBy: parsedData.createdBy,
    });

    const savedJobPosting = await newJobPosting.save();

    await User.findByIdAndUpdate(
      parsedData.createdBy,
      { $push: { jobPostings: savedJobPosting._id } },
      { new: true }
    );

    res.status(201).json(savedJobPosting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Error creating job posting', error });
    }
  }
};

export const getJobPostingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const jobPosting = await JobPosting.findById(id).populate('createdBy candidates');

    if (!jobPosting) {
      res.status(404).json({ message: 'Job posting not found' });
      return;
    }

    res.status(200).json(jobPosting);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving job posting', error });
  }
};

export const updateJobPosting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedData = jobPostingSchema.partial().parse(req.body); // Allow partial updates

    const updatedJobPosting = await JobPosting.findByIdAndUpdate(
      id,
      { ...parsedData },
      { new: true }
    );

    if (!updatedJobPosting) {
      res.status(404).json({ message: 'Job posting not found' });
      return;
    }

    res.status(200).json(updatedJobPosting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Error updating job posting', error });
    }
  }
};

export const deleteJobPosting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedJobPosting = await JobPosting.findByIdAndDelete(id);

    if (!deletedJobPosting) {
      res.status(404).json({ message: 'Job posting not found' });
      return;
    }

    await User.findByIdAndUpdate(
      deletedJobPosting.createdBy,
      { $pull: { jobPostings: deletedJobPosting._id } }
    );

    await Candidate.deleteMany({ jobPosting: deletedJobPosting._id });

    res.status(200).json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job posting', error });
  }
};

export const getAllJobPostings = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobPostings = await JobPosting.find().populate('createdBy candidates');
    res.status(200).json(jobPostings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving job postings', error });
  }
};
