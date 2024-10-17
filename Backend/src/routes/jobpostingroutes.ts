import express from 'express';
import {
  createJobPosting,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting,
  getAllJobPostings,
} from '../controllers/jobpostingcontroller';

const router = express.Router();

router.post('/jobpostings', createJobPosting);
router.get('/jobpostings/:id', getJobPostingById);
router.put('/jobpostings/:id', updateJobPosting);
router.delete('/jobpostings/:id', deleteJobPosting);
router.get('/jobpostings', getAllJobPostings);

export default router;
