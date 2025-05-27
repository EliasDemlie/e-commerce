import { IUser } from '@/server/models/User'

export type SafeUser = Omit<
  IUser,
  'createdAt' | 'updatedAt' | 'emailVerified' | 'hashedPassword' | 'activatedAt'
> & {
  createdAt: string
  updatedAt: string
  emailVerified: string | null
  activatedAt: string | null 
}
