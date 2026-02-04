'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Channel } from '@/lib/supabase'

interface ChannelCarouselProps {
  channels: Channel[]
  currentIndex: number
  onChannelChange: (index: number) => void
}

export function ChannelCarousel({
  channels,
  currentIndex,
  onChannelChange,
}: ChannelCarouselProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handlePrevious = () => {
    if (isAnimating || currentIndex === 0) return
    setIsAnimating(true)
    onChannelChange(currentIndex - 1)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleNext = () => {
    if (isAnimating || currentIndex === channels.length - 1) return
    setIsAnimating(true)
    onChannelChange(currentIndex + 1)
    setTimeout(() => setIsAnimating(false), 300)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isAnimating])

  const getChannelAtOffset = (offset: number) => {
    const index = currentIndex + offset
    if (index < 0 || index >= channels.length) return null
    return channels[index]
  }

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Left preview */}
      <div className="absolute left-0 top-0 bottom-0 w-64 flex items-center justify-end pr-6 pointer-events-none">
        {getChannelAtOffset(-1) && (
          <div
            className={cn(
              'w-48 h-32 rounded-lg bg-muted/50 backdrop-blur-sm border border-border/50 p-4 transition-all duration-300',
              'opacity-40 scale-90'
            )}
          >
            <h3 className="font-semibold text-sm text-foreground/70 truncate">
              {getChannelAtOffset(-1)!.name}
            </h3>
            <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
              {getChannelAtOffset(-1)!.description}
            </p>
          </div>
        )}
      </div>

      {/* Center - Current channel */}
      <div className="flex-1 max-w-4xl mx-auto px-20">
        <div
          className={cn(
            'w-full transition-all duration-300',
            isAnimating && 'scale-95 opacity-50'
          )}
        >
          {channels[currentIndex] && (
            <div className="w-full h-full">
              {/* This will be replaced with the actual channel content */}
              <div className="rounded-lg bg-background border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {channels[currentIndex].name}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {channels[currentIndex].description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right preview */}
      <div className="absolute right-0 top-0 bottom-0 w-64 flex items-center justify-start pl-6 pointer-events-none">
        {getChannelAtOffset(1) && (
          <div
            className={cn(
              'w-48 h-32 rounded-lg bg-muted/50 backdrop-blur-sm border border-border/50 p-4 transition-all duration-300',
              'opacity-40 scale-90'
            )}
          >
            <h3 className="font-semibold text-sm text-foreground/70 truncate">
              {getChannelAtOffset(1)!.name}
            </h3>
            <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
              {getChannelAtOffset(1)!.description}
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <Button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        onClick={handleNext}
        disabled={currentIndex === channels.length - 1}
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Position indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {channels.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true)
                onChannelChange(index)
                setTimeout(() => setIsAnimating(false), 300)
              }
            }}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
          />
        ))}
      </div>
    </div>
  )
}
