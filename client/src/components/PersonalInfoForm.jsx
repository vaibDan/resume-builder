import React, { useRef, useEffect } from 'react'
import { Upload, User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase } from 'lucide-react'
import { useForm } from 'react-hook-form'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
  const fileInputRef = useRef(null)

  // Initialize React Hook Form
  const {
    register,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: data,
    mode: 'onChange' // Validate on change
  })

  // Watch only the fields managed by React Hook Form
  const fullName = watch('full_name')
  const email = watch('email')

  useEffect(() => {
    // Only update the fields managed by React Hook Form
    onChange({
      ...data,
      full_name: fullName,
      email: email
    })
  }, [fullName, email])

  const handleInputChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('image', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    handleInputChange('image', null)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Personal Information</h3>
        <p className='text-sm text-gray-600'>Complete your personal details to get started</p>
      </div>

      {/* Profile Image Section */}
      <div className='space-y-4'>
        <label className='block text-sm font-medium text-gray-700'>Profile Picture</label>
        <div className='flex items-center gap-4'>
          <div 
            className='relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-center bg-gray-50'
            onClick={handleImageClick}
          >
            {data.image ? (
              <div className='relative w-full h-full'>
                <img 
                  src={data.image} 
                  alt="Profile" 
                  className='w-full h-full object-cover rounded-lg' 
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage()
                  }}
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600'
                >
                  ×
                </button>
              </div>
            ) : (
              <div className='text-center'>
                <Upload className='w-6 h-6 text-gray-400 mx-auto mb-1' />
                <span className='text-xs text-gray-500'>Upload</span>
              </div>
            )}
          </div>
          <div className='flex-1'>
            <p className='text-sm text-gray-600 mb-2'>Upload a professional photo (optional)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className='hidden'
            />
            <button
              type="button"
              onClick={handleImageClick}
              className='text-sm text-blue-600 hover:text-blue-700 font-medium'
            >
              Choose Photo
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Full Name */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            <User className='w-4 h-4 inline mr-2' />
            Full Name *
          </label>
          <input
            type="text"
            {...register("full_name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter your full name"
          />
          {errors.full_name && (
            <span className='text-sm text-red-500'>{errors.full_name.message}</span>
          )}
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            <Mail className='w-4 h-4 inline mr-2' />
            Email *
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <span className='text-sm text-red-500'>{errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            <Phone className='w-4 h-4 inline mr-2' />
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
            placeholder="+91 1234567890"
          />
        </div>

        {/* Location */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            <MapPin className='w-4 h-4 inline mr-2' />
            Location
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
            placeholder="City, State, Country"
          />
        </div>

        {/* Profession */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            <Briefcase className='w-4 h-4 inline mr-2' />
            Profession 
          </label>
          <input
            type="text"
            value={data.profession || ''}
            onChange={(e) => handleInputChange('profession', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
            placeholder="e.g. Software Engineer"
            required
          />
        </div>

        {/* LinkedIn */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            <Linkedin className='w-4 h-4 inline mr-2' />
            LinkedIn
          </label>
          <input
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* Website */}
        <div className='space-y-2 md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700'>
            <Globe className='w-4 h-4 inline mr-2' />
            Website/Portfolio
          </label>
          <input
            type="url"
            value={data.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      {/* Background Removal Option */}
      <div className='border-t pt-4'>
        <div className='flex items-center justify-between'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Background Removal
            </label>
            <p className='text-xs text-gray-500'>
              Remove background from your profile photo for a cleaner look
            </p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type="checkbox"
              checked={removeBackground}
              onChange={(e) => setRemoveBackground(e.target.checked)}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm