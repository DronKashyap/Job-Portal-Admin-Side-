import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
require('dotenv').config();

import userRoutes from './routes/userroutes';
import candidateRoutes from './routes/candidateroutes';
import jobPostingRoutes from './routes/jobpostingroutes';

const app = express();
const port = process.env.PORT || 3000;
const mongourl = process.env.DB_URL;

app.use(cors());
app.use(express.json());

mongoose.connect(`${mongourl}`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobpostings', jobPostingRoutes);

app.listen(port, () => {
  console.log(`Backend is now online on port ${port}!`);
});
