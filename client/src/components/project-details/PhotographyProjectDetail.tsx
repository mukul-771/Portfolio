import { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';

import type { Project, PhotographyProject } from '../../types/project';
import BentoBoxLayout from './BentoBoxLayout';

interface PhotographyProjectDetailProps {
  project: Project;
}

const PhotographyProjectDetail = ({ project }: PhotographyProjectDetailProps) => {
  // Cast to PhotographyProject to access photography-specific fields
  const photographyProject = project as PhotographyProject;
  const bentoGridRef = useRef<HTMLDivElement>(null);

  // Animate the bento grid on mount
  useEffect(() => {
    if (bentoGridRef.current) {
      const gridItems = bentoGridRef.current.querySelectorAll('.bento-item');

      gsap.fromTo(
        gridItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, []);

  return (
    <div className="photography-project-detail">
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
            View Full Portfolio
          </a>
        </div>
      )}

      {/* Project Description */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed">
          {photographyProject.photoDetails || project.description}
        </p>
      </div>

      {/* Bento Grid Photo Gallery */}
      {photographyProject.photoCollection && photographyProject.photoCollection.length > 0 && (
        <BentoBoxLayout
          images={photographyProject.photoCollection}
          projectTitle={project.title}
          imageSettings={project.galleryImageSettings}
        />
      )}

      {/* Fallback to galleryImages if photoCollection not available */}
      {(!photographyProject.photoCollection || photographyProject.photoCollection.length === 0) &&
       project.galleryImages && project.galleryImages.length > 0 && (
        <BentoBoxLayout
          images={project.galleryImages}
          projectTitle={project.title}
          imageSettings={project.galleryImageSettings}
        />
      )}
    </div>
  );
};

export default PhotographyProjectDetail;
