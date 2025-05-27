import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface AddressData {
  fullName: string
  email: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface AddressFormProps {
  type: 'shipping' | 'billing'
  address: AddressData
  onChange: (data: AddressData) => void
  onFormInstance?: (form: ReturnType<typeof useForm<AddressData>>) => void
}

export function AddressForm({
  type,
  address,
  onChange,
  onFormInstance,
}: AddressFormProps) {
  const prefix = type === 'shipping' ? 'shipping' : 'billing'

  // Initialize react-hook-form with built-in validation
  const form = useForm<AddressData>({
    defaultValues: address,
    mode: 'onBlur',
  })

  // Pass form instance to parent after render
  useEffect(() => {
    if (onFormInstance) {
      onFormInstance(form)
    }
  }, [form, onFormInstance])

  // Handle form changes and propagate to parent component
  const handleFormChange = (name: keyof AddressData, value: string) => {
    const updatedAddress = { ...address, [name]: value }
    onChange(updatedAddress)
  }

  return (
    <Form {...form}>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            rules={{
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Full name must be at least 2 characters',
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel
                  htmlFor={`${prefix}FullName`}
                  className="font-medium"
                >
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    id={`${prefix}FullName`}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleFormChange('fullName', e.target.value)
                    }}
                    className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                      fieldState.error
                        ? 'border-red-600 focus:ring-red-600/20'
                        : ''
                    }`}
                    placeholder="John Doe"
                  />
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address',
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor={`${prefix}Email`} className="font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    id={`${prefix}Email`}
                    {...field}
                    type="email"
                    onChange={(e) => {
                      field.onChange(e)
                      handleFormChange('email', e.target.value)
                    }}
                    className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                      fieldState.error
                        ? 'border-red-600 focus:ring-red-600/20'
                        : ''
                    }`}
                    placeholder="john.doe@example.com"
                  />
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneNumber"
          rules={{
            required: 'Phone number is required',
            minLength: {
              value: 6,
              message: 'Phone number must be at least 6 characters',
            },
            pattern: {
              value: /^\+?[0-9\s\-()]{6,20}$/,
              message: 'Please enter a valid phone number',
            },
          }}
          render={({ field, fieldState }) => (
            <FormItem className="grid gap-2">
              <FormLabel
                htmlFor={`${prefix}PhoneNumber`}
                className="font-medium"
              >
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  id={`${prefix}PhoneNumber`}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleFormChange('phoneNumber', e.target.value)
                  }}
                  className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                    fieldState.error
                      ? 'border-red-600 focus:ring-red-600/20'
                      : ''
                  }`}
                  placeholder="+251 91 234 5678"
                />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine1"
          rules={{
            required: 'Address line 1 is required',
            minLength: {
              value: 3,
              message: 'Address must be at least 3 characters',
            },
          }}
          render={({ field, fieldState }) => (
            <FormItem className="grid gap-2">
              <FormLabel
                htmlFor={`${prefix}AddressLine1`}
                className="font-medium"
              >
                Address Line 1
              </FormLabel>
              <FormControl>
                <Input
                  id={`${prefix}AddressLine1`}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleFormChange('addressLine1', e.target.value)
                  }}
                  className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                    fieldState.error
                      ? 'border-red-600 focus:ring-red-600/20'
                      : ''
                  }`}
                  placeholder="123 Main Street"
                />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field, fieldState }) => (
            <FormItem className="grid gap-2">
              <FormLabel
                htmlFor={`${prefix}AddressLine2`}
                className="font-medium"
              >
                Address Line 2 (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  id={`${prefix}AddressLine2`}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleFormChange('addressLine2', e.target.value)
                  }}
                  className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                    fieldState.error
                      ? 'border-red-600 focus:ring-red-600/20'
                      : ''
                  }`}
                  placeholder="Apartment, Suite, Unit, etc."
                />
              </FormControl>
              <FormMessage className="text-red-600 font-medium" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            rules={{
              required: 'City is required',
              minLength: {
                value: 2,
                message: 'City must be at least 2 characters',
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor={`${prefix}City`} className="font-medium">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    id={`${prefix}City`}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleFormChange('city', e.target.value)
                    }}
                    className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                      fieldState.error
                        ? 'border-red-600 focus:ring-red-600/20'
                        : ''
                    }`}
                    placeholder="Addis Ababa"
                  />
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            rules={{
              required: 'State/Region is required',
              minLength: {
                value: 2,
                message: 'State must be at least 2 characters',
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor={`${prefix}State`} className="font-medium">
                  State/Region
                </FormLabel>
                <FormControl>
                  <Input
                    id={`${prefix}State`}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleFormChange('state', e.target.value)
                    }}
                    className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                      fieldState.error
                        ? 'border-red-600 focus:ring-red-600/20'
                        : ''
                    }`}
                    placeholder="Addis Ababa"
                  />
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postalCode"
            rules={{
              required: 'Postal code is required',
              minLength: {
                value: 2,
                message: 'Postal code must be at least 2 characters',
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel
                  htmlFor={`${prefix}PostalCode`}
                  className="font-medium"
                >
                  Postal Code
                </FormLabel>
                <FormControl>
                  <Input
                    id={`${prefix}PostalCode`}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleFormChange('postalCode', e.target.value)
                    }}
                    className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                      fieldState.error
                        ? 'border-red-600 focus:ring-red-600/20'
                        : ''
                    }`}
                    placeholder="1000"
                  />
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            rules={{
              required: 'Country is required',
            }}
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor={`${prefix}Country`} className="font-medium">
                  Country
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleFormChange('country', value)
                    }}
                    value={field.value}
                  >
                    <SelectTrigger
                      id={`${prefix}Country`}
                      className={`border-gray-300 focus:ring-2 focus:ring-primary/20 ${
                        fieldState.error
                          ? 'border-red-600 focus:ring-red-600/20'
                          : ''
                      }`}
                    >
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-600 font-medium" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  )
}
