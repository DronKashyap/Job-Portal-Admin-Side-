import express from 'express';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  signInUser,
} from '../controllers/usercontroller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/signup', createUser);
router.post('/signin', signInUser);
router.get('/users/:id', authenticateJWT, getUserById);
router.put('/users/:id', authenticateJWT, updateUser);
router.delete('/users/:id', authenticateJWT, deleteUser);
router.get('/users', authenticateJWT, getAllUsers);

export default router;
