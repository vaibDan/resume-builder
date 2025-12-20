// Middleware to parse resumeData from multipart/form-data before validation
export const parseResumeData = (req, res, next) => {
    console.log('[parseResumeData] Called');
    console.log('[parseResumeData] resumeData type:', typeof req.body.resumeData);
    console.log('[parseResumeData] resumeData value:', req.body.resumeData);
    
    if (req.body.resumeData && typeof req.body.resumeData === 'string') {
        try {
            req.body.resumeData = JSON.parse(req.body.resumeData);
            console.log('[parseResumeData] Parsed successfully:', req.body.resumeData);
        } catch (error) {
            console.log('[parseResumeData] Parse error:', error.message);
            return res.status(400).json({ 
                message: 'Invalid resumeData format',
                error: 'resumeData must be valid JSON' 
            });
        }
    }
    next();
};
