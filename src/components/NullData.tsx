import React from 'react'
import { AlertTriangle } from 'lucide-react' 

interface NullDataProps {
  title: string
}

const NullData: React.FC<NullDataProps> = ({ title }) => {
  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
      <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
      <h1 className="text-xl md:text-2xl font-semibold text-gray-700">
        {title}
      </h1>
      <p className="text-gray-500">You might not have access to this page.</p>
    </div>
  )
}

export default NullData
