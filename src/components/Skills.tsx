import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Skill {
  name: string;
  proficiency: number; // 1-100 scale
  category: 'frontend' | 'backend' | 'tools' | 'other';
}

const skills: Skill[] = [
  // Frontend Skills
  { name: 'React', proficiency: 95, category: 'frontend' },
  { name: 'TypeScript', proficiency: 90, category: 'frontend' },
  { name: 'JavaScript', proficiency: 95, category: 'frontend' },
  { name: 'HTML/CSS', proficiency: 90, category: 'frontend' },
  { name: 'Tailwind CSS', proficiency: 85, category: 'frontend' },
  { name: 'Next.js', proficiency: 80, category: 'frontend' },
  { name: 'Vue.js', proficiency: 70, category: 'frontend' },

  // Backend Skills
  { name: 'Node.js', proficiency: 85, category: 'backend' },
  { name: 'Python', proficiency: 80, category: 'backend' },
  { name: 'Express.js', proficiency: 85, category: 'backend' },
  { name: 'PostgreSQL', proficiency: 75, category: 'backend' },
  { name: 'MongoDB', proficiency: 70, category: 'backend' },
  { name: 'REST APIs', proficiency: 90, category: 'backend' },
  { name: 'GraphQL', proficiency: 65, category: 'backend' },

  // Tools & Technologies
  { name: 'Git', proficiency: 90, category: 'tools' },
  { name: 'Docker', proficiency: 75, category: 'tools' },
  { name: 'AWS', proficiency: 70, category: 'tools' },
  { name: 'Vite', proficiency: 85, category: 'tools' },
  { name: 'Webpack', proficiency: 75, category: 'tools' },
  { name: 'Jest', proficiency: 80, category: 'tools' },
  { name: 'Cypress', proficiency: 70, category: 'tools' },
];

const categoryLabels = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  tools: 'Tools & Technologies',
  other: 'Other Skills',
};

const categoryColors = {
  frontend: 'bg-blue-500/10 text-blue-700 border-blue-200',
  backend: 'bg-green-500/10 text-green-700 border-green-200',
  tools: 'bg-purple-500/10 text-purple-700 border-purple-200',
  other: 'bg-orange-500/10 text-orange-700 border-orange-200',
};

export default function Skills() {
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <section
      id="skills"
      className="bg-background py-20"
      aria-labelledby="skills-heading"
      tabIndex={-1}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2
              id="skills-heading"
              className="mb-4 text-3xl font-bold md:text-4xl"
            >
              Skills & Expertise
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              A comprehensive overview of my technical skills and proficiency
              levels across different domains
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <Card key={category} className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${categoryColors[category as keyof typeof categoryColors]} font-medium`}
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {categorySkills.length} skills
                  </span>
                </div>

                <div
                  className="space-y-4"
                  role="list"
                  aria-label={`${categoryLabels[category as keyof typeof categoryLabels]} skills`}
                >
                  {categorySkills
                    .sort((a, b) => b.proficiency - a.proficiency)
                    .map((skill) => (
                      <div
                        key={skill.name}
                        className="space-y-2"
                        role="listitem"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-medium"
                            id={`skill-${skill.name.replace(/\s+/g, '-').toLowerCase()}`}
                          >
                            {skill.name}
                          </span>
                          <span
                            className="text-muted-foreground text-xs"
                            aria-label={`Proficiency: ${skill.proficiency} percent`}
                          >
                            {skill.proficiency}%
                          </span>
                        </div>
                        <Progress
                          value={skill.proficiency}
                          className="h-2"
                          aria-labelledby={`skill-${skill.name.replace(/\s+/g, '-').toLowerCase()}`}
                          aria-valuenow={skill.proficiency}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          role="progressbar"
                        />
                      </div>
                    ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Skills Summary */}
          <div className="mt-12 text-center">
            <Card className="bg-muted/30 p-6">
              <h3 className="mb-4 text-xl font-semibold">Core Competencies</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {skills
                  .filter((skill) => skill.proficiency >= 85)
                  .map((skill) => (
                    <Badge
                      key={skill.name}
                      variant="secondary"
                      className="text-sm"
                    >
                      {skill.name}
                    </Badge>
                  ))}
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Technologies where I have advanced proficiency (85%+)
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
