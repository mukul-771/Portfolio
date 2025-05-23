import { useState, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import * as Tabs from '@radix-ui/react-tabs';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsSectionProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

const TabsSection = ({ tabs, defaultTab, className = '' }: TabsSectionProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  useEffect(() => {
    // Animate content when tab changes
    const contentElement = document.querySelector(`[data-tab-content="${activeTab}"]`);

    if (contentElement) {
      gsap.fromTo(
        contentElement,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className={className}
    >
      <Tabs.List className="flex justify-center space-x-1 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-primary-100 text-primary-100 dark:border-primary-100 dark:text-primary-100'
                : 'border-transparent text-gray-400 hover:text-gray-200 dark:text-gray-300 dark:hover:text-gray-100'
            }`}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.id}
          value={tab.id}
          data-tab-content={tab.id}
          className="focus:outline-none"
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default TabsSection;
