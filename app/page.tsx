'use client'

import Link from 'next/link'

const features = [
  ['01', 'One organized pipeline', 'Keep every application, contact, deadline, and next step in one calm command center.'],
  ['02', 'Signals, not spreadsheets', 'See your momentum with clear status chips, progress metrics, and practical insights.'],
  ['03', 'Follow through confidently', 'Turn scattered notes into an intentional plan with a visible next action for every role.'],
]

export default function LandingPage() {
  return <main className="landing-page">
    <div className="landing-glow" />
    <nav className="landing-nav"><Link href="/" className="brand"><span className="brand-mark">JT</span><span>JobTrack</span></Link><div className="landing-links"><a href="#features">How it works</a><a href="#why">Why JobTrack</a><Link className="nav-login" href="/login">Log in <span>↗</span></Link></div></nav>
    <section className="hero hero-expanded"><div className="hero-copy"><div className="hero-kicker"><span className="pulse-dot" /> A healthier job search starts here</div><h1>Your job search,<br /><em>in good hands.</em></h1><p className="hero-text">A professional workspace for tracking applications, preparing for interviews, and making your next career move with less noise.</p><div className="hero-actions"><Link href="/login?mode=signup" className="primary-btn">Create your workspace <span>→</span></Link><Link href="/login" className="text-btn">Sign in to continue</Link></div><div className="hero-trust"><div className="trust-avatars"><span>AM</span><span>JK</span><span>RS</span></div><span>Built for focused career moves<br /><b>Private by design</b></span></div></div><div className="hero-visual dashboard-preview"><div className="preview-header"><span><i className="pulse-dot" /> Workspace overview</span><span className="preview-date">This week · 2026</span></div><div className="preview-title"><div><small>YOUR PIPELINE</small><strong>24 <span>active roles</span></strong></div><span className="preview-score">+18%<small>momentum</small></span></div><div className="preview-chart"><i style={{height:'35%'}} /><i style={{height:'53%'}} /><i style={{height:'46%'}} /><i style={{height:'71%'}} /><i style={{height:'64%'}} /><i style={{height:'88%'}} /><i style={{height:'100%'}} /></div><div className="preview-list"><div><span className="company-dot dot-teal">N</span><b>Northstar Health</b><span className="status-chip chip-orange">Interviewing</span></div><div><span className="company-dot dot-blue">C</span><b>Cedar Labs</b><span className="status-chip chip-purple">Applied</span></div><div><span className="company-dot dot-green">L</span><b>Lumen Medical</b><span className="status-chip chip-blue">Saved</span></div></div></div></section>
    <section className="landing-strip" id="why"><span>DESIGNED FOR THE WHOLE SEARCH</span><strong>From first application to final offer, keep the important details within reach.</strong><span className="strip-arrow">↓</span></section>
    <section className="feature-section" id="features"><div className="section-intro"><p className="eyebrow">A BETTER SYSTEM</p><h2>Less admin.<br /><em>More momentum.</em></h2></div><div className="feature-grid">{features.map(([number, title, copy]) => <article className="feature-card" key={number}><span className="feature-number">{number}</span><h3>{title}</h3><p>{copy}</p><span className="feature-line" /></article>)}</div></section>
    <section className="landing-cta"><p className="eyebrow">READY WHEN YOU ARE</p><h2>Make space for<br /><em>the next yes.</em></h2><Link href="/login?mode=signup" className="primary-btn">Start tracking free <span>→</span></Link></section>
    <footer className="landing-footer"><Link href="/" className="brand"><span className="brand-mark">JT</span><span>JobTrack</span></Link><span>Personal career operations, made calmer.</span><span>© 2026 JobTrack</span></footer>
  </main>
}

LandingPage.displayName = 'LandingPage'
    
