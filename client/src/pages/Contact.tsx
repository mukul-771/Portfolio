import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Heart } from 'lucide-react';

import FadeIn from '../components/animations/FadeIn';
import ContactForm from '../components/ui/ContactForm';

const Contact = () => {
  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate signature
    if (signatureRef.current) {
      const paths = signatureRef.current.querySelectorAll('path');

      gsap.set(paths, {
        strokeDasharray: function(_i, target) {
          return target.getTotalLength();
        },
        strokeDashoffset: function(_i, target) {
          return target.getTotalLength();
        }
      });

      ScrollTrigger.create({
        trigger: signatureRef.current,
        start: 'top bottom',
        onEnter: () => {
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power3.out',
            stagger: 0.1
          });
        },
        once: true
      });
    }
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-white">
      <section className="py-20">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-20">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Have a project in mind or want to collaborate? I'd love to hear from you and discuss how we can bring your ideas to life.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <FadeIn direction="right">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-white/20 h-full">
                <h2 className="text-3xl font-bold mb-8 text-blue-400">Contact Information</h2>

                <div className="space-y-8">
                  <div className="flex items-start group">
                    <div className="bg-blue-100 p-3 rounded-full mr-5 group-hover:bg-blue-200 transition-colors">
                      <Mail className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">Email</h3>
                      <a
                        href="mailto:mukulmee771@gmail.com"
                        className="text-gray-600 hover:text-blue-400 transition-colors text-lg"
                      >
                        mukulmee771@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="bg-blue-100 p-3 rounded-full mr-5 group-hover:bg-blue-200 transition-colors">
                      <Phone className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">Phone</h3>
                      <a
                        href="tel:+918278601729"
                        className="text-gray-600 hover:text-blue-400 transition-colors text-lg"
                      >
                        +91 8278601729
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="bg-blue-100 p-3 rounded-full mr-5 group-hover:bg-blue-200 transition-colors">
                      <MapPin className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">Location</h3>
                      <p className="text-gray-600 text-lg">
                        Gujarat, India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="font-semibold text-gray-900 text-xl mb-6">Connect With Me</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-blue-100 p-4 rounded-full text-gray-600 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                      aria-label="GitHub"
                    >
                      <Github size={24} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-blue-100 p-4 rounded-full text-gray-600 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={24} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-blue-100 p-4 rounded-full text-gray-600 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                      aria-label="Instagram"
                    >
                      <Instagram size={24} />
                    </a>

                  </div>
                </div>

                {/* Personal Signature */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div
                    ref={signatureRef}
                    className="text-center"
                  >
                    <div className="font-handwriting text-4xl text-blue-400 mb-2 transform rotate-[-2deg]">
                      Mukul Meena
                    </div>
                    <div className="flex items-center justify-center text-gray-500 text-sm">
                      <span>Made with</span>
                      <Heart className="mx-1 text-red-400" size={16} fill="currentColor" />
                      <span>in Gujarat</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn direction="left" delay={0.2}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-white/20">
                <h2 className="text-3xl font-bold mb-8 text-blue-400">Send Me a Message</h2>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
