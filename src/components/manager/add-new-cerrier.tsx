'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button2'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Truck, CheckCircle2, UserCog, Key } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
//import type { Carrier } from '@/type/Carrier'

interface AddCarrierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCarrierAdded: () => void
}

export default function AddCarrierDialog({
  open,
  onOpenChange,
  onCarrierAdded,
}: AddCarrierDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [zone, setZone] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const zones = [
    'Downtown',
    'North Side',
    'South Side',
    'East Side',
    'West Side',
    'Suburbs',
    'All Areas',
  ]

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setContactPhone('')
    setVehicle('')
    setZone('')
    setIsActive(false)
    setError(null)
    setIsSubmitting(false)
    setIsComplete(false)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.')
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Name, email, and password are required.',
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const carrierData = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        contactPhone: contactPhone.trim() || undefined,
        vehicle: vehicle.trim() || undefined,
        zone: zone || undefined,
        isActive,
        role: 'CARRIER' as const,
      }

      const response = await fetch('/api/register/carrier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carrierData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(
          responseData.error || `HTTP error! status: ${response.status}`
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: 'Carrier Created',
        description: `The carrier ${name} has been successfully created.`,
      })

      setIsComplete(true)
      setIsSubmitting(false)

      // Auto-close after 3 seconds if user doesn't interact
      setTimeout(() => {
        if (open) {
          resetForm()
          onCarrierAdded()
          onOpenChange(false)
        }
      }, 3000)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create carrier. Please try again.'
      setError(errorMessage)
      setIsSubmitting(false)

      toast({
        variant: 'destructive',
        title: 'Error Creating Carrier',
        description: errorMessage,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="max-w-md bg-[#f8f9fa] border-[#e0e4e8] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="bg-[#4a6bff] text-white p-4">
          <DialogTitle className="text-xl font-bold flex items-center">
            <UserCog className="mr-2 h-5 w-5" />
            Add New Carrier
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && !isComplete && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <div className="flex items-center">
                  <div className="text-red-500 text-sm font-medium">Error:</div>
                </div>
                <div className="text-red-700 text-sm mt-1">{error}</div>
              </div>

              <Card className="border-[#e0e4e8] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Truck className="h-5 w-5 text-[#4a6bff] mr-2" />
                    <h3 className="font-medium text-[#2d3748]">
                      Carrier Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter carrier name"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        type="email"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          type="password"
                          className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                        />
                        <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5a6474]" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Contact Phone
                      </Label>
                      <Input
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Enter contact phone"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Vehicle
                      </Label>
                      <Input
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        placeholder="Enter vehicle type (e.g., Van)"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">Zone</Label>
                      <Select value={zone} onValueChange={setZone}>
                        <SelectTrigger className="border-[#e0e4e8] focus:ring-[#4a6bff] text-sm">
                          <SelectValue placeholder="Select delivery zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="isActive"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label
                        htmlFor="isActive"
                        className="cursor-pointer text-[#5a6474]"
                      >
                        Set as active immediately
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!error && !isComplete && !isSubmitting && (
            <div className="space-y-4">
              <Card className="border-[#e0e4e8] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Truck className="h-5 w-5 text-[#4a6bff] mr-2" />
                    <h3 className="font-medium text-[#2d3748]">
                      Carrier Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter carrier name"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        type="email"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          type="password"
                          className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                        />
                        <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5a6474]" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Contact Phone
                      </Label>
                      <Input
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Enter contact phone"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">
                        Vehicle
                      </Label>
                      <Input
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        placeholder="Enter vehicle type (e.g., Van)"
                        className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-[#5a6474] mb-1 block">Zone</Label>
                      <Select value={zone} onValueChange={setZone}>
                        <SelectTrigger className="border-[#e0e4e8] focus:ring-[#4a6bff] text-sm">
                          <SelectValue placeholder="Select delivery zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="isActive"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label
                        htmlFor="isActive"
                        className="cursor-pointer text-[#5a6474]"
                      >
                        Set as active immediately
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isSubmitting && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-blue-50 rounded-full p-3 mb-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                Creating Carrier...
              </h3>
              <p className="text-center text-[#5a6474]">
                Please wait while we create the carrier account.
              </p>
            </div>
          )}

          {isComplete && !error && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-green-50 rounded-full p-3 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Carrier Created!
              </h3>
              <p className="text-center text-[#5a6474] mb-4">
                The carrier {name} has been successfully created.
              </p>
              <div className="bg-[#f0f2f5] rounded-md p-3 w-full text-center">
                <p className="text-sm font-medium text-[#2d3748]">Carrier</p>
                <p className="text-lg font-medium text-[#2d3748]">{name}</p>
                <p className="text-sm text-[#5a6474]">{email}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-[#f0f2f5] border-t border-[#e0e4e8] p-4">
          <div className="w-full flex justify-between">
            {!isComplete && !isSubmitting && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-[#e0e4e8] text-[#5a6474] hover:bg-[#f0f2f5]"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !name.trim() ||
                    !email.trim() ||
                    !password.trim()
                  }
                  className="bg-[#4a6bff] hover:bg-[#3a5bef] text-white flex items-center"
                >
                  Create Carrier
                </Button>
              </>
            )}

            {isComplete && !error && (
              <div className="w-full flex gap-3">
                <Button
                  onClick={() => {
                    resetForm()
                    onCarrierAdded()
                    onOpenChange(false)
                    router.push('/')
                  }}
                  className="flex-1 bg-[#4a6bff] hover:bg-[#3a5bef] text-white"
                >
                  Go to Homepage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    onCarrierAdded()
                    onOpenChange(false)
                  }}
                  className="flex-1 border-[#e0e4e8] text-[#5a6474] hover:bg-[#f0f2f5]"
                >
                  Close
                </Button>
              </div>
            )}

            {error && (
              <div className="w-full flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-[#e0e4e8] text-[#5a6474] hover:bg-[#f0f2f5]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setError(null)}
                  className="bg-[#4a6bff] hover:bg-[#3a5bef] text-white"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
