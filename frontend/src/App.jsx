import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import History from './components/History'
import Gallery from './components/Gallery'
import Timings from './components/Timings'
import Events from './components/Events'
import Committee from './components/Committee'
import Construction from './components/Construction'
import Donation from './components/Donation'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

function App() {
  return (
    <div className="bg-charcoal text-cream font-body antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <History />
        <Construction />
        <Gallery />
        <Timings />
        <Events />
        <Committee />
        <Donation />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

export default App
