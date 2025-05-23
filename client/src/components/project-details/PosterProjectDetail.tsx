import { useState, useRef, useEffect } from 'react';
import { ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';
import { gsap } from 'gsap';

import type { Project, PosterProject } from '../../types/project';
import BentoBoxLayout from './BentoBoxLayout';

interface PosterProjectDetailProps {
  project: Project;
}

const PosterProjectDetail = ({ project }: PosterProjectDetailProps) => {
  // Cast to PosterProject to access poster-specific fields
  const posterProject = project as PosterProject;
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const posterContainerRef = useRef<HTMLDivElement>(null);
  const posterImageRef = useRef<HTMLImageElement>(null);

  // Toggle zoom mode
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    setZoomLevel(1); // Reset zoom level when toggling
  };

  // Increase zoom level
  const zoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.5);
    }
  };

  // Decrease zoom level
  const zoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 0.5);
    }
  };

  // Animate the poster container on mount
  useEffect(() => {
    if (posterContainerRef.current) {
      gsap.fromTo(
        posterContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  // Apply zoom level to image
  useEffect(() => {
    if (posterImageRef.current) {
      gsap.to(posterImageRef.current, {
        scale: zoomLevel,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [zoomLevel]);

  return (
    <div className="poster-project-detail">
      {/* High-Resolution Poster Preview */}
      <div
        ref={posterContainerRef}
        className={`mb-12 rounded-lg overflow-hidden shadow-lg relative ${
          isZoomed ? 'cursor-move h-[80vh]' : 'cursor-zoom-in'
        }`}
        onClick={!isZoomed ? toggleZoom : undefined}
      >
        <div className={`${isZoomed ? 'h-full overflow-auto' : 'aspect-w-3 aspect-h-4'}`}>
          <div className={`${isZoomed ? 'flex items-center justify-center min-h-full' : ''}`}>
            <img
              ref={posterImageRef}
              src={posterProject.highResImageUrl || project.imageUrl}
              alt={project.title}
              className={`${isZoomed ? 'max-w-none' : 'w-full h-full object-cover'}`}
              style={{
                transformOrigin: 'center',
                transition: 'transform 0.3s ease-out'
              }}
            />
          </div>
        </div>

        {/* Zoom controls */}
        {isZoomed && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              className="p-2 bg-black bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-all"
              disabled={zoomLevel <= 1}
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              className="p-2 bg-black bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-all"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className="p-2 bg-black bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-all"
            >
              <ZoomOut size={20} />
            </button>
          </div>
        )}

        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-70 rounded-full text-white">
            <ZoomIn size={20} />
          </div>
        )}
      </div>

      {/* Project Links */}
      {project.projectUrl && (
        <div className="mb-8">
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex"
          >
            <ExternalLink size={18} className="mr-2" />
            View Full Project
          </a>
        </div>
      )}

      {/* Project Description */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed">
          {posterProject.posterDetails || project.description}
        </p>
      </div>

      {/* Gallery Images - Bento Box Layout */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <div className="mb-12">
          <BentoBoxLayout
            images={project.galleryImages}
            projectTitle={project.title}
            imageSettings={project.galleryImageSettings}
          />
        </div>
      )}

      {/* Technical Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Design Information</h3>
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2">Tools Used</h4>
              <ul className="list-disc pl-5">
                {project.technologies.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterProjectDetail;
