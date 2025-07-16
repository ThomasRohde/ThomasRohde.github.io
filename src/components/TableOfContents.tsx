import { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TableOfContentsProps } from '@/types/blog';

export function TableOfContents({ entries, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    // Observe all headings
    entries.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className={cn('space-y-1', className)}>
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <List className="h-4 w-4" />
        Table of Contents
      </div>

      <ul className="space-y-1">
        {entries.map(({ id, title, level }) => (
          <li key={id}>
            <button
              onClick={() => handleClick(id)}
              className={cn(
                'text-muted-foreground hover:text-foreground flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors',
                {
                  'text-primary bg-primary/10': activeId === id,
                  'pl-4': level === 2,
                  'pl-6': level === 3,
                  'pl-8': level === 4,
                  'pl-10': level === 5,
                  'pl-12': level === 6,
                }
              )}
            >
              <ChevronRight
                className={cn(
                  'h-3 w-3 transition-transform',
                  activeId === id && 'rotate-90'
                )}
              />
              <span className="truncate">{title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
