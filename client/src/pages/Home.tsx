import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

import { ArrowRight, ChevronDown } from 'lucide-react';

import FadeIn from '../components/animations/FadeIn';
import ProjectCard from '../components/ui/ProjectCard';
import HomeProfileImage from '../components/ui/HomeProfileImage';
import profileImage from '../assets/images/profile.png';
import { projectApi, globalSettingsApi } from '../services/jsonApi';
import type { Project, GlobalImageSettings } from '../types/project';

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // State for recent projects
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [globalImageSettings, setGlobalImageSettings] = useState<GlobalImageSettings | null>(null);

  // Fetch featured projects and global settings function
  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch projects and global settings in parallel
      const [featured, globalSettings] = await Promise.all([
        projectApi.getFeatured(),
        globalSettingsApi.getImageSettings().catch(() => null) // Don't fail if settings unavailable
      ]);

      setFeaturedProjects(featured);
      setGlobalImageSettings(globalSettings);
    } catch (err: any) {
      console.error('Error fetching featured projects:', err);
      setError('Failed to load featured projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured projects on component mount
  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  useEffect(() => {
    // Hero section animations
    if (heroRef.current) {
      const heroTimeline = gsap.timeline();

      heroTimeline
        .fromTo(
          heroRef.current.querySelector('h1'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        )
        .fromTo(
          heroRef.current.querySelector('h2'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          heroRef.current.querySelector('p'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          heroRef.current.querySelectorAll('.hero-button'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out' },
          '-=0.4'
        );
    }

    // Scroll indicator animation
    if (scrollIndicatorRef.current) {
      gsap.fromTo(
        scrollIndicatorRef.current,
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 1.5,
          ease: 'power2.out',
          repeat: -1,
          yoyo: true
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center px-4 relative bg-gradient-to-b from-blue-100 to-blue-200"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-left">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              Welcome to my Portfolio
            </h1>

            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-6 text-blue-400">
              Full Stack Developer & Designer
            </h2>

            <p className="text-xl md:text-2xl mb-8 text-blue-300 max-w-2xl">
              Let's Create Something Amazing
            </p>

            <p className="text-lg mb-10 text-blue-300">
              I bring ideas to life with code, design, and media.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/my-work" className="hero-button btn bg-blue-400 hover:bg-blue-500 text-white">
                View My Work
              </Link>
              <Link to="/contact" className="hero-button btn border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0">
            <HomeProfileImage
              imageSrc={profileImage}
              className="mx-auto"
            />
          </div>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-blue-400 flex flex-col items-center"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">Featured Work</h2>
              <p className="text-xl text-blue-300 max-w-2xl mx-auto">
                Here are my featured projects that showcase my skills and expertise across different disciplines.
              </p>
            </div>
          </FadeIn>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button
                onClick={fetchFeaturedProjects}
                className="btn bg-blue-400 hover:bg-blue-500 text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.length > 0 ? (
                featuredProjects.map((project, index) => (
                  <FadeIn key={project.id} delay={index * 0.2} direction="up">
                    <ProjectCard {...project} globalImageSettings={globalImageSettings || undefined} />
                  </FadeIn>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <p className="text-gray-500 text-lg">No featured projects found.</p>
                </div>
              )}
            </div>
          )}

          <FadeIn direction="up" delay={0.6}>
            <div className="text-center mt-16">
              <Link
                to="/my-work"
                className="inline-flex items-center text-blue-400 hover:text-blue-500 font-medium text-lg group"
              >
                View All MY Work
                <ArrowRight
                  size={18}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Home;
