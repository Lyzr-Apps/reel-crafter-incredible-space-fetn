'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MdDashboard, MdAddCircle, MdHistory, MdSettings, MdMenu, MdChevronLeft } from 'react-icons/md'

type Screen = 'dashboard' | 'new-campaign' | 'content-review' | 'campaign-history' | 'brand-settings'

interface SidebarProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems: { screen: Screen; label: string; icon: React.ReactNode }[] = [
  { screen: 'dashboard', label: 'Dashboard', icon: <MdDashboard className="w-5 h-5" /> },
  { screen: 'new-campaign', label: 'New Campaign', icon: <MdAddCircle className="w-5 h-5" /> },
  { screen: 'campaign-history', label: 'Campaign History', icon: <MdHistory className="w-5 h-5" /> },
  { screen: 'brand-settings', label: 'Brand Settings', icon: <MdSettings className="w-5 h-5" /> },
]

export default function Sidebar({ currentScreen, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={cn(
        'h-screen flex flex-col border-r border-border bg-[hsl(30_38%_95%)] transition-all duration-300 shrink-0',
        collapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Logo header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm font-sans">MF</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-[-0.01em] text-foreground font-sans">MarketFlow</h1>
              <p className="text-[11px] text-muted-foreground font-sans">AI Content Studio</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <MdMenu className="w-5 h-5" /> : <MdChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 font-sans tracking-[-0.01em]',
              currentScreen === item.screen
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-border">
          <p className="text-[11px] text-muted-foreground font-sans">Powered by AI Agents</p>
        </div>
      )}
    </aside>
  )
}
