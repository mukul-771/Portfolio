import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import MyWork from './pages/MyWorkJSON';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetailJSON';
import AdminDashboard from './pages/AdminDashboardJSON';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize any global GSAP animations here
    gsap.config({
      nullTargetWarn: false,
    });
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Admin route - no Navbar or Footer */}
          <Route path="/admin" element={
            <AdminDashboard />
          } />

          {/* Public routes - with Navbar and Footer */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <About />
              </main>
              <Footer />
            </>
          } />
          <Route path="/my-work" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <MyWork />
              </main>
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Contact />
              </main>
              <Footer />
            </>
          } />
          <Route path="/project/:id" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProjectDetail />
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App
