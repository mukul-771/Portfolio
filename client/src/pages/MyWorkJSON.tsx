import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import FadeIn from '../components/animations/FadeIn';

import ProjectCard from '../components/ui/ProjectCard';
import MinimalToggle from '../components/ui/BrutalistToggle';

// Import background images
import developerBg from '../assets/backgrounds/developer-bg.svg';
import designerBg from '../assets/backgrounds/designer-bg.svg';

// Import project types
import type { Project, GlobalImageSettings } from '../types/project';
import { projectApi, globalSettingsApi } from '../services/firebaseApi';

const MyWork = () => {
  // State for projects
  const [developerProjects, setDeveloperProjects] = useState<Project[]>([]);
  const [designerProjects, setDesignerProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State to track active category - now designer is default
  const [activeCategory, setActiveCategory] = useState<'designer' | 'developer'>('designer');

  // State to track theme mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // State for global image settings
  const [globalImageSettings, setGlobalImageSettings] = useState<GlobalImageSettings | null>(null);

  // Refs for background elements
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Fetch projects and global settings from JSON API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch projects and global settings in parallel
        const [devProjects, desProjects, globalSettings] = await Promise.all([
          projectApi.getByCategory('developer'),
          projectApi.getByCategory('designer'),
          globalSettingsApi.getImageSettings().catch(() => null) // Don't fail if settings unavailable
        ]);

        setDeveloperProjects(devProjects || []);
        setDesignerProjects(desProjects || []);
        setGlobalImageSettings(globalSettings as GlobalImageSettings || null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle toggle change with smoother animations, background transition, and theme change
  const handleToggle = (active: 'left' | 'right') => {
    // Now left is Designer, right is Developer
    const newCategory = active === 'left' ? 'designer' : 'developer';
    const newThemeMode = newCategory === 'developer';

    // Set dark mode state
    setIsDarkMode(newThemeMode);

    // Apply theme change to section
    if (sectionRef.current) {
      if (newThemeMode) {
        // Transition to dark mode
        gsap.to(sectionRef.current, {
          backgroundColor: '#0d1117', // GitHub dark mode background
          color: '#c9d1d9', // GitHub dark mode text
          duration: 0.5,
          ease: 'power2.inOut'
        });
      } else {
        // Transition to light mode
        gsap.to(sectionRef.current, {
          backgroundColor: 'white',
          color: 'inherit',
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
    }

    if (bgRef.current) {
      // First animate the background transition
      gsap.to(bgRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Change background image
          if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url(${newCategory === 'developer' ? developerBg : designerBg})`;

            // Fade in the new background with appropriate opacity for the theme
            gsap.to(bgRef.current, {
              opacity: newThemeMode ? 0.05 : 0.15, // Lower opacity for dark mode
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        }
      });
    }

    // Fade out the current projects
    gsap.to('.projects-container', {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        // Update state after fade out
        setActiveCategory(newCategory);

        // Then fade in the new projects
        gsap.fromTo(
          '.projects-container',
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.1
          }
        );
      }
    });
  };

  // Create project grid components with enhanced layout
  const renderProjectGrid = (projects: Project[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
      {projects.map((project, index) => (
        <div key={project.id} className="project-card h-full">
          <div className="h-full transform transition-all duration-300 hover:scale-[1.02]">
            <ProjectCard {...project} globalImageSettings={globalImageSettings || undefined} />
          </div>
        </div>
      ))}
      {projects.length === 0 && !loading && (
        <div className="col-span-full text-center py-20">
          <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Projects Found</h3>
            <p className="text-gray-500 leading-relaxed">
              No work found in this category yet. Check back soon for new projects!
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Set initial background image and theme
  useEffect(() => {
    // Set initial background image
    if (bgRef.current) {
      bgRef.current.style.backgroundImage = `url(${activeCategory === 'developer' ? developerBg : designerBg})`;
      gsap.to(bgRef.current, {
        opacity: activeCategory === 'developer' ? 0.05 : 0.15, // Lower opacity for dark mode
        duration: 0.5,
        ease: 'power2.out'
      });
    }

    // Set initial theme
    if (sectionRef.current && activeCategory === 'developer') {
      sectionRef.current.style.backgroundColor = '#0d1117'; // GitHub dark mode background
      sectionRef.current.style.color = '#c9d1d9'; // GitHub dark mode text
      setIsDarkMode(true);
    }
  }, [activeCategory]);

  // Initialize GSAP ScrollTrigger with smoother animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation for project cards with staggered effect
    const cards = gsap.utils.toArray<HTMLElement>('.project-card');

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-container',
          start: 'top bottom-=100',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeCategory]); // Re-run when category changes

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section
        ref={sectionRef}
        className="py-20 relative transition-colors duration-500"
      >
        {/* Background Element with Pattern */}
        <div
          ref={bgRef}
          className="absolute inset-0 opacity-0 transition-opacity duration-500 bg-no-repeat bg-cover"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            pointerEvents: 'none' // Ensures clicks pass through to elements below
          }}
        ></div>

        <div className="container-custom relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-500 ${isDarkMode ? 'text-gray-100' : ''}`}>
                My Work
              </h1>
              <p className={`text-xl max-w-2xl mx-auto transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Explore my portfolio of work across different disciplines and technologies.
              </p>
            </div>
          </FadeIn>

          {/* Minimal Toggle Navigation */}
          <FadeIn>
            <div className="max-w-6xl mx-auto">
              <MinimalToggle
                leftOption="Designer"
                rightOption="Developer"
                defaultActive={activeCategory === 'designer' ? 'left' : 'right'}
                onToggle={handleToggle}
                className="mb-12"
              />

              {/* Projects Container */}
              <div className={`projects-container transition-colors duration-500 ${isDarkMode ? 'dark-mode' : ''}`}>
                {activeCategory === 'developer' ? (
                  renderProjectGrid(developerProjects)
                ) : (
                  renderProjectGrid(designerProjects)
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default MyWork;
