import express from 'express';
import {
  createJobPosting,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting,
  getAllJobPostings,
} from '../controllers/jobpostingcontroller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/jobpostings',authenticateJWT, createJobPosting); 
router.get('/jobpostings/:id', getJobPostingById); 
router.put('/jobpostings/:id',authenticateJWT, updateJobPosting); 
router.delete('/jobpostings/:id',authenticateJWT, deleteJobPosting); 
router.get('/jobpostings', getAllJobPostings);

export default router;
