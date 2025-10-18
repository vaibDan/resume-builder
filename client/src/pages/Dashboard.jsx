import { PlusIcon, UploadCloudIcon, FileTextIcon, EyeIcon, EditIcon, XIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { dummyResumeData } from '../assets/assets.js'
import {useNavigate} from 'react-router-dom'

const Dashboard = () => {
  const [resumes, setResumes] = useState(dummyResumeData)
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [showEditResume, setShowEditResume] = useState(false)
  const [editingResume, setEditingResume] = useState(null)
 
  const navigate = useNavigate()

  const createResume = async (event) => {
    event.preventDefault()
    setShowCreateResume(false)
    navigate(`/app/builder/res123`)
  }

  const handleFileUpload = (event) => {
    event.preventDefault()
    if (uploadedFile) {
      // Here you would typically upload the file to your server
      console.log('Uploading file:', uploadedFile.name)
      setShowUploadResume(false)
      setUploadedFile(null)
      // You can add navigation or success message here
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file)
      } else {
        alert('Please select a valid file (PDF, DOC, or DOCX)')
      }
    }
  }

  const handleEditResume = (resume) => {
    setEditingResume(resume)
    setTitle(resume.title)
    setShowEditResume(true)
  }

  const updateResume = async (event) => {
    event.preventDefault()
    if (editingResume && title.trim()) {
      // Update the resume in the state
      const updatedResumes = resumes.map(resume => 
        resume._id === editingResume._id 
          ? { ...resume, title: title.trim(), updatedAt: new Date().toISOString() }
          : resume
      )
      setResumes(updatedResumes)
      setShowEditResume(false)
      setEditingResume(null)
      setTitle('')
    }
  }

  const deleteResume = async (resumeId) => {
    const confirm = window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')
    if (confirm) {
      setResumes(prev => prev.filter(resume => resume._id !== resumeId))
    }
  }

  const colors = [
    {
      bg: 'bg-green-200',
      text: 'text-green-900',
      iconBg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      hoverBg: 'hover:bg-green-50',
      border: 'border-green-200'
    },
    {
      bg: 'bg-blue-200',
      text: 'text-blue-900',
      iconBg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      hoverBg: 'hover:bg-blue-50',
      border: 'border-blue-200'
    },
    {
      bg: 'bg-purple-200',
      text: 'text-purple-900',
      iconBg: 'bg-gradient-to-r from-purple-500 to-pink-600',
      hoverBg: 'hover:bg-purple-50',
      border: 'border-purple-200'
    }
  ]

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8 mt-20'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
          Welcome, Vaibhav
        </p>
        <div className="flex flex-row gap-4">
          <button onClick={()=> setShowCreateResume(true)} className="flex flex-col items-center justify-center gap-2 px-6 py-10 bg-green-200 text-green-900 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl">
            <PlusIcon size={38} />
            <span className="text-xl font-semibold">Create Resume</span>
          </button>
          <button onClick={() => setShowUploadResume(true)} className="flex flex-col items-center justify-center gap-2 px-6 py-10 bg-green-200 text-green-900 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl">
            <UploadCloudIcon size={38} />
            <span className="text-xl font-semibold">Upload Resume</span>
          </button>
        </div>

        <hr className='border-slate-300 my-6 sm:w-[400px]' />

         {showCreateResume && (
           <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50" onClick={() => setShowCreateResume(false)}>
             <div 
               className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300"
               onClick={e => e.stopPropagation()}
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Create New Resume</h2>
                 <button 
                   onClick={() => {
                     setShowCreateResume(false)
                     setTitle('')
                   }}
                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <XIcon onClick={()=> deleteResume(resume._id)} size={24} className="text-slate-600" />
                 </button>
               </div>
               
               <form onSubmit={createResume} className="space-y-6">
                 <div>
                   <label htmlFor="resumeTitle" className="block text-sm font-medium text-slate-700 mb-2">
                     Resume Title
                   </label>
                   <input 
                     id="resumeTitle"
                     type="text" 
                     placeholder="Enter resume title (e.g., Software Engineer Resume)" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     required 
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                   />
                 </div>
                 
                 <div className="flex gap-3 pt-4">
                   <button 
                     type="button"
                     onClick={() => {
                       setShowCreateResume(false)
                       setTitle('')
                     }}
                     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                   >
                     Create Resume
                   </button>
                 </div>
               </form>
             </div>
           </div>
         )}

         {showUploadResume && (
           <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50" onClick={() => setShowUploadResume(false)}>
             <div 
               className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300"
               onClick={e => e.stopPropagation()}
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Upload Resume</h2>
                 <button 
                   onClick={() => setShowUploadResume(false)}
                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <XIcon size={24} className="text-slate-600" />
                 </button>
               </div>
               
               <form onSubmit={handleFileUpload} className="space-y-6">
                 <div className="space-y-4">
                   <label htmlFor="fileInput" className="block text-sm font-medium text-slate-700">
                     Select Resume File
                   </label>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                     <input
                       id="fileInput"
                       type="file"
                       accept=".pdf,.doc,.docx"
                       onChange={handleFileChange}
                       className="hidden"
                       required
                     />
                     <label htmlFor="fileInput" className="cursor-pointer">
                       <UploadCloudIcon size={48} className="mx-auto text-gray-400 mb-4" />
                       <p className="text-gray-600 mb-2">Click to browse files or</p>
                       <button type="button" className="text-green-600 font-medium hover:text-green-700">
                         Choose File
                       </button>
                       <p className="text-sm text-gray-500 mt-2">Supports PDF, DOC, DOCX files</p>
                     </label>
                   </div>
                   {uploadedFile && (
                     <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                       <div className="flex items-center gap-3">
                         <FileTextIcon size={24} className="text-green-600" />
                         <div>
                           <p className="font-medium text-green-800">{uploadedFile.name}</p>
                           <p className="text-sm text-green-600">
                             {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                           </p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
                 
                 <div className="flex gap-3">
                   <button 
                     type="button"
                     onClick={() => {
                       setShowUploadResume(false)
                       setUploadedFile(null)
                     }}
                     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     disabled={!uploadedFile}
                     className={`flex-1 px-6 py-3 rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl ${
                       uploadedFile 
                         ? 'bg-green-600 text-white hover:bg-green-700' 
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
                   >
                     Upload Resume
                   </button>
                 </div>
               </form>
             </div>
           </div>
         )}

         {showEditResume && (
           <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50" onClick={() => setShowEditResume(false)}>
             <div 
               className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300"
               onClick={e => e.stopPropagation()}
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Edit Resume</h2>
                 <button 
                   onClick={() => {
                     setShowEditResume(false)
                     setEditingResume(null)
                     setTitle('')
                   }}
                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <XIcon size={24} className="text-slate-600" />
                 </button>
               </div>
               
               <form onSubmit={updateResume} className="space-y-6">
                 <div>
                   <label htmlFor="editResumeTitle" className="block text-sm font-medium text-slate-700 mb-2">
                     Resume Title
                   </label>
                   <input 
                     id="editResumeTitle"
                     type="text" 
                     placeholder="Enter resume title" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     required 
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                   />
                 </div>
                 
                 {editingResume && (
                   <div className="bg-gray-50 rounded-xl p-4">
                     <h4 className="font-medium text-slate-700 mb-2">Current Resume Details:</h4>
                     <div className="space-y-1 text-sm text-slate-600">
                       <p><span className="font-medium">Name:</span> {editingResume.personal_info.full_name}</p>
                       <p><span className="font-medium">Profession:</span> {editingResume.personal_info.profession}</p>
                       <p><span className="font-medium">Location:</span> {editingResume.personal_info.location}</p>
                       <p><span className="font-medium">Template:</span> {editingResume.template.replace('-', ' ')}</p>
                     </div>
                   </div>
                 )}
                 
                 <div className="flex gap-3 pt-4">
                   <button 
                     type="button"
                     onClick={() => {
                       setShowEditResume(false)
                       setEditingResume(null)
                       setTitle('')
                     }}
                     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                   >
                     Update Resume
                   </button>
                 </div>
               </form>
             </div>
           </div>
         )}

        {/* Resume List Section */}
        <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-4 text-slate-700'>All Resumes</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {resumes.map((resume, index) => {
              const colorScheme = colors[index % colors.length]
              return (
                <div
                  key={resume._id}
                  className={`${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${colorScheme.iconBg} rounded-full flex items-center justify-center`}>
                        <FileTextIcon size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{resume.title}</h3>
                        <p className="text-sm opacity-80">{resume.personal_info.profession}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=> navigate(`/app/builder/${resume._id}`)} className={`p-2 ${colorScheme.text} ${colorScheme.hoverBg} rounded-lg transition-colors`}>
                        <EyeIcon size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditResume(resume)}
                        className={`p-2 ${colorScheme.text} ${colorScheme.hoverBg} rounded-lg transition-colors`}
                      >
                        <EditIcon size={18} />
                      </button>
                      <button 
                        onClick={() => deleteResume(resume._id)}
                        className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                        title="Delete Resume"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm opacity-80">
                      <span className="font-medium">Name:</span> {resume.personal_info.full_name}
                    </p>
                    <p className="text-sm opacity-80">
                      <span className="font-medium">Location:</span> {resume.personal_info.location}
                    </p>
                    <p className="text-sm opacity-80">
                      <span className="font-medium">Template:</span> {resume.template.replace('-', ' ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${resume.public
                        ? 'bg-white bg-opacity-30 text-current'
                        : 'bg-white bg-opacity-20 text-current'
                      }`}>
                      {resume.public ? 'Public' : 'Private'}
                    </span>
                    <span className="text-xs opacity-70">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard