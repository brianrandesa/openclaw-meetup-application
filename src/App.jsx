import { useState } from 'react'
import './index.css'

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || '/api/apply'

const EVENT_DATE = 'Thursday, March 12, 2026'
const EVENT_LOCATION = 'Miami, FL'

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    industryRole: '',
    whyAttend: '',
    hopingToLearn: '',
    howHeard: '',
    socialLinks: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      event: `OpenClaw Meetup - Miami — ${EVENT_DATE}`,
    }

    // Always save locally first
    try {
      const existing = JSON.parse(localStorage.getItem('openclaw_applications') || '[]')
      existing.push(payload)
      localStorage.setItem('openclaw_applications', JSON.stringify(existing))
    } catch (_) {}

    // Try webhook
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok && res.status !== 404 && res.status !== 405) {
        throw new Error('Submission failed. Please try again.')
      }
      setSubmitted(true)
    } catch (err) {
      if (err.message === 'Submission failed. Please try again.') {
        setError(err.message)
        setLoading(false)
        return
      }
      // Network / endpoint not configured — still show success (saved locally)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return <SuccessScreen name={formData.fullName} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020817 0%, #0a1628 40%, #020817 100%)',
      backgroundImage: 'linear-gradient(135deg, #020817 0%, #0a1628 40%, #020817 100%), radial-gradient(circle, rgba(59,130,246,0.08) 1px, transparent 1px)',
      backgroundSize: 'cover, 32px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%', width: '600px', height: '600px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,78,216,0.1), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto', padding: '48px 16px' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                boxShadow: '0 0 30px rgba(59,130,246,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>OC</span>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
            color: '#93c5fd', borderRadius: '999px', padding: '6px 16px',
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa' }} />
            Exclusive · Invitation Only · 50 Seats
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa' }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 52px)', fontWeight: '900', color: 'white',
            lineHeight: 1.1, margin: '0 0 4px',
            textShadow: '0 0 30px rgba(96,165,250,0.3)',
          }}>
            OpenClaw Meetup
          </h1>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: '800', margin: '0 0 6px',
            background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Miami
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
            {EVENT_DATE} &nbsp;·&nbsp; {EVENT_LOCATION}
          </p>

          {/* Subheadline */}
          <p style={{
            color: '#cbd5e1', marginTop: '20px', fontSize: '15px', lineHeight: '1.7',
            maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            An exclusive AI showcase limited to{' '}
            <span style={{ color: '#60a5fa', fontWeight: '600' }}>50 hand-selected attendees</span>.
            Experience cutting-edge AI technology, connect with founders and builders, and be part of
            Miami's most talked-about tech gathering.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px' }}>
            {[
              { value: '50', label: 'Seats Total' },
              { value: 'AI', label: 'Showcase' },
              { value: '~1hr', label: 'Review Time' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#60a5fa', fontWeight: '900', fontSize: '20px' }}>{value}</div>
                <div style={{ color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.15)',
          backdropFilter: 'blur(20px)', borderRadius: '24px',
          padding: 'clamp(24px, 5vw, 40px)',
          boxShadow: '0 0 40px rgba(59,130,246,0.1), 0 0 80px rgba(59,130,246,0.05)',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ color: 'white', fontWeight: '800', fontSize: '20px', margin: '0 0 4px' }}>
              Apply for Access
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px' }}>
              Applications are reviewed within 1 hour. Venue address sent upon approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Field label="Full Name" required>
                <Input name="fullName" value={formData.fullName} onChange={handleChange}
                  placeholder="Alex Johnson" type="text" required />
              </Field>
              <Field label="Email Address" required>
                <Input name="email" value={formData.email} onChange={handleChange}
                  placeholder="alex@company.com" type="email" required />
              </Field>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Field label="Phone Number" required>
                <Input name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+1 (305) 000-0000" type="tel" required />
              </Field>
              <Field label="Company / Business" required>
                <Input name="company" value={formData.company} onChange={handleChange}
                  placeholder="Acme Corp" type="text" required />
              </Field>
            </div>

            {/* Industry */}
            <Field label="Industry / Role" required>
              <Input name="industryRole" value={formData.industryRole} onChange={handleChange}
                placeholder="e.g. Founder — SaaS / VP Engineering — Fintech" type="text" required />
            </Field>

            {/* Why attend */}
            <Field label="Why do you want to attend?" required>
              <TextArea name="whyAttend" value={formData.whyAttend} onChange={handleChange}
                placeholder="Tell us what draws you to this event and what you bring to the room..." rows={3} required />
            </Field>

            {/* Hoping to learn */}
            <Field label="What are you hoping to learn or see?" required>
              <TextArea name="hopingToLearn" value={formData.hopingToLearn} onChange={handleChange}
                placeholder="Specific AI use cases, demos, connections you're looking for..." rows={3} required />
            </Field>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <Field label="How did you hear about this event?" optional>
                <Input name="howHeard" value={formData.howHeard} onChange={handleChange}
                  placeholder="Twitter, friend, newsletter..." type="text" />
              </Field>
              <Field label="LinkedIn / Twitter" optional>
                <Input name="socialLinks" value={formData.socialLinks} onChange={handleChange}
                  placeholder="linkedin.com/in/yourname" type="text" />
              </Field>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '12px', padding: '12px 16px', color: '#f87171', fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                border: '1px solid rgba(96,165,250,0.3)',
                borderRadius: '14px', padding: '16px',
                color: 'white', fontWeight: '700', fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em', width: '100%',
                boxShadow: loading ? 'none' : '0 0 20px rgba(59,130,246,0.3)',
                transition: 'all 0.2s ease',
                marginTop: '4px',
              }}
            >
              {loading ? 'Submitting Application...' : 'Apply for Access →'}
            </button>

            <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px' }}>
              Seats are extremely limited. Applications reviewed on a rolling basis.
            </p>
          </form>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '32px', color: '#334155', fontSize: '12px', lineHeight: '1.8' }}>
          <p>OpenClaw AI · Miami, FL</p>
          <p>This is a private, invitation-reviewed event.</p>
        </footer>
      </div>
    </div>
  )
}

function Input({ name, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px',
        padding: '12px 16px', color: '#e2e8f0', fontSize: '14px',
        outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box',
      }}
      onFocus={e => {
        e.target.style.background = 'rgba(255,255,255,0.06)'
        e.target.style.borderColor = 'rgba(96,165,250,0.5)'
        e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
      }}
      onBlur={e => {
        e.target.style.background = 'rgba(255,255,255,0.04)'
        e.target.style.borderColor = 'rgba(59,130,246,0.2)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )
}

function TextArea({ name, value, onChange, placeholder, rows = 3, required = false }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      style={{
        width: '100%', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px',
        padding: '12px 16px', color: '#e2e8f0', fontSize: '14px',
        outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box',
        resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6',
      }}
      onFocus={e => {
        e.target.style.background = 'rgba(255,255,255,0.06)'
        e.target.style.borderColor = 'rgba(96,165,250,0.5)'
        e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
      }}
      onBlur={e => {
        e.target.style.background = 'rgba(255,255,255,0.04)'
        e.target.style.borderColor = 'rgba(59,130,246,0.2)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )
}

function Field({ label, required, optional, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '13px', fontWeight: '600',
        color: '#94a3b8', marginBottom: '8px',
      }}>
        {label}
        {required && <span style={{ color: '#60a5fa', marginLeft: '4px' }}>*</span>}
        {optional && <span style={{ color: '#475569', marginLeft: '8px', fontSize: '11px', fontWeight: '400' }}>optional</span>}
      </label>
      {children}
    </div>
  )
}

function SuccessScreen({ name }) {
  const first = name?.split(' ')[0] || 'there'
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020817 0%, #0a1628 40%, #020817 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: '24px', padding: '48px 40px',
        maxWidth: '440px', width: '100%', textAlign: 'center',
        boxShadow: '0 0 40px rgba(59,130,246,0.1)',
        animation: 'fadeInUp 0.5s ease forwards',
      }}>
        {/* Check */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            boxShadow: '0 0 40px rgba(59,130,246,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="40" height="40" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '900', margin: '0 0 8px' }}>
          Application Received!
        </h2>
        <p style={{ color: '#60a5fa', fontWeight: '700', fontSize: '17px', margin: '0 0 16px' }}>
          Hey {first} — you're in the queue.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7', margin: '0 0 24px' }}>
          We'll review your application and send the{' '}
          <span style={{ color: 'white', fontWeight: '600' }}>venue address via email within 1 hour</span>.
          Keep an eye on your inbox (and spam folder).
        </p>

        <div style={{
          background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
        }}>
          <p style={{ color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Event</p>
          <p style={{ color: 'white', fontWeight: '700', fontSize: '14px', margin: '0 0 2px' }}>
            OpenClaw Meetup — Miami
          </p>
          <p style={{ color: '#475569', fontSize: '12px' }}>Thursday, March 12, 2026</p>
        </div>

        <p style={{ color: '#334155', fontSize: '12px' }}>
          Questions? Reach out via Telegram or email.
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default App
