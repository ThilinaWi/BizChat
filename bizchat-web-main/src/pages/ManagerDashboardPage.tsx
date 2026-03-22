import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api, getUser } from '../utils/api'

// ── Types ────────────────────────────────────────────────────────

interface Event {
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

interface Ticket {
  _id: string
  eventId: string
  name: string
  description?: string
  price: number
  totalQuantity: number
  soldQuantity: number
  status: string
}

interface Booking {
  _id: string
  bookingReference: string
  userId: string
  eventId: string
  ticketId: string
  quantity: number
  unitPrice: number
  totalAmount: number
  bookingStatus: string
  paymentStatus: string
  verifiedAt?: string
  createdAt: string
}

type Tab = 'events' | 'tickets' | 'bookings'

// ── Main Component ───────────────────────────────────────────────

const ManagerDashboardPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [activeTab, setActiveTab] = useState<Tab>('events')

  useEffect(() => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
      navigate('/')
    }
  }, [user, navigate])

  if (!user || (user.role !== 'manager' && user.role !== 'admin')) return null

  const tabs: { key: Tab; label: string }[] = [
    { key: 'events', label: 'Events' },
    { key: 'tickets', label: 'Tickets' },
    { key: 'bookings', label: 'Bookings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar solid />

      <section className="pt-28 pb-6 px-4 md:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Manager Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Manage events, tickets, and verify bookings
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.key
                    ? 'bg-gray-50 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'tickets' && <TicketsTab />}
        {activeTab === 'bookings' && <BookingsTab />}
      </section>

      <Footer />
    </div>
  )
}

// ── Image Picker ────────────────────────────────────────────────────

const ImagePicker = ({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(value)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        const scale = img.width > MAX ? MAX / img.width : 1
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressed = canvas.toDataURL('image/jpeg', 0.72)
        setPreview(compressed)
        onChange(compressed)
      }
      img.src = ev.target!.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreview(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Image <span className="text-[#FF6000]">*</span></label>

      {/* Preview */}
      {preview && (
        <div className="relative mb-2 w-full h-36 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(''); onChange('') }}
            className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Choose file button */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#FF6000] hover:text-[#FF6000] transition-colors bg-gray-50 hover:bg-orange-50 mb-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Choose Image
      </button>

      {/* URL fallback */}
      <input
        type="url"
        value={preview.startsWith('data:') ? '' : preview}
        onChange={handleUrl}
        placeholder="…or paste an image URL"
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] transition-colors"
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  EVENTS TAB
// ═══════════════════════════════════════════════════════════════════

const EventsTab = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', venue: '', location: '', imageUrl: '', status: 'published',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Edit state
  const [editTarget, setEditTarget] = useState<Event | null>(null)
  const [editForm, setEditForm] = useState({
    title: '', description: '', date: '', time: '', venue: '', location: '', imageUrl: '', status: 'draft',
  })
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api<{ data: Event[] }>('/events', { auth: true })
      setEvents(data.data || [])
    } catch { /* empty */ }
    setLoading(false)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchEvents() }, [fetchEvents])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api('/events', { method: 'POST', auth: true, body: form })
      setShowForm(false)
      setForm({ title: '', description: '', date: '', time: '', venue: '', location: '', imageUrl: '', status: 'published' })
      fetchEvents()
    } catch (err: unknown) {
      setError((err as Error).message)
    }
    setSaving(false)
  }

  const toggleStatus = async (ev: Event) => {
    const newStatus = ev.status === 'published' ? 'draft' : 'published'
    try {
      await api(`/events/${ev._id}`, { method: 'PUT', auth: true, body: { status: newStatus } })
      fetchEvents()
    } catch { /* empty */ }
  }

  const openEdit = (ev: Event) => {
    setEditTarget(ev)
    setEditError('')
    setEditForm({
      title: ev.title,
      description: ev.description,
      date: new Date(ev.date).toISOString().split('T')[0],
      time: ev.time,
      venue: ev.venue,
      location: ev.location,
      imageUrl: ev.imageUrl || '',
      status: ev.status,
    })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTarget) return
    setEditSaving(true)
    setEditError('')
    try {
      await api(`/events/${editTarget._id}`, { method: 'PUT', auth: true, body: editForm })
      setEditTarget(null)
      fetchEvents()
    } catch (err: unknown) {
      setEditError((err as Error).message)
    }
    setEditSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api(`/events/${deleteTarget._id}`, { method: 'DELETE', auth: true })
      setDeleteTarget(null)
      fetchEvents()
    } catch { /* empty */ }
    setDeleting(false)
  }

  const setEdit = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setEditForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Events</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#FF6000] text-white text-sm font-medium rounded-lg hover:bg-[#e55500] transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={set('title')} required />
            <ImagePicker value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] text-sm transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={set('date')} required />
            <Input label="Time" value={form.time} onChange={set('time')} required placeholder="6:00 PM – 10:00 PM" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status <span className="text-[#FF6000]">*</span></label>
              <select
                value={form.status}
                onChange={set('status')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] text-sm transition-all bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Venue" value={form.venue} onChange={set('venue')} required placeholder="Nelum Pokuna Theatre" />
            <Input label="Location" value={form.location} onChange={set('location')} placeholder="Colombo 07, Sri Lanka" />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#FF6000] text-white font-medium text-sm rounded-lg hover:bg-[#e55500] transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Event'}
          </button>
        </form>
      )}

      {/* Events List */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No events yet. Create your first event above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-black truncate">{ev.title}</h3>
                  <StatusBadge status={ev.status} />
                </div>
                <p className="text-sm text-gray-500 truncate">{ev.venue}, {ev.location} • {new Date(ev.date).toLocaleDateString()} • {ev.time}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleStatus(ev)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    ev.status === 'published'
                      ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                      : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                  }`}
                >
                  {ev.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => openEdit(ev)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(ev)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit Event Modal ──────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-black">Edit Event</h3>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-black transition-colors text-xl leading-none">✕</button>
            </div>
            {editError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{editError}</div>}
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Title" value={editForm.title} onChange={setEdit('title')} required />
                <ImagePicker value={editForm.imageUrl} onChange={(url) => setEditForm((f) => ({ ...f, imageUrl: url }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={setEdit('description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Date" type="date" value={editForm.date} onChange={setEdit('date')} required />
                <Input label="Time" value={editForm.time} onChange={setEdit('time')} required placeholder="6:00 PM" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status <span className="text-[#FF6000]">*</span></label>
                  <select
                    value={editForm.status}
                    onChange={setEdit('status')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] text-sm bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Venue" value={editForm.venue} onChange={setEdit('venue')} required />
                <Input label="Location" value={editForm.location} onChange={setEdit('location')} />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6000] text-sm font-semibold text-white hover:bg-[#e55500] transition-colors disabled:opacity-50"
                >
                  {editSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-black mb-2">Delete Event?</h3>
            <p className="text-sm text-gray-500 mb-1">You are about to delete:</p>
            <p className="text-sm font-bold text-black mb-6">"{deleteTarget.title}"</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  TICKETS TAB
// ═══════════════════════════════════════════════════════════════════

const TicketsTab = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', totalQuantity: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api<{ data: Event[] }>('/events', { auth: true })
      setEvents(data.data || [])
    } catch { /* empty */ }
    setLoading(false)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void fetchEvents() }, [fetchEvents])

  const fetchTickets = useCallback(async () => {
    if (!selectedEvent) { setTickets([]); return }
    try {
      const data = await api<{ data: Ticket[] }>(`/tickets/event/${selectedEvent}`)
      setTickets(data.data || [])
    } catch { /* empty */ }
  }, [selectedEvent])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void fetchTickets() }, [fetchTickets])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api('/tickets', {
        method: 'POST',
        auth: true,
        body: {
          eventId: selectedEvent,
          name: form.name,
          description: form.description,
          price: Number(form.price),
          totalQuantity: Number(form.totalQuantity),
        },
      })
      setShowForm(false)
      setForm({ name: '', description: '', price: '', totalQuantity: '' })
      fetchTickets()
    } catch (err: unknown) {
      setError((err as Error).message)
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Tickets</h2>
      </div>

      {/* Event Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] text-sm bg-white"
        >
          <option value="">— Choose an event —</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Ticket tiers for this event</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#FF6000] text-white text-sm font-medium rounded-lg hover:bg-[#e55500] transition-colors"
            >
              {showForm ? 'Cancel' : '+ Add Tier'}
            </button>
          </div>

          {/* Create Ticket Form */}
          {showForm && (
            <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Tier Name" value={form.name} onChange={set('name')} required placeholder="e.g. General, VIP, VVIP" />
                <Input label="Description" value={form.description} onChange={set('description')} placeholder="Brief description" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Price (LKR)" type="number" value={form.price} onChange={set('price')} required placeholder="2500" />
                <Input label="Total Quantity" type="number" value={form.totalQuantity} onChange={set('totalQuantity')} required placeholder="100" />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#FF6000] text-white font-medium text-sm rounded-lg hover:bg-[#e55500] transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create Ticket Tier'}
              </button>
            </form>
          )}

          {/* Tickets List */}
          {tickets.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-sm">No ticket tiers yet. Add one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((t) => (
                <div key={t._id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-black">{t.name}</h4>
                    <StatusBadge status={t.status} />
                  </div>
                  {t.description && <p className="text-xs text-gray-500 mb-3">{t.description}</p>}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-[#FF6000]">LKR {t.price.toLocaleString()}</span>
                    <span className="text-gray-500">
                      {t.soldQuantity}/{t.totalQuantity} sold
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {loading && <p className="text-gray-400 text-sm">Loading events…</p>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  BOOKINGS TAB
// ═══════════════════════════════════════════════════════════════════

interface LookupResult {
  booking: Booking
  user?: { firstName: string; lastName: string; email: string }
  event?: { title: string }
  ticket?: { name: string }
}

const BookingsTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [verifying, setVerifying] = useState<string | null>(null)
  const [lookupRef, setLookupRef] = useState('')
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null)
  const [lookupError, setLookupError] = useState('')

  const fetchBookings = useCallback(async () => {
    try {
      const qs = filter !== 'all' ? `?bookingStatus=${filter}` : ''
      const data = await api<{ data: Booking[] }>(`/bookings/manage/all${qs}`, { auth: true })
      setBookings(data.data || [])
    } catch { /* empty */ }
    setLoading(false)
  }, [filter])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void fetchBookings() }, [fetchBookings])

  const handleVerify = async (id: string) => {
    setVerifying(id)
    try {
      await api(`/bookings/${id}/verify`, { method: 'POST', auth: true })
      fetchBookings()
    } catch { /* empty */ }
    setVerifying(null)
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLookupError('')
    setLookupResult(null)
    if (!lookupRef.trim()) return
    try {
      const data = await api<{ data: LookupResult }>(`/bookings/reference/${lookupRef.trim()}`, { auth: true })
      setLookupResult(data.data)
    } catch (err: unknown) {
      setLookupError((err as Error).message)
    }
  }

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-black mb-6">Bookings</h2>

      {/* Reference Lookup */}
      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={lookupRef}
          onChange={(e) => setLookupRef(e.target.value)}
          placeholder="Look up by reference (e.g. BK-A1B2C3D4)"
          className="flex-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Lookup
        </button>
      </form>

      {lookupError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{lookupError}</div>}

      {lookupResult && (
        <div className="bg-white rounded-xl border-2 border-[#FF6000]/30 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-black">Booking: {lookupResult.booking.bookingReference}</h3>
            <StatusBadge status={lookupResult.booking.bookingStatus} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
            <Detail label="User" value={lookupResult.user ? `${lookupResult.user.firstName} ${lookupResult.user.lastName}` : 'N/A'} />
            <Detail label="Email" value={lookupResult.user?.email || 'N/A'} />
            <Detail label="Event" value={lookupResult.event?.title || 'N/A'} />
            <Detail label="Ticket" value={`${lookupResult.ticket?.name || 'N/A'} × ${lookupResult.booking.quantity}`} />
            <Detail label="Total" value={`LKR ${lookupResult.booking.totalAmount.toLocaleString()}`} />
            <Detail label="Payment" value={lookupResult.booking.paymentStatus} />
          </div>
          {lookupResult.booking.bookingStatus === 'pending' && (
            <button
              onClick={() => handleVerify(lookupResult.booking._id)}
              disabled={verifying === lookupResult.booking._id}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {verifying === lookupResult.booking._id ? 'Verifying…' : 'Verify & Send Ticket Email'}
            </button>
          )}
          <button onClick={() => setLookupResult(null)} className="ml-3 text-sm text-gray-500 hover:text-gray-700">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${
              filter === f.value
                ? 'bg-black text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">No bookings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Reference</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Qty</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Payment</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Created</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 text-sm font-mono font-medium text-black">{b.bookingReference}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{b.quantity}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-black">LKR {b.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={b.bookingStatus} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={b.paymentStatus} /></td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    {b.bookingStatus === 'pending' ? (
                      <button
                        onClick={() => handleVerify(b._id)}
                        disabled={verifying === b._id}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {verifying === b._id ? '…' : 'Verify'}
                      </button>
                    ) : b.bookingStatus === 'confirmed' ? (
                      <span className="text-xs text-green-600 font-medium">Verified ✓</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Shared Helpers ───────────────────────────────────────────────

const Input = ({
  label, value, onChange, type = 'text', required = false, placeholder = '',
}: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}{required && <span className="text-[#FF6000] ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] text-sm transition-all"
    />
  </div>
)

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    published: 'bg-green-50 text-green-700 border-green-200',
    draft: 'bg-gray-50 text-gray-600 border-gray-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    unpaid: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    available: 'bg-green-50 text-green-700 border-green-200',
    sold_out: 'bg-red-50 text-red-600 border-red-200',
    disabled: 'bg-gray-50 text-gray-500 border-gray-200',
  }
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{label}</p>
    <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
  </div>
)

export default ManagerDashboardPage
