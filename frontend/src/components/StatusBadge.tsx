import { RideStatus } from '../types'

const config: Record<RideStatus, { label: string; color: string; bg: string }> = {
  [RideStatus.REQUESTED]: { label: 'Requested', color: 'var(--warning)', bg: 'rgba(255, 184, 0, 0.12)' },
  [RideStatus.ASSIGNED]:  { label: 'Assigned',  color: '#ff9100', bg: 'rgba(255, 145, 0, 0.12)' },
  [RideStatus.IN_PROGRESS]: { label: 'In Progress', color: 'var(--primary)', bg: 'rgba(255, 107, 0, 0.12)' },
  [RideStatus.COMPLETED]: { label: 'Completed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  [RideStatus.CANCELLED]: { label: 'Cancelled', color: 'var(--danger)', bg: 'rgba(255, 51, 51, 0.12)' },
}

export default function StatusBadge({ status }: { status: RideStatus }) {
  const { label, color, bg } = config[status]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 99,
      fontSize: '0.75rem',
      fontWeight: 600,
      color,
      background: bg,
      border: `1px solid ${color}40`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}
