import { PlusIcon, Sparkles, XIcon } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({ data = [], onChange }) => {

    const [newSkill, setNewSkill] = useState('')

    const addSkill = () => {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill('')
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSkill()
        }
    }

    return (
    <div className='space-y-4'>
        <div> <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
            <p className='text-sm text-gray-500'>Add your technical and soft skills</p>
        </div>

        <div className="flex items-start gap-3">
            <div className="flex-1">
                <input 
                    type="text"
                    placeholder={'Enter a skill (e.g., JavaScript, Node.js, React)'}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full rounded-lg border border-blue-300 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Add a skill"
                />
            </div>

            <div className="pt-1">
                <button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-disabled={!newSkill.trim()}
                >
                    <PlusIcon className="size-5" />
                    <span className="font-medium">Add</span>
                </button>
            </div>
        </div>

        {data.length > 0 ? (
            <div>
                <div className="flex flex-wrap gap-2">
                    {data.map((skill, index) => (
                        <div key={index} className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm">
                            <span className="font-medium">{skill}</span>
                            <button
                                onClick={() => removeSkill(index)}
                                aria-label={`Remove ${skill}`}
                                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300"
                            >
                                <XIcon className="size-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className='text-center py-8'>
                <Sparkles className='mx-auto mb-2 size-8 opacity-30' />
                <p className='text-sm text-gray-500'>No skills added yet.</p>
                <p>Add your technical and soft skills above.</p>
            </div>
        )}
        <div className='bg-blue-50 p-3 rounded-lg'>
            <p className='text-sm text-blue-800'> <strong>Tip:</strong> Add 8-12 relevant skills. Include both technical (programming languages, tools) and soft skills (communication, leadership).</p>
        </div>
    </div>
    )
}

export default SkillsForm