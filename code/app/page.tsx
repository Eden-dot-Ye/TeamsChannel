'use client'

import { useState, useEffect } from 'react'
import { TeamsSidebar } from '@/components/teams-sidebar'
import { ChannelView } from '@/components/channel-view'
import { ChannelCarousel } from '@/components/channel-carousel'
import { supabase, type Channel, type Message, type Category } from '@/lib/supabase'

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

  const handleSendMessage = async (content: string) => {
    if (!currentChannel) return

    // Insert message into Supabase
    const { data: newMessageData, error: insertError } = await supabase
      .from('messages')
      .insert({
        channel_id: currentChannel.id,
        author_name: 'You',
        author_avatar: 'YU',
        content,
      })
      .select()
      .single()

    if (insertError) {
      console.error('[v0] Error inserting message:', insertError)
      return
    }

    if (newMessageData) {
      console.log('[v0] New message saved:', newMessageData)

      // Add message to local state
      setMessages((prev) => ({
        ...prev,
        [currentChannel.id]: [...(prev[currentChannel.id] || []), newMessageData],
      }))

      // Categorize message with AI in the background
      try {
        const response = await fetch('/api/categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, categories }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('[v0] AI categorization:', result)

          // Find matching category name
          const matchedCategory = categories.find((cat) => cat.id === result.categoryId)
          const categoryName = matchedCategory?.name || null

          if (categoryName) {
            // Update message in Supabase with category
            const { error: updateError } = await supabase
              .from('messages')
              .update({ category: categoryName })
              .eq('id', newMessageData.id)

            if (updateError) {
              console.error('[v0] Error updating category:', updateError)
            } else {
              // Update local state
              setMessages((prev) => ({
                ...prev,
                [currentChannel.id]: prev[currentChannel.id].map((msg) =>
                  msg.id === newMessageData.id ? { ...msg, category: categoryName } : msg
                ),
              }))
            }
          }
        } else {
          const errorText = await response.text()
          console.log('[v0] AI categorization failed:', errorText)
        }
      } catch (error) {
        console.error('[v0] Failed to categorize message:', error)
      }
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
      {/* Sidebar */}
      <TeamsSidebar
        channels={channels}
        currentChannelId={currentChannel.id}
        onChannelSelect={handleChannelSelect}
      />

      {/* Main content area with carousel */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <ChannelCarousel
            channels={channels}
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
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
