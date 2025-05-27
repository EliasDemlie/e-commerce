import { Skeleton } from '@/components/ui/skeleton'
import { Package, Clock, TruckIcon } from 'lucide-react'

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-6 w-6 text-slate-300 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="hidden sm:flex space-x-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-md">
            <Skeleton className="h-5 w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md">
            <Skeleton className="h-5 w-1/3 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          <div className="hidden sm:flex space-x-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-md">
            <Skeleton className="h-5 w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md">
            <Skeleton className="h-5 w-1/3 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
              <TruckIcon className="h-6 w-6 text-sky-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="hidden sm:flex space-x-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-md">
            <Skeleton className="h-5 w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md">
            <Skeleton className="h-5 w-1/3 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg flex items-center justify-center animate-bounce">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
