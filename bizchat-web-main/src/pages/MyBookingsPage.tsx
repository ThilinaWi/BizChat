import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api, isLoggedIn } from '../utils/api'

interface Attendee {
  firstName: string
  lastName?: string
  email: string
  phoneNumber: string
}

interface Booking {
  _id: string
  bookingReference: string
  eventId: string
  ticketId: string
  quantity: number
  unitPrice: number
  totalAmount: number
  bookingStatus: string
  paymentStatus: string
  createdAt: string
  verifiedAt?: string
  ticketSentAt?: string
  attendees?: Attendee[]
}

const MyBookingsPage = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/signin?redirect=/my-bookings')
      return
    }
    const fetchBookings = async () => {
      try {
        const data = await api<{ data: Booking[] }>('/bookings/my', { auth: true })
        setBookings(data.data || [])
      } catch { /* empty */ }
      setLoading(false)
    }
    fetchBookings()
  }, [navigate])

  const cancelBooking = async (id: string) => {
    setCancelling(true)
    try {
      await api(`/bookings/${id}/cancel`, { method: 'POST', auth: true })
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: 'cancelled' } : b))
      )
    } catch { /* empty */ }
    setCancelling(false)
    setCancelTarget(null)
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
  }

  const paymentColor: Record<string, string> = {
    unpaid: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    refunded: 'bg-gray-50 text-gray-600 border-gray-200',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar solid />

      <section className="pt-28 pb-6 px-4 md:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white">My Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">Track your event tickets and booking status</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-gray-500 mb-2">No bookings yet</p>
            <Link to="/events" className="text-[#FF6000] font-medium text-sm hover:underline">
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl border border-gray-200 p-5 md:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-black text-sm">{b.bookingReference}</span>
                      <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColor[b.bookingStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {b.bookingStatus}
                      </span>
                      <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${paymentColor[b.paymentStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {b.paymentStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                      <span>Qty: <strong className="text-black">{b.quantity}</strong></span>
                      <span>Unit: <strong className="text-black">LKR {b.unitPrice.toLocaleString()}</strong></span>
                      <span>Total: <strong className="text-black">LKR {b.totalAmount.toLocaleString()}</strong></span>
                      <span>Booked: {new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                    {b.attendees && b.attendees.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                        <span>Name: <strong className="text-black">{b.attendees[0].firstName}</strong></span>
                        <span>Phone: <strong className="text-black">{b.attendees[0].phoneNumber}</strong></span>
                      </div>
                    )}
                    {b.ticketSentAt && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ Ticket sent to your email on {new Date(b.ticketSentAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {b.bookingStatus === 'pending' && (
                      <button
                        onClick={() => setCancelTarget(b._id)}
                        className="px-4 py-2 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />

      {/* ── Cancellation Confirmation Modal ─────────────────── */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-black mb-2">Cancel Booking?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Do you want to cancel your booking?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                No, Keep It
              </button>
              <button
                onClick={() => cancelBooking(cancelTarget)}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookingsPage
