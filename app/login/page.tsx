'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = useMemo(() => createClient(), [])
  const [mode, setMode] = useState<'signin' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          },
        })

    setBusy(false)

    if (result.error) {
      setMessage(mode === 'signin' ? 'Invalid email or password.' : result.error.message)
      return
    }

    if (mode === 'signup' && !result.data.session) {
      setMessage('Account created. You can sign in once your account is ready.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="auth-screen">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="brand-mark">JT</span><span>JobTrack</span></Link>
        <p className="eyebrow auth-eyebrow">{mode === 'signin' ? 'WELCOME BACK' : 'GET STARTED'}</p>
        <h1>{mode === 'signin' ? 'Welcome back.' : 'Start your search.'}</h1>
        <p className="muted">{mode === 'signin' ? 'Pick up exactly where you left off.' : 'A calmer home for your next career move.'}</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" /></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" /></label>
          {message && <p className="form-message">{message}</p>}
          <button className="primary-btn" disabled={busy}>{busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'} <span>→</span></button>
        </form>
        <button className="text-btn" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage('') }}>
          {mode === 'signin' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return <Suspense fallback={<main className="auth-screen"><div className="auth-card"><p className="muted">Loading sign in…</p></div></main>}><LoginForm /></Suspense>
}

LoginForm.displayName = 'LoginForm'
LoginPage.displayName = 'LoginPage'
