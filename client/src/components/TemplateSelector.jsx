import { Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
      {
        id: 'classic',
        name: 'Classic',
        preview: "A traditional resume layout with a focus on clarity and organization."
      },
      {
        id: 'minimal',
        name: 'Minimal',
        preview: "A clean and simple resume layout with a focus on essential information."
      },
      {
        id: 'modern',
        name: 'Modern',
        preview: "A sleek and contemporary resume design with a focus on minimalism."
      },
      {
        id: 'minimal-image',
        name: 'Minimal-Image',
        preview: "A unique and artistic resume layout that showcases your personality."
      }
    ]

  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100'>
        <Layout size={14}/> <span className='max-sm:hidden'>Template</span>
      </button>
      {isOpen && (
        <div className='absolute left-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white border rounded-md shadow-lg z-20'>
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedTemplate === template.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
              onClick={() => {
                onChange(template.id)
                setIsOpen(false)
              }}
            >
              <div className='font-medium text-gray-800'>{template.name}</div>
              <div className='text-sm text-gray-500 leading-relaxed break-words'>{template.preview}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateSelector