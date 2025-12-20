import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { createResume, deleteResume,getPublicResumeById,getResumeById, updateResume } from '../controllers/resumeController.js';
import upload from '../config/multer.js';
import { parseResumeData } from '../middleware/parseResumeData.js';
import {
    validator,
    createResumeSchema,
    updateResumeSchema,
    deleteResumeParamsSchema,
    getResumeParamsSchema
} from '../validations/resumeValidation.js';

const resumeRouter = express.Router();

resumeRouter.get('/get/:resumeId', validator.params(getResumeParamsSchema), protect, getResumeById);
resumeRouter.get('/public/:resumeId', validator.params(getResumeParamsSchema), getPublicResumeById);
resumeRouter.post('/create', protect, validator.body(createResumeSchema), createResume);
resumeRouter.put('/update', upload.single('image'), parseResumeData, protect, validator.body(updateResumeSchema), updateResume);
resumeRouter.delete('/delete/:resumeId', validator.params(deleteResumeParamsSchema), protect, deleteResume);


export default resumeRouter;