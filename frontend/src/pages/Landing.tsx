import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

export default function Landing() {
  const { isAuthenticated, user } = useAuth()
  const dashboardPath = user?.role === UserRole.DRIVER ? '/driver' : '/rider'

  return (
    <div>
      {/* Hero */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 0',
        overflow: 'hidden'
      }}>
        {/* Decorative Glowing Orbs */}
        <div className="animate-float" style={{ position: 'absolute', top: '10%', left: '-5%', width: 400, height: 400, background: 'rgba(255, 107, 0, 0.15)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }} />
        <div className="animate-float" style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 600, height: 600, background: 'rgba(255, 145, 0, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, animationDelay: '2s' }} />
        
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-slide-up" style={{ opacity: 0 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 107, 0, 0.1)',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              borderRadius: 99,
              padding: '6px 18px',
              fontSize: '0.85rem',
              color: 'var(--primary)',
              marginBottom: 32,
              fontWeight: 600,
              boxShadow: '0 0 20px rgba(255, 107, 0, 0.1)'
            }}>
              <span className="animate-pulseGlow" style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></span>
              Now featuring Smart Surge Pricing
            </div>

            <h1 style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 24,
              background: 'linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              Your Ride,<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(255, 107, 0, 0.3))'
              }}>On Demand</span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              maxWidth: 580,
              margin: '0 auto 48px',
              lineHeight: 1.6,
            }}>
              Experience the next generation of ride sharing. Safe, lightning-fast, and powered by intelligent real-time pricing algorithms.
            </p>
          </div>

          <div className="animate-slide-up animate-delay-1" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: 0 }}>
            {isAuthenticated ? (
              <Link to={dashboardPath} className="btn btn-primary btn-lg">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
              </>
            )}
          </div>

          <div className="animate-slide-up animate-delay-2" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(2rem, 5vw, 4rem)',
            marginTop: 80,
            flexWrap: 'wrap',
            opacity: 0
          }}>
            {[
              { value: '50K+', label: 'Happy Riders' },
              { value: '10K+', label: 'Active Drivers' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '2 min', label: 'Avg Pickup Time' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0 10px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>{s.value}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 48 }}>
            Why RideLink?
          </h2>
          <div className="animate-slide-up animate-delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, opacity: 0 }}>
            {[
              { icon: '🔒', title: 'Secure & Verified', desc: 'All drivers are background-checked and verified before onboarding.' },
              { icon: '💸', title: 'Smart Pricing', desc: 'Real-time algorithms dynamically adjust rates to ensure fair pricing.' },
              { icon: '⚡', title: 'Instant Matching', desc: 'Our advanced systems connect you with the nearest driver immediately.' },
              { icon: '📍', title: 'Live Tracking', desc: 'Pinpoint GPS tracking continuously updates your ride status.' },
            ].map((f, i) => (
              <div key={f.title} className="card" style={{ textAlign: 'left', transitionDelay: `${i * 0.1}s` }}>
                <div style={{ 
                  fontSize: 32, 
                  marginBottom: 20, 
                  background: 'rgba(255, 107, 0, 0.1)', 
                  width: 60, height: 60, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 107, 0, 0.2)'
                }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1.25rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
