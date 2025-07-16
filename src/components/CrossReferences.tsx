import { ExternalLink, FileText, Github, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CrossReference {
  type: 'spec' | 'code' | 'documentation';
  title: string;
  description: string;
  url: string;
  icon?: React.ReactNode;
}

interface CrossReferencesProps {
  references: CrossReference[];
  className?: string;
}

export function CrossReferences({
  references,
  className,
}: CrossReferencesProps) {
  if (references.length === 0) return null;

  const getIcon = (
    type: CrossReference['type'],
    customIcon?: React.ReactNode
  ) => {
    if (customIcon) return customIcon;

    switch (type) {
      case 'spec':
        return <FileText className="h-4 w-4" />;
      case 'code':
        return <Github className="h-4 w-4" />;
      case 'documentation':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: CrossReference['type']) => {
    switch (type) {
      case 'spec':
        return 'Specification';
      case 'code':
        return 'Code Repository';
      case 'documentation':
        return 'Documentation';
      default:
        return 'Reference';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ExternalLink className="h-5 w-5" />
          Related Resources
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {references.map((reference, index) => (
            <div key={index} className="group">
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-3 transition-colors"
              >
                <div className="text-muted-foreground group-hover:text-foreground mt-0.5 transition-colors">
                  {getIcon(reference.type, reference.icon)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(reference.type)}
                    </Badge>
                  </div>

                  <div className="group-hover:text-primary font-medium transition-colors">
                    {reference.title}
                  </div>

                  <div className="text-muted-foreground mt-1 text-sm">
                    {reference.description}
                  </div>
                </div>

                <ExternalLink className="text-muted-foreground group-hover:text-foreground h-4 w-4 flex-shrink-0 transition-colors" />
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to create common cross-references for the Kiro series
export function createKiroSeriesCrossReferences(): CrossReference[] {
  return [
    {
      type: 'spec',
      title: 'Requirements Document',
      description:
        'View the complete requirements specification for the personal landing page project',
      url: 'https://github.com/your-repo/personal-landing-page/.kiro/specs/personal-landing-page/requirements.md',
    },
    {
      type: 'spec',
      title: 'Design Document',
      description:
        'Explore the architectural design and component specifications',
      url: 'https://github.com/your-repo/personal-landing-page/.kiro/specs/personal-landing-page/design.md',
    },
    {
      type: 'spec',
      title: 'Task List',
      description: 'See the complete implementation plan and task breakdown',
      url: 'https://github.com/your-repo/personal-landing-page/.kiro/specs/personal-landing-page/tasks.md',
    },
    {
      type: 'code',
      title: 'Source Code Repository',
      description:
        'Browse the complete source code for the personal landing page project',
      url: 'https://github.com/your-repo/personal-landing-page',
    },
    {
      type: 'documentation',
      title: 'Kiro Documentation',
      description:
        "Learn more about Kiro's spec-driven development methodology",
      url: 'https://kiro.dev/docs',
    },
  ];
}
