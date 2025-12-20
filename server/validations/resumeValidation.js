import Joi from 'joi';
import { createValidator } from 'express-joi-validation';

// Create validator instance
export const validator = createValidator({ passError: true });

// Custom MongoDB ObjectId validator
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Personal Info Schema
const personalInfoSchema = Joi.object({
    image: Joi.string().allow('').optional(),
    full_name: Joi.string().trim().min(2).max(100).optional()
        .custom((value, helpers) => {
            // If the field is provided, it cannot be empty after trimming
            if (value !== undefined && value.trim() === '') {
                return helpers.error('string.empty');
            }
            return value;
        })
        .messages({
            'string.empty': 'Full name cannot be empty',
            'string.min': 'Full name must be at least 2 characters long',
            'string.max': 'Full name cannot exceed 100 characters'
        }),
    profession: Joi.string().trim().max(100).allow('').optional(),
    email: Joi.string().email().trim().min(1).optional()
        .custom((value, helpers) => {
            // If the field is provided, it cannot be empty after trimming
            if (value !== undefined && value.trim() === '') {
                return helpers.error('string.empty');
            }
            return value;
        })
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email cannot be empty',
            'string.min': 'Email cannot be empty'
        }),
    phone: Joi.string().trim().max(20).allow('').optional(),
    location: Joi.string().trim().max(200).allow('').optional(),
    linkedin: Joi.string().uri().trim().allow('').optional().messages({
        'string.uri': 'LinkedIn must be a valid URL'
    }),
    website: Joi.string().uri().trim().allow('').optional().messages({
        'string.uri': 'Website must be a valid URL'
    }),
    _id: Joi.any().strip()  // Allow MongoDB auto-generated _id
}).optional();

// Experience Schema
const experienceSchema = Joi.object({
    company: Joi.string().trim().max(200).allow('').optional(),
    position: Joi.string().trim().max(200).allow('').optional(),
    start_date: Joi.string().trim().allow('').optional(),
    end_date: Joi.string().trim().allow('').optional(),
    description: Joi.string().trim().allow('').optional(),
    is_current: Joi.boolean().optional(),
    _id: Joi.any().strip()  // Allow MongoDB auto-generated _id
});

// Projects Schema
const projectSchema = Joi.object({
    name: Joi.string().trim().max(200).allow('').optional(),
    type: Joi.string().trim().max(100).allow('').optional(),
    description: Joi.string().trim().allow('').optional(),
    link: Joi.string().uri().trim().allow('').optional().messages({
        'string.uri': 'Project link must be a valid URL'
    }),
    _id: Joi.any().strip()  // Allow MongoDB auto-generated _id
});

// Education Schema
const educationSchema = Joi.object({
    institution: Joi.string().trim().max(200).allow('').optional(),
    degree: Joi.string().trim().max(200).allow('').optional(),
    field: Joi.string().trim().max(200).allow('').optional(),
    graduation_date: Joi.string().trim().allow('').optional(),
    gpa: Joi.string().trim().max(10).allow('').optional(),
    _id: Joi.any().strip()  // Allow MongoDB auto-generated _id
});

// Resume Data Schema (for updates)
const resumeDataSchema = Joi.object({
    title: Joi.string().trim().max(200).optional(),
    public: Joi.boolean().optional(),
    template: Joi.string().trim().valid('classic', 'modern', 'minimal').optional(),
    ascent_color: Joi.string().trim().pattern(/^#[0-9A-Fa-f]{6}$/).optional().messages({
        'string.pattern.base': 'Ascent color must be a valid hex color (e.g., #3B82F6)'
    }),
    accent_color: Joi.string().trim().pattern(/^#[0-9A-Fa-f]{6}$/).optional().messages({
        'string.pattern.base': 'Accent color must be a valid hex color (e.g., #3B82F6)'
    }),
    professional_summary: Joi.string().trim().allow('').optional(),
    skills: Joi.array().items(Joi.string().trim().max(100)).optional(),
    personal_info: personalInfoSchema,
    experience: Joi.array().items(experienceSchema).optional(),
    project: Joi.any().strip(),  // Legacy field for backward compatibility
    projects: Joi.array().items(projectSchema).optional(),
    education: Joi.array().items(educationSchema).optional(),
    _id: Joi.any().strip(),
    userId: Joi.any().strip(),
    createdAt: Joi.any().strip(),
    updatedAt: Joi.any().strip(),
    __v: Joi.any().strip()
}).optional();

// Create Resume Schema
export const createResumeSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).optional().messages({
        'string.empty': 'Title cannot be empty',
        'string.max': 'Title cannot exceed 200 characters'
    })
});

// Update Resume Schema
export const updateResumeSchema = Joi.object({
    resumeId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid resume ID format',
        'any.required': 'Resume ID is required'
    }),
    resumeData: resumeDataSchema,
    removeBackground: Joi.boolean().optional()
});

// Delete Resume Params Schema
export const deleteResumeParamsSchema = Joi.object({
    resumeId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid resume ID format',
        'any.required': 'Resume ID is required'
    })
});

// Get Resume Params Schema
export const getResumeParamsSchema = Joi.object({
    resumeId: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'Invalid resume ID format',
        'any.required': 'Resume ID is required'
    })
});
