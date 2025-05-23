// Map of tool/skill names to their logo files
// These logos should be downloaded from https://worldvectorlogo.com/alphabetical
// and placed in the assets/logos directory

interface LogoMap {
  [key: string]: string;
}

// Designer tools
export const designerLogos: LogoMap = {
  'Figma': 'figma.svg',
  'Adobe Photoshop': 'adobe-photoshop.svg',
  'Adobe Illustrator': 'adobe-illustrator.svg',
  'Adobe After Effects': 'adobe-after-effects.svg',
  'Adobe Premiere Pro': 'adobe-premiere-pro.svg',
  'Adobe Lightroom': 'adobe-lightroom.svg',
  'Sketch': 'sketch.svg',
  'Final Cut Pro': 'final-cut-pro.svg',
};

// Developer tools
export const developerLogos: LogoMap = {
  'React': 'react.svg',
  'TypeScript': 'typescript.svg',
  'Node.js': 'nodejs.svg',
  'Next.js': 'nextjs.svg',
  'Redux': 'redux.svg',
  'Git': 'git.svg',
  'MongoDB': 'mongodb.svg',
  'Firebase': 'firebase.svg',
  'Tailwind CSS': 'tailwindcss.svg',
  'GraphQL': 'graphql.svg',
  'AWS': 'aws.svg',
};

// Skills
export const skillLogos: LogoMap = {
  // Graphic Design
  'Brand Identity': 'brand-identity.svg',
  'Print Design': 'print-design.svg',
  'Digital Design': 'digital-design.svg',
  'Typography': 'typography.svg',
  'Illustration': 'illustration.svg',

  // Videography
  'Video Editing': 'video-editing.svg',
  'Motion Graphics': 'motion-graphics.svg',
  'Color Grading': 'color-grading.svg',
  'Sound Design': 'sound-design.svg',
  'Storyboarding': 'storyboarding.svg',

  // Photography
  'Portrait': 'portrait.svg',
  'Product': 'product.svg',
  'Event': 'event.svg',
  'Landscape': 'landscape.svg',
  'Post-processing': 'post-processing.svg',

  // UI/UX Design
  'Wireframing': 'wireframing.svg',
  'Prototyping': 'prototyping.svg',
  'User Research': 'user-research.svg',
  'Usability Testing': 'usability-testing.svg',
  'Interaction Design': 'interaction-design.svg',

  // Development
  'Frontend': 'frontend.svg',
  'Backend': 'backend.svg',
  'Full Stack': 'full-stack.svg',
  'Mobile': 'mobile.svg',
  'API Development': 'api.svg',
};

// Helper function to get logo path
export const getLogoPath = (name: string): string => {
  // Check in all logo maps
  const logo = designerLogos[name] || developerLogos[name] || skillLogos[name];

  if (logo) {
    return new URL(`../assets/logos/${logo}`, import.meta.url).href;
  }

  // Return a default logo or null if not found
  return '';
};

export default {
  designerLogos,
  developerLogos,
  skillLogos,
  getLogoPath,
};
