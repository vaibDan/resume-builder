import React, { useState } from 'react'
import { PlusIcon, Trash2, Edit2 } from 'lucide-react'

const ProjectForm = ({ data = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(-1)
  
    const addProject = () => {
      const newProject = {
        name: '',
        type: '',
        description: '',
        link: ''
      }
      onChange([...data, newProject])
      setEditingIndex(data.length)
    }
  
    const updateProject = (index, field, value) => {
      const updatedData = [...data]
      updatedData[index] = {
        ...updatedData[index],
        [field]: value
      }
      onChange(updatedData)
    }
  
    const deleteProject = (index) => {
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
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
          <p className='text-sm text-gray-500'>Add your projects here</p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={addProject}
            className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700'
          >
            <PlusIcon className='size-4' />
            Add Project
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500 mb-4'>No projects added yet</p>
          <button
            onClick={addProject}
            className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
          >
            <PlusIcon className='size-4' />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((project, index) => (
            <div key={index} className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  {editingIndex === index ? (
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Project Name</label>
                          <input
                            type='text'
                            value={project.name}
                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. Resume Builder App'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Type</label>
                          <input
                            type='text'
                            value={project.type}
                            onChange={(e) => updateProject(index, 'type', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='e.g. Web, Mobile, CLI'
                          />
                        </div>
                      </div>
                      
                      <div className='grid grid-cols-1 gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Link</label>
                          <input
                            type='url'
                            value={project.link}
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                            placeholder='https://github.com/username/project'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                          rows={3}
                          className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                          placeholder='Describe the project, technologies used, and impact...'
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                        <h4 className='font-semibold text-gray-900'>{project.name || 'Project Name'}</h4>
                      <p className='text-gray-600'>{project.type || 'Type'}</p>
                      <p className='text-sm text-gray-500'>
                        {project.link && (
                          <a href={project.link} target='_blank' rel='noreferrer' className='text-blue-600 hover:underline'>
                            {project.link}
                          </a>
                        )}
                      </p>
                      {project.description && (
                        <p className='text-sm text-gray-700 mt-2'>{project.description}</p>
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
                    onClick={() => deleteProject(index)}
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

export default ProjectForm