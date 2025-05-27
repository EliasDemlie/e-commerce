'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  CheckCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import type { SafeUser } from '@/type/SafeUser'

interface RegisterFormData {
  name: string
  email: string
  password: string
}

interface RegisterProps {
  currentUser: SafeUser | null
}

export default function RegisterPage({ currentUser }: RegisterProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const password = watch('password')

  useEffect(() => {
    if (currentUser) {
      toast('You are already logged in.')
      router.push('/cart')
      router.refresh()
    }
  }, [currentUser, router])

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      toast.success('Registered successfully!')

      const loginResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (loginResult?.ok) {
        toast.success('Logged in!')
        router.push('/cart')
        router.refresh()
      } else if (loginResult?.error) {
        toast.error('Login failed. Please check your credentials.')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Something went wrong!')
      } else {
        toast.error('An unexpected error occurred!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)

    try {
      const result = await signIn('google', { redirect: false })

      if (result?.ok) {
        toast.success('Signed up with Google!')
        router.push('/cart')
        router.refresh()
      } else {
        toast.error('Google sign-up failed!')
      }
    } catch (error) {
      console.log(error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[A-Z]/, text: 'One uppercase letter' },
      { regex: /[a-z]/, text: 'One lowercase letter' },
      { regex: /\d/, text: 'One number' },
      { regex: /[@$!%*?&]/, text: 'One special character' },
    ]

    return requirements.map((req) => ({
      ...req,
      met: req.regex.test(password),
    }))
  }

  const passwordRequirements = getPasswordStrength(password || '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 ">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-1 gap-8 items-center min-h-[calc(100vh-4rem)]">
         

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-900 to-teal-600 dark:from-emerald-100 dark:to-teal-400 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Sign up to get started with your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 h-12"
                        disabled={isLoading}
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                          maxLength: {
                            value: 50,
                            message: 'Name must be less than 50 characters',
                          },
                          pattern: {
                            value: /^[a-zA-Z\s-]+$/,
                            message:
                              'Name can only contain letters, spaces, or hyphens',
                          },
                        })}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12"
                        disabled={isLoading}
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Please enter a valid email address',
                          },
                          maxLength: {
                            value: 100,
                            message: 'Email must be less than 100 characters',
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12"
                        disabled={isLoading}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: 'Password must meet all requirements',
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}

                    {password && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Password requirements:
                        </p>
                        {passwordRequirements.map((req, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs"
                          >
                            <CheckCircle
                              className={`h-3 w-3 ${
                                req.met ? 'text-emerald-500' : 'text-slate-300'
                              }`}
                            />
                            <span
                              className={
                                req.met ? 'text-emerald-600' : 'text-slate-500'
                              }
                            >
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
                    disabled={isLoading || Object.keys(errors).length > 0}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  {isLoading ? 'Connecting...' : 'Continue with Google'}
                </Button>

                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link
                    href="/signin"
                    className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
