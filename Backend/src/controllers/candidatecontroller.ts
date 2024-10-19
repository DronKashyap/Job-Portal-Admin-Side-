import { Request, Response } from 'express';
import { Candidate, JobPosting } from '../models/models';
import { z } from 'zod';

const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  resume: z.string().min(1, 'Resume is required'),
  jobPosting: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid job posting ID format'), 
});

export const createCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = candidateSchema.parse(req.body);
    const { name, email, resume, jobPosting } = parsedData;

    const newCandidate = new Candidate({
      name,
      email,
      resume,
      jobPosting,
    });

    await newCandidate.save();

    //  Update the job posting to include the new candidate
    await JobPosting.findByIdAndUpdate(
      jobPosting,
      { $addToSet: { candidates: newCandidate._id } }, 
      { new: true } 
    );
    res.status(201).json(newCandidate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Error creating candidate', error });
    }
  }
};


export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id).populate('jobPosting');

    if (!candidate) {
      res.status(404).json({ message: 'Candidate not found' });
      return;
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving candidate', error });
  }
};

export const getAllCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidates = await Candidate.find().populate('jobPosting');
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving candidates', error });
  }
};
