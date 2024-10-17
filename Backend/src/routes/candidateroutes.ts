import express from 'express';
import {
  createCandidate,
  getCandidateById,
 
  getAllCandidates,
} from '../controllers/candidatecontroller';

const router = express.Router();

router.post('/candidates', createCandidate);
router.get('/candidates/:id', getCandidateById);
router.get('/candidates', getAllCandidates);

export default router;
