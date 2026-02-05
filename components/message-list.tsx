'use client'

import type { ReactNode } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Message, Category } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { ThumbsUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageListProps {
  messages: Message[]
  categories: Category[]
}

export function MessageList({ messages, categories }: MessageListProps) {
  const markdownComponents = {
    h1: ({ children }: { children: ReactNode }) => (
      <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>
    ),
    h3: ({ children }: { children: ReactNode }) => (
      <h5 className="text-sm font-semibold mt-2 mb-1">{children}</h5>
    ),
    p: ({ children }: { children: ReactNode }) => (
      <p className="mb-2 last:mb-0">{children}</p>
    ),
    ul: ({ children }: { children: ReactNode }) => (
      <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
      <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }: { children: ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className="border-l-2 border-border pl-3 text-muted-foreground italic mb-2">
        {children}
      </blockquote>
    ),
    code: ({ inline, children }: { inline?: boolean; children: ReactNode }) =>
      inline ? (
        <code className="rounded bg-muted px-1.5 py-0.5 text-[0.85em]">
          {children}
        </code>
      ) : (
        <code className="text-xs">{children}</code>
      ),
    pre: ({ children }: { children: ReactNode }) => (
      <pre className="mb-2 mt-2 overflow-x-auto rounded-lg bg-muted/60 p-3 text-xs">
        {children}
      </pre>
    ),
    a: ({ href, children }: { href?: string; children: ReactNode }) => (
      <a href={href} className="text-primary underline underline-offset-2">
        {children}
      </a>
    ),
    strong: ({ children }: { children: ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children: ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  }
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
            className="flex gap-3 p-4 rounded-xl border border-border/70 bg-card shadow-sm hover:shadow-md transition-shadow group"
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

              <div className="text-sm text-foreground leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              </div>

              <div className="flex items-center gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
