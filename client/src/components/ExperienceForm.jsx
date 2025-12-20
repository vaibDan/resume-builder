import { PlusIcon, Sparkles, Trash2, Edit2, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import api from '../configs/api';

const ExperienceForm = ({ data = [], onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [editingIndex, setEditingIndex] = useState(-1)
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addExperience = () => {
    const newExperience = {
      position: '',
      company: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
    }
    onChange([...data, newExperience])
    setEditingIndex(data.length)
  }

  const updateExperience = (index, field, value) => {
    const updatedData = [...data]
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    }
    onChange(updatedData)
  }

  const deleteExperience = (index) => {
    const updatedData = data.filter((_, i) => i !== index)
    onChange(updatedData)
    if (editingIndex === index) {
      setEditingIndex(-1)
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1)
    }
  }

  const toggleEdit = (index) => {
    setEditingIndex(editingIndex === index ? -1 : index)
  }

  // const aiEnhance = () => {
  //   // Placeholder for AI enhancement functionality
  //   console.log('AI Enhance clicked for experience section')
  // }

  const generatingDescription = async (index) => {
    // mark which entry is being enhanced (spinner uses this)
    setGeneratingIndex(index);
    // Ensure editor is open while enhancement runs
    setEditingIndex(index);
    const experience = data[index];
    // Use the client-side field names (position) when building the prompt
    const prompt = `Enhance this job description ${experience.description} for the
    position of ${experience.position} at ${experience.company}.`

    try {
      const { data } = await api.post('/api/ai/enhance-job-desc',
        { userContent: prompt },
        { headers: { Authorization: token } });
      updateExperience(index, 'description', data.enhanceContent
      )
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    finally {
      // clear only the generating flag (keep editing open if needed)
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
          <p className='text-sm text-gray-500'>Add your work experience here</p>
        </div>
        <div className='flex gap-2'>
          
          <button
            onClick={addExperience}
            className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700'
          >
            <PlusIcon className='size-4' />
            Add Experience
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500 mb-4'>No work experience added yet</p>
          <button
            onClick={addExperience}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
          >
            <PlusIcon className='size-4' />
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((experience, index) => (
            <div key={index} className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  {editingIndex === index ? (
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Position</label>
                          <input
                            type='text'
                            value={experience.position}
                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. Software Engineer'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Company</label>
                          <input
                            type='text'
                            value={experience.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. Google Inc.'
                          />
                        </div>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>

                        <div className='flex gap-2'>
                          <div className='flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Start Date</label>
                            <input
                              type='month'
                              value={experience.start_date}
                              onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            />
                          </div>
                          <div className='flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>End Date</label>
                            <input
                              type='month'
                              value={experience.end_date}
                              onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                              disabled={experience.is_current}
                              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100'
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          id={`current-${index}`}
                          checked={experience.is_current}
                          onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                          className='rounded border-gray-300'
                        />
                        <label htmlFor={`current-${index}`} className='text-sm text-gray-700'>
                          I currently work here
                        </label>
                      </div>
                      <div className='flex space-y'>
                        <button
                          onClick={() => generatingDescription(index)}
                          disabled={generatingIndex === index || !experience.position || !experience.company}
                          className='flex items-center gap-2 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700'
                        >
                          {generatingIndex === index ? (
                            <Loader2 className='size-4 animate-spin' />
                          ) : (
                              <Sparkles className='size-4' />
                          )}
                          AI Enhance 
                        </button>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'> Job Description</label>
                        <textarea
                          value={experience.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          rows={3}
                          className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                          placeholder='Describe your key responsibilities and achievements...'
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                        <h4 className='font-semibold text-gray-900'>{experience.position || 'Position'}</h4>
                      <p className='text-gray-600'>{experience.company || 'Company Name'}</p>
                      <p className='text-sm text-gray-500'>
                          {experience.start_date || 'Start Date'} - {experience.is_current ? 'Present' : (experience.end_date || 'End Date')}
                        {experience.location && ` • ${experience.location}`}
                      </p>
                      {experience.description && (
                        <p className='text-sm text-gray-700 mt-2'>{experience.description}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className='flex gap-2 ml-4'>
                  <button
                    onClick={() => toggleEdit(index)}
                    className='p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md'
                  >
                    <Edit2 className='size-4' />
                  </button>
                  <button
                    onClick={() => deleteExperience(index)}
                    className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md'
                  >
                    <Trash2 className='size-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm