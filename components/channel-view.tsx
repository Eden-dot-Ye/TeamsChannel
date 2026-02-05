'use client'

import React from "react"

import Link from 'next/link'
import { MessageList } from './message-list'
import { Button } from '@/components/ui/button'
import type { Channel, Message, Category } from '@/lib/supabase'

interface ChannelViewProps {
  channel: Channel
  messages: Message[]
  categories: Category[]
}

export function ChannelView({
  channel,
  messages,
  categories,
}: ChannelViewProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {/* Channel description */}
          <div className="mb-6 pb-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-1">
              # {channel.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {channel.description}
            </p>
          </div>

          {/* Messages */}
          <MessageList messages={messages} categories={categories} />
        </div>
      </div>

      {/* New post action */}
      <div className="border-t border-border bg-card/60 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            发布新帖会自动匹配到最相关的子频道
          </div>
          <Button asChild size="sm">
            <Link href="/post">发布新帖子</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
