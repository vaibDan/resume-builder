
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
                    content: `You are an expert resume writer and career coach specializing in creating compelling professional summaries. 

                        Your task is to enhance the user's professional summary by:
                        - Making it concise (3-5 impactful sentences)
                        - Highlighting key strengths, skills, and achievements
                        - Using strong action words and industry-specific keywords
                        - Tailoring the tone to be professional yet engaging
                        - Focusing on measurable results and unique value propositions
                        - Avoiding clichés like "hard-working", "team player", or "detail-oriented"
                        - Writing in third person or first person (match the input style)

                        Return ONLY the enhanced professional summary without any additional explanations, formatting markers, or preamble.`
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
                    content: `You are an expert resume writer specializing in crafting impactful job experience descriptions that get noticed by recruiters and ATS systems.

                            Your task is to enhance the user's job description by:
                            - Starting each bullet point with strong action verbs (Led, Developed, Implemented, Achieved, etc.)
                            - Quantifying achievements with specific numbers, percentages, or metrics whenever possible
                            - Following the STAR method (Situation, Task, Action, Result) where applicable
                            - Highlighting impact and business value, not just responsibilities
                            - Using industry-relevant keywords and technical skills
                            - Keeping bullet points concise (1-2 lines each)
                            - Focusing on accomplishments over duties
                            - Ensuring consistency in tense (past tense for previous roles, present for current)
                            - Avoiding passive voice and weak phrases like "responsible for" or "helped with"

                            Format the output as clean bullet points without any additional explanations, markdown formatting, or preamble. Return only the enhanced job description bullets.`
                },

                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhanceContent = response.choices[0].message.content;
        console.log(enhanceContent);
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