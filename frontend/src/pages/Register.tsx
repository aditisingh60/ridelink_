import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole, VehicleType } from '../types'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: UserRole.RIDER as UserRole,
    vehicleType: VehicleType.ECONOMY as VehicleType,
    vehicleNumber: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate(form.role === UserRole.DRIVER ? '/driver' : '/rider')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255, 107, 0, 0.08) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Join thousands using RideLink</p>
        </div>

        <div className="card" style={{ boxShadow: 'var(--shadow)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ background: 'hsla(0,80%,58%,0.1)', border: '1px solid hsla(0,80%,58%,0.3)', borderRadius: 'var(--radius)', padding: '10px 14px', color: 'hsl(0,80%,70%)', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            {/* Role Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {([UserRole.RIDER, UserRole.DRIVER] as UserRole[]).map(r => (
                <button key={r} type="button"
                  onClick={() => setForm(p => ({ ...p, role: r }))}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: `2px solid ${form.role === r ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.role === r ? 'rgba(255, 107, 0, 0.1)' : 'var(--bg-card2)',
                    color: form.role === r ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                  {r === UserRole.RIDER ? '🧑 Rider' : '🚗 Driver'}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="John Doe" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+91 9876543210" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
            </div>

            {form.role === UserRole.DRIVER && (
              <>
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select className="form-input" value={form.vehicleType}
                    onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value as VehicleType }))}>
                    {Object.values(VehicleType).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Number</label>
                  <input className="form-input" placeholder="MH 01 AB 1234" value={form.vehicleNumber}
                    onChange={e => setForm(p => ({ ...p, vehicleNumber: e.target.value }))} required />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
