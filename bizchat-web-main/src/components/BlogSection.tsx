import type { BlogPost } from '../types/index'

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Ways to Build Trust with Your AI Coworkers",
    category: "Leadership",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    date: "2 days ago"
  },
  {
    id: 2,
    title: "Why Venture Capital is Heading to the Global South",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=80",
    date: "5 days ago"
  },
  {
    id: 3,
    title: "The Return of Craftsmanship in the Age of Automation",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80",
    date: "1 week ago"
  }
]

const BlogSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
      <div className="flex items-center gap-4 mb-12">
        <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tight">
          The BizChat Blog
        </h3>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Featured Post */}
        <div className="lg:col-span-7 group cursor-pointer">
          <div className="relative overflow-hidden rounded-xl mb-6">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
              alt="Featured Blog Post"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div>
            <span className="inline-block bg-[#FF6000] text-white text-xs font-black px-3 py-1.5 rounded-sm uppercase tracking-widest mb-4">
              Global Economy
            </span>
            <h2 className="text-3xl lg:text-4xl font-black mb-4 group-hover:text-[#FF6000] transition-colors leading-tight">
              The 2026 Shift: How Remote Work Saved the Environment
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Five years after the great transition, data shows that the decentralization of the office has had unexpected positive consequences on urban carbon footprints...
            </p>
            <a href="#" className="inline-flex items-center gap-2 font-bold text-[#FF6000] border-b-2 border-[#FF6000] pb-1 hover:gap-3 transition-all">
              Read Story <span>→</span>
            </a>
          </div>
        </div>

        {/* Sidebar Posts */}
        <div className="lg:col-span-5">
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex gap-5 group cursor-pointer">
                <div className="w-32 h-24 flex-shrink-0 bg-gray-100 overflow-hidden rounded-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[#FF6000] font-black text-[10px] uppercase tracking-widest">
                    {post.category}
                  </span>
                  <h4 className="font-black text-sm mt-1 leading-snug group-hover:text-gray-600 transition line-clamp-2">
                    {post.title}
                  </h4>
                  {post.date && (
                    <p className="text-gray-400 text-xs mt-2">{post.date}</p>
                  )}
                </div>
              </div>
            ))}
            
            <a href="#" className="inline-flex items-center gap-2 text-[#FF6000] font-bold text-sm hover:gap-3 transition-all mt-4">
              View all articles <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection