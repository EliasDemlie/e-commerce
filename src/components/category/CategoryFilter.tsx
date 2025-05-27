'use client'
import { useState, useRef, useEffect } from 'react'
import type { Category } from '@/type/category'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import ScrollableContainer from './ScrollableContainer'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  selectedSubcategory: string | null
  setSelectedCategory: (category: string) => void
  setSelectedSubcategory: (subcategory: string | null) => void
  productCounts?: Record<string, number>
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  selectedSubcategory,
  setSelectedCategory,
  setSelectedSubcategory,
  productCounts = {},
}: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Add "All" category
  const allCategories = [
    { _id: 'all', name: 'All', subCategories: [] },
    ...categories,
  ]

  // Handle scrolling
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const container = scrollContainerRef.current
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  // Check scroll position to show/hide arrows
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      setShowLeftArrow(container.scrollLeft > 0)
      setShowRightArrow(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      )
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      // Initial check
      handleScroll()

      setShowRightArrow(container.scrollWidth > container.clientWidth)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [categories])

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedSubcategory(null)
  }

  return (
    <div className="mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        {(selectedCategory !== 'all' || selectedSubcategory) && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            <X size={14} className="mr-1" />
            Clear filters
          </button>
        )}
      </div>

      <div className="relative w-full">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <ScrollableContainer
          ref={scrollContainerRef}
          className="w-full py-2 px-2 -mx-2"
        >
          <nav className="flex w-max">
            {allCategories.map((category) => {
              const hasSubcategories =
                category.subCategories && category.subCategories.length > 0
              const isActive =
                selectedCategory === category.name ||
                (selectedCategory === 'all' && category._id === 'all')
              const count =
                productCounts[category._id === 'all' ? 'all' : category.name] ||
                0

              return (
                <div key={category._id} className="dropdown relative mr-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(
                        category._id === 'all' ? 'all' : category.name
                      )
                      setSelectedSubcategory(null)
                    }}
                    className={`whitespace-nowrap px-5 py-2 ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <span className="flex items-center">
                      {category.name}
                      {count > 0 && (
                        <span
                          className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white text-black'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* W3Schools-style dropdown content */}
                  {hasSubcategories && (
                    <div className="dropdown-content hidden absolute left-0 top-full bg-white shadow-lg min-w-[180px] z-20">
                      {category.subCategories?.map((subCategory, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCategory(category.name)
                            setSelectedSubcategory(subCategory)
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            selectedSubcategory === subCategory &&
                            selectedCategory === category.name
                              ? 'bg-gray-100 font-medium'
                              : 'text-gray-800'
                          }`}
                        >
                          {subCategory}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </ScrollableContainer>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Active filters display */}
      {(selectedCategory !== 'all' || selectedSubcategory) && (
        <div className="flex items-center mt-4 text-sm text-gray-600">
          <span className="mr-2">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  aria-label={`Remove ${selectedCategory} filter`}
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                {selectedSubcategory}
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  aria-label={`Remove ${selectedSubcategory} filter`}
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .dropdown:hover .dropdown-content {
          display: block;
        }
      `}</style>
    </div>
  )
}
