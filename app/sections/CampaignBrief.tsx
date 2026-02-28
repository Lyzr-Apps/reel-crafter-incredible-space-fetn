'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { MdAutoAwesome, MdArrowBack } from 'react-icons/md'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface CampaignBriefProps {
  onSubmit: (brief: {
    goal: string
    audience: string
    voice: string
    messages: string
    platforms: string[]
    tone: string
    name: string
  }) => void
  loading: boolean
  onBack: () => void
}

const platformOptions = ['Instagram Reels', 'Meta Ads', 'Landing Page']
const toneOptions = ['Professional', 'Playful', 'Bold', 'Empathetic', 'Urgent']

export default function CampaignBrief({ onSubmit, loading, onBack }: CampaignBriefProps) {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [audience, setAudience] = useState('')
  const [voice, setVoice] = useState('')
  const [messages, setMessages] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [tone, setTone] = useState('')
  const [error, setError] = useState('')

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleSubmit = () => {
    if (!name.trim() || !goal.trim() || !audience.trim() || platforms.length === 0 || !tone) {
      setError('Please fill in campaign name, goal, audience, select at least one platform, and a tone.')
      return
    }
    setError('')
    onSubmit({ goal, audience, voice, messages, platforms, tone, name })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-8 py-6 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <MdArrowBack className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.01em] font-sans text-foreground">New Campaign</h2>
          <p className="text-sm text-muted-foreground mt-1 font-sans leading-[1.55]">Define your campaign brief and let AI generate content</p>
        </div>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-sans text-foreground">Campaign Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium font-sans text-foreground">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Summer Product Launch 2025"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl font-sans"
              />
            </div>

            {/* Campaign Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm font-medium font-sans text-foreground">Campaign Goal *</Label>
              <Textarea
                id="goal"
                placeholder="Describe your campaign objective. e.g., Drive awareness for our new eco-friendly product line and generate 500 sign-ups for early access."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
                className="rounded-xl font-sans resize-none"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-sm font-medium font-sans text-foreground">Target Audience *</Label>
              <Input
                id="audience"
                placeholder="e.g., Health-conscious millennials, 25-35, urban professionals"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="rounded-xl font-sans"
              />
            </div>

            {/* Brand Voice */}
            <div className="space-y-2">
              <Label htmlFor="voice" className="text-sm font-medium font-sans text-foreground">Brand Voice Notes</Label>
              <Textarea
                id="voice"
                placeholder="Describe your brand personality. e.g., Approachable yet authoritative, uses simple language, avoids jargon."
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                rows={3}
                className="rounded-xl font-sans resize-none"
              />
            </div>

            {/* Key Messages */}
            <div className="space-y-2">
              <Label htmlFor="messages" className="text-sm font-medium font-sans text-foreground">Key Messages / USPs</Label>
              <Textarea
                id="messages"
                placeholder="List your key selling points, one per line. e.g.,&#10;- 100% sustainably sourced materials&#10;- 30-day money-back guarantee&#10;- Free shipping on orders over $50"
                value={messages}
                onChange={(e) => setMessages(e.target.value)}
                rows={4}
                className="rounded-xl font-sans resize-none"
              />
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium font-sans text-foreground">Platforms *</Label>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border font-sans',
                      platforms.includes(p)
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-white/50 text-muted-foreground border-border hover:border-primary/50'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium font-sans text-foreground">Tone *</Label>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border font-sans',
                      tone === t
                        ? 'bg-accent text-accent-foreground border-accent shadow-md'
                        : 'bg-white/50 text-muted-foreground border-border hover:border-accent/50'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full gap-2 rounded-xl font-sans font-medium h-12 text-base"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                  Creating your marketing materials...
                </>
              ) : (
                <>
                  <MdAutoAwesome className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
