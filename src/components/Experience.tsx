import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  type: 'full-time' | 'contract' | 'freelance' | 'internship';
}

const experiences: Experience[] = [
  {
    id: '1',
    company: 'Tech Solutions Inc.',
    position: 'Senior Full Stack Developer',
    startDate: '2022-01',
    endDate: undefined, // Current position
    location: 'Remote',
    description:
      'Leading development of modern web applications using React, TypeScript, and Node.js. Responsible for architecture decisions, code reviews, and mentoring junior developers.',
    achievements: [
      'Architected and built a customer portal that increased user engagement by 40%',
      'Led migration from legacy PHP system to modern React/Node.js stack',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
      'Mentored 3 junior developers and established coding standards for the team',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'Docker',
    ],
    type: 'full-time',
  },
  {
    id: '2',
    company: 'Digital Agency Co.',
    position: 'Frontend Developer',
    startDate: '2020-06',
    endDate: '2021-12',
    location: 'New York, NY',
    description:
      'Developed responsive web applications and e-commerce solutions for various clients. Collaborated with designers and backend developers to deliver high-quality digital experiences.',
    achievements: [
      'Built 15+ responsive websites with 99% client satisfaction rate',
      'Optimized website performance resulting in 50% faster load times',
      'Implemented accessibility standards achieving WCAG 2.1 AA compliance',
      'Created reusable component library used across multiple projects',
    ],
    technologies: [
      'React',
      'JavaScript',
      'SCSS',
      'Webpack',
      'Figma',
      'WordPress',
    ],
    type: 'full-time',
  },
  {
    id: '3',
    company: 'Startup Ventures',
    position: 'Full Stack Developer',
    startDate: '2019-03',
    endDate: '2020-05',
    location: 'San Francisco, CA',
    description:
      'Worked in a fast-paced startup environment building MVP products and iterating based on user feedback. Handled both frontend and backend development responsibilities.',
    achievements: [
      'Developed MVP that secured $2M in Series A funding',
      'Built real-time chat system handling 10k+ concurrent users',
      'Implemented automated testing reducing bugs by 70%',
      'Collaborated directly with founders on product strategy',
    ],
    technologies: [
      'Vue.js',
      'Python',
      'Django',
      'Redis',
      'MongoDB',
      'Socket.io',
    ],
    type: 'full-time',
  },
  {
    id: '4',
    company: 'Freelance Projects',
    position: 'Web Developer',
    startDate: '2018-01',
    endDate: '2019-02',
    location: 'Remote',
    description:
      'Provided web development services to small businesses and startups. Specialized in creating custom websites and web applications tailored to client needs.',
    achievements: [
      'Completed 20+ projects with 100% on-time delivery rate',
      'Increased client revenue by average of 30% through improved web presence',
      'Built long-term relationships with 5 recurring clients',
      'Developed expertise in multiple CMS platforms and frameworks',
    ],
    technologies: [
      'HTML/CSS',
      'JavaScript',
      'PHP',
      'MySQL',
      'WordPress',
      'Shopify',
    ],
    type: 'freelance',
  },
];

const typeColors = {
  'full-time': 'bg-green-500/10 text-green-700 border-green-200',
  contract: 'bg-blue-500/10 text-blue-700 border-blue-200',
  freelance: 'bg-purple-500/10 text-purple-700 border-purple-200',
  internship: 'bg-orange-500/10 text-orange-700 border-orange-200',
};

export default function Experience() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  return (
    <section
      id="experience"
      className="bg-muted/30 py-20"
      aria-labelledby="experience-heading"
      tabIndex={-1}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2
              id="experience-heading"
              className="mb-4 text-3xl font-bold md:text-4xl"
            >
              Professional Experience
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              My journey through various roles and companies, building expertise
              and delivering impactful solutions
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="bg-border absolute top-0 bottom-0 left-4 w-0.5 md:left-8"></div>

            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  {/* Timeline dot */}
                  <div className="bg-primary border-background absolute left-2 h-4 w-4 rounded-full border-4 shadow-sm md:left-6"></div>

                  {/* Content */}
                  <div className="ml-12 md:ml-20">
                    <Card className="p-6 transition-shadow hover:shadow-md">
                      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="text-xl font-semibold">
                              {exp.position}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`${typeColors[exp.type]} text-xs`}
                            >
                              {exp.type.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-primary mb-1 text-lg font-medium">
                            {exp.company}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {exp.location}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatDate(exp.startDate)} -{' '}
                            {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {calculateDuration(exp.startDate, exp.endDate)}
                          </p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Technologies */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {/* Expandable achievements */}
                      <div className="space-y-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(exp.id)}
                          onKeyDown={(e) => handleKeyDown(e, exp.id)}
                          className="text-primary hover:text-primary/80 focus:ring-primary h-auto p-0 font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
                          aria-expanded={expandedItems.has(exp.id)}
                          aria-controls={`achievements-${exp.id}`}
                          aria-label={`${expandedItems.has(exp.id) ? 'Hide' : 'Show'} key achievements for ${exp.position} at ${exp.company}`}
                        >
                          {expandedItems.has(exp.id) ? 'Hide' : 'Show'} Key
                          Achievements
                          <span className="ml-1" aria-hidden="true">
                            {expandedItems.has(exp.id) ? '▲' : '▼'}
                          </span>
                        </Button>

                        {expandedItems.has(exp.id) && (
                          <div
                            id={`achievements-${exp.id}`}
                            className="space-y-2 border-t pt-2"
                            role="region"
                            aria-label={`Key achievements for ${exp.position} at ${exp.company}`}
                          >
                            <ul className="space-y-2" role="list">
                              {exp.achievements.map((achievement, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2"
                                  role="listitem"
                                >
                                  <span
                                    className="text-primary mt-1.5 text-xs"
                                    aria-hidden="true"
                                  >
                                    •
                                  </span>
                                  <p className="text-muted-foreground text-sm leading-relaxed">
                                    {achievement}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Summary */}
          <div className="mt-16 text-center">
            <Card className="bg-background p-6">
              <h3 className="mb-4 text-xl font-semibold">Experience Summary</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-primary text-2xl font-bold">5+</p>
                  <p className="text-muted-foreground text-sm">
                    Years of Experience
                  </p>
                </div>
                <div>
                  <p className="text-primary text-2xl font-bold">50+</p>
                  <p className="text-muted-foreground text-sm">
                    Projects Completed
                  </p>
                </div>
                <div>
                  <p className="text-primary text-2xl font-bold">15+</p>
                  <p className="text-muted-foreground text-sm">
                    Technologies Mastered
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
