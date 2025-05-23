import { ExternalLink } from 'lucide-react';

import type { Project } from '../../types/project';
import ImageGallery from './ImageGallery';
import BentoBoxLayout from './BentoBoxLayout';

interface GenericDesignerProjectDetailProps {
  project: Project;
}

const GenericDesignerProjectDetail = ({ project }: GenericDesignerProjectDetailProps) => {
  return (
    <div className="designer-project-detail">

      {/* Project Images Gallery - Bento Box Layout */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <div className="mb-12">
          <BentoBoxLayout
            images={project.galleryImages}
            projectTitle={project.title}
            imageSettings={project.galleryImageSettings}
          />
        </div>
      )}

      {/* Fallback to regular images if galleryImages not available */}
      {(!project.galleryImages || project.galleryImages.length === 0) && project.images && project.images.length > 0 && (
        <div className="mb-12">
          <ImageGallery
            images={project.images}
            imageSettings={project.galleryImageSettings}
          />
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
            View Project
          </a>
        </div>
      )}

      {/* Project Description */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed">
          {project.detailedDescription || project.description}
        </p>
      </div>

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

export default GenericDesignerProjectDetail;
