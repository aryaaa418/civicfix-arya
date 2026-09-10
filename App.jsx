import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_URL = 'https://eradicate-atlantic-setting.ngrok-free.dev'

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'Report an issue', page: 'report' },
  { label: 'Track complaint', page: 'tracking' },
]

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    camera: <><path d="M4 7h3l1.5-2h7L17 7h3v11H4Z"/><circle cx="12" cy="12.5" r="3"/></>,
    clock: <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M5 15v4h14v-4"/></>,
    shield: <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  }

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = 'primary',
  icon,
  onClick,
  type = 'button',
  disabled = false,
}) {
  return (
    <button
      className={`button button-${variant}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
      {icon && <Icon name={icon} size={17} />}
    </button>
  )
}

function Navbar({ page, navigate }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <button
        className="brand"
        onClick={() => navigate('home')}
        aria-label="Go to CivicFix home"
      >
        <span className="brand-mark">
          <Icon name="shield" size={19} />
        </span>
        <span>
          Civic<span>Fix</span>
        </span>
      </button>

      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <Icon name={open ? 'close' : 'menu'} />
      </button>

      <nav className={open ? 'nav-links is-open' : 'nav-links'}>
        {navItems.map((item) => (
          <button
            className={page === item.page ? 'active' : ''}
            key={item.page}
            onClick={() => {
              navigate(item.page)
              setOpen(false)
            }}
          >
            {item.label}
          </button>
        ))}

        <span className="nav-divider" />

        <span className="nav-status">
          <i /> Services online
        </span>
      </nav>
    </header>
  )
}

function Footer({ navigate }) {
  return (
    <footer>
      <div className="footer-brand">
        <button className="brand" onClick={() => navigate('home')}>
          <span className="brand-mark">
            <Icon name="shield" size={17} />
          </span>
          <span>
            Civic<span>Fix</span>
          </span>
        </button>

        <p>Make your city better, one report at a time.</p>
      </div>

      <div className="footer-links">
        <span>Built for better neighborhoods</span>
        <span>Privacy · Accessibility · Support</span>
      </div>
    </footer>
  )
}

function Home({ navigate }) {
  const steps = [
    ['01', 'Upload a photo', 'Show us what needs attention.'],
    ['02', 'AI detects the issue', 'We identify the right department.'],
    ['03', 'Location captured', 'Pinpoint the problem in seconds.'],
    ['04', 'Complaint sent', 'Your city takes it from here.'],
  ]

  return (
    <main>
      <section className="hero-section page-pad">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Community-powered city care
          </p>

          <h1>
            Report civic problems <em>easily.</em>
          </h1>

          <p className="hero-lede">
            CivicFix helps you turn a photo of a problem into action.
            Fast, clear, and built for the people who live here.
          </p>

          <div className="hero-actions">
            <Button onClick={() => navigate('report')} icon="arrow">
              Report an issue
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate('tracking')}
              icon="search"
            >
              Track a complaint
            </Button>
          </div>

          <div className="trust-note">
            <span className="avatar-stack">
              <i>J</i>
              <i>M</i>
              <i>A</i>
            </span>

            <span>
              <strong>12,400+</strong> residents making a difference
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="photo-card">
            <div className="photo-image" />

            <div className="photo-label">
              <span className="label-pin">
                <Icon name="pin" size={14} />
              </span>

              <span>
                <strong>Issue spotted</strong>
                <small>Market Street · San Francisco</small>
              </span>

              <span className="verified">
                <Icon name="check" size={15} />
              </span>
            </div>
          </div>

          <div className="floating-card ai-float">
            <span className="float-icon">
              <Icon name="shield" size={17} />
            </span>

            <span>
              <strong>AI powered</strong>
              <small>Smart civic issue detection</small>
            </span>
          </div>

          <div className="floating-card response-float">
            <span className="response-number">24h</span>
            <span>
              Average first
              <br />
              response
            </span>
          </div>
        </div>
      </section>

      <section className="stats-strip page-pad">
        <div>
          <strong>12,400+</strong>
          <span>Issues reported</span>
        </div>

        <div>
          <strong>8,920</strong>
          <span>Issues resolved</span>
        </div>

        <div>
          <strong>72%</strong>
          <span>Resolved in 7 days</span>
        </div>

        <div>
          <strong>4.9/5</strong>
          <span>Community rating</span>
        </div>
      </section>

      <section className="how-section page-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Simple by design</p>
            <h2>From spotted to solved.</h2>
          </div>

          <p>
            Every report gets the right attention, without the runaround.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map(([number, title, text], index) => (
            <div
              className={`step ${
                index === 1 ? 'step-highlight' : ''
              }`}
              key={number}
            >
              <span className="step-number">{number}</span>

              <div className="step-icon">
                <Icon
                  name={['camera', 'shield', 'pin', 'check'][index]}
                  size={20}
                />
              </div>

              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="callout page-pad">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h2>See something? Say something.</h2>
        </div>

        <Button onClick={() => navigate('report')} icon="arrow">
          Start a report
        </Button>
      </section>
    </main>
  )
}

function Report({ navigate, report, setReport }) {
  const inputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setReport((current) => ({
      ...current,
      file,
      image: URL.createObjectURL(file),
    }))

    setError('')
  }

  const locate = () => {
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        setReport((current) => ({
          ...current,
          latitude,
          longitude,
          location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }))
      },
      () => {
        setError('Unable to access your location.')
      }
    )
  }

  const analyze = async () => {
    if (!report.file) {
      setError('Please upload a photo first.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()

      formData.append('image', report.file)

      if (report.description) {
        formData.append('description', report.description)
      }

      if (report.latitude) {
        formData.append('latitude', report.latitude)
      }

      if (report.longitude) {
        formData.append('longitude', report.longitude)
      }

      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      setReport((current) => ({
        ...current,
        ...data,
        analyzed: true,
      }))

      navigate('result')
    } catch (err) {
      console.error(err)
      setError(
        'AI analysis failed. Please make sure your backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="subpage">
      <section className="page-pad narrow-header">
        <p className="eyebrow">New report</p>
        <h1>What needs fixing?</h1>
        <p>
          Give us the details and we'll route your report to the right
          people.
        </p>
      </section>

      <section className="report-layout page-pad">
        <div className="form-panel">
          <div
            className={`upload-zone ${
              report.image ? 'has-image' : ''
            }`}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex="0"
            onKeyDown={(event) =>
              event.key === 'Enter' &&
              inputRef.current?.click()
            }
          >
            {report.image ? (
              <img src={report.image} alt="Selected civic issue" />
            ) : (
              <>
                <span className="upload-icon">
                  <Icon name="camera" size={24} />
                </span>

                <strong>Upload a photo</strong>
                <span>or take one with your camera</span>
                <small>JPG, PNG up to 10MB</small>
              </>
            )}

            <input
              ref={inputRef}
              onChange={handleFile}
              type="file"
              accept="image/*"
              capture="environment"
            />
          </div>

          <div className="location-row">
            <div>
              <label>Location</label>

              <p className={report.location ? 'location-set' : ''}>
                <Icon name="pin" size={16} />
                {report.location || 'No location selected'}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={locate}
              icon="pin"
            >
              Use current location
            </Button>
          </div>

          <label
            className="field-label"
            htmlFor="description"
          >
            Tell us more <span>Optional</span>
          </label>

          <textarea
            id="description"
            value={report.description || ''}
            onChange={(event) =>
              setReport((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Add any helpful details..."
            rows="5"
          />

          {error && <p className="form-error">{error}</p>}

          <Button
            onClick={analyze}
            disabled={loading}
            icon="arrow"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Analyzing with AI...
              </>
            ) : (
              'Analyze issue'
            )}
          </Button>

          <p className="privacy-note">
            <Icon name="shield" size={14} />
            Your report helps improve your neighborhood.
          </p>
        </div>

        <aside className="side-note">
          <span className="side-note-icon">
            <Icon name="shield" size={22} />
          </span>

          <h3>Smart routing</h3>

          <p>
            Our AI looks at your photo and details to identify
            the issue and send it to the right city team.
          </p>

          <div className="side-rule" />

          <p className="small-copy">
            Your location is only used to find the right service
            area.
          </p>
        </aside>
      </section>
    </main>
  )
    }
function Result({ navigate, report, setReport }) {
  const [submitted, setSubmitted] = useState(false)

  const submit = () => {
    const complaintId = `CF-${Date.now().toString().slice(-6)}`

    setSubmitted(true)

    setReport((current) => ({
      ...current,
      submitted: true,
      id: complaintId,
    }))
  }

  if (submitted) {
    return (
      <main className="subpage success-page">
        <div className="success-mark">
          <Icon name="check" size={32} />
        </div>

        <p className="eyebrow">Complaint submitted</p>

        <h1>Thanks for speaking up.</h1>

        <p>
          Your report is now with the city team. We'll keep you
          posted as it moves forward.
        </p>

        <div className="complaint-id">
          <span>Complaint ID</span>
          <strong>{report.id}</strong>
          <small>Save this ID to track your report</small>
        </div>

        <div className="hero-actions">
          <Button
            onClick={() => navigate('tracking')}
            icon="arrow"
          >
            Track complaint
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setReport({})
              navigate('report')
            }}
          >
            Report another issue
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="subpage">
      <section className="page-pad narrow-header">
        <p className="eyebrow">AI analysis complete</p>

        <h1>Here's what we found.</h1>

        <p>
          Review the details before sending your report to the
          city.
        </p>
      </section>

      <section className="result-layout page-pad">
        <div className="result-image">
          <img
            src={report.image}
            alt="Uploaded civic issue"
          />

          <span className="image-tag">
            <Icon name="check" size={14} />
            Photo analyzed
          </span>
        </div>

        <div className="result-details">
          <div className="result-category">
            <span className="category-icon">
              <Icon name="camera" size={22} />
            </span>

            <div>
              <span>Detected category</span>
              <h2>{report.category || 'Issue detected'}</h2>
            </div>

            <span className="confidence">
              {report.confidence ?? '--'}%
              <small>confidence</small>
            </span>
          </div>

          <div className="detail-grid">
            <div>
              <span>Priority</span>

              <strong className="priority-high">
                ● {report.priority || 'Medium'}
              </strong>
            </div>

            <div>
              <span>Location</span>

              <strong>
                <Icon name="pin" size={15} />
                {report.location || 'Location not provided'}
              </strong>
            </div>
          </div>

          <div className="description-preview">
            <span>Your description</span>

            <p>
              {report.description ||
                'No additional description provided.'}
            </p>
          </div>

          <Button onClick={submit} icon="arrow">
            Submit complaint
          </Button>

          <button
            className="text-button"
            onClick={() => navigate('report')}
          >
            ← Edit report
          </button>
        </div>
      </section>
    </main>
  )
}

function Tracking({ report }) {
  const [query, setQuery] = useState(report.id || '')
  const [searched, setSearched] = useState(Boolean(report.submitted))

  const complaint = {
    category: report.category || 'Civic issue',
    description: report.description || 'Civic issue reported by resident.',
    location: report.location || 'Location not provided',
    id: report.id || '',
  }

  const statuses = [
    'Submitted',
    'Verified',
    'Assigned',
    'In Progress',
    'Resolved',
  ]

  return (
    <main className="subpage tracking-page">
      <section className="page-pad narrow-header">
        <p className="eyebrow">Complaint tracking</p>

        <h1>Follow it through.</h1>

        <p>
          Stay in the loop from your first report to a cleaner,
          safer city.
        </p>
      </section>

      <section className="tracking-search page-pad">
        <div className="search-field">
          <Icon name="search" size={19} />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter your complaint ID"
          />

          <Button
            onClick={() => setSearched(Boolean(query.trim()))}
          >
            Search
          </Button>
        </div>

        <p>
          Enter the complaint ID generated after submitting your
          report.
        </p>
      </section>

      {searched ? (
        <section className="tracking-card page-pad">
          <div className="tracking-card-top">
            <div>
              <span className="status-pill">
                <i /> In progress
              </span>

              <h2>{complaint.category}</h2>

              <p>{complaint.description}</p>
            </div>

            <div className="tracking-id">
              <span>Complaint ID</span>
              <strong>{query || complaint.id}</strong>
            </div>
          </div>

          <div className="tracking-meta">
            <span>
              <Icon name="pin" size={16} />
              {complaint.location}
            </span>

            <span>
              <Icon name="clock" size={16} />
              Updated just now
            </span>
          </div>

          <div className="timeline">
            {statuses.map((status, index) => (
              <div
                className={`timeline-step ${
                  index < 3 ? 'complete' : ''
                } ${index === 3 ? 'current' : ''}`}
                key={status}
              >
                <span className="timeline-dot">
                  {index < 3 ? (
                    <Icon name="check" size={13} />
                  ) : index === 3 ? (
                    <i />
                  ) : (
                    ''
                  )}
                </span>

                <span>{status}</span>

                {index < statuses.length - 1 && <b />}
              </div>
            ))}
          </div>

          <div className="status-message">
            <span className="message-icon">
              <Icon name="shield" size={18} />
            </span>

            <p>
              <strong>Your complaint is being processed.</strong>
              <br />
              The city team will review the reported issue.
            </p>
          </div>
        </section>
      ) : (
        <div className="empty-state">
          <span>
            <Icon name="search" size={25} />
          </span>

          <h2>Enter an ID to see your report</h2>

          <p>
            Your complaint timeline and latest updates will
            appear here.
          </p>
        </div>
      )}
    </main>
  )
}

function App() {
  const [page, setPage] = useState(
    window.location.hash.slice(1) || 'home'
  )

  const [report, setReport] = useState({})

  useEffect(() => {
    const onHash = () => {
      setPage(window.location.hash.slice(1) || 'home')
    }

    window.addEventListener('hashchange', onHash)

    return () =>
      window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (nextPage) => {
    window.location.hash = nextPage
  }

  const content =
    page === 'report' ? (
      <Report
        navigate={navigate}
        report={report}
        setReport={setReport}
      />
    ) : page === 'result' ? (
      <Result
        navigate={navigate}
        report={report}
        setReport={setReport}
      />
    ) : page === 'tracking' ? (
      <Tracking report={report} />
    ) : (
      <Home navigate={navigate} />
    )

  return (
    <>
      <Navbar page={page} navigate={navigate} />
      {content}
      <Footer navigate={navigate} />
    </>
  )
}

export default App
