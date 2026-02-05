'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Message, Category } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { ThumbsUp } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  categories: Category[]
}

export function MessageList({ messages, categories }: MessageListProps) {
  const getCategoryByName = (name?: string | null) => {
    if (!name) return null
    return categories.find((cat) => cat.name?.toLowerCase() === name.toLowerCase())
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const category = getCategoryByName(message.category)
        const authorInitials = message.author_avatar || getInitials(message.author_name)

        return (
          <div
            key={message.id}
            className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <Avatar className="h-9 w-9 mt-1">
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {authorInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-sm text-foreground">
                  {message.author_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.created_at)}
                </span>
                {category && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-1 text-xs font-medium',
                      'bg-opacity-10'
                    )}
                    style={{
                      backgroundColor: category.color + '20',
                      color: category.color,
                      borderColor: category.color + '40',
                    }}
                  >
                    {category.name}
                  </Badge>
                )}
              </div>

              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>

              <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Like</span>
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
