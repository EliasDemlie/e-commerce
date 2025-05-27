export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
        <div className="h-4 w-64 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      
      <div className="flex flex-wrap gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 shadow-sm">
            
            <div className="w-full h-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>

           
            <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>

            <div className="space-y-2 mb-4">
              <div className="h-3 w-full bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded-md animate-pulse"></div>
            </div>

          
            <div className="h-6 w-1/3 bg-gray-200 rounded-md animate-pulse"></div>

           
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
