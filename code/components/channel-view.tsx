'use client'

import React from "react"

import { MessageList } from './message-list'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Send,
  Paperclip,
  Smile,
  AtSign,
  MoreHorizontal,
  Video,
  Phone,
  Users,
} from 'lucide-react'
import type { Channel, Message, Category } from '@/lib/supabase'
import { useState } from 'react'

interface ChannelViewProps {
  channel: Channel
  messages: Message[]
  categories: Category[]
  onSendMessage: (content: string) => void
}

export function ChannelView({
  channel,
  messages,
  categories,
  onSendMessage,
}: ChannelViewProps) {
  const [messageContent, setMessageContent] = useState('')

  const handleSend = () => {
    if (messageContent.trim()) {
      onSendMessage(messageContent)
      setMessageContent('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Channel header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">
            # {channel.name}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Users className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

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

      {/* Message input */}
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-lg border border-border bg-background focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-0">
            <Textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message # ${channel.name}`}
              className="min-h-[80px] border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-12"
            />

            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <AtSign className="h-4 w-4" />
              </Button>
              <div className="w-px h-5 bg-border mx-1" />
              <Button
                onClick={handleSend}
                disabled={!messageContent.trim()}
                size="icon"
                className="h-7 w-7"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, {' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+Enter</kbd> for new line
          </div>
        </div>
      </div>
    </div>
  )
}
