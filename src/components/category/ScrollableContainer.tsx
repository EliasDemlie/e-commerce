'use client'
import { type ReactNode, forwardRef } from 'react'

interface ScrollableContainerProps {
  children: ReactNode
  className?: string
}

const ScrollableContainer = forwardRef<
  HTMLDivElement,
  ScrollableContainerProps
>(({ children, className = '' }, ref) => {
  return (
    <div
      ref={ref}
      className={`overflow-x-auto ${className}`}
      style={{
        scrollbarWidth: 'none' /* Firefox */,
        msOverflowStyle: 'none' /* IE and Edge */,
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      {children}
    </div>
  )
})

ScrollableContainer.displayName = 'ScrollableContainer'

export default ScrollableContainer
