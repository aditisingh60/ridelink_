import { VehicleType } from '../types'

interface Props {
  type: VehicleType
  baseFare: number
  perKm: number
  selected: boolean
  onSelect: () => void
}

const icons: Record<VehicleType, string> = {
  [VehicleType.ECONOMY]: '🚗',
  [VehicleType.PREMIUM]: '🚙',
  [VehicleType.BIKE]: '🏍️',
  [VehicleType.AUTO]: '🛺',
}

const descriptions: Record<VehicleType, string> = {
  [VehicleType.ECONOMY]: 'Comfortable & affordable',
  [VehicleType.PREMIUM]: 'Luxury experience',
  [VehicleType.BIKE]: 'Beat the traffic',
  [VehicleType.AUTO]: 'Quick & easy',
}

export default function PricingCard({ type, baseFare, perKm, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      style={{
        background: selected ? 'rgba(255, 107, 0, 0.12)' : 'var(--bg-card)',
        border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        boxShadow: selected ? 'var(--shadow-glow)' : 'none',
      }}
    >
      <span style={{ fontSize: 28 }}>{icons[type]}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: selected ? 'var(--primary)' : 'var(--text)' }}>{type}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{descriptions[type]}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{baseFare}+</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>₹{perKm}/km</div>
      </div>
    </button>
  )
}
