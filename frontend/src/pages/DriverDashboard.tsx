import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IRide, UserRole } from '../types'
import RideCard from '../components/RideCard'
import api from '../api/axios'

export default function DriverDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [available, setAvailable] = useState<IRide[]>([])
  const [myRides, setMyRides] = useState<IRide[]>([])
  const [stats, setStats] = useState<{ totalCompleted: number; totalEarnings: number } | null>(null)
  const [fetching, setFetching] = useState(true)
  const [tab, setTab] = useState<'available' | 'history'>('available')

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== UserRole.DRIVER)) navigate('/login')
  }, [isAuthenticated, isLoading, user, navigate])

  const fetchAll = async () => {
    try {
      const [avRes, myRes, stRes] = await Promise.all([
        api.get('/rides/available'),
        api.get('/driver/rides/my'),
        api.get('/driver/stats'),
      ])
      setAvailable(avRes.data.rides)
      setMyRides(myRes.data.rides)
      setStats({ totalCompleted: stRes.data.totalCompleted, totalEarnings: stRes.data.driver?.totalEarnings ?? 0 })
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleAccept = async (id: string) => {
    await api.patch(`/driver/rides/${id}/accept`)
    fetchAll()
  }
  const handleStart = async (id: string) => {
    await api.patch(`/driver/rides/${id}/start`)
    fetchAll()
  }
  const handleComplete = async (id: string) => {
    await api.patch(`/driver/rides/${id}/complete`)
    fetchAll()
  }

  if (isLoading || fetching) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>Loading…</div>
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Driver Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>On the road, {user?.name} 🏎️</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { icon: '✅', label: 'Completed Rides', value: stats?.totalCompleted ?? 0 },
          { icon: '💰', label: 'Total Earnings', value: `₹${stats?.totalEarnings ?? 0}` },
          { icon: '🔍', label: 'Available Rides', value: available.length },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-card2)', borderRadius: 'var(--radius)', padding: 4, width: 'fit-content' }}>
        {(['available', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              background: tab === t ? 'var(--primary)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>
            {t === 'available' ? `Available (${available.length})` : `My Rides (${myRides.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'available' ? (
          available.length === 0
            ? <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No available rides right now. Check back soon! 🔍</div>
            : available.map(r => (
              <RideCard key={r._id} ride={r} viewAs={UserRole.DRIVER}
                onAccept={handleAccept} onStart={handleStart} onComplete={handleComplete} />
            ))
        ) : (
          myRides.length === 0
            ? <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No ride history yet.</div>
            : myRides.map(r => (
              <RideCard key={r._id} ride={r} viewAs={UserRole.DRIVER}
                onStart={handleStart} onComplete={handleComplete} />
            ))
        )}
      </div>
    </div>
  )
}
