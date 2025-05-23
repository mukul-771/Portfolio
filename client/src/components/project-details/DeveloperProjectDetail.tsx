import { useState } from 'react';
import { ExternalLink, Github, Code } from 'lucide-react';
import { gsap } from 'gsap';

import type { Project, DeveloperProject } from '../../types/project';
import ImageGallery from './ImageGallery';
import ResponsiveImage from '../ui/ResponsiveImage';

interface DeveloperProjectDetailProps {
  project: Project;
}

const DeveloperProjectDetail = ({ project }: DeveloperProjectDetailProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'implementation'>('overview');

  // Cast to DeveloperProject to access developer-specific fields
  const developerProject = project as DeveloperProject;

  const handleTabChange = (tab: 'overview' | 'technical' | 'implementation') => {
    setActiveTab(tab);

    // Animate tab content change
    gsap.fromTo(
      '.tab-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  };

  return (
    <div className="developer-project-detail">
      {/* Project Mockup Image */}
      {project.mockupImageUrl && (
        <div className="mb-12">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <ResponsiveImage
              src={project.mockupImageUrl}
              alt={`${project.title} - Main Screenshot`}
              imageSettings={project.heroImageSettings}
              containerClassName="w-full h-full"
              priority={true}
            />
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">Main Project Screenshot</p>
        </div>
      )}

      {/* Project Links */}
      <div className="flex flex-wrap gap-4 mb-8">
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ExternalLink size={18} className="mr-2" />
            View Live Demo
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            <Github size={18} className="mr-2" />
            View Source Code
          </a>
        )}
      </div>

      {/* Project Images Gallery */}
      {project.images && project.images.length > 0 && (
        <div className="mb-12">
          <ImageGallery
            images={project.images}
            imageSettings={project.galleryImageSettings}
          />
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => handleTabChange('overview')}
            className={`pb-4 font-mono text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => handleTabChange('technical')}
            className={`pb-4 font-mono text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'technical'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Technical Details
          </button>

          <button
            onClick={() => handleTabChange('implementation')}
            className={`pb-4 font-mono text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'implementation'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Implementation
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <p className="text-lg leading-relaxed font-mono">
              {project.overviewDescription || project.detailedDescription || project.description}
            </p>

            {developerProject.challenges && developerProject.challenges.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-mono font-bold mb-4">Challenges</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {developerProject.challenges.map((challenge, index) => (
                    <li key={index} className="font-mono">{challenge}</li>
                  ))}
                </ul>
              </div>
            )}

            {developerProject.solutions && developerProject.solutions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-mono font-bold mb-4">Solutions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {developerProject.solutions.map((solution, index) => (
                    <li key={index} className="font-mono">{solution}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-mono font-bold mb-4">Technical Specifications</h3>
              <div className="font-mono whitespace-pre-line">
                {developerProject.technicalDetails || 'Technical details not available.'}
              </div>
            </div>

            {developerProject.codeSnippets && developerProject.codeSnippets.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-mono font-bold mb-4">Code Snippets</h3>
                <div className="space-y-6">
                  {developerProject.codeSnippets.map((snippet, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 flex items-center">
                        <Code size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-200 font-mono">{snippet.title}</span>
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded font-mono">
                          {snippet.language}
                        </span>
                      </div>
                      <pre className="p-4 text-gray-300 overflow-x-auto">
                        <code>{snippet.code}</code>
                      </pre>
                      {snippet.description && (
                        <div className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-mono">
                          {snippet.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-mono font-bold mb-4">Implementation Details</h3>
              <div className="font-mono whitespace-pre-line">
                {developerProject.implementationInfo || 'Implementation details not available.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Images Section */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-mono font-bold mb-6">Project Screenshots</h3>
          <ImageGallery
            images={project.galleryImages}
            imageSettings={project.galleryImageSettings}
          />
        </div>
      )}
    </div>
  );
};

export default DeveloperProjectDetail;
