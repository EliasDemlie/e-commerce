'use client'

import React, { useState } from 'react'
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps {
  id: string
  label: string
  type?: string
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  validation?: object
  showPasswordToggle?: boolean
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  disabled = false,
  required = false,
  register,
  errors,
  validation,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const inputType =
    showPasswordToggle && type === 'password' && showPassword ? 'text' : type

  return (
    <div className="w-full relative mt-6">
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, {
          required: required ? 'This field is required' : false,
          ...validation,
        })}
        placeholder=""
        type={inputType}
        className={`
          peer
          w-full
          p-3
          pt-6
          outline-none
          border-white
          border-2
          rounded-md
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${errors[id] ? 'border-rose-400' : 'border-slate-300'}
          ${errors[id] ? 'focus:border-rose-400' : 'focus:border-slate-300'}
        `}
      />
      <label
        htmlFor={id}
        className={`
          absolute
          cursor-text
          duration-150
          transform
          -translate-y-3
          text-md
          text-blue-500
          top-4
          z-10
          origin-[0]
          left-4
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-5
          ${errors[id] ? 'text-rose-400' : 'text-blue-500'}
          ${errors[id] ? 'focus:text-rose-400' : 'focus:text-slate-300'}
        `}
      >
        {label}
      </label>
      {showPasswordToggle && type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
      {errors[id] && (
        <p className="text-rose-400 text-sm mt-1 font-medium">
          {errors[id]?.message?.toString()}
        </p>
      )}
    </div>
  )
}


export default Input
