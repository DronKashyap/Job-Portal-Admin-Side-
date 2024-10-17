import { Request, Response } from 'express';
import { JobPosting, User, Candidate } from '../models/models';

export const createJobPosting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, company, location, createdBy } = req.body;

    const newJobPosting = new JobPosting({
      title,
      description,
      company,
      location,
      createdBy,
    });

    const savedJobPosting = await newJobPosting.save();

    await User.findByIdAndUpdate(
      createdBy,
      { $push: { jobPostings: savedJobPosting._id } },
      { new: true }
    );

    res.status(201).json(savedJobPosting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job posting', error });
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
    const { title, description, company, location } = req.body;

    const updatedJobPosting = await JobPosting.findByIdAndUpdate(
      id,
      { title, description, company, location },
      { new: true }
    );

    if (!updatedJobPosting) {
      res.status(404).json({ message: 'Job posting not found' });
      return;
    }

    res.status(200).json(updatedJobPosting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job posting', error });
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
