import React from 'react'
import { Sparkles } from 'lucide-react'

const ProfessionalSummaryForm = ({data, onChange, setResumeData}) => {
  return (
    <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
            <p className='text-sm text-gray-500'> Add Summary for your resume here</p>
            </div>
            <button className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700'>
                <Sparkles className='size-4'/>
                AI Enhance.
            </button>
        </div>
        <div className='mt-6'>
            <textarea value={data || ''} onChange={(e)=> onChange(e.target.value)} rows={7} name="" id="" className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'/>
        </div>
        <p className='text-sm text-gray-500'>keep it concise (3-5 sentences) and focus on your most relevant achievements and skills.</p>
    </div>
  )
}

export default ProfessionalSummaryForm  