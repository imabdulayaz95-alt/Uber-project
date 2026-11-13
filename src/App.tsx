import { useEffect, useRef, useState } from 'react'
import './App.css'

const NAV_LINKS = ['Ride', 'Earn', 'Travel', 'Hotels', 'Business', 'Uber Eats']
const PICKUP_OPTIONS = ['Pickup now', 'Pickup in 15 min', 'Pickup in 30 min', 'Schedule for later']

const SERVICES = [
  {
    title: 'Ride',
    text: 'Go anywhere with Uber. Request a ride, hop in, and go.',
    icon: <CarIcon />,
  },
  {
    title: 'Reserve',
    text: 'Reserve your ride in advance so you can relax on the day of your trip.',
    icon: <CalendarIcon />,
  },
  {
    title: 'Hotels',
    text: 'Explore over 700,000 hotels and earn rewards on every stay.',
    icon: <HotelIcon />,
  },
]

type RideOption = { name: string; seats: number; eta: number; price: number }

function estimateRides(pickup: string, dropoff: string): RideOption[] {
  // Deterministic fake estimate based on the inputs so results feel consistent.
  const seed = [...(pickup + dropoff)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  const base = 8 + (seed % 25)
  return [
    { name: 'UberX', seats: 4, eta: 3 + (seed % 5), price: base },
    { name: 'Comfort', seats: 4, eta: 4 + (seed % 6), price: base * 1.3 },
    { name: 'UberXL', seats: 6, eta: 6 + (seed % 7), price: base * 1.6 },
    { name: 'Black', seats: 4, eta: 8 + (seed % 8), price: base * 2.4 },
  ]
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pickupTime, setPickupTime] = useState(PICKUP_OPTIONS[0])
  const [timeOpen, setTimeOpen] = useState(false)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [rides, setRides] = useState<RideOption[] | null>(null)
  const [error, setError] = useState('')
  const timeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleSeePrices(e: React.FormEvent) {
    e.preventDefault()
    if (!pickup.trim() || !dropoff.trim()) {
      setError('Enter both a pickup and a dropoff location.')
      setRides(null)
      return
    }
    setError('')
    setRides(estimateRides(pickup.trim(), dropoff.trim()))
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo">Uber</a>
          <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Main">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="pill">{l}</a>
            ))}
            <button className="pill">
              About <ChevronIcon />
            </button>
          </nav>
          <div className="header-actions">
            <button className="pill hide-sm"><GlobeIcon /> EN</button>
            <a href="#" className="pill hide-sm">Help</a>
            <a href="#" className="pill">Log in</a>
            <a href="#" className="pill pill-light">Sign up</a>
            <button
              className="pill menu-btn"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-form">
            <p className="city">
              <PinIcon /> Oklahoma City, US <a href="#">Change city</a>
            </p>
            <h1>Go anywhere</h1>

            <div className="time-select" ref={timeRef}>
              <button
                type="button"
                className="time-btn"
                aria-haspopup="listbox"
                aria-expanded={timeOpen}
                onClick={() => setTimeOpen((o) => !o)}
              >
                <ClockIcon /> {pickupTime} <ChevronIcon />
              </button>
              {timeOpen && (
                <ul className="time-menu" role="listbox">
                  {PICKUP_OPTIONS.map((opt) => (
                    <li key={opt}>
                      <button
                        role="option"
                        aria-selected={opt === pickupTime}
                        onClick={() => {
                          setPickupTime(opt)
                          setTimeOpen(false)
                        }}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={handleSeePrices}>
              <div className="locations">
                <span className="connector" aria-hidden="true" />
                <label className="field">
                  <span className="dot" aria-hidden="true" />
                  <input
                    placeholder="Pickup location"
                    aria-label="Pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                  <button
                    type="button"
                    className="locate"
                    aria-label="Use current location"
                    onClick={() => setPickup('Current location')}
                  >
                    <NavigateIcon />
                  </button>
                </label>
                <label className="field">
                  <span className="square" aria-hidden="true" />
                  <input
                    placeholder="Dropoff location"
                    aria-label="Dropoff location"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                  />
                </label>
              </div>

              {error && <p className="error" role="alert">{error}</p>}

              <div className="form-actions">
                <button type="submit" className="btn-light">See prices</button>
                <a href="#" className="activity-link">Log in to check your activity</a>
              </div>
            </form>

            {rides && (
              <ul className="rides" aria-live="polite">
                {rides.map((r) => (
                  <li key={r.name}>
                    <CarIcon small />
                    <div className="ride-info">
                      <strong>{r.name}</strong>
                      <span>{r.seats} seats · {r.eta} min away</span>
                    </div>
                    <strong className="ride-price">${r.price.toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hero-media">
            <HotelRoomArt />
            <div className="promo">
              <span>Planning travel?</span>
              <a href="#" className="btn-pill-light">Explore Hotels</a>
            </div>
          </div>
        </section>

        <section className="explore">
          <h2>Explore what you can do with Uber</h2>
          <div className="cards">
            {SERVICES.map((s) => (
              <article key={s.title} className="card">
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <a href="#" className="card-btn">Details</a>
                </div>
                <div className="card-icon">{s.icon}</div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Front-end practice project for my portfolio. Not affiliated with or endorsed by
          Uber Technologies, Inc. Prices shown are randomly generated.
        </p>
      </footer>
    </>
  )
}

/* ---------- Icons & illustration ---------- */

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}
function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </svg>
  )
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" fill="currentColor" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M12 6v6h5" stroke="#fff" strokeWidth="2.5" fill="none" />
    </svg>
  )
}
function NavigateIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3L3 10.5l7.5 3 3 7.5L21 3z" fill="currentColor" />
    </svg>
  )
}
function CarIcon({ small = false }: { small?: boolean }) {
  const s = small ? 44 : 110
  return (
    <svg width={s} height={s * 0.6} viewBox="0 0 100 60" aria-hidden="true">
      <ellipse cx="50" cy="54" rx="44" ry="4" fill="#000" opacity=".35" />
      <path d="M8 40c0-6 4-9 10-10l12-12c3-3 6-4 10-4h22c4 0 7 2 9 5l8 11c8 1 13 4 13 10v6H8z" fill="#f2f2f2" />
      <path d="M33 19c2-2 4-3 7-3h10v12H26zM54 16h8c3 0 5 1 6 3l6 9H54z" fill="#5a6a7a" />
      <circle cx="26" cy="47" r="8" fill="#222" /><circle cx="26" cy="47" r="3.5" fill="#999" />
      <circle cx="76" cy="47" r="8" fill="#222" /><circle cx="76" cy="47" r="3.5" fill="#999" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
      <rect x="14" y="20" width="72" height="68" rx="8" fill="#fff" />
      <rect x="14" y="20" width="72" height="20" rx="8" fill="#ff6937" />
      <rect x="14" y="32" width="72" height="8" fill="#ff6937" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}-${c}`} x={22 + c * 15} y={48 + r * 13} width="10" height="8" rx="2" fill={r === 1 && c === 2 ? '#276ef1' : '#ddd'} />
        )),
      )}
      <rect x="30" y="12" width="6" height="16" rx="3" fill="#888" />
      <rect x="64" y="12" width="6" height="16" rx="3" fill="#888" />
    </svg>
  )
}
function HotelIcon() {
  return (
    <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
      <rect x="22" y="14" width="56" height="76" rx="4" fill="#f5a623" />
      <rect x="22" y="14" width="56" height="10" rx="4" fill="#e08a00" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={30 + c * 15} y={30 + r * 12} width="10" height="7" rx="1" fill="#fff6e0" />
        )),
      )}
      <rect x="43" y="76" width="14" height="14" fill="#7a4a00" />
    </svg>
  )
}

function HotelRoomArt() {
  return (
    <svg className="room-art" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a hotel room">
      <defs>
        <linearGradient id="wall" x1="0" x2="1">
          <stop offset="0" stopColor="#b9b4ad" />
          <stop offset="1" stopColor="#d6d1c9" />
        </linearGradient>
        <linearGradient id="wood" x1="0" x2="1">
          <stop offset="0" stopColor="#a0612b" />
          <stop offset="1" stopColor="#d08a45" />
        </linearGradient>
        <radialGradient id="glow" cx=".72" cy=".35" r=".6">
          <stop offset="0" stopColor="#fff3d6" stopOpacity=".6" />
          <stop offset="1" stopColor="#fff3d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#wall)" />
      <rect x="0" y="0" width="70" height="400" fill="url(#wood)" />
      <rect x="320" y="0" width="80" height="400" fill="url(#wood)" />
      <rect x="250" y="70" width="60" height="110" fill="#3d4b63" />
      <path d="M255 80l40 20-20 60-20-10z" fill="#6c7f99" opacity=".8" />
      <rect x="0" y="290" width="400" height="110" fill="#8b6a4f" />
      {/* lamp */}
      <path d="M20 40 Q90 20 120 90" stroke="#555" strokeWidth="3" fill="none" />
      <path d="M85 120 a40 34 0 0 1 80 0z" fill="#f4ead8" />
      {/* bed */}
      <rect x="150" y="215" width="250" height="90" rx="6" fill="#efe9e1" />
      <path d="M150 240h250v65H150z" fill="#8c5a3c" />
      <ellipse cx="280" cy="212" rx="38" ry="18" fill="#fff" />
      <ellipse cx="350" cy="208" rx="38" ry="18" fill="#fbfbfb" />
      {/* bag & suitcase */}
      <path d="M200 228h55l-6 22h-44z" fill="#6f8796" />
      <rect x="120" y="215" width="30" height="80" rx="5" fill="#d9a520" />
      <rect x="130" y="196" width="10" height="20" fill="none" stroke="#333" strokeWidth="3" />
      <rect width="400" height="400" fill="url(#glow)" />
    </svg>
  )
}
