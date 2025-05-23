import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLUListElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Navbar animation on scroll
    const navbar = navbarRef.current;

    if (navbar) {
      gsap.fromTo(
        navbar,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2
        }
      );
    }

    // Scroll event for navbar background change with enhanced glass effect
    const handleScroll = () => {
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('glass-navbar');
          navbar.classList.remove('bg-transparent', 'border-transparent');
        } else {
          navbar.classList.remove('glass-navbar');
          navbar.classList.add('bg-transparent', 'border-transparent');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate nav links with staggered effect
  useEffect(() => {
    if (navLinksRef.current) {
      const links = navLinksRef.current.querySelectorAll('li');

      gsap.fromTo(
        links,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.5
        }
      );
    }
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="fixed w-full z-50 transition-all duration-500 ease-in-out py-4 bg-transparent border-transparent"
    >
      <div className="container-custom mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-handwriting font-bold text-blue-400"
        >
          Mukul's Portfolio
        </Link>

        {/* Desktop Navigation */}
        <ul
          ref={navLinksRef}
          className="hidden md:flex space-x-8 items-center"
        >
          <li>
            <Link
              to="/"
              className={`font-medium hover:text-blue-500 transition-colors ${
                location.pathname === '/' ? 'text-blue-500' : 'text-blue-300'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`font-medium hover:text-blue-500 transition-colors ${
                location.pathname === '/about' ? 'text-blue-500' : 'text-blue-300'
              }`}
            >
              About Me
            </Link>
          </li>
          <li>
            <Link
              to="/my-work"
              className={`font-medium hover:text-blue-500 transition-colors ${
                location.pathname === '/my-work' ? 'text-blue-500' : 'text-blue-300'
              }`}
            >
              My Work
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="btn btn-primary"
            >
              Get In Touch
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-400"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-mobile-menu py-6 px-6 animate-slide-down">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                to="/"
                className={`block font-medium hover:text-blue-500 transition-colors ${
                  location.pathname === '/' ? 'text-blue-500' : 'text-blue-300'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block font-medium hover:text-blue-500 transition-colors ${
                  location.pathname === '/about' ? 'text-blue-500' : 'text-blue-300'
                }`}
              >
                About Me
              </Link>
            </li>
            <li>
              <Link
                to="/my-work"
                className={`block font-medium hover:text-blue-500 transition-colors ${
                  location.pathname === '/my-work' ? 'text-blue-500' : 'text-blue-300'
                }`}
              >
                MY Work
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block btn btn-primary w-full text-center"
              >
                Get In Touch
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
