'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { supabase, type Category, type Channel } from '@/lib/supabase'

export default function PostPage() {
  const [content, setContent] = useState('')
  const [channels, setChannels] = useState<Channel[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [targetChannel, setTargetChannel] = useState<Channel | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const [{ data: channelData }, { data: categoryData }] = await Promise.all([
        supabase.from('channels').select('*').order('position', { ascending: true }),
        supabase.from('categories').select('*'),
      ])

      setChannels(channelData || [])
      setCategories(categoryData || [])
    }

    loadData()
  }, [])

  const channelNameMap = useMemo(() => {
    return new Map(channels.map((channel) => [channel.name, channel]))
  }, [channels])

  const handleSubmit = async () => {
    if (!content.trim() || status === 'loading') return

    setStatus('loading')
    setErrorMessage(null)
    setTargetChannel(null)

    try {
      const response = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, categories }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'AI classify failed')
      }

      const result = await response.json()
      const matchedCategory = categories.find((cat) => cat.id === result.categoryId)
      const matchedChannel = matchedCategory
        ? channelNameMap.get(matchedCategory.name) || null
        : null

      if (!matchedChannel) {
        throw new Error('No matching channel for the detected category')
      }

      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          channel_id: matchedChannel.id,
          author_name: '你',
          author_avatar: '你',
          content: content.trim(),
        })

      if (insertError) {
        throw insertError
      }

      setTargetChannel(matchedChannel)
      setContent('')
      setStatus('done')
    } catch (error) {
      console.error('[v0] post error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">新建帖子</h1>
            <p className="text-sm text-muted-foreground mt-1">
              不需要选择频道，系统会自动分配到最相关的子频道。
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">返回频道</Link>
          </Button>
        </div>

        <Card className="mt-6 p-6">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="输入你的问题或分享内容..."
            className="min-h-[180px] resize-none"
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              AI 会根据内容自动匹配子频道
            </div>
            <Button onClick={handleSubmit} disabled={!content.trim() || status === 'loading'}>
              {status === 'loading' ? '正在发布...' : '发布'}
            </Button>
          </div>
        </Card>

        {status === 'done' && targetChannel && (
          <Card className="mt-4 p-4 border-primary/30 bg-primary/5">
            <div className="text-sm text-foreground">
              已发布到频道：
              <span className="font-semibold ml-1">#{targetChannel.name}</span>
            </div>
          </Card>
        )}

        {status === 'error' && (
          <Card className="mt-4 p-4 border-destructive/40 bg-destructive/10">
            <div className="text-sm text-foreground">
              发布失败：{errorMessage || '请稍后重试'}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
