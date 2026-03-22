import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api } from '../utils/api'

interface EventItem {
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

const EventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api<{ data: EventItem[] }>('/events/public?limit=100')
        setEvents(data.data || [])
      } catch { /* empty */ }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative bg-black pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block bg-[#FF6000] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4">
            Upcoming Events
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Ideas are better{' '}
            <span className="text-[#FF6000]">live</span>.
          </h1>
          <p className="mt-4 text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
            Grab your seat at Sri Lanka's most inspiring business events.
            Network, learn, and witness ideas that shape the future.
          </p>
        </div>
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6000]/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-[16/9] bg-gray-200" />
                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />
                  <div className="flex gap-4 mb-4">
                    <div className="h-3 bg-gray-100 rounded w-24" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-3 bg-gray-100 rounded w-32" />
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No events available right now.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for upcoming experiences.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9] bg-gray-100">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-4xl font-black text-gray-300">BIZ</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black group-hover:text-[#FF6000] transition-colors duration-200 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue}, {event.location}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-[#FF6000] group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default EventsPage
