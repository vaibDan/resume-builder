import React from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../configs/api';

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {

    const { token } = useSelector((state) => state.auth);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateSummary = async () => {
        try {
            setIsGenerating(true);
            const prompt = `enhance my professional summary "${data}" to make it more impressive and impactful.`;
            const response = await api.post('/api/ai/enhance-pro-sum',
                { userContent: prompt },
                { headers: { Authorization: token } })
            setResumeData((prev) => ({
                ...prev, professional_summary: response.data.
                    enhanceContent
            }));

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                    <p className='text-sm text-gray-500'> Add Summary for your resume here</p>
                </div>
                <button disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700'>
                    {isGenerating ? (<Loader2 className='size-4 animate-spin' />) :
                        (<Sparkles className='size-4' />)}

                    {isGenerating ? 'Enhancing...' : 'AI Enhance.'}
                </button>
            </div>
            <div className='mt-6'>
                <textarea value={data || ''} onChange={(e) => onChange(e.target.value)} rows={7} name="" id="" className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...' />
            </div>
            <p className='text-sm text-gray-500'>keep it concise (3-5 sentences) and focus on your most relevant achievements and skills.</p>
        </div>
    )
}

export default ProfessionalSummaryForm  