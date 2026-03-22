import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api, isLoggedIn } from '../utils/api'

// ── Types ────────────────────────────────────────────────────────

interface TicketTier {
  _id: string
  name: string
  description?: string
  price: number
  totalQuantity: number
  soldQuantity: number
  status: string
}

interface EventDetail {
  _id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  location: string
  imageUrl?: string
  status: string
}

// ── Page ─────────────────────────────────────────────────────────

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [tickets, setTickets] = useState<TicketTier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [attendees, setAttendees] = useState([{ firstName: '', lastName: '', email: '', phoneNumber: '' }])
  const [booking, setBooking] = useState(false)
  const [bookingResult, setBookingResult] = useState<{ ref: string; message: string } | null>(null)
  const [bookingError, setBookingError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }[]>([])

  // Keep attendees array in sync with quantity
  const setQty = (n: number) => {
    setQuantity(n)
    setFieldErrors([])
    setAttendees((prev) => {
      const blank = { firstName: '', lastName: '', email: '', phoneNumber: '' }
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill(null).map(() => ({ ...blank }))]
      return prev.slice(0, n)
    })
  }

  const validateAttendees = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{10}$/
    const errors = attendees.map((a) => {
      const e: { [key: string]: string } = {}
      if (!a.firstName.trim()) e.firstName = 'Name is required'
      if (!a.email.trim()) e.email = 'Email is required'
      else if (!emailRegex.test(a.email.trim())) e.email = 'Enter a valid email address'
      if (!a.phoneNumber.trim()) e.phoneNumber = 'Contact number is required'
      else if (!phoneRegex.test(a.phoneNumber.trim())) e.phoneNumber = 'Contact number must be exactly 10 digits'
      return e
    })
    setFieldErrors(errors)
    return errors.every((e) => Object.keys(e).length === 0)
  }

  const setAttendeeField = (i: number, field: string, value: string) => {
    setAttendees((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const [evRes, tkRes] = await Promise.all([
          api<{ data: EventDetail }>(`/events/public/${id}`),
          api<{ data: TicketTier[] }>(`/tickets/event/${id}`),
        ])
        setEvent(evRes.data)
        setTickets(tkRes.data || [])
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to load event')
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  const chosenTier = tickets.find((t) => t._id === selectedTicket)

  const handleBook = async () => {
    if (!isLoggedIn()) {
      navigate('/signin?redirect=' + encodeURIComponent(`/events/${id}`))
      return
    }

    if (!selectedTicket || !chosenTier) return
    if (!validateAttendees()) return
    setBooking(true)
    setBookingError('')
    setBookingResult(null)

    try {
      const data = await api<{ data: { bookingReference: string }; message: string }>('/bookings', {
        method: 'POST',
        auth: true,
        body: { ticketId: selectedTicket, quantity, attendees },
      })
      setBookingResult({
        ref: data.data.bookingReference,
        message: data.message,
      })
      // Refresh ticket availability
      const tkRes = await api<{ data: TicketTier[] }>(`/tickets/event/${id}`)
      setTickets(tkRes.data || [])
      setSelectedTicket(null)
      setQuantity(1)
      setAttendees([{ firstName: '', lastName: '', email: '', phoneNumber: '' }])
      setFieldErrors([])
    } catch (err: unknown) {
      setBookingError((err as Error).message || 'Booking failed')
    }
    setBooking(false)
  }

  // ── Loading / Error / Not Found ──

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar solid />
        {/* Banner skeleton */}
        <div className="w-full mt-16 md:mt-[72px] h-[40vh] bg-gray-200 animate-pulse" />
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-16">
          {/* Title */}
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
            {/* Left */}
            <div className="order-1">
              <div className="flex flex-wrap gap-6 pb-8 border-b border-gray-100 mb-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div>
                      <div className="h-2.5 bg-gray-200 rounded w-12 mb-1.5 animate-pulse" />
                      <div className="h-3.5 bg-gray-100 rounded w-36 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: ticket card */}
            <div className="order-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-200 h-16 animate-pulse" />
              <div className="p-5 space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="w-full p-4 rounded-xl border-2 border-gray-100 animate-pulse">
                    <div className="flex justify-between mb-2">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-28" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar solid />
        <div className="flex flex-col items-center justify-center py-40">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Event not found'}</h2>
          <Link to="/events" className="text-[#FF6000] font-medium hover:underline">
            ← Back to events
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar solid />

      {/* ── Event Image ─────────────────────────────────────── */}
      <div className="w-full mt-[64px] md:mt-[72px] bg-black">
        {event.imageUrl ? (
          <div className="relative">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-auto max-h-[75vh] object-contain mx-auto block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-1 md:mb-2 drop-shadow-lg">
                {event.title}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl line-clamp-2 md:line-clamp-none drop-shadow">
                {event.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
            <span className="text-6xl font-black text-gray-700">BIZCHAT</span>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-1 md:mb-2">
                {event.title}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl">
                {event.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-16">
        {/* Event Title + Description */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black leading-tight mb-2">
            {event.title}
          </h1>
          {event.description && (
            <p className="text-gray-500 text-sm md:text-base max-w-3xl">{event.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Left: Details */}
          <div className="order-1 lg:order-1">
            {/* Quick Info Bar */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 pb-6 md:mb-8 md:pb-8 border-b border-gray-200">
              <InfoChip
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                }
                label="Date"
                value={new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                })}
              />
              <InfoChip
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                }
                label="Time"
                value={event.time}
              />
              <InfoChip
                icon={
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </>
                }
                label="Venue"
                value={`${event.venue}, ${event.location}`}
              />
            </div>

            {/* About section removed as per requirements */}

            {/* Booking Success */}
            {bookingResult && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-green-800 mb-1">Booking Created!</h3>
                    <p className="text-sm text-green-700 mb-2">{bookingResult.message}</p>
                    <p className="text-sm text-green-700">
                      Your reference: <span className="font-mono font-bold">{bookingResult.ref}</span>
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Show this reference at the venue. After you pay, the manager will verify your booking and you'll receive your ticket via email.
                    </p>
                    <Link to="/my-bookings" className="inline-block mt-3 text-sm font-medium text-[#FF6000] hover:underline">
                      View My Bookings →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Ticket Selection Card */}
          <div className="order-2 lg:order-2 lg:sticky lg:top-28 self-start">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-black px-6 py-5">
                <h3 className="text-white font-bold text-lg">Select Tickets</h3>
                <p className="text-gray-400 text-xs mt-1">Pay at venue • Manager verifies on-site</p>
              </div>

              {/* Ticket Tiers */}
              <div className="p-5 space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No tickets available yet.</p>
                ) : (
                  tickets.map((tier) => {
                    const isSelected = selectedTicket === tier._id
                    const available = tier.totalQuantity - tier.soldQuantity
                    const isSoldOut = available <= 0 || tier.status === 'sold_out'
                    return (
                      <button
                        key={tier._id}
                        disabled={isSoldOut}
                        onClick={() => {
                          setSelectedTicket(tier._id)
                          setQty(1)
                          setAttendees([{ firstName: '', lastName: '', email: '', phoneNumber: '' }])
                          setBookingError('')
                          setBookingResult(null)
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSoldOut
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#FF6000] bg-[#FF6000]/5'
                            : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-black text-sm">{tier.name}</span>
                          <span className={`font-bold ${isSelected ? 'text-[#FF6000]' : 'text-black'}`}>
                            LKR {tier.price.toLocaleString()}
                          </span>
                        </div>
                        {tier.description && (
                          <p className="text-gray-500 text-xs leading-relaxed">{tier.description}</p>
                        )}
                        <p className="text-xs mt-1.5 font-medium text-gray-400">
                          {isSoldOut && (
                            <span className="text-red-500">Sold out</span>
                          )}
                        </p>
                      </button>
                    )
                  })
                )}
              </div>

              {/* Quantity + Book */}
              {selectedTicket && chosenTier && (
                <div className="px-5 pb-5">
                  {bookingError && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-3">{bookingError}</div>
                  )}

                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
                    <span className="text-sm text-gray-600 font-medium">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQty(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#FF6000] hover:text-[#FF6000] transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-bold text-black">{quantity}</span>
                      <button
                        onClick={() => {
                          const avail = chosenTier.totalQuantity - chosenTier.soldQuantity
                          setQty(Math.min(10, Math.min(avail, quantity + 1)))
                        }}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#FF6000] hover:text-[#FF6000] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Attendee Details */}
                  <div className="mb-4 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Attendee Details</p>
                    {attendees.map((a, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                        {quantity > 1 && (
                          <p className="text-xs font-bold text-[#FF6000] uppercase tracking-wider">Ticket {i + 1}</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Name <span className="text-[#FF6000]">*</span>
                            </label>
                            <input
                              type="text"
                              value={a.firstName}
                              onChange={(e) => {
                                setAttendeeField(i, 'firstName', e.target.value)
                                if (fieldErrors[i]?.firstName) setFieldErrors((prev) => prev.map((fe, fi) => fi === i ? { ...fe, firstName: '' } : fe))
                              }}
                              placeholder="Full name"
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] bg-white ${
                                fieldErrors[i]?.firstName ? 'border-red-400' : 'border-gray-200'
                              }`}
                            />
                            {fieldErrors[i]?.firstName && (
                              <p className="text-red-500 text-[11px] mt-1">{fieldErrors[i].firstName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Company <span className="text-[#FF6000]">*</span>
                            </label>
                            <input
                              type="text"
                              value={a.lastName}
                              onChange={(e) => setAttendeeField(i, 'lastName', e.target.value)}
                              required
                              placeholder="Company name"
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Email <span className="text-[#FF6000]">*</span>
                          </label>
                          <input
                            type="email"
                            value={a.email}
                            onChange={(e) => {
                              setAttendeeField(i, 'email', e.target.value)
                              if (fieldErrors[i]?.email) setFieldErrors((prev) => prev.map((fe, fi) => fi === i ? { ...fe, email: '' } : fe))
                            }}
                            placeholder="john@example.com"
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] bg-white ${
                              fieldErrors[i]?.email ? 'border-red-400' : 'border-gray-200'
                            }`}
                          />
                          {fieldErrors[i]?.email && (
                            <p className="text-red-500 text-[11px] mt-1">{fieldErrors[i].email}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Contact Number <span className="text-[#FF6000]">*</span>
                          </label>
                          <input
                            type="tel"
                            value={a.phoneNumber}
                            onChange={(e) => {
                              setAttendeeField(i, 'phoneNumber', e.target.value)
                              if (fieldErrors[i]?.phoneNumber) setFieldErrors((prev) => prev.map((fe, fi) => fi === i ? { ...fe, phoneNumber: '' } : fe))
                            }}
                            placeholder="0761234567"
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] bg-white ${
                              fieldErrors[i]?.phoneNumber ? 'border-red-400' : 'border-gray-200'
                            }`}
                          />
                          {fieldErrors[i]?.phoneNumber && (
                            <p className="text-red-500 text-[11px] mt-1">{fieldErrors[i].phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-xl font-black text-black">
                      LKR {(chosenTier.price * quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBook}
                    disabled={booking}
                    className="w-full py-3.5 bg-[#FF6000] text-white font-bold rounded-lg hover:bg-[#e55500] transition-colors duration-200 uppercase tracking-wider text-sm disabled:opacity-50"
                  >
                    {booking ? 'Booking…' : 'Book Now'}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    Collect money at venue. Ticket sent to email after verification.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ── Helper Component ─────────────────────────────────────────────

const InfoChip = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-full bg-[#FF6000]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg className="w-4 h-4 text-[#FF6000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-black">{value}</p>
    </div>
  </div>
)

export default EventDetailPage
