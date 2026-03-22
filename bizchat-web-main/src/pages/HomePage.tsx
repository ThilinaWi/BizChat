import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedTalk from '../components/FeaturedTalk'
// import TrendingTalks from '../components/TrendingTalks'
import Playlists from '../components/Playlists'
// import BlogSection from '../components/BlogSection'
import TedPage from '../components/TedPage'
import PsychologyHero from '../components/PsychologyHero'
import MembershipSection from '../components/MembershipSection'
// import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeaturedTalk />
      {/* <TrendingTalks /> */}
      {/* <BlogSection /> */}
      <TedPage />
      <PsychologyHero />
      <MembershipSection />
      <Playlists />
      {/* <Newsletter /> */}
      <Footer />
    </div>
  )
}

export default HomePage