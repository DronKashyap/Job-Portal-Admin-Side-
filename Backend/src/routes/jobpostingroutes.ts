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

router.post('/jobpostings',authenticateJWT, createJobPosting); //done
router.get('/jobpostings/:id', getJobPostingById); //done
router.put('/jobpostings/:id',authenticateJWT, updateJobPosting); //done
router.delete('/jobpostings/:id',authenticateJWT, deleteJobPosting); //done
router.get('/jobpostings', getAllJobPostings);

export default router;
