import { Request, Response } from 'express';
import { Candidate } from '../models/models';

export const createCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, resume, jobPosting } = req.body;

    const newCandidate = new Candidate({
      name,
      email,
      resume,
      jobPosting,
    });

    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating candidate', error });
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
