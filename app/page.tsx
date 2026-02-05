'use client'

import { useState, useEffect } from 'react'
import { TeamsSidebar } from '@/components/teams-sidebar'
import { ChannelView } from '@/components/channel-view'
import { ChannelCarousel } from '@/components/channel-carousel'
import { supabase, type Channel, type Message, type Category } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Activity,
  Bell,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Search,
  Users,
  Video,
} from 'lucide-react'

export default function Page() {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0)
  const [channels, setChannels] = useState<Channel[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [loading, setLoading] = useState(true)

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        console.log('[v0] Loading data from Supabase...')
        
        // Load channels
        const { data: channelsData, error: channelsError } = await supabase
          .from('channels')
          .select('*')
          .order('position', { ascending: true })

        if (channelsError) {
          console.error('[v0] Error loading channels:', channelsError)
        } else if (channelsData) {
          console.log('[v0] Loaded channels:', channelsData)
          setChannels(channelsData)
        }

        // Load categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')

        if (categoriesError) {
          console.error('[v0] Error loading categories:', categoriesError)
        } else if (categoriesData) {
          console.log('[v0] Loaded categories:', categoriesData)
          setCategories(categoriesData)
        }

        // Load messages for all channels
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })

        if (messagesError) {
          console.error('[v0] Error loading messages:', messagesError)
        } else if (messagesData) {
          console.log('[v0] Loaded messages:', messagesData)
          // Group messages by channel_id
          const groupedMessages: Record<string, Message[]> = {}
          for (const msg of messagesData) {
            if (!groupedMessages[msg.channel_id]) {
              groupedMessages[msg.channel_id] = []
            }
            groupedMessages[msg.channel_id].push(msg)
          }
          setMessages(groupedMessages)
        }

        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const currentChannel = channels[currentChannelIndex]
  const currentMessages = currentChannel ? messages[currentChannel.id] || [] : []

  const handleChannelSelect = (channelId: string) => {
    const index = channels.findIndex((c) => c.id === channelId)
    if (index !== -1) {
      setCurrentChannelIndex(index)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading channels...</p>
        </div>
      </div>
    )
  }

  if (!currentChannel) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">No channels available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left navigation rail */}
      <div className="hidden lg:flex w-16 h-full border-r border-border/70 bg-card/70 backdrop-blur flex-col items-center py-4 gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
          DC
        </div>
        <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60">
          <Activity className="h-4 w-4" />
        </button>
        <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60">
          <MessageSquare className="h-4 w-4" />
        </button>
        <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60">
          <Users className="h-4 w-4" />
        </button>
        <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60">
          <Calendar className="h-4 w-4" />
        </button>
        <div className="mt-auto flex flex-col gap-2">
          <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <TeamsSidebar
        channels={channels}
        currentChannelId={currentChannel.id}
        onChannelSelect={handleChannelSelect}
      />

      {/* Main content area with carousel */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-border/70 bg-card/80 backdrop-blur flex items-center justify-between px-6 gap-4">
          <div className="text-sm text-muted-foreground">Development CORE Team</div>
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索频道、消息或成员"
                className="h-8 pl-8 bg-background border-border/60"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">频道视图</div>
        </div>

        <div className="h-12 border-b border-border/70 bg-card/80 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            {currentChannel.icon && (
              <span className="text-lg" aria-hidden>
                {currentChannel.icon}
              </span>
            )}
            <div className="text-sm font-semibold text-foreground"># {currentChannel.name}</div>
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

        <div className="flex-1 relative">
          <ChannelCarousel
            channels={channels}
            messages={messages}
            currentIndex={currentChannelIndex}
            onChannelChange={setCurrentChannelIndex}
          />

          {/* Overlay the actual channel content on top of carousel */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-4xl h-full pointer-events-auto">
              <ChannelView
                channel={currentChannel}
                messages={currentMessages}
                categories={categories}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="hidden xl:flex w-72 h-full border-l border-border/70 bg-card/60 backdrop-blur flex-col">
        <div className="p-4 border-b border-border/70">
          <div className="text-sm font-semibold text-foreground">Channel info</div>
          <div className="text-xs text-muted-foreground mt-1">
            #{currentChannel.name}
          </div>
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div className="rounded-lg border border-border/60 bg-background/80 p-3">
            <div className="text-xs text-muted-foreground">Description</div>
            <div className="text-foreground mt-1 text-sm">
              {currentChannel.description || '暂无描述'}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/80 p-3">
            <div className="text-xs text-muted-foreground">Highlights</div>
            <div className="mt-2 space-y-2 text-sm text-foreground/90">
              <div>最新消息：{currentMessages.length} 条</div>
              <div>AI 分类已启用</div>
              <div>预览卡片已增强</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
