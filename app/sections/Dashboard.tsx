'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { MdAddCircle, MdCampaign, MdAutoAwesome, MdTrendingUp, MdOpenInNew, MdMovie, MdAdsClick, MdWeb } from 'react-icons/md'

interface Campaign {
  id: string
  name: string
  date: string
  platforms: string[]
  status: 'draft' | 'complete'
  tone: string
  brief: { goal: string; audience: string; voice: string; messages: string }
  content?: {
    campaign_summary: string
    reels_script: any
    meta_ads: any
    landing_page: any
  }
  visuals?: {
    data: any
    images: Array<{ file_url: string; name: string; format_type: string }>
  }
}

interface DashboardProps {
  campaigns: Campaign[]
  onNewCampaign: () => void
  onViewCampaign: (id: string) => void
  sampleMode: boolean
  onToggleSample: (val: boolean) => void
}

export default function Dashboard({ campaigns, onNewCampaign, onViewCampaign, sampleMode, onToggleSample }: DashboardProps) {
  const completeCampaigns = campaigns.filter(c => c.status === 'complete')
  const totalPieces = campaigns.reduce((acc, c) => {
    let count = 0
    if (c.content?.reels_script) count++
    if (c.content?.meta_ads) count++
    if (c.content?.landing_page) count++
    if (c.visuals) count++
    return acc + count
  }, 0)

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.01em] font-sans text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1 font-sans leading-[1.55]">Manage your AI-powered marketing campaigns</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="sample-toggle" checked={sampleMode} onCheckedChange={onToggleSample} />
            <Label htmlFor="sample-toggle" className="text-sm text-muted-foreground font-sans">Sample Data</Label>
          </div>
          <Button onClick={onNewCampaign} className="gap-2 rounded-xl font-sans font-medium">
            <MdAddCircle className="w-5 h-5" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MdCampaign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold font-sans text-foreground">{campaigns.length}</p>
                <p className="text-sm text-muted-foreground font-sans">Total Campaigns</p>
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <MdAutoAwesome className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold font-sans text-foreground">{totalPieces}</p>
                <p className="text-sm text-muted-foreground font-sans">Content Pieces</p>
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MdTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold font-sans text-foreground">{completeCampaigns.length}</p>
                <p className="text-sm text-muted-foreground font-sans">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4 font-sans text-foreground">Recent Campaigns</h3>
          {campaigns.length === 0 ? (
            <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MdCampaign className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2 font-sans text-foreground">No campaigns yet</h4>
                <p className="text-sm text-muted-foreground mb-6 font-sans leading-[1.55]">Create your first AI-powered campaign to get started with content generation.</p>
                <Button onClick={onNewCampaign} className="gap-2 rounded-xl font-sans font-medium">
                  <MdAddCircle className="w-5 h-5" />
                  Create First Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const summary = campaign.content?.campaign_summary ?? ''
                const hasReels = !!campaign.content?.reels_script
                const hasMeta = !!campaign.content?.meta_ads
                const hasLanding = !!campaign.content?.landing_page
                const hasVisuals = !!campaign.visuals
                const goalSnippet = campaign.brief?.goal
                  ? campaign.brief.goal.length > 100
                    ? campaign.brief.goal.slice(0, 100) + '...'
                    : campaign.brief.goal
                  : ''

                return (
                  <Card
                    key={campaign.id}
                    className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem] cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col"
                    onClick={() => onViewCampaign(campaign.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold font-sans text-foreground leading-tight">{campaign.name}</CardTitle>
                        <Badge variant={campaign.status === 'complete' ? 'default' : 'secondary'} className="rounded-lg text-xs font-sans shrink-0">
                          {campaign.status === 'complete' ? 'Complete' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans mt-1">{campaign.date}</p>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
                      {/* Campaign description / goal */}
                      {(summary || goalSnippet) && (
                        <p className="text-sm text-muted-foreground font-sans leading-[1.55] line-clamp-3">
                          {summary || goalSnippet}
                        </p>
                      )}

                      {/* Content availability indicators */}
                      {campaign.status === 'complete' && (
                        <div className="flex flex-wrap gap-1.5">
                          {hasReels && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-medium font-sans">
                              <MdMovie className="w-3 h-3" /> Reels
                            </span>
                          )}
                          {hasMeta && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[11px] font-medium font-sans">
                              <MdAdsClick className="w-3 h-3" /> Ads
                            </span>
                          )}
                          {hasLanding && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-700 text-[11px] font-medium font-sans">
                              <MdWeb className="w-3 h-3" /> Page
                            </span>
                          )}
                          {hasVisuals && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 text-[11px] font-medium font-sans">
                              <MdAutoAwesome className="w-3 h-3" /> Visuals
                            </span>
                          )}
                        </div>
                      )}

                      {/* Platform badges and tone */}
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(campaign.platforms) && campaign.platforms.map((p) => (
                          <Badge key={p} variant="outline" className="text-[11px] rounded-lg font-sans">
                            {p}
                          </Badge>
                        ))}
                      </div>

                      {/* Footer with tone + action */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                        {campaign.tone && (
                          <p className="text-xs text-muted-foreground font-sans">Tone: {campaign.tone}</p>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary font-sans">
                          View Results <MdOpenInNew className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
