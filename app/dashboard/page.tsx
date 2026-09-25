'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Job = { id: string; company: string; role: string; location: string | null; work_type: string | null; status: string; salary_range: string | null; url: string | null; next_step: string | null; next_step_date: string | null }
const statuses = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn']
const statusClass: Record<string, string> = { Saved: 'chip-blue', Applied: 'chip-purple', Interviewing: 'chip-orange', Offer: 'chip-green', Rejected: 'chip-red', Withdrawn: 'chip-gray' }

const starterApplications = [
  { company: 'Northstar Health', role: 'Product Designer', location: 'Remote', work_type: 'Remote', status: 'Interviewing', salary_range: '$110k – $135k' },
  { company: 'Cedar Labs', role: 'Frontend Engineer', location: 'New York, NY', work_type: 'Hybrid', status: 'Applied', salary_range: '$125k – $155k' },
  { company: 'Atlas Finance', role: 'UX Researcher', location: 'Boston, MA', work_type: 'On-site', status: 'Saved', salary_range: '$95k – $120k' },
  { company: 'Mosaic Studio', role: 'Brand Strategist', location: 'Remote', work_type: 'Remote', status: 'Saved', salary_range: '$85k – $105k' },
  { company: 'Brightwell', role: 'Product Manager', location: 'Austin, TX', work_type: 'Hybrid', status: 'Applied', salary_range: '$120k – $145k' },
  { company: 'Kindred Systems', role: 'Content Designer', location: 'Chicago, IL', work_type: 'Hybrid', status: 'Interviewing', salary_range: '$90k – $115k' },
  { company: 'Harbor & Co.', role: 'Operations Lead', location: 'Seattle, WA', work_type: 'On-site', status: 'Rejected', salary_range: '$80k – $100k' },
  { company: 'Juniper Cloud', role: 'Growth Marketer', location: 'Remote', work_type: 'Remote', status: 'Saved', salary_range: '$75k – $95k' },
  { company: 'Lumen Medical', role: 'Service Designer', location: 'Philadelphia, PA', work_type: 'Hybrid', status: 'Applied', salary_range: '$100k – $125k' },
  { company: 'Oakline Ventures', role: 'Data Analyst', location: 'Denver, CO', work_type: 'Hybrid', status: 'Saved', salary_range: '$88k – $112k' },
]

const jobColumns = 'id,company,role,location,work_type,status,salary_range,url,next_step,next_step_date'

export default function Dashboard() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (!data.user) { router.replace('/login'); return }; setUser(data.user); load(data.user.id) }) }, [supabase])
  async function load(uid: string) {
    const { data: existing, error } = await supabase.from('jobs').select(jobColumns).eq('user_id', uid).order('updated_at', { ascending: false })
    if (error) { setJobs([]); setLoading(false); return }

    const existingCompanies = new Set((existing || []).map((job) => job.company))
    const missing = starterApplications.filter((job) => !existingCompanies.has(job.company))
    let allJobs = existing || []

    if (missing.length > 0) {
      const { data: created } = await supabase.from('jobs').insert(missing.map((job) => ({ ...job, user_id: uid }))).select(jobColumns)
      if (created) allJobs = [...created, ...allJobs]
    }

    setJobs(allJobs)
    setLoading(false)
  }
  async function save(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (!user) return; setSaving(true); const f = new FormData(e.currentTarget); const values = { company: String(f.get('company')), role: String(f.get('role')), location: String(f.get('location') || ''), work_type: String(f.get('work_type')), status: String(f.get('status')), salary_range: String(f.get('salary_range') || ''), url: String(f.get('url') || '') }; if (selected) { const { data } = await supabase.from('jobs').update(values).eq('id', selected.id).select('id,company,role,location,work_type,status,salary_range,url,next_step,next_step_date').single(); if (data) setJobs(jobs.map(j => j.id === selected.id ? data : j)) } else { const { data } = await supabase.from('jobs').insert({ ...values, user_id: user.id }).select('id,company,role,location,work_type,status,salary_range,url,next_step,next_step_date').single(); if (data) setJobs([data, ...jobs]) }; setSaving(false); closeModal() }
  async function remove() { if (selected) { await supabase.from('jobs').delete().eq('id', selected.id); setJobs(jobs.filter(j => j.id !== selected.id)); closeModal() } }
  function closeModal() { setModal(null); setSelected(null) }
  const filtered = jobs.filter(j => (filter === 'All' || j.status === filter) && `${j.company} ${j.role} ${j.location || ''}`.toLowerCase().includes(query.toLowerCase()))
  const count = (s: string) => jobs.filter(j => j.status === s).length
  if (loading) return <main className="loading-screen">Preparing your workspace...</main>
  return <main className="app-shell"><aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark">JT</span><span>JobTrack</span></Link><div className="side-label">WORKSPACE</div><nav><Link className="active" href="/dashboard"><span>▦</span> Overview</Link><Link href="/insights"><span>◒</span> Insights</Link></nav><div className="sidebar-tip"><strong>Search health</strong><span>Keep your next step visible.</span><div className="tip-progress"><i style={{ width: `${Math.min(jobs.length * 10, 100)}%` }} /></div></div><div className="side-bottom"><span className="avatar">{user?.email?.[0]?.toUpperCase()}</span><span className="side-email">{user?.email}</span><button className="text-btn" onClick={() => supabase.auth.signOut().then(() => router.replace('/'))}>Sign out</button></div></aside><section className="workspace"><header className="mobile-header"><Link href="/" className="brand"><span className="brand-mark">JT</span><span>JobTrack</span></Link><Link href="/insights" className="text-btn">Insights</Link></header><div className="workspace-inner"><div className="page-heading"><div><p className="eyebrow">PERSONAL COMMAND CENTER</p><h1>Good to see you, <em>again.</em></h1><p className="muted">Stay organized, stay confident, keep moving forward.</p></div><button className="primary-btn" onClick={() => setModal('add')}>+ New application</button></div><div className="stats-grid"><div className="stat-card featured"><span>Total pipeline</span><strong>{jobs.length}</strong><small><b className="trend-up">↑ {jobs.length ? 'Active' : 'Ready'}</b> opportunities tracked</small></div><div className="stat-card stat-blue"><span>Applications sent</span><strong>{count('Applied')}</strong><small>Keep the rhythm going</small></div><div className="stat-card stat-orange"><span>In progress</span><strong>{count('Interviewing')}</strong><small>Interviews underway</small></div><div className="stat-card stat-green"><span>Offers</span><strong>{count('Offer')}</strong><small>Great work so far</small></div></div><div className="section-bar"><div><h2>Application pipeline</h2><p className="muted">Every opportunity, one organized view.</p></div><Link href="/insights" className="secondary-btn">View insights →</Link></div><div className="toolbar"><div className="filter-pills">{['All', ...statuses].map(s => <button className={`${filter === s ? 'selected' : ''} ${statusClass[s] || ''}`} onClick={() => setFilter(s)} key={s}>{s}<span>{s === 'All' ? jobs.length : count(s)}</span></button>)}</div><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pipeline..." /></div><div className="job-list"><div className="list-head"><span>ROLE & COMPANY</span><span>STATUS</span><span>NEXT STEP</span><span>ACTIONS</span></div>{filtered.length === 0 ? <div className="empty-state"><span className="empty-icon">⌕</span><h3>No applications here yet</h3><p>Start building your pipeline with your next opportunity.</p><button className="primary-btn" onClick={() => setModal('add')}>Add first application</button></div> : filtered.map(job => <div className="job-row" key={job.id}><span className="company-dot">{job.company[0]}</span><div className="job-title"><strong>{job.role}</strong><small>{job.company} · {job.location || 'Remote'}{job.work_type ? ` · ${job.work_type}` : ''}</small></div><span className={`status-chip ${statusClass[job.status]}`}>{job.status}</span><div className="job-next"><strong>{job.next_step || 'Set a next step'}</strong><small>{job.next_step_date || 'No date set'}</small></div><div className="row-actions"><button className="icon-btn edit" title="Edit application" onClick={() => { setSelected(job); setModal('edit') }}>Edit</button><button className="icon-btn delete" title="Delete application" onClick={() => { setSelected(job); setModal('delete') }}>Delete</button></div></div>)}</div></div></section>{modal && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && closeModal()}><div className={`modal-card ${modal === 'delete' ? 'confirm' : ''}`}><div className="modal-title"><div><p className="eyebrow">{modal === 'delete' ? 'REMOVE OPPORTUNITY' : selected ? 'UPDATE OPPORTUNITY' : 'NEW OPPORTUNITY'}</p><h2>{modal === 'delete' ? 'Delete this application?' : selected ? 'Edit application' : 'Add to your pipeline'}</h2></div><button className="close-btn" onClick={closeModal}>×</button></div>{modal === 'delete' ? <><p className="muted">This will permanently remove <strong>{selected?.role}</strong> at <strong>{selected?.company}</strong>. This action cannot be undone.</p><div className="modal-actions"><button className="secondary-btn" onClick={closeModal}>Keep it</button><button className="danger-btn" onClick={remove}>Yes, delete</button></div></> : <form className="form-grid" onSubmit={save}><label>Company<input name="company" required defaultValue={selected?.company || ''} placeholder="e.g. Acme Health" /></label><label>Role<input name="role" required defaultValue={selected?.role || ''} placeholder="e.g. Product Designer" /></label><label>Location<input name="location" defaultValue={selected?.location || ''} placeholder="Remote or city" /></label><label>Work type<select name="work_type" defaultValue={selected?.work_type || 'Full-time'}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></label><label>Status<select name="status" defaultValue={selected?.status || 'Saved'}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><label>Salary range<input name="salary_range" defaultValue={selected?.salary_range || ''} placeholder="$90k - $120k" /></label><label className="wide">Job URL<input name="url" type="url" defaultValue={selected?.url || ''} placeholder="https://..." /></label><button className="primary-btn modal-submit wide" disabled={saving}>{saving ? 'Saving...' : selected ? 'Save changes' : 'Add application'}</button></form>}</div></div>}</main>
}
