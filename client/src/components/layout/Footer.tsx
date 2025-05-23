import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top bottom',
        onEnter: () => {
          gsap.fromTo(
            footerRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true
      });
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-blue-100 py-12"
    >
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-handwriting font-bold text-blue-400">
              Mukul's Portfolio
            </Link>
            <p className="text-blue-300 max-w-xs">
              Bringing ideas to life with code, design, and media. Let's create something amazing together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-300 hover:text-blue-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-300 hover:text-blue-500 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link to="/my-work" className="text-blue-300 hover:text-blue-500 transition-colors">
                  MY Work
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-300 hover:text-blue-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-500">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/mukul-meena-95b599270/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/mukul_7711/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://github.com/mukul-771"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-500 transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-200 mt-8 pt-8 text-center text-blue-300">
          <p>© {new Date().getFullYear()} Mukul's Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
