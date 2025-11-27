import React, { useEffect, useState } from 'react'
import { data, Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowBigLeftIcon, Briefcase, DownloadCloud, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import { useSelector } from 'react-redux';
import api from '../configs/api.js';
import toast from 'react-hot-toast'


const ResumeBuilder = () => {
  const { resumeId } = useParams()

  const { token } = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      profession: '',
      image: null
    },
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false
  })

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId,
        { headers: { Authorization: token } });
      if (data.resume) {
        // server previously used `ascent_color` (typo). normalize to `accent_color`
        const normalized = { ...data.resume };
        if (!normalized.accent_color && normalized.ascent_color) {
          normalized.accent_color = normalized.ascent_color;
        }
        setResumeData(normalized)
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  const handlePersonalInfoChange = (updatedPersonalInfo) => {
    setResumeData(prev => ({
      ...prev,
      personal_info: updatedPersonalInfo
    }))
  }

  const handleTemplateChange = (templateId) => {
    setResumeData(prev => ({
      ...prev,
      template: templateId
    }))
  }

  const handleExperienceChange = (updatedExperience) => {
    setResumeData(prev => ({
      ...prev,
      experience: updatedExperience
    }))
  }

  const handleEducationChange = (updatedEducation) => {
    setResumeData(prev => ({
      ...prev,
      education: updatedEducation
    }))
  }

  const handleProjectChange = (updatedProject) => {
    setResumeData(prev => ({
      ...prev,
      project: updatedProject
    }))
  }

  const handleSkillsChange = (updatedSkills) => {
    setResumeData(prev => ({
      ...prev,
      skills: updatedSkills
    }))
  }

  useEffect(() => {
    loadExistingResume()
  }, [resumeId])

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify({ public: !resumeData.public }));
      const { data } = await api.put('/api/resumes/update', formData,
        { headers: { Authorization: token } });
      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message);
    } catch (error) {
      console.error("Error changing resume visibility:", error);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.origin;
    const resumeUrl = frontendUrl + "/view/" + resumeId;

    if (navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: "Check out my resume!",
      })
    } else {
      alert("Share not supported on this browser")
    }
  }

  const handleDownload = () => {
    window.print();
  };

  const saveResume = async () => {
    try {
      // deep-clone resumeData (structuredClone if available, otherwise JSON fallback)
      let updatedResumeData;
      try {
        updatedResumeData = typeof structuredClone === 'function' ? structuredClone(resumeData) : JSON.parse(JSON.stringify(resumeData));
      } catch (err) {
        updatedResumeData = JSON.parse(JSON.stringify(resumeData));
      }
      // remove image from updatedResumeData before sending to server
      if (updatedResumeData?.personal_info && typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image;
      }
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(updatedResumeData));
      removeBackground && formData.append('removeBackground', 'true');
      if (typeof resumeData.personal_info.image === 'object') {
        formData.append('image', resumeData.personal_info.image);
      }

      const { data } = await api.put('/api/resumes/update', formData,
        { headers: { Authorization: token } });

      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  return (
    <div className='print:bg-white'>
      <div className='max-w-7xl mx-auto px-4 py-6 print:hidden'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500'>
          <ArrowBigLeftIcon className='size-4' /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8 print:p-0'>
        <div className='grid lg:grid-cols-12 gap-8 print:block'>
          {/* left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden print:hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/*    progress bar using activeSectionIndex*/}
              <div className='mb-6 pt-4'>
                <div className='flex gap-6 mb-4'>
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={handleTemplateChange}
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))}
                  />
                </div>

                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-medium text-gray-700'>
                    Step {activeSectionIndex + 1} of {sections.length}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {Math.round(((activeSectionIndex + 1) / sections.length) * 100)}%
                  </span>
                </div>


                <div className='flex gap-1'>
                  {sections.map((_, index) => (
                    <hr
                      key={index}
                      className={`flex-1 h-2 border-0 rounded ${index <= activeSectionIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                        }`}
                    />
                  ))}
                </div>
                <div className='mt-2 text-sm font-medium text-gray-800'>
                  {activeSection.name}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeSectionIndex === 0}
                  className={`px-5 py-2 rounded-lg border font-medium transition-colors ${activeSectionIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionIndex((prev) => Math.min(sections.length - 1, prev + 1))}
                  disabled={activeSectionIndex === sections.length - 1}
                  className={`px-5 py-2 rounded-lg border font-medium transition-colors ${activeSectionIndex === sections.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  Next
                </button>
              </div>

              {/* Form Content */}
              <div className='mt-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={handlePersonalInfoChange}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                    setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={handleExperienceChange}
                  />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={handleEducationChange}
                  />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={handleProjectChange}
                  />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={handleSkillsChange}
                  />
                )}

              </div>

              <button onClick={() => toast.promise(saveResume(), { loading: 'Saving...', success: 'Saved', error: 'Failed to save' })} className='mt-6 w-max inline-flex justify-center items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600'>
                Save Changes
              </button>

            </div>

          </div>

          {/* Right panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6 print:col-span-12 print:max-lg:mt-0'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2 p-4 print:hidden'>
                {resumeData.public && (
                  <button onClick={handleShare} className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-600 transition-all mt-5'>
                    <Share2Icon className='size-4' /> <span>Share</span>
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all mt-5'>
                  {resumeData.public ? <EyeIcon className='size-4 text-gray-600' /> : <EyeOffIcon className='size-4 text-gray-600' />}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button onClick={handleDownload} className='flex items-center p-2 px-4 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all mt-5'>
                  <DownloadIcon className='size-4' />
                  Download
                </button>
              </div>
              {/* ---buttons--- */}
            </div>
            {/* --resume preview-- */}
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />

          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder