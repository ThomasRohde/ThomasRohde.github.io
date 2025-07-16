import { Button } from '@/components/ui/button';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Focus the section for screen readers
      element.focus({ preventScroll: true });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(sectionId);
    }
  };

  return (
    <section
      id="hero"
      className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br"
      aria-label="Hero section"
      tabIndex={-1}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            Thomas Rohde
          </h1>
          <p
            className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl md:text-2xl"
            role="doc-subtitle"
          >
            Full Stack Developer & Software Engineer
          </p>
          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-lg leading-relaxed">
            Passionate about creating innovative solutions and building
            exceptional digital experiences. I specialize in modern web
            technologies and love turning complex problems into elegant, simple
            designs.
          </p>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection('about')}
              onKeyDown={(e) => handleKeyDown(e, 'about')}
              className="min-w-[160px]"
              aria-describedby="about-description"
            >
              Learn More
            </Button>
            <span id="about-description" className="sr-only">
              Navigate to the about section to learn more about Thomas Rohde
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
