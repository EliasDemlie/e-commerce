'use client'

import type React from 'react'

import { useState, useEffect, useRef, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock } from 'lucide-react'
import { useOnClickOutside } from '@/hooks/use-click-outside'
import type { Product } from '@/type/Product'

interface AdvancedSearchBarProps {
  initialQuery?: string
  className?: string
  products?: Product[]
}

// Maximum number of search history items to store
const MAX_HISTORY_ITEMS = 5
// Maximum number of suggestions to show
const MAX_SUGGESTIONS = 5

export function AdvancedSearchBar({
  initialQuery = '',
  className = '',
  products = [],
}: AdvancedSearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Fix the ref type definition
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load search history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory')
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory))
      } catch (e) {
        console.error('Failed to parse search history:', e)
        setSearchHistory([])
      }
    }
  }, [])

  // Generate suggestions based on current query
  useEffect(() => {
    if (!query.trim() || !products?.length) {
      setSuggestions([])
      return
    }

    const searchTerms = query.toLowerCase().trim().split(/\s+/)
    const filteredProducts = products
      .filter((product) => {
        // Create a comprehensive search text from all product attributes
        const searchText = [
          product.name || '',
          product.description || '',
          product.brand || '',
          product.category?.name || '',
          // Include subcategories if they exist
          ...(product.category?.subCategories || []),
          // Include color information if available
          ...(product.images?.map((img) => img.color || '') || []),
        ]
          .join(' ')
          .toLowerCase()

        // Check if any search term is found in the product text (partial matching)
        return searchTerms.some(
          (term) => term.length > 1 && searchText.includes(term)
        )
      })
      .slice(0, MAX_SUGGESTIONS)

    setSuggestions(filteredProducts)
    setSelectedIndex(-1)
  }, [query, products])

  // Handle click outside to close dropdown
  useOnClickOutside(searchRef, () => setIsFocused(false))

  // Save search to history
  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setSearchHistory((prev) => {
      // Remove if already exists and add to the beginning
      const newHistory = [
        searchTerm,
        ...prev.filter(
          (item) => item.toLowerCase() !== searchTerm.toLowerCase()
        ),
      ].slice(0, MAX_HISTORY_ITEMS)

      // Save to localStorage
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }

  // Handle search submission
  const handleSearch = (searchTerm: string = query) => {
    const trimmedQuery = searchTerm.trim()
    if (!trimmedQuery) return

    // Set the query in the input field
    setQuery(trimmedQuery)

    saveToHistory(trimmedQuery)
    setIsFocused(false)
    router.push(`/?q=${encodeURIComponent(trimmedQuery)}`)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const totalItems = suggestions.length + searchHistory.length

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      if (selectedIndex < suggestions.length) {
        handleSearch(suggestions[selectedIndex].name)
      } else {
        const historyIndex = selectedIndex - suggestions.length
        handleSearch(searchHistory[historyIndex])
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false)
    }
  }

  // Clear search input
  const clearSearch = () => {
    setQuery('')
    // Navigate to home page without search parameters to refresh the results
    router.push('/')
    // Focus on the input after clearing
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // Remove item from search history
  const removeFromHistory = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchHistory((prev) => {
      const newHistory = [...prev]
      newHistory.splice(index, 1)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Dropdown for suggestions and history */}
      {isFocused && (query.trim() || searchHistory.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {/* Product suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">
                SUGGESTIONS
              </h3>
              <ul>
                {suggestions.map((product, index) => (
                  <li
                    key={`suggestion-${product._id}`}
                    className={`px-3 py-2 cursor-pointer rounded-md flex items-center ${
                      selectedIndex === index
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSearch(product.name)}
                  >
                    {selectedIndex === index && (
                      <ArrowRight className="h-3 w-3 mr-2 text-blue-500" />
                    )}
                    <Search className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="flex-1 truncate">{product.name}</span>
                    {product.price && (
                      <span className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search history */}
          {searchHistory.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">
                RECENT SEARCHES
              </h3>
              <ul>
                {searchHistory.map((item, index) => (
                  <li
                    key={`history-${index}`}
                    className={`px-3 py-2 cursor-pointer rounded-md flex items-center justify-between ${
                      selectedIndex === index + suggestions.length
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSearch(item)}
                  >
                    <div className="flex items-center flex-1">
                      {selectedIndex === index + suggestions.length && (
                        <ArrowRight className="h-3 w-3 mr-2 text-blue-500" />
                      )}
                      <Clock className="h-3 w-3 mr-2 text-gray-400" />
                      <span className="truncate">{item}</span>
                    </div>
                    <button
                      onClick={(e) => removeFromHistory(index, e)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Remove from history"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        
          {query.trim() && !suggestions.length && (
            <div className="p-4 text-center text-gray-500">
              No matching products found
            </div>
          )}
        </div>
      )}
    </div>
  )
}


function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  )
}
