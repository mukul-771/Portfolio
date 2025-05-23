import { useRef, useEffect } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { gsap } from 'gsap';

import type { Project, ProductionProject } from '../../types/project';
import ImageGallery from './ImageGallery';
import BentoBoxLayout from './BentoBoxLayout';

interface ProductionProjectDetailProps {
  project: Project;
}

const ProductionProjectDetail = ({ project }: ProductionProjectDetailProps) => {
  // Cast to ProductionProject to access production-specific fields
  const productionProject = project as ProductionProject;
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Extract video ID from YouTube URL if present
  const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;

    // Match YouTube URL patterns
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(productionProject.videoUrl);

  // Animate the video container on mount
  useEffect(() => {
    if (videoContainerRef.current) {
      gsap.fromTo(
        videoContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className="production-project-detail">
      {/* Video Section */}
      {youtubeEmbedUrl && (
        <div
          ref={videoContainerRef}
          className="mb-12 rounded-lg overflow-hidden shadow-lg"
        >
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={youtubeEmbedUrl}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

      {/* Video Thumbnail (if no embed URL but has thumbnail) */}
      {!youtubeEmbedUrl && productionProject.thumbnailUrl && (
        <div
          ref={videoContainerRef}
          className="mb-12 rounded-lg overflow-hidden shadow-lg relative group cursor-pointer"
          onClick={() => {
            if (productionProject.videoUrl) {
              window.open(productionProject.videoUrl, '_blank');
            }
          }}
        >
          <div className="aspect-w-16 aspect-h-9 relative">
            <img
              src={productionProject.thumbnailUrl}
              alt={`${project.title} thumbnail`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-600 bg-opacity-80 flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-300">
                <Play size={36} className="text-white ml-1" />
              </div>
            </div>
            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
        </div>
      )}

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
            View Project Website
          </a>
        </div>
      )}

      {/* Project Description */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed">
          {productionProject.productionDetails || project.description}
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

      {/* Production Screenshots - Fallback */}
      {(!project.galleryImages || project.galleryImages.length === 0) && project.images && project.images.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Production Stills</h3>
          <ImageGallery
            images={project.images}
            imageSettings={project.galleryImageSettings}
          />
        </div>
      )}

      {/* Technical Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Technical Information</h3>
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

export default ProductionProjectDetail;
