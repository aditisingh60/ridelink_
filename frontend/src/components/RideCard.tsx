import { IRide, RideStatus, UserRole } from '../types'
import StatusBadge from './StatusBadge'

interface Props {
  ride: IRide
  viewAs: UserRole
  onAccept?: (id: string) => void
  onStart?: (id: string) => void
  onComplete?: (id: string) => void
  onCancel?: (id: string) => void
}

export default function RideCard({ ride, viewAs, onAccept, onStart, onComplete, onCancel }: Props) {
  const driverUser = typeof ride.driver === 'object' ? ride.driver : null
  const riderUser = typeof ride.rider === 'object' ? ride.rider : null

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {ride.vehicleType} · {ride.distance} km
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <span>📍 {ride.pickup}</span>
            <span style={{ color: 'var(--text-dim)' }}>→</span>
            <span>🏁 {ride.dropoff}</span>
          </div>
        </div>
        <StatusBadge status={ride.status} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Fare</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>₹{ride.fare}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Pricing</div>
            <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{ride.pricingStrategy}</div>
          </div>
          {viewAs === UserRole.RIDER && driverUser && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Driver</div>
              <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{driverUser.name}</div>
            </div>
          )}
          {viewAs === UserRole.DRIVER && riderUser && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Rider</div>
              <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{riderUser.name}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {viewAs === UserRole.DRIVER && ride.status === RideStatus.REQUESTED && onAccept && (
            <button className="btn btn-accent btn-sm" onClick={() => onAccept(ride._id)}>Accept</button>
          )}
          {viewAs === UserRole.DRIVER && ride.status === RideStatus.ASSIGNED && onStart && (
            <button className="btn btn-primary btn-sm" onClick={() => onStart(ride._id)}>Start Ride</button>
          )}
          {viewAs === UserRole.DRIVER && ride.status === RideStatus.IN_PROGRESS && onComplete && (
            <button className="btn btn-accent btn-sm" onClick={() => onComplete(ride._id)}>Complete</button>
          )}
          {viewAs === UserRole.RIDER && (ride.status === RideStatus.REQUESTED || ride.status === RideStatus.ASSIGNED) && onCancel && (
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(ride._id)}>Cancel</button>
          )}
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        {new Date(ride.createdAt).toLocaleString()}
      </div>
    </div>
  )
}
