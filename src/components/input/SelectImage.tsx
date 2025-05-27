'use client'

import { useCallback } from 'react'
import { ImageType } from '../manager/addst'
import { useDropzone } from 'react-dropzone'

interface SelectImageProps {
  item?: ImageType
  handleFileChange: (value: File | null) => void
}

const SelectImage: React.FC<SelectImageProps> = ({
  item,
  handleFileChange,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0])
      }
    },
    [handleFileChange]
  )
  console.log('item', item)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    // maxFiles: 1,
    // multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-400 rounded-lg cursor-pointer hover:border-black transition"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p className="text-[10px]">
        Drag and drop here</p>
      )}
    </div>
  )
}

export default SelectImage
