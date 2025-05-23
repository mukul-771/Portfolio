import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Save, X, Image, Camera, Globe, Star } from 'lucide-react';

import type { Project, ImageSettings, GlobalImageSettings } from '../types/project';
import { projectApi, authApi, globalSettingsApi } from '../services/firebaseApi';

import SimplifiedImageUpload from '../components/admin/SimplifiedImageUpload';
import ImageSettingsPanel from '../components/admin/ImageSettingsPanel';
import GlobalImageSettingsComponent from '../components/admin/GlobalImageSettings';
import SuccessNotification from '../components/admin/SuccessNotification';

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'media' | 'settings'>('projects');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [globalImageSettings, setGlobalImageSettings] = useState<GlobalImageSettings | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    description?: string;
    type?: 'success' | 'info' | 'warning';
  }>({ show: false, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          await authApi.verifyToken();
          setIsAuthenticated(true);
          fetchProjects();
          fetchGlobalSettings();
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const projectsData = await projectApi.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch global image settings
  const fetchGlobalSettings = async () => {
    try {
      const settings = await globalSettingsApi.getImageSettings();
      setGlobalImageSettings(settings);
    } catch (error) {
      console.error('Error fetching global settings:', error);
      // Set default settings if fetch fails
      setGlobalImageSettings({
        defaultThumbnailSettings: {
          aspectRatio: '4:3',
          fitBehavior: 'cover',
          width: 300,
          height: 225,
          scale: 100,
          lockAspectRatio: true
        },
        defaultHeroSettings: {
          aspectRatio: '16:9',
          fitBehavior: 'cover',
          width: 800,
          height: 450,
          scale: 100,
          lockAspectRatio: true
        },
        defaultGallerySettings: {
          aspectRatio: 'original',
          fitBehavior: 'contain',
          width: 600,
          height: 400,
          scale: 100,
          lockAspectRatio: true
        },
        responsiveBreakpoints: {
          mobile: 375,
          tablet: 768,
          desktop: 1200
        }
      });
    }
  };

  // Show notification
  const showNotification = (message: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ show: true, message, description, type });
  };

  // Handle global settings save
  const handleSaveGlobalSettings = async () => {
    if (!globalImageSettings) return;

    try {
      await globalSettingsApi.updateImageSettings(globalImageSettings);
      showNotification(
        'Settings Saved!',
        'Global image settings have been updated successfully.',
        'success'
      );
    } catch (error) {
      console.error('Error saving global settings:', error);
      showNotification(
        'Save Failed',
        'Failed to save global settings. Please try again.',
        'warning'
      );
    }
  };

  // Handle global settings change
  const handleGlobalSettingsChange = (settings: GlobalImageSettings) => {
    setGlobalImageSettings(settings);
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      await authApi.login({ email, password });
      setIsAuthenticated(true);
      fetchProjects();
      fetchGlobalSettings();
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      setEmail('');
      setPassword('');
      setProjects([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };



  // Handle project selection for editing
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
  };

  // Handle creating a new project
  const handleNewProject = () => {
    const newProject: Project = {
      id: '', // Will be assigned by the server
      title: 'New Project',
      description: 'Project description',
      imageUrl: 'https://via.placeholder.com/800x600',
      category: 'designer',
      technologies: [],
      featured: false, // Initialize featured field
      // Initialize new fields
      mockupImageUrl: '',
      overviewDescription: '',
      galleryImages: [],
      technicalDetails: '',
      implementationInfo: '',
    };

    setSelectedProject(newProject);
    setIsEditing(true);
  };

  // Handle saving project changes
  const handleSaveProject = async () => {
    if (!selectedProject) return;

    try {
      setIsLoading(true);

      // Check if it's a new project or an existing one
      if (!selectedProject.id || selectedProject.id === '') {
        // Create new project
        const { id, ...projectData } = selectedProject;
        const newProject = await projectApi.create(projectData);
        setProjects([newProject, ...projects]);
      } else {
        // Update existing project
        const updatedProject = await projectApi.update(selectedProject.id.toString(), selectedProject);
        setProjects(projects.map(p =>
          p.id === updatedProject.id ? updatedProject : p
        ));
      }

      setIsEditing(false);
      setSelectedProject(null);
      showNotification(
        'Project Saved!',
        'Your project has been saved successfully.',
        'success'
      );
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setIsLoading(true);
        await projectApi.delete(id.toString());

        // Update state
        setProjects(projects.filter(p => p.id !== id));
        showNotification(
          'Project Deleted',
          'The project has been removed successfully.',
          'info'
        );
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle toggling featured status
  const handleToggleFeatured = async (project: Project) => {
    try {
      setIsLoading(true);
      const updatedProject = await projectApi.update(project.id.toString(), {
        ...project,
        featured: !project.featured
      });

      setProjects(projects.map(p =>
        p.id === updatedProject.id ? updatedProject : p
      ));

      showNotification(
        'Project Updated!',
        `Project ${updatedProject.featured ? 'featured' : 'unfeatured'} successfully.`,
        'success'
      );
    } catch (error: any) {
      console.error('Error updating project featured status:', error);
      showNotification(
        'Error',
        error.message || 'Failed to update project. Please try again.',
        'warning'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!selectedProject) return;

    const { name, value } = e.target;

    // If category is changing, animate the transition
    if (name === 'category') {
      const categoryFields = document.querySelector('.category-specific-fields') as HTMLElement;
      if (categoryFields) {
        // Fade out current fields
        categoryFields.style.opacity = '0';
        categoryFields.style.transform = 'translateY(10px)';

        setTimeout(() => {
          setSelectedProject({
            ...selectedProject,
            [name]: value as 'developer' | 'designer',
          });

          // Fade in new fields
          setTimeout(() => {
            categoryFields.style.opacity = '1';
            categoryFields.style.transform = 'translateY(0)';
          }, 50);
        }, 200);
      } else {
        setSelectedProject({
          ...selectedProject,
          [name]: value as 'developer' | 'designer',
        });
      }
    } else {
      setSelectedProject({
        ...selectedProject,
        [name]: value,
      });
    }
  };

  // Handle technology tags
  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProject) return;

    const techString = e.target.value;
    const techArray = techString.split(',').map(tech => tech.trim()).filter(Boolean);

    setSelectedProject({
      ...selectedProject,
      technologies: techArray,
    });
  };

  // Handle gallery images change
  const handleGalleryImagesChange = (images: string[]) => {
    if (!selectedProject) return;

    setSelectedProject({
      ...selectedProject,
      galleryImages: images,
    });
  };

  // Handle image settings change
  const handleImageSettingsChange = (settingType: keyof Project, settings: ImageSettings) => {
    if (!selectedProject) return;

    setSelectedProject({
      ...selectedProject,
      [settingType]: settings,
    });
  };

  // Handle file upload for project images
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedProject) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const result = await projectApi.uploadImage(file);
      const imageUrl = `http://localhost:5001${result.imageUrl}`;

      // Update the project with the new image URL based on field name
      setSelectedProject({
        ...selectedProject,
        [fieldName]: imageUrl
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileUpload = (fieldName: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-field', fieldName);
      fileInputRef.current.click();
    }
  };

  // Show loading state
  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }



  // Render login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

          {loginError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>


        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="text-sm text-green-600 font-medium">✓ JSON Storage (Free)</div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              View Site
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <LogOut size={18} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'projects'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects ({projects.length})
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`pb-4 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'media'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Media
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe size={18} className="inline mr-1" />
              Settings
            </button>
          </div>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            {/* Project List */}
            {!isEditing ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <button
                    onClick={handleNewProject}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} className="mr-1" />
                    Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="text-gray-400 mb-4">
                      <Plus size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Projects Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Get started by creating your first project.
                    </p>
                    <button
                      onClick={handleNewProject}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create First Project
                    </button>
                  </div>
                ) : (
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Featured
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={project.imageUrl}
                                    alt={project.title}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {project.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {project.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.projectType || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleToggleFeatured(project)}
                                className={`p-1 rounded-full transition-colors ${
                                  project.featured
                                    ? 'text-yellow-500 hover:text-yellow-600'
                                    : 'text-gray-300 hover:text-yellow-400'
                                }`}
                                title={project.featured ? 'Remove from featured' : 'Add to featured'}
                              >
                                <Star
                                  size={20}
                                  fill={project.featured ? 'currentColor' : 'none'}
                                />
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleSelectProject(project)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              /* Project Edit Form - Same as before but simplified */
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {selectedProject?.id ? 'Edit Project' : 'New Project'}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      <X size={18} className="mr-1" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProject}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Save size={18} className="mr-1" />
                      Save
                    </button>
                  </div>
                </div>

                {selectedProject && (
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={selectedProject.title}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          value={selectedProject.category}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Type
                        </label>
                        <select
                          name="projectType"
                          value={selectedProject.projectType || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Type</option>
                          {selectedProject.category === 'developer' ? (
                            <>
                              <option value="web">Web</option>
                              <option value="mobile">Mobile</option>
                              <option value="desktop">Desktop</option>
                              <option value="other">Other</option>
                            </>
                          ) : (
                            <>
                              <option value="photography">Photography</option>
                              <option value="production">Production</option>
                              <option value="poster">Poster</option>
                              <option value="magazine">Magazine</option>
                              <option value="other">Other</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Technologies (comma separated)
                        </label>
                        <input
                          type="text"
                          name="technologies"
                          value={selectedProject.technologies.join(', ')}
                          onChange={handleTechChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={selectedProject.featured || false}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            featured: e.target.checked
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-700">
                          <Star size={16} className="inline mr-1" />
                          Featured Project
                        </label>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={selectedProject.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Detailed Description
                        </label>
                        <textarea
                          name="detailedDescription"
                          value={selectedProject.detailedDescription || ''}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main Image
                        </label>
                        <div className="space-y-2">
                          {/* Image preview */}
                          {selectedProject.imageUrl && (
                            <div className="relative w-full h-40 mb-2 border rounded-md overflow-hidden">
                              <img
                                src={selectedProject.imageUrl}
                                alt="Project preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="flex space-x-2">
                            {/* URL input */}
                            <input
                              type="text"
                              name="imageUrl"
                              value={selectedProject.imageUrl}
                              onChange={handleInputChange}
                              className="flex-grow p-2 border border-gray-300 rounded-md"
                              placeholder="Image URL"
                            />

                            {/* Upload button */}
                            <button
                              type="button"
                              onClick={() => triggerFileUpload('imageUrl')}
                              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Uploading...
                                </span>
                              ) : (
                                <>
                                  <Camera size={18} className="mr-1" />
                                  Upload
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Main Image Settings */}
                      {selectedProject.imageUrl && (
                        <div className="md:col-span-2">
                          <ImageSettingsPanel
                            imageUrl={selectedProject.imageUrl}
                            settings={selectedProject.thumbnailImageSettings || globalImageSettings?.defaultThumbnailSettings || {
                              aspectRatio: '4:3',
                              fitBehavior: 'cover',
                              width: 300,
                              height: 225,
                              scale: 100,
                              lockAspectRatio: true
                            }}
                            onChange={(settings) => handleImageSettingsChange('thumbnailImageSettings', settings)}
                            title="Thumbnail Image Settings"
                            showPreview={true}
                            showGlobalActions={true}
                            globalSettings={globalImageSettings?.defaultThumbnailSettings}
                            onApplyGlobal={() => {
                              if (globalImageSettings?.defaultThumbnailSettings) {
                                handleImageSettingsChange('thumbnailImageSettings', globalImageSettings.defaultThumbnailSettings);
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Category-Specific Fields */}
                      <div className="category-specific-fields transition-all duration-300 ease-in-out">
                        {selectedProject.category === 'developer' && (
                          <>
                          {/* Developer Project Mockup Image */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Project Mockup/Screenshot (Main Working Website Image)
                            </label>
                            <div className="space-y-2">
                              {selectedProject.mockupImageUrl && (
                                <div className="relative w-full h-40 mb-2 border rounded-md overflow-hidden">
                                  <img
                                    src={selectedProject.mockupImageUrl}
                                    alt="Project mockup preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}

                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  name="mockupImageUrl"
                                  value={selectedProject.mockupImageUrl || ''}
                                  onChange={handleInputChange}
                                  className="flex-grow p-2 border border-gray-300 rounded-md"
                                  placeholder="Mockup Image URL"
                                />
                                <button
                                  type="button"
                                  onClick={() => triggerFileUpload('mockupImageUrl')}
                                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                  disabled={isUploading}
                                >
                                  <Camera size={18} className="mr-1" />
                                  Upload
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Mockup Image Settings */}
                          {selectedProject.mockupImageUrl && (
                            <div className="md:col-span-2">
                              <ImageSettingsPanel
                                imageUrl={selectedProject.mockupImageUrl}
                                settings={selectedProject.heroImageSettings || globalImageSettings?.defaultHeroSettings || {
                                  aspectRatio: '16:9',
                                  fitBehavior: 'cover',
                                  width: 800,
                                  height: 450,
                                  scale: 100,
                                  lockAspectRatio: true
                                }}
                                onChange={(settings) => handleImageSettingsChange('heroImageSettings', settings)}
                                title="Hero Image Settings"
                                showPreview={true}
                                showGlobalActions={true}
                                globalSettings={globalImageSettings?.defaultHeroSettings}
                                onApplyGlobal={() => {
                                  if (globalImageSettings?.defaultHeroSettings) {
                                    handleImageSettingsChange('heroImageSettings', globalImageSettings.defaultHeroSettings);
                                  }
                                }}
                              />
                            </div>
                          )}

                          {/* Overview Description */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Overview Section
                            </label>
                            <textarea
                              name="overviewDescription"
                              value={selectedProject.overviewDescription || ''}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Detailed project overview, purpose, and goals..."
                            />
                          </div>

                          {/* Technical Details */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Technical Details Section
                            </label>
                            <textarea
                              name="technicalDetails"
                              value={selectedProject.technicalDetails || ''}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Technologies used, frameworks, architecture details..."
                            />
                          </div>

                          {/* Implementation Info */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Implementation Section
                            </label>
                            <textarea
                              name="implementationInfo"
                              value={selectedProject.implementationInfo || ''}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Development process, challenges solved, key features..."
                            />
                          </div>

                          {/* Multiple Website Screenshots */}
                          <div className="md:col-span-2">
                            <SimplifiedImageUpload
                              images={selectedProject.galleryImages || []}
                              onImagesChange={handleGalleryImagesChange}
                              label="Website Screenshots"
                              maxImages={15}
                              showImageSettings={true}
                              imageSettings={selectedProject.galleryImageSettings || globalImageSettings?.defaultGallerySettings}
                              onImageSettingsChange={(settings) => handleImageSettingsChange('galleryImageSettings', settings)}
                              globalSettings={globalImageSettings?.defaultGallerySettings}
                              previewContext="gallery"
                            />
                          </div>
                        </>
                      )}

                      {selectedProject.category === 'designer' && (
                        <>
                          {/* Multiple Photos for Bento Box Layout */}
                          <div className="md:col-span-2">
                            <SimplifiedImageUpload
                              images={selectedProject.galleryImages || []}
                              onImagesChange={handleGalleryImagesChange}
                              label="Project Photos"
                              maxImages={20}
                              showImageSettings={true}
                              imageSettings={selectedProject.galleryImageSettings || globalImageSettings?.defaultGallerySettings}
                              onImageSettingsChange={(settings) => handleImageSettingsChange('galleryImageSettings', settings)}
                              globalSettings={globalImageSettings?.defaultGallerySettings}
                              previewContext="gallery"
                            />
                          </div>
                        </>
                        )}
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Image size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Local File Storage</h3>
              <p className="text-gray-500 mb-4">
                Images are stored locally on your server. Upload images through the project editor.
              </p>
              <div className="text-sm text-green-600">
                ✓ Completely free - no external storage costs
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && globalImageSettings && (
          <div>
            <GlobalImageSettingsComponent
              globalSettings={globalImageSettings}
              onChange={handleGlobalSettingsChange}
              onSave={handleSaveGlobalSettings}
            />
          </div>
        )}
      </main>

      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const fieldName = fileInputRef.current?.getAttribute('data-field') || 'imageUrl';
          handleFileUpload(e, fieldName);
        }}
      />

      {/* Success Notification */}
      <SuccessNotification
        show={notification.show}
        message={notification.message}
        description={notification.description}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '' })}
      />
    </div>
  );
};

export default AdminDashboard;