import Resume from "../models/Resume.js";


// controller for creating user resume
// POST:api/resumes/create

export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        // create new resume
        const newResume = await Resume.create({
            userId,
            title
        });
        res.status(201).json({ message: "Resume created successfully",
         resume: newResume });
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

// controller for deleting resume
// DELETE: /api/resume/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId, _id: resumeId})
        
        res.status(201).json({ message: "Resume deleted successfully" });
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

// get User resume by id
// GET : /api/resume/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId, _id: resumeId});
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        res.status(200).json({ resume });
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

// get resumeby id public
// GET: /api/resumes/public


export const getPublicResumeById = async (req, res) => {
    try {
        
        const {resumeId} = req.params;

        const resume = await Resume.findOne({public: true, _id: resumeId});
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json({ resume });
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

// controller for updating a resume
// PUT: /api/resume/update

export const updateResume = async (req, res) =>{
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;


        let resumeDataCopy = JSON.parse(resumeData);
        const resume = await Resume.findByIdAndUpdate({userId, _id:resumeId},
            resumeDataCopy, {new:true}
        );
        return res.status(200).json({message:"Saved Successfully", resume})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}