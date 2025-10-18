import React from 'react'
import { Palette } from 'lucide-react'

const ColorPicker = ({ selectedColor, onChange }) => {

    const colors = [
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Green', value: '#10b981' },
        { name: 'Yellow', value: '#f59e0b' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Gray', value: '#6b7280' },
        {name: 'Black', value: '#000000'},
    ]
    const [isOpen, setIsOpen] = React.useState(false);
    
    // Find the selected color name based on the selectedColor value
    const selectedColorName = colors.find(color => color.value === selectedColor)?.name || 'Select';

     const handleSelect = (color) => {
        onChange(color.value);
        setIsOpen(false);
    }

  return (
    <div className='relative'>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className='flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100'
      >
        <Palette size={14}/>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full border border-gray-300" 
            style={{ backgroundColor: selectedColor }}
          ></div>
          <span className='max-sm:hidden'>{selectedColorName}</span>
        </div>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20'>
          {colors.map((color) => (
            <div 
              key={color.value} 
              className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 ${
                selectedColor === color.value ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
              onClick={() => handleSelect(color)}
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-300" 
                style={{ backgroundColor: color.value }}
              ></div>
              <div>
                <div className='font-medium'>{color.name}</div>
                {/* <div className='text-sm text-gray-500'>{color.value}</div> */}
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
  )
}

export default ColorPicker