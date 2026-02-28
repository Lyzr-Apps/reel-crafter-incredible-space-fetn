'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MdSearch, MdDelete, MdVisibility, MdHistory } from 'react-icons/md'

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

interface CampaignHistoryProps {
  campaigns: Campaign[]
  onViewCampaign: (id: string) => void
  onDeleteCampaign: (id: string) => void
}

export default function CampaignHistory({ campaigns, onViewCampaign, onDeleteCampaign }: CampaignHistoryProps) {
  const [search, setSearch] = useState('')

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.brief.goal.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.01em] font-sans text-foreground">Campaign History</h2>
          <p className="text-sm text-muted-foreground mt-1 font-sans leading-[1.55]">View and manage your past campaigns</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl font-sans"
          />
        </div>

        {/* Campaign List */}
        {filtered.length === 0 ? (
          <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <MdHistory className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-2 font-sans text-foreground">No campaigns found</h4>
              <p className="text-sm text-muted-foreground font-sans leading-[1.55]">
                {campaigns.length === 0 ? 'Create your first campaign to see it here.' : 'No campaigns match your search.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((campaign) => (
              <Card
                key={campaign.id}
                className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem] transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h4 className="text-base font-semibold font-sans text-foreground truncate">{campaign.name}</h4>
                      <Badge variant={campaign.status === 'complete' ? 'default' : 'secondary'} className="rounded-lg text-xs font-sans shrink-0">
                        {campaign.status === 'complete' ? 'Complete' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-sans">
                      <span>{campaign.date}</span>
                      <span className="text-border">|</span>
                      <span>{campaign.tone}</span>
                      <span className="text-border">|</span>
                      <div className="flex gap-1">
                        {Array.isArray(campaign.platforms) && campaign.platforms.map(p => (
                          <Badge key={p} variant="outline" className="text-[11px] rounded-lg font-sans">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewCampaign(campaign.id)}
                      className="rounded-xl h-9 w-9 text-primary hover:bg-primary/10"
                    >
                      <MdVisibility className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteCampaign(campaign.id)}
                      className="rounded-xl h-9 w-9 text-destructive hover:bg-destructive/10"
                    >
                      <MdDelete className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
