import imagekit from "../config/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";


// controller for creating user resume
// POST:api/resumes/create

export const createResume = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId || (req.user && req.user.id);
        const { title } = req.body;

        // debug logs to help trace missing userId issues
        // console.log('[createResume] authorization header present:', !!req.headers.authorization);
        // console.log('[createResume] resolved userId:', userId);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: userId missing on request" });
        }

        // create new resume
        const newResume = await Resume.create({ userId, title });
        res.status(201).json({
            message: "Resume created successfully",
            resume: newResume
        });

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// controller for deleting resume
// DELETE: /api/resume/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId })

        res.status(201).json({ message: "Resume deleted successfully" });

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// get User resume by id
// GET : /api/resume/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        // ensure returned resume object always exposes `accent_color` for clients
        const resumeObj = resume.toObject ? resume.toObject() : { ...resume };
        // normalize historical typo `ascent_color` -> `accent_color`
        if (!resumeObj.accent_color && resumeObj.ascent_color) {
            resumeObj.accent_color = resumeObj.ascent_color;
        }
        delete resumeObj.__v;
        delete resumeObj.createdAt;
        delete resumeObj.updatedAt;

        res.status(200).json({ resume: resumeObj });

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// get resumeby id public
// GET: /api/resumes/public


export const getPublicResumeById = async (req, res) => {
    try {

        const { resumeId } = req.params;

        const resume = await Resume.findOne({ public: true, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const resumeObj = resume.toObject ? resume.toObject() : { ...resume };
        if (!resumeObj.accent_color && resumeObj.ascent_color) {
            resumeObj.accent_color = resumeObj.ascent_color;
        }

        res.status(200).json({ resume: resumeObj });

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

// controller for updating a resume
// PUT: /api/resume/update

export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        // console.log('[updateResume] authorization header present:', !!req.headers.authorization);
        // console.log('[updateResume] resolved userId:', userId);
        // console.log('[updateResume] resumeId:', resumeId);
        // console.log('[updateResume] resumeData received:', resumeData);

        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = await JSON.parse(resumeData);
        } else {
            resumeDataCopy = structuredClone(resumeData);
        };
        // console.log(resumeDataCopy);

        // Debug: Check if base64 image is present
        // console.log('[updateResume] Checking for base64 image:', resumeDataCopy.personal_info?.image?.startsWith('data:image/'));

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            // console.log('[updateResume] image file received:', image.originalname);
            // upload image to imagekit
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300, h-300, fo-face,z-0.75' +
                        (removeBackground ? ',e-bgremove' : '')
                }
            });
            resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
            resumeDataCopy.personal_info.image = response.url;
        } else if (resumeDataCopy.personal_info?.image?.startsWith('data:image/')) {
            // console.log('[updateResume] Base64 image detected, uploading to ImageKit...');
            try {
                // Try uploading the full data URI first (some SDKs accept data URI directly)
                const dataUri = resumeDataCopy.personal_info.image;

                let response;

                try {
                    response = await imagekit.files.upload({
                        file: dataUri,
                        fileName: 'resume.png',
                        folder: 'user-resumes',
                        transformation: {
                            pre: 'w-300,h-300,fo-face,z-0.75' +
                                (removeBackground ? ',e-bgremove' : '')
                        }
                    });
                } catch (firstErr) {
                    // If the SDK rejected the data URI, fall back to base64-only upload
                    // console.warn('[updateResume] data URI upload failed, will try base64-only fallback:', firstErr.message);
                    const base64Data = dataUri.split(',')[1];

                    // Some SDKs accept Buffer; some expect base64 string - try both if needed
                    try {
                        // First try raw base64 string
                        response = await imagekit.files.upload({
                            file: base64Data,
                            fileName: 'resume.png',
                            folder: 'user-resumes',
                            transformation: {
                                pre: 'w-300,h-300,fo-face,z-0.75' +
                                    (removeBackground ? ',e-bgremove' : '')
                            }
                        });
                    } catch (secondErr) {
                        // console.warn('[updateResume] base64 string upload failed, will try Buffer fallback:', secondErr.message);
                        // Last fallback: Buffer
                        const buffer = Buffer.from(base64Data, 'base64');
                        response = await imagekit.files.upload({
                            file: buffer,
                            fileName: 'resume.png',
                            folder: 'user-resumes',
                            transformation: {
                                pre: 'w-300,h-300,fo-face,z-0.75' +
                                    (removeBackground ? ',e-bgremove' : '')
                            }
                        });
                    }
                }

                // console.log('[updateResume] ImageKit upload response:', response?.url || response);
                if (!response?.url) {
                    throw new Error('ImageKit returned an unexpected upload response');
                }
                // Replace the base64 string with the hosted image URL
                resumeDataCopy.personal_info.image = response.url;

            } catch (uploadError) {
                // console.error('[updateResume] ImageKit upload failed:', uploadError?.message || uploadError);
                // If upload fails we should not silently keep the base64 string in the DB.
                // Return a 500 error so client can react (and optionally try again with a proper ImageKit config).
                return res.status(500).json({ message: 'Failed to upload image to ImageKit. Please check server ImageKit configuration and try again.' });
            }
        } else {
            // console.log('[updateResume] No image file or base64 detected');
        }

        // Normalize accent / ascent color keys for compatibility
        if (resumeDataCopy.accent_color && !resumeDataCopy.ascent_color) {
            resumeDataCopy.ascent_color = resumeDataCopy.accent_color;
        } else if (!resumeDataCopy.accent_color && resumeDataCopy.ascent_color) {
            resumeDataCopy.accent_color = resumeDataCopy.ascent_color;
        }

        // Flatten nested resumeDataCopy into dot-notation so nested fields are updated correctly
        // Arrays are NOT flattened - they are set directly to ensure MongoDB replaces the entire array
        const flatten = (obj, parentKey = '', res = {}) => {
            for (const [k, v] of Object.entries(obj || {})) {
                const key = parentKey ? `${parentKey}.${k}` : k;
                // If it's an array, set it directly without flattening
                if (Array.isArray(v)) {
                    res[key] = v;
                } else if (v && typeof v === 'object' && !(v instanceof Date) && !(v instanceof Buffer)) {
                // Only flatten non-array objects
                    flatten(v, key, res);
                } else {
                    res[key] = v;
                }
            }
            return res;
        };

        const setObj = flatten(resumeDataCopy);

        // remove any createdAt/updatedAt keys from the flattened set object to avoid conflict with $currentDate
        if (Object.prototype.hasOwnProperty.call(setObj, 'createdAt')) {
            delete setObj.createdAt;
            // console.log('[updateResume] removed createdAt from $set object');
        }
        if (Object.prototype.hasOwnProperty.call(setObj, 'updatedAt')) {
            delete setObj.updatedAt;
            // console.log('[updateResume] removed updatedAt from $set object');
        }

        // console.log('[updateResume] $set object:', setObj);

        const updatedResume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            { $set: setObj, $currentDate: { updatedAt: true } },
            { new: true, runValidators: true }
        );

        // console.log('[updateResume] update result:', updatedResume);
        return res.status(200).json({ message: "Saved Successfully", resume: updatedResume })


    } catch (error) {
        // console.log('[updateResume] error:', error.message);
        res.status(400).json({ message: error.message })
    }
}