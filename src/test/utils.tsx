import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything except render to avoid conflicts
export * from '@testing-library/react';
export { customRender as render };

// Mock data for testing
export const mockBlogPost = {
  slug: 'test-post',
  title: 'Test Blog Post',
  excerpt: 'This is a test blog post excerpt',
  content: '# Test Content\n\nThis is test content.',
  publishedDate: new Date('2025-01-15'),
  tags: ['test', 'blog'],
  category: 'tutorial',
  readTime: 5,
  published: true,
};

export const mockPersonalInfo = {
  name: 'Thomas Rohde',
  title: 'Software Developer',
  tagline: 'Building amazing web experiences',
  bio: 'Passionate developer with expertise in React and TypeScript',
  location: 'Copenhagen, Denmark',
  email: 'thomas@example.com',
  social: {
    github: 'https://github.com/thomasrohde',
    linkedin: 'https://linkedin.com/in/thomasrohde',
  },
};

export const mockSkills = [
  {
    name: 'React',
    category: 'frontend' as const,
    proficiency: 5,
    icon: 'react',
  },
  {
    name: 'TypeScript',
    category: 'frontend' as const,
    proficiency: 4,
    icon: 'typescript',
  },
  {
    name: 'Node.js',
    category: 'backend' as const,
    proficiency: 4,
    icon: 'nodejs',
  },
];

export const mockExperience = [
  {
    company: 'Tech Company',
    position: 'Senior Developer',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2024-12-31'),
    description: 'Led development of web applications',
    achievements: ['Improved performance by 50%', 'Mentored junior developers'],
    technologies: ['React', 'TypeScript', 'Node.js'],
  },
];
