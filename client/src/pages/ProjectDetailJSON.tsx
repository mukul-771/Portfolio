import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import FadeIn from '../components/animations/FadeIn';
import StaggerReveal from '../components/animations/StaggerReveal';
import DeveloperProjectDetail from '../components/project-details/DeveloperProjectDetail';
import PhotographyProjectDetail from '../components/project-details/PhotographyProjectDetail';
import ProductionProjectDetail from '../components/project-details/ProductionProjectDetail';
import PosterProjectDetail from '../components/project-details/PosterProjectDetail';
import MagazineProjectDetail from '../components/project-details/MagazineProjectDetail';
import GenericDesignerProjectDetail from '../components/project-details/GenericDesignerProjectDetail';

import type { Project } from '../types/project';
import { projectApi } from '../services/firebaseApi';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch project details from Firebase API
    const fetchProject = async () => {
      if (!id) {
        console.log('🚨 No project ID provided');
        return;
      }

      console.log(`🔥 ProjectDetail component - fetching project with ID: ${id}`);

      try {
        setLoading(true);
        setError(null);

        console.log('🔥 Calling projectApi.getById...');
        const projectData = await projectApi.getById(id);
        console.log('🔥 ProjectDetail - received project data:', projectData);

        if (projectData) {
          setProject(projectData);
          console.log('🔥 Project set successfully:', projectData);
        } else {
          console.log('🚨 Project not found');
          setError('Project not found');
        }
      } catch (err: any) {
        console.error('🚨 Error in ProjectDetail fetchProject:', err);
        setError('Failed to load project details: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
        console.log('🔥 ProjectDetail loading finished');
      }
    };

    fetchProject();
  }, [id]);

  // Render appropriate project detail component based on project type
  const renderProjectDetail = () => {
    if (!project) return null;

    if (project.category === 'developer') {
      return <DeveloperProjectDetail project={project} />;
    }

    // For designer projects, render based on project type
    switch (project.projectType) {
      case 'photography':
        return <PhotographyProjectDetail project={project} />;
      case 'production':
        return <ProductionProjectDetail project={project} />;
      case 'poster':
        return <PosterProjectDetail project={project} />;
      case 'magazine':
        return <MagazineProjectDetail project={project} />;
      default:
        return <GenericDesignerProjectDetail project={project} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link to="/my-work" className="text-blue-500 hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <Link to="/my-work" className="text-blue-500 hover:underline flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to Projects
            </Link>
          </div>
        </FadeIn>

        {project && (
          <StaggerReveal>
            <div className="mb-8">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
                project.category === 'developer' ? 'font-mono' : 'font-serif'
              }`}>
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {renderProjectDetail()}
          </StaggerReveal>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
