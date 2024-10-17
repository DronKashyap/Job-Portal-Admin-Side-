import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    jobPostings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
    }],
  },
  { timestamps: true }
);

// JobPosting Schema
const jobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidates: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
    }],
  },
  { timestamps: true }
);

// Candidate Schema
const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    resume: {
      type: String, 
      required: true,
    },
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
    },
  },
  { timestamps: true }
);

// Create models
const User = mongoose.model('User', userSchema);
const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);


  // Export the models
  export { User, JobPosting, Candidate };
