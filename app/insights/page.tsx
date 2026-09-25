'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Job = { status: string; company: string; role: string }
const stages = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn']

export default function InsightsPage() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) { router.replace('/login'); return }
      setEmail(auth.user.email ?? '')
      const { data } = await supabase.from('jobs').select('status,company,role').eq('user_id', auth.user.id)
      if (active) setJobs(data ?? [])
    }
    load()
    return () => { active = false }
  }, [router, supabase])

  const count = (status: string) => jobs.filter((job) => job.status === status).length
  const total = jobs.length
  const conversations = count('Interviewing') + count('Offer')
  const responseRate = total ? Math.round((conversations / total) * 100) : 0
  const active = count('Saved') + count('Applied') + count('Interviewing')
  const initials = email ? email.slice(0, 2).toUpperCase() : 'JT'

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="brand"><span className="brand-mark">JT</span><span>JobTrack</span></Link>
        <div className="workspace-profile"><span className="avatar">{initials}</span><div><strong>My workspace</strong><small>{email || 'Personal job search'}</small></div></div>
        <p className="side-label">WORKSPACE</p>
        <nav aria-label="Workspace navigation">
          <Link href="/dashboard"><span>⌂</span>Overview</Link>
          <Link className="active" href="/insights"><span>◔</span>Insights</Link>
          <Link href="/dashboard#applications"><span>▤</span>Applications</Link>
        </nav>
        <div className="sidebar-tip"><span className="tip-icon">✦</span><div><strong>Keep momentum</strong><small>Review your pipeline every week.</small></div><div className="tip-progress"><i style={{ width: `${Math.min(100, active * 10)}%` }} /></div></div>
        <div className="side-bottom"><Link className="text-btn" href="/"><span>←</span> Back to home</Link></div>
      </aside>

      <section className="workspace">
        <header className="mobile-header"><Link href="/dashboard" className="brand"><span className="brand-mark">JT</span><span>JobTrack</span></Link><Link href="/dashboard">Overview</Link></header>
        <div className="workspace-inner insights-workspace">
          <div className="page-heading"><div><p className="eyebrow">SEARCH INTELLIGENCE</p><h1>Your search, <em>decoded.</em></h1><p className="muted">Use these signals to focus your energy on the applications most likely to move forward.</p></div><Link className="secondary-btn" href="/dashboard">← View tracker</Link></div>
          <div className="stats-grid insights-stats">
            <article className="stat-card featured"><span>Response rate</span><strong>{responseRate}%</strong><small>{conversations} of {total} applications reached a conversation stage</small></article>
            <article className="stat-card stat-blue"><span>Active pipeline</span><strong>{active}</strong><small>Roles that still need your attention</small></article>
            <article className="stat-card stat-green"><span>Offers</span><strong>{count('Offer')}</strong><small>Keep building on this momentum</small></article>
          </div>
          <div className="insights-panels">
            <section className="breakdown"><div className="panel-heading"><div><h2>Pipeline breakdown</h2><p className="muted">A clear view of every stage in your search.</p></div><span className="data-chip">{total} total</span></div>{stages.map((stage) => { const value = count(stage); return <div className="break-row" key={stage}><span className={`stage-dot dot-${stage.toLowerCase()}`} /> <strong>{stage}</strong><div className="break-track"><i style={{ width: `${total ? Math.max(value ? 4 : 0, (value / total) * 100) : 0}%` }} /></div><b>{value}</b></div> })}</section>
            <section className="breakdown opportunity-card"><p className="eyebrow">NEXT BEST ACTION</p><h2>{total ? 'Turn your warm leads into conversations.' : 'Start building your signal.'}</h2><p className="muted">{total ? `You have ${active} active roles. Follow up on recent applications and add a next step to keep them moving.` : 'Add your first application to unlock personalized pipeline insights.'}</p><Link className="primary-btn" href="/dashboard">{total ? 'Open applications' : 'Add first application'} <span>→</span></Link></section>
          </div>
        </div>
      </section>
    </main>
  )
}

// Insight calculations intentionally stay derived from the authenticated user's rows so this page never exposes another user's data.
const _insightTypes = { stages }
void _insightTypes
