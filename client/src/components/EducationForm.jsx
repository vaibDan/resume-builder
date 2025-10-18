import { PlusIcon, Trash2, Edit2, GraduationCap } from 'lucide-react'
import React, { useState } from 'react'

const EducationForm = ({ data = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(-1)

  const addEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      graduation_date: '',
      gpa: ''
    }
    onChange([...data, newEducation])
    setEditingIndex(data.length)
  }

  const updateEducation = (index, field, value) => {
    const updatedData = [...data]
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    }
    onChange(updatedData)
  }

  const deleteEducation = (index) => {
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Education</h3>
          <p className='text-sm text-gray-500'>Add your education details here</p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={addEducation}
            className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700'
          >
            <PlusIcon className='size-4' />
            Add Education
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8'>
          <GraduationCap className='size-10 justify-center mx-auto opacity-25' />
          <p className='text-gray-500 mb-4'>No education added yet</p>
          <button
            onClick={addEducation}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
          >
            <PlusIcon className='size-4' />
            Add Your First Education
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((education, index) => (
            <div key={index} className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  {editingIndex === index ? (
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Institution</label>
                          <input
                            type='text'
                            value={education.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. Stanford University'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Degree</label>
                          <input
                            type='text'
                            value={education.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. B.Sc., M.Sc., Ph.D.'
                          />
                        </div>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Field of Study</label>
                          <input
                            type='text'
                            value={education.field}
                            onChange={(e) => updateEducation(index, 'field', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. Computer Science'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Graduation Date</label>
                          <input
                            type='month'
                            value={education.graduation_date}
                            onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                          />
                        </div>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>GPA (optional)</label>
                          <input
                            type='text'
                            value={education.gpa}
                            onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. 3.8/4.0'
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className='font-semibold text-gray-900'>
                        {education.degree || 'Degree'} {education.field ? `in ${education.field}` : ''}
                      </h4>
                      <p className='text-gray-600'>{education.institution || 'Institution'}</p>
                      <p className='text-sm text-gray-500'>
                        {education.graduation_date || 'Graduation Date'}
                        {education.gpa ? ` • GPA: ${education.gpa}` : ''}
                      </p>
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
                    onClick={() => deleteEducation(index)}
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

export default EducationForm