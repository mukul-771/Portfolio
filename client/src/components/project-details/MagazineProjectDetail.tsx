import { useRef, useEffect } from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { gsap } from 'gsap';

import type { Project, MagazineProject } from '../../types/project';
import BentoBoxLayout from './BentoBoxLayout';

interface MagazineProjectDetailProps {
  project: Project;
}

const MagazineProjectDetail = ({ project }: MagazineProjectDetailProps) => {
  console.log('🔥 MagazineProjectDetail component rendering with project:', project);

  // Cast to MagazineProject to access magazine-specific fields
  const magazineProject = project as MagazineProject;
  const magazineContainerRef = useRef<HTMLDivElement>(null);

  console.log('🔥 Magazine project data:', {
    title: project.title,
    imageUrl: project.imageUrl,
    galleryImages: project.galleryImages,
    magazinePreviewImages: magazineProject.magazinePreviewImages,
    fullContentUrl: magazineProject.fullContentUrl,
    projectUrl: project.projectUrl
  });

  // Animate the magazine container on mount
  useEffect(() => {
    if (magazineContainerRef.current) {
      gsap.fromTo(
        magazineContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className="magazine-project-detail">
      {/* Magazine Preview */}
      <div
        ref={magazineContainerRef}
        className="mb-12"
      >
        {/* Magazine Spread Viewer */}
        <div className="magazine-viewer bg-gray-100 p-8 rounded-lg">
          <div className="flex flex-col items-center">
            {/* Magazine Cover */}
            <div className="mb-8 shadow-xl max-w-md">
              <img
                src={project.imageUrl}
                alt={`${project.title} Cover`}
                className="w-full h-auto rounded-md"
              />
            </div>

            {/* Magazine Spreads */}
            {magazineProject.magazinePreviewImages && magazineProject.magazinePreviewImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {magazineProject.magazinePreviewImages.map((image, index) => (
                  <div
                    key={index}
                    className="magazine-spread overflow-hidden rounded-md shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={image}
                      alt={`${project.title} - Spread ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Links */}
      <div className="flex flex-wrap gap-4 mb-8">
        {magazineProject.fullContentUrl && (
          <a
            href={magazineProject.fullContentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <BookOpen size={18} className="mr-2" />
            Read Full Magazine
          </a>
        )}

        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            <ExternalLink size={18} className="mr-2" />
            View Project Website
          </a>
        )}
      </div>

      {/* Project Description */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed">
          {magazineProject.magazineDetails || project.description}
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

export default MagazineProjectDetail;
