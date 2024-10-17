import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000 ;
const mongourl=process.env.DB_URL


//middlewares 
app.use(cors());
app.use(express.json())

// Connect to MongoDB
mongoose.connect(`${mongourl}`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));





 app.listen(port, () => {
    console.log(`Backend is now online on port ${port}!`);
  });