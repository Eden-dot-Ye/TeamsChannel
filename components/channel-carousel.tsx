'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Channel, Message } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChannelCarouselProps {
  channels: Channel[]
  messages: Record<string, Message[]>
  currentIndex: number
  onChannelChange: (index: number) => void
}

export function ChannelCarousel({
  channels,
  messages,
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

  const getPreviewMessages = (channelId?: string) => {
    if (!channelId) return []
    const channelMessages = messages[channelId] || []
    return channelMessages.slice(-3).reverse()
  }

  const previewMarkdownComponents = {
    h1: ({ children }: { children: ReactNode }) => (
      <span className="block font-semibold">{children}</span>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <span className="block font-semibold">{children}</span>
    ),
    h3: ({ children }: { children: ReactNode }) => (
      <span className="block font-semibold">{children}</span>
    ),
    p: ({ children }: { children: ReactNode }) => (
      <span className="block">{children}</span>
    ),
    code: ({ inline, children }: { inline?: boolean; children: ReactNode }) =>
      inline ? (
        <code className="rounded bg-muted/60 px-1 py-0.5 text-[0.85em]">
          {children}
        </code>
      ) : (
        <code className="block text-xs">{children}</code>
      ),
    pre: ({ children }: { children: ReactNode }) => (
      <span className="block rounded bg-muted/50 px-2 py-1 text-xs">
        {children}
      </span>
    ),
    strong: ({ children }: { children: ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children: ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  }

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Left preview */}
      <div className="absolute left-0 top-0 bottom-0 hidden lg:flex items-center justify-end pr-6">
        {getChannelAtOffset(-1) && (
          <button
            onClick={() => handlePrevious()}
            className={cn(
              'w-[28rem] h-[70%] rounded-2xl bg-card/70 backdrop-blur border border-border/60 p-5 transition-all duration-300 text-left shadow-md',
              'opacity-70 scale-[0.92] hover:opacity-100 hover:scale-[0.96]'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{getChannelAtOffset(-1)!.icon || '💬'}</span>
              <h3 className="font-semibold text-base text-foreground truncate">
                {getChannelAtOffset(-1)!.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {getChannelAtOffset(-1)!.description}
            </p>
            <div className="mt-4 space-y-3">
              {getPreviewMessages(getChannelAtOffset(-1)!.id).map((message) => (
                <div key={message.id} className="text-sm text-foreground/90 whitespace-normal break-words">
                  <span className="font-semibold text-foreground/80 mr-2">
                    {message.author_name}:
                  </span>
                  <div className="line-clamp-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={previewMarkdownComponents}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {getPreviewMessages(getChannelAtOffset(-1)!.id).length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No recent messages
                </div>
              )}
            </div>
          </button>
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
              <div className="rounded-2xl bg-background border border-border/70 p-6 shadow-sm">
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
      <div className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center justify-start pl-6">
        {getChannelAtOffset(1) && (
          <button
            onClick={() => handleNext()}
            className={cn(
              'w-[28rem] h-[70%] rounded-2xl bg-card/70 backdrop-blur border border-border/60 p-5 transition-all duration-300 text-left shadow-md',
              'opacity-70 scale-[0.92] hover:opacity-100 hover:scale-[0.96]'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{getChannelAtOffset(1)!.icon || '💬'}</span>
              <h3 className="font-semibold text-base text-foreground truncate">
                {getChannelAtOffset(1)!.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {getChannelAtOffset(1)!.description}
            </p>
            <div className="mt-4 space-y-3">
              {getPreviewMessages(getChannelAtOffset(1)!.id).map((message) => (
                <div key={message.id} className="text-sm text-foreground/90 whitespace-normal break-words">
                  <span className="font-semibold text-foreground/80 mr-2">
                    {message.author_name}:
                  </span>
                  <div className="line-clamp-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={previewMarkdownComponents}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {getPreviewMessages(getChannelAtOffset(1)!.id).length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No recent messages
                </div>
              )}
            </div>
          </button>
        )}
      </div>

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
