import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ExternalLink, Github, Eye } from 'lucide-react';

import type { Project, GlobalImageSettings } from '../../types/project';
import ResponsiveImage from './ResponsiveImage';

interface ProjectCardProps extends Project {
  globalImageSettings?: GlobalImageSettings;
}

const ProjectCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  technologies,
  projectUrl,
  githubUrl,
  thumbnailImageSettings,
  globalImageSettings
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if the card is in dark mode by looking at parent elements
  useEffect(() => {
    const checkDarkMode = () => {
      if (cardRef.current) {
        // Check if any parent has the dark-mode class
        let parent = cardRef.current.parentElement;
        while (parent) {
          if (parent.classList.contains('dark-mode')) {
            setIsDarkMode(true);
            return;
          }
          parent = parent.parentElement;
        }
        setIsDarkMode(false);
      }
    };

    checkDarkMode();

    // Create a mutation observer to detect class changes
    const observer = new MutationObserver(checkDarkMode);
    if (cardRef.current?.parentElement) {
      observer.observe(cardRef.current.parentElement, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
      });
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`overflow-hidden rounded-xl transition-all duration-300 relative shadow-md hover:shadow-2xl border ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
          : 'bg-white border-gray-100 hover:border-gray-200'
      } h-full flex flex-col`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
        <ResponsiveImage
          src={imageUrl}
          alt={title}
          imageSettings={{
            aspectRatio: '4:3',
            fitBehavior: 'cover',
            ...thumbnailImageSettings
          }}
          globalSettings={globalImageSettings?.defaultThumbnailSettings}
          className={`transition-all duration-500 ${
            isDarkMode ? 'brightness-90' : ''
          }`}
          containerClassName="h-full w-full"
          style={{
            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
          }}
          onError={() => {
            console.error('Failed to load image:', imageUrl);
          }}
          priority={true}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-white text-xs font-medium rounded-full ${
            isDarkMode ? 'bg-blue-600' : 'bg-blue-500 bg-opacity-90'
          }`}>
            {category}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className={`text-xl font-semibold mb-3 line-clamp-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>{title}</h3>
          <p className={`mb-4 text-sm leading-relaxed line-clamp-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-blue-300 hover:bg-gray-600'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                +{technologies.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className={`flex space-x-3 mt-6 pt-4 ${
          isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-100'
        }`}>
          {/* View Project Details Link */}
          <Link
            to={`/project/${id}`}
            className={`flex items-center font-medium text-sm transition-colors ${
              isDarkMode
                ? 'text-white hover:text-gray-200'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <Eye size={16} className="mr-1" />
            View Project
          </Link>

          {/* External Project Link */}
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center font-medium text-sm transition-colors ${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              <ExternalLink size={16} className="mr-1" />
              Live Demo
            </a>
          )}

          {/* GitHub Link */}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center font-medium text-sm transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:text-gray-100'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Github size={16} className="mr-1" />
              View Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
