import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import { dummyResumeData } from '../assets/assets'
import { ArrowBigLeftIcon, DownloadIcon, EyeIcon, EyeOffIcon, Share2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../configs/api'


const Preview = () => {
  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId)
      setResumeData(data.resume)
    } catch (error) {
      console.log(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 
    loadResume() 
  }, [resumeId])

  const handleShare = () => {
    // Use origin so share links don't accidentally duplicate paths
    const frontendUrl = window.location.origin
    const resumeUrl = frontendUrl + '/view/' + resumeId
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'Check out my resume!' })
    } else {
      navigator.clipboard?.writeText(resumeUrl)
      alert('Resume URL copied to clipboard')
    }
  }

  const handleToggleVisibility = () => {
    // this is a demo/local preview; real apps should call an API
    setResumeData(prev => ({ ...prev, public: !prev.public }))
  }

  const handleDownload = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 mx-auto mb-3" />
          <div className="text-sm text-gray-600">Loading resume preview…</div>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-700">
          404 | Resume Not Found
        </h1>
        <div className="h-px w-60 bg-slate-300 my-5 md:my-7"></div>
        <p className="md:text-lg text-slate-500 max-w-lg">
          The resume you are looking for does not exist or has been moved.
        </p>
        <Link to="/app" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-2.5 text-white rounded-md mt-10 font-medium active:scale-95 transition-all">
          Back to Dashboard
        </Link>
      </div>
    )
  }


  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <div className='flex items-center justify-between mb-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500'>
          <ArrowBigLeftIcon className='size-4' /> Back to Dashboard
        </Link>

        <div className='flex items-center gap-2'>
          {resumeData.public && (
            <button onClick={handleShare} className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-md'>
              <Share2Icon className='size-4' /> Share
            </button>
          )}

          <button onClick={handleToggleVisibility} className='flex items-center p-2 px-4 gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md'>
            {resumeData.public ? <EyeIcon className='size-4 text-gray-600' /> : <EyeOffIcon className='size-4 text-gray-600' />}
            {resumeData.public ? 'Public' : 'Private'}
          </button>

          <button onClick={handleDownload} className='flex items-center p-2 px-4 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md'>
            <DownloadIcon className='size-4' /> Download
          </button>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        {/* handle server/client key name mismatch for accent color */}
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color || resumeData.ascent_color} />
      </div>
    </div>
  )
}

export default Preview