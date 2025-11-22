
import ai from "../config/ai.js";
import Resume from "../models/Resume.js";


// controller for enhancing a resume professionally summary using AI
// POST: /api/ai/enhance-summary


export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        };

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. "
                },

                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhanceContent = response.choices[0].message.content;
        return res.status(200).json({ enhanceContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for enhancing a resume job description using AI
// POST: /api/ai/enhance-job-description

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        };

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. "
                },

                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhanceContent = response.choices[0].message.content;
        return res.status(200).json({ enhanceContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for uploading a resume to the database
// POST: /api/ai/upoad-resume


export const uploadResume = async (req, res) => {
    try {

        const { resumeText, title } = req.body;
        const userId = req.user.id;

        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const systemPrompt = "You are an expert AI agent to extract data from resumes and convert them into structured format to store in database. Extract following details from the resume: full name, email address, phone number, skills, education, work experience, certifications, projects, and any other relevant information. Format the extracted data as a JSON object with appropriate key-value pairs."

        const userPrompt = `extract data from this resume: ${resumeText}
        provide the response in JSON format only with the following keys:
        
        professional_summary: { type: String, default: "" },
        {skills: [{ type: String }],
            personal_info: {
                image: { type: String, default: "" },
                full_name: { type: String, default: "" },
                profession: { type: String, default: "" },
                email: { type: String, default: "" },
                phone: { type: String, default: "" },
                location: { type: String, default: "" },
                linkedin: { type: String, default: "" },
                website: { type: String, default: "" },

            },
            experience: [{
                company: { type: String},
                position: { type: String},
                start_date: { type: String},
                end_date: { type: String},         
                description: { type: String},         
                is_current: { type: Boolean, default: false},         
            }],
            projects: [{
                name: { type: String},
                type: { type: String},          
                description: { type: String},
                link: { type: String},                     
            }],
            education: [{
                institution: { type: String},
                degree: { type: String},          
                field: { type: String},
                graduation_date: { type: String},                     
                gpa: { type: String},                     
            }],}
                `;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },

                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: { type: "json_object" },
        });
        const extractData = response.choices[0].message.content;
        const parseData = JSON.parse(extractData);
        const newResume = await Resume.create({
            user: userId,
            title: title || "Untitled Resume",
            ...parseData
        })
        res.json({ resumeId: newResume._id, message: "Resume uploaded successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};