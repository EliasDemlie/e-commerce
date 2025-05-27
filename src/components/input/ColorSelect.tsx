'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { UploadDropzone } from '@/hooks/utils/uploadthing'
import { toast } from '../ui/use-toast'

import Button from './Button'

interface ColorSelectProps {
  item: ImageType
  addImageToState: (value: ImageType) => void
  RemoveImageFromState: (value: ImageType) => void
  isProductCreated: boolean
}
export interface ImageType {
  color: string
  colorCode?: string
  image: string
}
const ColorSelect: React.FC<ColorSelectProps> = ({
  item,
  addImageToState,
  RemoveImageFromState,
  isProductCreated,
}) => {
  const [isSelected, setIsSelected] = useState(false)

  const [selectedFile, setSelectedFile] = useState<ImageType | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  console.log(isUploading)
  // Reset file and selection when product is created
  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false)
      setSelectedFile(null)
    }
  }, [isProductCreated])

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked)
      if (!e.target.checked) {
        setSelectedFile(null)
        RemoveImageFromState(item)
      }
    },
    [item, RemoveImageFromState]
  )

  const handleUploadComplete = (
    res: { url: string; key: string; ufsUrl?: string }[]
  ) => {
    const uploadedFile = res[0]

    const transformedImage: ImageType = {
      ...item,
      image: uploadedFile.ufsUrl ?? uploadedFile.url,
    }

    setSelectedFile(transformedImage)
    addImageToState(transformedImage)
  }

  const handleUploadError = (error: Error) => {
    toast({ title: `ERROR! ${error.message}` })
    setIsUploading(false)
    setSelectedFile(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 mb-2 p-2 gap-2 items-center">
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          id={item.color}
          value={item.color}
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label htmlFor={item.color} className="cursor-pointer">
          {item.color}
        </label>
      </div>

      {isSelected && (
        <div className="col-span-2 text-center">
          <UploadDropzone
            className="p-2 border border-gray-600"
            endpoint="imageUploader" // Adjust endpoint if needed
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </div>
      )}

      {selectedFile && (
        <div className="text-center mt-4">
          {/* <Image
            src={`${selectedFile.image}`}
            alt="Uploaded preview"
            width={100}
            height={100}
            className="max-w-xs"
          /> */}
          <Button
            label="Remove"
            onClick={() => {
              setSelectedFile(null)
              RemoveImageFromState(item)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ColorSelect
