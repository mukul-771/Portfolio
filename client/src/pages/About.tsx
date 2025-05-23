import FadeIn from '../components/animations/FadeIn';
import TabsSection from '../components/ui/TabsSection';
import CreativeProfileImage from '../components/ui/CreativeProfileImage';
import profileImage from '../assets/images/profile.png';
import { designerLogos, developerLogos, getLogoPath } from '../utils/logoMap';

const About = () => {

  // Designer tools tab content
  const designerTools = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe After Effects',
        'Adobe Premiere Pro', 'Adobe Lightroom', 'Sketch', 'Final Cut Pro'].map((tool) => (
        <div
          key={tool}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-center h-full"
        >
          {designerLogos[tool] && (
            <div className="flex justify-center mb-2">
              <img
                src={getLogoPath(tool)}
                alt={`${tool} logo`}
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
          <div className="text-primary-200 dark:text-primary-100 font-medium">{tool}</div>
        </div>
      ))}
    </div>
  );

  // Developer tools tab content
  const developerTools = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {['React', 'TypeScript', 'Node.js', 'Next.js', 'Redux', 'Git',
        'MongoDB', 'Firebase', 'Tailwind CSS', 'GraphQL', 'AWS'].map((tool) => (
        <div
          key={tool}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center justify-center h-full"
        >
          {developerLogos[tool] && (
            <div className="flex justify-center mb-2">
              <img
                src={getLogoPath(tool)}
                alt={`${tool} logo`}
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
          <div className="text-primary-200 dark:text-primary-100 font-medium">{tool}</div>
        </div>
      ))}
    </div>
  );

  // Skills data
  const skills = [
    {
      title: 'Graphic Design',
      items: ['Brand Identity', 'Print Design', 'Digital Design', 'Typography', 'Illustration']
    },
    {
      title: 'Videography',
      items: ['Video Editing', 'Motion Graphics', 'Color Grading', 'Sound Design', 'Storyboarding']
    },
    {
      title: 'Photography',
      items: ['Portrait', 'Product', 'Event', 'Landscape', 'Post-processing']
    },
    {
      title: 'UI/UX Design',
      items: ['Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Interaction Design']
    },
    {
      title: 'Development',
      items: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'API Development']
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* About Me Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <FadeIn direction="right">
                <div>
                  <div className="mb-8">
                    <h1 className="font-handwriting text-2xl text-blue-400 mb-1">Hey, this is </h1>
                    <h1 className="text-6xl md:text-7xl font-bold text-blue-400 tracking-tight">
                      Mukul<span className="text-orange-400 inline-block">&nbsp;M.</span>
                    </h1>
                  </div>
                  <div className="space-y-4 text-blue-300">
                    <p>
                      a pixel-pushing, code-wrangling creative who's spent the last 4+ years turning caffeine into cool digital stuff. Part designer, part developer, and occasionally a wizard when deadlines get tight. I make things look pretty AND work properly – a rare combo, or so I've been told!
                    </p>
                    <p>
                      I specialize in creating visually striking, user-centered digital experiences that not only look
                      beautiful but also solve real problems. Whether it's designing intuitive interfaces, developing
                      robust web applications, or producing engaging visual content, I bring a holistic approach to every project.
                    </p>
                    <p className="font-medium">
                      But beyond the degrees, I'm someone who believes that meaningful impact lies at the crossroads of
                      <span className="text-blue-400 font-bold"> creativity, technology, and community</span>.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <CreativeProfileImage
                  imageSrc={profileImage}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Technologies Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-100">Tools & Technologies</h2>
          </FadeIn>

          <FadeIn direction="up">
            <TabsSection
              tabs={[
                { id: 'designer', label: 'Designer', content: designerTools },
                { id: 'developer', label: 'Developer', content: developerTools }
              ]}
              className="max-w-4xl mx-auto"
            />
          </FadeIn>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-100">Skills</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <FadeIn key={skill.title} delay={index * 0.1} direction="up">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <h3 className="text-xl font-bold mb-4 text-primary-200 dark:text-primary-100">{skill.title}</h3>
                  <ul className="space-y-3">
                    {skill.items.map((item) => (
                      <li key={item} className="flex items-center text-blue-100">
                        <span className="w-2 h-2 bg-primary-200 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
