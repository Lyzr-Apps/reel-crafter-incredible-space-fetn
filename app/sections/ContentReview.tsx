'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { copyToClipboard } from '@/lib/clipboard'
import { MdContentCopy, MdCheck, MdArrowBack, MdAutoAwesome, MdMovie, MdAdsClick, MdWeb, MdMusicNote, MdTipsAndUpdates, MdPlayCircle } from 'react-icons/md'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

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

interface ContentReviewProps {
  campaign: Campaign | null
  onBack: () => void
  onGenerateVisuals: () => void
  visualsLoading: boolean
  visualsData: any
  visualImages: Array<{ file_url: string; name: string; format_type: string }>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 rounded-lg shrink-0">
      {copied ? <MdCheck className="w-4 h-4 text-green-600" /> : <MdContentCopy className="w-4 h-4 text-muted-foreground" />}
    </Button>
  )
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1 font-sans">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1 font-sans">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2 font-sans">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm font-sans">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm font-sans">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm font-sans leading-[1.55]">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

export default function ContentReview({ campaign, onBack, onGenerateVisuals, visualsLoading, visualsData, visualImages }: ContentReviewProps) {
  if (!campaign) return null

  const content = campaign.content
  const reels = content?.reels_script
  const meta = content?.meta_ads
  const landing = content?.landing_page
  const scenes = Array.isArray(reels?.scenes) ? reels.scenes : []
  const placements = Array.isArray(meta?.placements) ? meta.placements : []
  const valueProp = Array.isArray(landing?.value_propositions) ? landing.value_propositions : []
  const features = Array.isArray(landing?.feature_highlights) ? landing.feature_highlights : []
  const faqs = Array.isArray(landing?.faqs) ? landing.faqs : []
  const socialProof = Array.isArray(landing?.social_proof_suggestions) ? landing.social_proof_suggestions : []
  const platformTips = Array.isArray(reels?.platform_tips) ? reels.platform_tips : []
  const sceneVisuals = Array.isArray(visualsData?.scene_visuals) ? visualsData.scene_visuals : []
  const colorPalette = Array.isArray(visualsData?.color_palette) ? visualsData.color_palette : []

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <MdArrowBack className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.01em] font-sans text-foreground">{campaign.name}</h2>
            <p className="text-sm text-muted-foreground mt-1 font-sans leading-[1.55]">{content?.campaign_summary ?? 'Campaign content review'}</p>
          </div>
        </div>
        <Badge variant={campaign.status === 'complete' ? 'default' : 'secondary'} className="rounded-lg font-sans">
          {campaign.status === 'complete' ? 'Complete' : 'Draft'}
        </Badge>
      </div>

      <div className="p-8 space-y-8">
        {/* Campaign Summary */}
        {content?.campaign_summary && (
          <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 font-sans uppercase tracking-wide">Campaign Summary</h3>
                  {renderMarkdown(content.campaign_summary)}
                </div>
                <CopyButton text={content.campaign_summary} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="reels" className="w-full">
          <TabsList className="w-full justify-start bg-white/50 rounded-xl p-1 h-auto flex-wrap">
            <TabsTrigger value="reels" className="rounded-lg gap-2 font-sans text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MdMovie className="w-4 h-4" />
              Reels Script
            </TabsTrigger>
            <TabsTrigger value="meta" className="rounded-lg gap-2 font-sans text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MdAdsClick className="w-4 h-4" />
              Meta Ads Copy
            </TabsTrigger>
            <TabsTrigger value="landing" className="rounded-lg gap-2 font-sans text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MdWeb className="w-4 h-4" />
              Landing Page
            </TabsTrigger>
          </TabsList>

          {/* Reels Script Tab */}
          <TabsContent value="reels" className="mt-6 space-y-4">
            {reels ? (
              <>
                {/* Hook */}
                {reels?.hook && (
                  <Card className="backdrop-blur-[16px] bg-white/75 border-2 border-primary/30 shadow-md rounded-[0.875rem]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MdPlayCircle className="w-5 h-5 text-primary" />
                            <h3 className="text-sm font-semibold text-primary font-sans uppercase tracking-wide">Hook</h3>
                          </div>
                          <p className="text-base font-medium font-sans leading-[1.55] text-foreground">{reels.hook}</p>
                        </div>
                        <CopyButton text={reels.hook ?? ''} />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scenes */}
                {scenes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide">Scenes</h3>
                    {scenes.map((scene: any, idx: number) => (
                      <Card key={idx} className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="rounded-lg font-sans">Scene {scene?.scene_number ?? idx + 1}</Badge>
                                {scene?.duration_seconds && (
                                  <span className="text-xs text-muted-foreground font-sans">{scene.duration_seconds}s</span>
                                )}
                              </div>
                              {scene?.visual_direction && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1 font-sans uppercase">Visual Direction</p>
                                  <p className="text-sm font-sans leading-[1.55] text-foreground">{scene.visual_direction}</p>
                                </div>
                              )}
                              {scene?.on_screen_text && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1 font-sans uppercase">On-Screen Text</p>
                                  <p className="text-sm font-sans leading-[1.55] text-foreground font-medium">{scene.on_screen_text}</p>
                                </div>
                              )}
                              {scene?.voiceover && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1 font-sans uppercase">Voiceover</p>
                                  <p className="text-sm font-sans leading-[1.55] text-foreground italic">{scene.voiceover}</p>
                                </div>
                              )}
                            </div>
                            <CopyButton text={`Visual: ${scene?.visual_direction ?? ''}\nText: ${scene?.on_screen_text ?? ''}\nVO: ${scene?.voiceover ?? ''}`} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {reels?.cta && (
                  <Card className="backdrop-blur-[16px] bg-white/75 border-2 border-accent/30 shadow-md rounded-[0.875rem]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-accent font-sans uppercase tracking-wide mb-1">Call to Action</h3>
                          <p className="text-base font-medium font-sans text-foreground">{reels.cta}</p>
                        </div>
                        <CopyButton text={reels.cta ?? ''} />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Meta info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reels?.total_duration && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MdPlayCircle className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground font-sans">Total Duration</p>
                          <p className="text-sm font-medium font-sans text-foreground">{reels.total_duration}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {reels?.music_suggestion && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MdMusicNote className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground font-sans">Music Suggestion</p>
                          <p className="text-sm font-medium font-sans text-foreground">{reels.music_suggestion}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Platform Tips */}
                {platformTips.length > 0 && (
                  <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <MdTipsAndUpdates className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-semibold font-sans text-foreground">Platform Tips</h3>
                      </div>
                      <ul className="space-y-2">
                        {platformTips.map((tip: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground font-sans leading-[1.55] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground font-sans">No reels script content available for this campaign.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Meta Ads Tab */}
          <TabsContent value="meta" className="mt-6 space-y-4">
            {placements.length > 0 ? (
              placements.map((placement: any, idx: number) => (
                <Card key={idx} className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold font-sans flex items-center gap-2">
                      <MdAdsClick className="w-5 h-5 text-primary" />
                      {placement?.placement_type ?? `Placement ${idx + 1}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Primary Text Variants */}
                    {Array.isArray(placement?.primary_text_variants) && placement.primary_text_variants.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2 font-sans uppercase">Primary Text Variants</p>
                        <div className="space-y-2">
                          {placement.primary_text_variants.map((text: string, ti: number) => (
                            <div key={ti} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-secondary/50">
                              <p className="text-sm font-sans leading-[1.55] text-foreground flex-1">{text}</p>
                              <CopyButton text={text} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Headline Variants */}
                    {Array.isArray(placement?.headline_variants) && placement.headline_variants.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2 font-sans uppercase">Headline Variants</p>
                        <div className="space-y-2">
                          {placement.headline_variants.map((text: string, ti: number) => (
                            <div key={ti} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-secondary/50">
                              <p className="text-sm font-semibold font-sans leading-[1.55] text-foreground flex-1">{text}</p>
                              <CopyButton text={text} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {placement?.description && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1 font-sans uppercase">Description</p>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-sans leading-[1.55] text-foreground flex-1">{placement.description}</p>
                          <CopyButton text={placement.description} />
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    {placement?.cta_button && (
                      <div className="flex items-center gap-3">
                        <Badge className="rounded-lg font-sans">{placement.cta_button}</Badge>
                        <span className="text-xs text-muted-foreground font-sans">CTA Button</span>
                      </div>
                    )}

                    {/* Optimization Notes */}
                    {placement?.optimization_notes && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <div className="flex items-start gap-2">
                          <MdTipsAndUpdates className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-800 mb-1 font-sans">Optimization Notes</p>
                            <p className="text-sm text-amber-700 font-sans leading-[1.55]">{placement.optimization_notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground font-sans">No Meta Ads content available for this campaign.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Landing Page Tab */}
          <TabsContent value="landing" className="mt-6 space-y-4">
            {landing ? (
              <>
                {/* Hero Section */}
                <Card className="backdrop-blur-[16px] bg-white/75 border-2 border-primary/20 shadow-md rounded-[0.875rem]">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-primary font-sans uppercase tracking-wide">Hero Section</h3>
                    {landing?.headline && (
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-2xl font-bold font-sans text-foreground">{landing.headline}</h4>
                        <CopyButton text={landing.headline} />
                      </div>
                    )}
                    {landing?.subheadline && (
                      <p className="text-lg text-muted-foreground font-sans leading-[1.55]">{landing.subheadline}</p>
                    )}
                    {landing?.hero_description && (
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-foreground font-sans leading-[1.55] flex-1">{landing.hero_description}</p>
                        <CopyButton text={landing.hero_description} />
                      </div>
                    )}
                    {landing?.hero_cta && (
                      <div className="flex items-center gap-3">
                        <Badge className="rounded-lg px-4 py-1.5 text-sm font-sans">{landing.hero_cta}</Badge>
                        <CopyButton text={landing.hero_cta} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Value Propositions */}
                {valueProp.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-3">Value Propositions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {valueProp.map((vp: any, idx: number) => (
                        <Card key={idx} className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold font-sans text-foreground mb-1">{vp?.title ?? ''}</h4>
                                <p className="text-sm text-muted-foreground font-sans leading-[1.55]">{vp?.description ?? ''}</p>
                              </div>
                              <CopyButton text={`${vp?.title ?? ''}: ${vp?.description ?? ''}`} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Proof */}
                {socialProof.length > 0 && (
                  <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                    <CardContent className="p-5">
                      <h3 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-3">Social Proof Suggestions</h3>
                      <ul className="space-y-2">
                        {socialProof.map((sp: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground font-sans leading-[1.55]">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                            {sp}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Feature Highlights */}
                {features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-3">Feature Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {features.map((feat: any, idx: number) => (
                        <Card key={idx} className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold font-sans text-foreground mb-1">{feat?.title ?? ''}</h4>
                                <p className="text-xs text-muted-foreground font-sans leading-[1.55]">{feat?.description ?? ''}</p>
                              </div>
                              <CopyButton text={`${feat?.title ?? ''}: ${feat?.description ?? ''}`} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs */}
                {faqs.length > 0 && (
                  <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                    <CardContent className="p-5">
                      <h3 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-3">FAQs</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq: any, idx: number) => (
                          <AccordionItem key={idx} value={`faq-${idx}`}>
                            <AccordionTrigger className="text-sm font-sans font-medium text-foreground hover:no-underline">
                              {faq?.question ?? ''}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm text-muted-foreground font-sans leading-[1.55]">{faq?.answer ?? ''}</p>
                                <CopyButton text={`Q: ${faq?.question ?? ''}\nA: ${faq?.answer ?? ''}`} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}

                {/* Secondary CTA & Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {landing?.secondary_cta && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-sans mb-1">Secondary CTA</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium font-sans text-foreground">{landing.secondary_cta}</p>
                          <CopyButton text={landing.secondary_cta} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {landing?.footer_cta && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-sans mb-1">Footer CTA</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium font-sans text-foreground">{landing.footer_cta}</p>
                          <CopyButton text={landing.footer_cta} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                {landing?.footer_copy && (
                  <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground font-sans mb-1">Footer Copy</p>
                          <p className="text-sm font-sans leading-[1.55] text-foreground">{landing.footer_copy}</p>
                        </div>
                        <CopyButton text={landing.footer_copy} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground font-sans">No landing page content available for this campaign.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Visual Concepts Section */}
        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold font-sans text-foreground">Visual Concepts</h3>
              <p className="text-sm text-muted-foreground font-sans">AI-generated visual direction and mood board</p>
            </div>
            <Button
              onClick={onGenerateVisuals}
              disabled={visualsLoading}
              className="gap-2 rounded-xl font-sans font-medium"
            >
              {visualsLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <MdAutoAwesome className="w-4 h-4" />
                  Generate Visual Concepts
                </>
              )}
            </Button>
          </div>

          {/* Visual Results */}
          {(visualsData || visualImages.length > 0) && (
            <div className="space-y-4">
              {/* Images */}
              {visualImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visualImages.map((img, idx) => (
                    <Card key={idx} className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem] overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={img.file_url}
                          alt={img.name || `Visual concept ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {img.name && (
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground font-sans truncate">{img.name}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              {/* Visual Data Cards */}
              {visualsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visualsData?.mood_board_description && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-2">Mood Board</h4>
                        <p className="text-sm font-sans leading-[1.55] text-foreground">{visualsData.mood_board_description}</p>
                      </CardContent>
                    </Card>
                  )}
                  {visualsData?.thumbnail_concept && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-2">Thumbnail Concept</h4>
                        <p className="text-sm font-sans leading-[1.55] text-foreground">{visualsData.thumbnail_concept}</p>
                      </CardContent>
                    </Card>
                  )}
                  {visualsData?.visual_style && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-2">Visual Style</h4>
                        <p className="text-sm font-sans leading-[1.55] text-foreground">{visualsData.visual_style}</p>
                      </CardContent>
                    </Card>
                  )}
                  {colorPalette.length > 0 && (
                    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide mb-2">Color Palette</h4>
                        <div className="flex flex-wrap gap-2">
                          {colorPalette.map((color: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="rounded-lg font-sans text-xs">{color}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Scene Visuals */}
              {sceneVisuals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground font-sans uppercase tracking-wide">Scene Visuals</h4>
                  {sceneVisuals.map((sv: any, idx: number) => (
                    <Card key={idx} className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
                      <CardContent className="p-5">
                        <Badge variant="outline" className="rounded-lg font-sans mb-2">Scene {sv?.scene_number ?? idx + 1}</Badge>
                        {sv?.visual_description && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-muted-foreground mb-1 font-sans uppercase">Visual Description</p>
                            <p className="text-sm font-sans leading-[1.55] text-foreground">{sv.visual_description}</p>
                          </div>
                        )}
                        {sv?.composition_notes && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-muted-foreground mb-1 font-sans uppercase">Composition Notes</p>
                            <p className="text-sm font-sans leading-[1.55] text-muted-foreground">{sv.composition_notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
