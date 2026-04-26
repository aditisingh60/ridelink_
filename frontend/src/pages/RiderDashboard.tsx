import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IRide, UserRole, VehicleType } from '../types'
import RideCard from '../components/RideCard'
import PricingCard from '../components/PricingCard'
import api from '../api/axios'

const VEHICLE_PRICES = {
  [VehicleType.ECONOMY]: { base: 50, perKm: 12 },
  [VehicleType.PREMIUM]: { base: 100, perKm: 22 },
  [VehicleType.BIKE]:    { base: 25, perKm: 7 },
  [VehicleType.AUTO]:    { base: 30, perKm: 10 },
}

export default function RiderDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [rides, setRides] = useState<IRide[]>([])
  const [fetching, setFetching] = useState(true)
  const [booking, setBooking] = useState(false)
  const [form, setForm] = useState({ pickup: '', dropoff: '', distance: '', vehicleType: VehicleType.ECONOMY })
  const [fareEstimate, setFareEstimate] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== UserRole.RIDER)) navigate('/login')
  }, [isAuthenticated, isLoading, user, navigate])

  const fetchRides = async () => {
    try {
      const { data } = await api.get('/rides/my')
      setRides(data.rides)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchRides() }, [])

  const fetchEstimate = async () => {
    if (!form.distance || !form.vehicleType) return
    try {
      const { data } = await api.get('/rides/fare-estimate', {
        params: { vehicleType: form.vehicleType, distance: form.distance },
      })
      setFareEstimate(data.fare)
    } catch { /* ignore */ }
  }

  const handleBook = async (e: FormEvent) => {
    e.preventDefault()
    setMsg('')
    setBooking(true)
    try {
      await api.post('/rides/book', {
        pickup: form.pickup,
        dropoff: form.dropoff,
        vehicleType: form.vehicleType,
        distance: parseFloat(form.distance),
      })
      setMsg('🎉 Ride booked successfully!')
      setForm({ pickup: '', dropoff: '', distance: '', vehicleType: VehicleType.ECONOMY })
      setFareEstimate(null)
      fetchRides()
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } }})?.response?.data?.message
      setMsg(m || 'Booking failed.')
    } finally {
      setBooking(false)
    }
  }

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/rides/${id}/cancel`)
      fetchRides()
    } catch { /* ignore */ }
  }

  if (isLoading || fetching) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>Loading…</div>
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Rider Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name} 👋</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {/* Book a Ride */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>📍 Book a Ride</h2>
          <div className="card">
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {msg && (
                <div style={{
                  padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '0.875rem',
                  background: msg.startsWith('🎉') ? 'rgba(255, 107, 0, 0.1)' : 'hsla(0,80%,58%,0.1)',
                  color: msg.startsWith('🎉') ? 'var(--primary)' : 'hsl(0,80%,70%)',
                  border: `1px solid ${msg.startsWith('🎉') ? 'rgba(255, 107, 0, 0.3)' : 'hsla(0,80%,58%,0.3)'}`,
                }}>{msg}</div>
              )}
              <div className="form-group">
                <label className="form-label">Pickup Location</label>
                <input className="form-input" placeholder="e.g. Connaught Place, Delhi" value={form.pickup}
                  onChange={e => setForm(p => ({ ...p, pickup: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Dropoff Location</label>
                <input className="form-input" placeholder="e.g. IGI Airport, Delhi" value={form.dropoff}
                  onChange={e => setForm(p => ({ ...p, dropoff: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Distance (km)</label>
                <input className="form-input" type="number" placeholder="e.g. 12" min="0.5" step="0.1" value={form.distance}
                  onChange={e => setForm(p => ({ ...p, distance: e.target.value }))} required />
              </div>

              <div>
                <label className="form-label" style={{ marginBottom: 10, display: 'block' }}>Vehicle Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.values(VehicleType).map(v => (
                    <PricingCard key={v} type={v}
                      baseFare={VEHICLE_PRICES[v].base} perKm={VEHICLE_PRICES[v].perKm}
                      selected={form.vehicleType === v}
                      onSelect={() => setForm(p => ({ ...p, vehicleType: v }))} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn btn-outline" onClick={fetchEstimate}>
                  Estimate Fare
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={booking}>
                  {booking ? 'Booking…' : 'Book Ride'}
                </button>
              </div>

              {fareEstimate !== null && (
                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(255, 107, 0, 0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Estimated fare: </span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>₹{fareEstimate}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Ride History */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>🕒 My Rides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rides.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                No rides yet. Book your first ride! 🚗
              </div>
            ) : (
              rides.map(r => (
                <RideCard key={r._id} ride={r} viewAs={UserRole.RIDER} onCancel={handleCancel} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
