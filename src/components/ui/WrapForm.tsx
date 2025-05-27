import React from 'react'

const WrapForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-fit
    h-full
    flex
    items-center
    justify-center
    pb-12
    pt-6'>
      <div className='
      max-w-[600px]
      w-full
      flex-col
      gap-6
      items-center
      shadow-xl
      rounded-md
      p-4
      md:p-8
      
      '>
        {children}
      </div>
    </div>
  )
}

export default WrapForm
