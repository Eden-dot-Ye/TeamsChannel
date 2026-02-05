'use client'

import { Hash, Plus, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Channel } from '@/lib/supabase'

interface TeamsSidebarProps {
  channels: Channel[]
  currentChannelId: string
  onChannelSelect: (channelId: string) => void
}

export function TeamsSidebar({
  channels,
  currentChannelId,
  onChannelSelect,
}: TeamsSidebarProps) {
  return (
    <div className="w-64 h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Team header */}
      <div className="p-4 border-b border-sidebar-border">
        <button className="w-full flex items-center justify-between hover:bg-sidebar-accent rounded px-2 py-1.5 transition-colors">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-xs font-semibold">
              DC
            </div>
            <span className="font-semibold text-sm">Development Team</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 h-8 bg-background border-border/60"
          />
        </div>
      </div>

      {/* Channels list */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Channels
            </span>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-0.5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors',
                  currentChannelId === channel.id
                    ? 'bg-sidebar-accent text-foreground font-semibold'
                    : 'text-foreground/80 hover:bg-sidebar-accent hover:text-foreground'
                )}
              >
                <Hash className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Powered by AI */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          Powered by AI Chatbot ACE
        </div>
      </div>
    </div>
  )
}
