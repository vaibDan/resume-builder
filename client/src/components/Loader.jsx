import React from 'react'
import { Loader as Icon } from 'lucide-react'

export const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Icon className="animate-spin" />
  </div>
)

export default Loader
