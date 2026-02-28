'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent, AIAgentResponse } from '@/lib/aiAgent'
import { generateUUID } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Sidebar from './sections/Sidebar'
import Dashboard from './sections/Dashboard'
import CampaignBrief from './sections/CampaignBrief'
import ContentReview from './sections/ContentReview'
import CampaignHistory from './sections/CampaignHistory'
import { MdSmartToy } from 'react-icons/md'

// ---------- Types ----------

type Screen = 'dashboard' | 'new-campaign' | 'content-review' | 'campaign-history' | 'brand-settings'

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

// ---------- Constants ----------

const MANAGER_AGENT_ID = '69a23753f89af5d059caa28b'
const VISUAL_AGENT_ID = '69a237532d763c5cd41488c1'

const STORAGE_KEY = 'marketflow-campaigns'

// ---------- Helpers ----------

function parseAgentResult(result: AIAgentResponse): any {
  if (!result.success) return null
  let data = result.response?.result
  if (!data) return null
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch { return null }
  }
  if (data?.result && typeof data.result === 'object') {
    data = data.result
  }
  return data
}

function getSampleCampaigns(): Campaign[] {
  const now = new Date()
  return [
    {
      id: 'sample-1',
      name: 'Summer Wellness Launch',
      date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      platforms: ['Instagram Reels', 'Meta Ads', 'Landing Page'],
      status: 'complete',
      tone: 'Playful',
      brief: {
        goal: 'Drive awareness for our new organic wellness supplement line and generate 500 sign-ups for early access.',
        audience: 'Health-conscious millennials, 25-35, urban professionals interested in natural wellness',
        voice: 'Approachable and energetic, uses conversational language with a confident undertone',
        messages: '- 100% organic, lab-tested ingredients\n- Feel the difference in 7 days\n- Free shipping on first order',
      },
      content: {
        campaign_summary: 'A multi-platform campaign targeting health-conscious millennials through engaging short-form video content, targeted Meta ads across Feed, Stories, and Reels placements, and a high-converting landing page designed to capture early access sign-ups for the organic wellness supplement line.',
        reels_script: {
          hook: 'What if feeling amazing was as simple as one scoop a day?',
          scenes: [
            { scene_number: 1, visual_direction: 'Close-up of powder being scooped with morning light streaming in', on_screen_text: 'Your morning just got an upgrade', voiceover: 'Most supplements are full of artificial junk.', duration_seconds: '3' },
            { scene_number: 2, visual_direction: 'Lifestyle shot of young professional making a smoothie in a modern kitchen', on_screen_text: '100% Organic. Lab-Tested.', voiceover: 'Ours is 100 percent organic and lab-tested for purity.', duration_seconds: '4' },
            { scene_number: 3, visual_direction: 'Split screen: before (tired at desk) vs after (energized workout)', on_screen_text: 'Feel the difference in 7 days', voiceover: 'Feel the difference in just seven days or your money back.', duration_seconds: '4' },
          ],
          cta: 'Tap the link to claim your free shipping on your first order!',
          total_duration: '15 seconds',
          music_suggestion: 'Upbeat lo-fi track with positive energy, 120 BPM',
          platform_tips: ['Use trending audio for first 2 seconds to boost discovery', 'Add captions - 85% of users watch without sound', 'Post between 7-9 AM for wellness audience'],
        },
        meta_ads: {
          placements: [
            {
              placement_type: 'Feed',
              primary_text_variants: [
                'Tired of supplements that don\'t deliver? Our organic wellness blend is lab-tested and loved by thousands. Try it risk-free today.',
                'One scoop. Seven days. A whole new you. Discover the organic supplement that\'s changing the wellness game.',
              ],
              headline_variants: ['Feel Amazing in 7 Days', 'Your Body Deserves Better'],
              description: 'Lab-tested organic wellness supplements with free shipping on your first order. 30-day money-back guarantee.',
              cta_button: 'Sign Up',
              optimization_notes: 'Test carousel format with ingredient close-ups. Target interests: organic food, yoga, mindfulness apps.',
            },
            {
              placement_type: 'Stories',
              primary_text_variants: ['Swipe up to feel the difference', 'Organic wellness made simple'],
              headline_variants: ['Free Shipping Today', 'Try Risk-Free'],
              description: 'Quick-hit wellness content optimized for Stories placement with urgency-driven CTAs.',
              cta_button: 'Learn More',
              optimization_notes: 'Use video format with first 3 seconds showing product. Add poll sticker for engagement.',
            },
          ],
        },
        landing_page: {
          headline: 'Feel the Difference in 7 Days',
          subheadline: 'Organic wellness supplements that actually work - lab-tested, doctor-recommended, and loved by thousands.',
          hero_cta: 'Start Your Free Trial',
          hero_description: 'Join 10,000+ wellness enthusiasts who transformed their daily routine with our premium organic supplement blend. Free shipping on your first order.',
          value_propositions: [
            { title: '100% Organic', description: 'Every ingredient is sustainably sourced and certified organic. No fillers, no artificial anything.' },
            { title: 'Lab Tested', description: 'Third-party tested for purity and potency. We publish every batch result for full transparency.' },
            { title: '7-Day Results', description: 'Most customers report noticeable improvements in energy and focus within the first week.' },
          ],
          social_proof_suggestions: ['10,000+ happy customers', '4.9 star average rating', 'Featured in Health Magazine', 'Recommended by 500+ wellness practitioners'],
          feature_highlights: [
            { title: 'Premium Ingredients', description: 'Sourced from certified organic farms worldwide' },
            { title: 'Fast Absorption', description: 'Bioavailable formula for maximum nutrient uptake' },
            { title: 'No Side Effects', description: 'Gentle on your stomach, powerful for your body' },
          ],
          secondary_cta: 'See the Science Behind It',
          faqs: [
            { question: 'How long until I see results?', answer: 'Most customers notice improvements in energy and focus within 7 days of consistent use.' },
            { question: 'Is it safe to take with other supplements?', answer: 'Yes! Our blend is designed to complement your existing routine. Consult your doctor if you have specific concerns.' },
            { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee. If you are not completely satisfied, return it for a full refund.' },
          ],
          footer_cta: 'Start Your Wellness Journey Today',
          footer_copy: 'Join thousands who chose a healthier path. Free shipping, 30-day guarantee, no questions asked.',
        },
      },
    },
    {
      id: 'sample-2',
      name: 'Tech Product Pre-Launch',
      date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      platforms: ['Meta Ads', 'Landing Page'],
      status: 'complete',
      tone: 'Bold',
      brief: {
        goal: 'Build hype for upcoming smart home device and collect 1,000 waitlist sign-ups before launch.',
        audience: 'Tech-savvy early adopters, 28-45, interested in smart home technology',
        voice: 'Confident, innovative, slightly provocative',
        messages: '- First AI-powered home hub\n- Works with 500+ devices\n- Pre-order pricing: 40% off',
      },
      content: {
        campaign_summary: 'A bold pre-launch campaign targeting tech enthusiasts through Meta Ads and a high-conversion landing page, emphasizing the innovative AI-powered features and exclusive pre-order pricing to drive waitlist sign-ups.',
        reels_script: null,
        meta_ads: {
          placements: [
            {
              placement_type: 'Feed',
              primary_text_variants: [
                'Your smart home is about to get a whole lot smarter. The first AI-powered hub that actually learns how you live.',
                'Forget everything you know about smart home devices. This changes everything.',
              ],
              headline_variants: ['The Future of Smart Home', 'AI Meets Home Automation'],
              description: 'Pre-order now at 40% off. Works with 500+ devices. Ships Q2 2025.',
              cta_button: 'Pre-Order Now',
              optimization_notes: 'Use tech-focused imagery. Target audiences interested in IoT, smart home, AI assistants.',
            },
          ],
        },
        landing_page: {
          headline: 'Your Home, Reimagined by AI',
          subheadline: 'The first truly intelligent home hub that learns, adapts, and evolves with your lifestyle.',
          hero_cta: 'Join the Waitlist',
          hero_description: 'Be among the first 1,000 to experience the future of smart living. Exclusive pre-order pricing available for waitlist members only.',
          value_propositions: [
            { title: 'AI-Powered Intelligence', description: 'Learns your routines and preferences automatically. No complex setup required.' },
            { title: 'Universal Compatibility', description: 'Works seamlessly with 500+ smart home devices and platforms.' },
          ],
          social_proof_suggestions: ['Featured at CES 2025', 'Winner of Innovation Award'],
          feature_highlights: [
            { title: 'Voice Control', description: 'Natural language understanding that goes beyond simple commands' },
            { title: 'Energy Optimization', description: 'AI-driven energy management that saves you up to 30% on utilities' },
          ],
          secondary_cta: 'Watch the Demo',
          faqs: [
            { question: 'When does it ship?', answer: 'Expected shipping date is Q2 2025 for pre-order customers.' },
            { question: 'What devices are compatible?', answer: 'We support 500+ devices across all major platforms including Zigbee, Z-Wave, Wi-Fi, and Matter.' },
          ],
          footer_cta: 'Reserve Yours at 40% Off',
          footer_copy: 'Limited pre-order pricing. Join the smart home revolution.',
        },
      },
    },
  ]
}

// ---------- ErrorBoundary ----------

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2 font-sans">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm font-sans">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-sans font-medium">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ---------- Agent Status Panel ----------

function AgentStatusPanel({ activeAgentId }: { activeAgentId: string | null }) {
  const agents = [
    { id: MANAGER_AGENT_ID, name: 'Content Creation Manager', purpose: 'Generates reels scripts, meta ads, and landing page copy' },
    { id: VISUAL_AGENT_ID, name: 'Reel Visual Concept Agent', purpose: 'Creates mood boards, visual direction, and AI images' },
  ]
  return (
    <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-sm rounded-[0.875rem]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MdSmartToy className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold font-sans text-muted-foreground uppercase tracking-wide">AI Agents</h4>
        </div>
        <div className="space-y-2">
          {agents.map(a => (
            <div key={a.id} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${activeAgentId === a.id ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`} />
              <div className="min-w-0">
                <p className="text-xs font-medium font-sans text-foreground truncate">{a.name}</p>
                <p className="text-[10px] text-muted-foreground font-sans truncate">{a.purpose}</p>
              </div>
              {activeAgentId === a.id && (
                <Badge variant="outline" className="text-[10px] rounded-md font-sans ml-auto shrink-0">Active</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------- Brand Settings ----------

function BrandSettings() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6 border-b border-border">
        <h2 className="text-2xl font-semibold tracking-[-0.01em] font-sans text-foreground">Brand Settings</h2>
        <p className="text-sm text-muted-foreground mt-1 font-sans leading-[1.55]">Configure your brand defaults for campaigns</p>
      </div>
      <div className="p-8">
        <Card className="backdrop-blur-[16px] bg-white/75 border border-white/[0.18] shadow-md rounded-[0.875rem]">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <MdSmartToy className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold mb-2 font-sans text-foreground">Coming Soon</h4>
            <p className="text-sm text-muted-foreground font-sans leading-[1.55] max-w-md mx-auto">Brand settings will allow you to save default brand voice, tone preferences, logos, and color palettes to streamline your campaign creation process.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ---------- Main Page ----------

export default function Page() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sampleMode, setSampleMode] = useState(true)
  const [contentLoading, setContentLoading] = useState(false)
  const [visualsLoading, setVisualsLoading] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Load campaigns from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setCampaigns(parsed)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Save campaigns to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns))
    } catch {
      // ignore storage errors
    }
  }, [campaigns])

  // Display campaigns based on sample mode — user campaigns first
  const displayCampaigns = sampleMode
    ? [...campaigns, ...getSampleCampaigns()]
    : campaigns

  const activeCampaign = displayCampaigns.find(c => c.id === activeCampaignId) ?? null

  // Handle sample mode toggle
  const handleToggleSample = (val: boolean) => {
    setSampleMode(val)
  }

  // Navigate to a screen
  const navigate = useCallback((s: Screen) => {
    setScreen(s)
    setError('')
  }, [])

  // View a specific campaign
  const handleViewCampaign = useCallback((id: string) => {
    setActiveCampaignId(id)
    setScreen('content-review')
    setError('')
  }, [])

  // Delete a campaign
  const handleDeleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id))
    if (activeCampaignId === id) {
      setActiveCampaignId(null)
      setScreen('dashboard')
    }
  }, [activeCampaignId])

  // Submit campaign brief
  const handleSubmitBrief = useCallback(async (brief: {
    goal: string; audience: string; voice: string; messages: string; platforms: string[]; tone: string; name: string
  }) => {
    setContentLoading(true)
    setActiveAgentId(MANAGER_AGENT_ID)
    setError('')

    const message = `Campaign Brief:
Campaign Name: ${brief.name}
Campaign Goal: ${brief.goal}
Target Audience: ${brief.audience}
Brand Voice: ${brief.voice}
Key Messages: ${brief.messages}
Platforms: ${brief.platforms.join(', ')}
Tone: ${brief.tone}

Generate comprehensive marketing content for all selected platforms including reels script, meta ads copy, and landing page draft.`

    try {
      const result = await callAIAgent(message, MANAGER_AGENT_ID)
      const data = parseAgentResult(result)

      const newCampaign: Campaign = {
        id: generateUUID(),
        name: brief.name,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        platforms: brief.platforms,
        status: data ? 'complete' : 'draft',
        tone: brief.tone,
        brief: { goal: brief.goal, audience: brief.audience, voice: brief.voice, messages: brief.messages },
        content: data ? {
          campaign_summary: data?.campaign_summary ?? '',
          reels_script: data?.reels_script ?? null,
          meta_ads: data?.meta_ads ?? null,
          landing_page: data?.landing_page ?? null,
        } : undefined,
      }

      setCampaigns(prev => [newCampaign, ...prev])
      setActiveCampaignId(newCampaign.id)
      setScreen('content-review')

      if (!data) {
        setError('Content was generated but could not be parsed. The campaign has been saved as a draft.')
      }
    } catch (err) {
      setError('Failed to generate content. Please try again.')
    } finally {
      setContentLoading(false)
      setActiveAgentId(null)
    }
  }, [])

  // Generate visual concepts
  const handleGenerateVisuals = useCallback(async () => {
    if (!activeCampaign) return

    setVisualsLoading(true)
    setActiveAgentId(VISUAL_AGENT_ID)
    setError('')

    const message = `Generate visual concepts for this campaign:
Campaign: ${activeCampaign.name}
Goal: ${activeCampaign.brief.goal}
Audience: ${activeCampaign.brief.audience}
Brand Voice: ${activeCampaign.brief.voice}
${activeCampaign.content?.reels_script?.hook ? `Reels Script Hook: ${activeCampaign.content.reels_script.hook}` : ''}

Create mood board concepts, thumbnail ideas, and scene-by-scene visual direction.`

    try {
      const result = await callAIAgent(message, VISUAL_AGENT_ID)
      const data = parseAgentResult(result)
      const images = Array.isArray(result?.module_outputs?.artifact_files)
        ? result.module_outputs!.artifact_files.map(f => ({
            file_url: f.file_url ?? '',
            name: f.name ?? '',
            format_type: f.format_type ?? '',
          }))
        : []

      // Update the campaign with visual data
      setCampaigns(prev => prev.map(c => {
        if (c.id === activeCampaign.id) {
          return { ...c, visuals: { data, images } }
        }
        return c
      }))
    } catch (err) {
      setError('Failed to generate visual concepts. Please try again.')
    } finally {
      setVisualsLoading(false)
      setActiveAgentId(null)
    }
  }, [activeCampaign])

  // Resolve visuals data for the active campaign (handle sample campaigns)
  const activeVisuals = activeCampaign?.visuals
  const visualsData = activeVisuals?.data ?? null
  const visualImages = Array.isArray(activeVisuals?.images) ? activeVisuals.images : []

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex bg-background text-foreground font-sans" style={{ background: 'linear-gradient(135deg, hsl(30 50% 97%) 0%, hsl(20 45% 95%) 35%, hsl(40 40% 96%) 70%, hsl(15 35% 97%) 100%)' }}>
        {/* Sidebar */}
        <Sidebar
          currentScreen={screen}
          onNavigate={navigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Error banner */}
          {error && (
            <div className="px-8 pt-4">
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError('')} className="text-xs underline ml-4 shrink-0">Dismiss</button>
              </div>
            </div>
          )}

          {/* Screens */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {screen === 'dashboard' && (
              <Dashboard
                campaigns={displayCampaigns}
                onNewCampaign={() => navigate('new-campaign')}
                onViewCampaign={handleViewCampaign}
                sampleMode={sampleMode}
                onToggleSample={handleToggleSample}
              />
            )}
            {screen === 'new-campaign' && (
              <CampaignBrief
                onSubmit={handleSubmitBrief}
                loading={contentLoading}
                onBack={() => navigate('dashboard')}
              />
            )}
            {screen === 'content-review' && (
              <ContentReview
                campaign={activeCampaign}
                onBack={() => navigate('dashboard')}
                onGenerateVisuals={handleGenerateVisuals}
                visualsLoading={visualsLoading}
                visualsData={visualsData}
                visualImages={visualImages}
              />
            )}
            {screen === 'campaign-history' && (
              <CampaignHistory
                campaigns={displayCampaigns}
                onViewCampaign={handleViewCampaign}
                onDeleteCampaign={handleDeleteCampaign}
              />
            )}
            {screen === 'brand-settings' && (
              <BrandSettings />
            )}
          </div>

          {/* Agent Status Footer */}
          <div className="px-6 py-3 border-t border-border">
            <AgentStatusPanel activeAgentId={activeAgentId} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
