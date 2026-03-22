import { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribed:', email)
    setEmail('')
  }

  return (
    <section className="bg-linear-to-br from-[#FF6000] to-[#FF8C42] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
          BizChat ideas change business.
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-10">
          Get the latest business insights delivered to your inbox every morning.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="px-6 py-4 w-full md:w-96 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/70 outline-none focus:border-white focus:bg-white/20 transition-all backdrop-blur-sm"
            required
          />
          <button
            type="submit"
            className="bg-white text-[#FF6000] px-10 py-4 rounded-lg font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all transform hover:scale-105 shadow-xl"
          >
            Subscribe
          </button>
        </form>
        
        <p className="text-white/60 text-xs mt-6">
          We'll never share your email. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}

export default Newsletter