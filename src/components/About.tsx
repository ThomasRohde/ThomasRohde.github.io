import { Card } from '@/components/ui/card';

export default function About() {
  return (
    <section
      id="about"
      className="bg-muted/30 py-20"
      aria-labelledby="about-heading"
      tabIndex={-1}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2
              id="about-heading"
              className="mb-4 text-3xl font-bold md:text-4xl"
            >
              About Me
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Discover my journey, passion, and the experiences that shape my
              approach to development
            </p>
          </div>

          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-2xl font-semibold">My Story</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  With a passion for technology and problem-solving, I've
                  dedicated my career to crafting digital solutions that make a
                  difference. My journey in software development began with
                  curiosity and has evolved into a deep expertise in modern web
                  technologies.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I believe in writing clean, maintainable code and creating
                  user experiences that are both functional and delightful.
                  Every project is an opportunity to learn something new and
                  push the boundaries of what's possible.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <h4 className="mb-2 font-semibold">Professional Focus</h4>
                <p className="text-muted-foreground text-sm">
                  Specializing in full-stack development with expertise in
                  React, TypeScript, Node.js, and modern web technologies. I
                  enjoy building scalable applications and contributing to
                  open-source projects.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="mb-2 font-semibold">Philosophy</h4>
                <p className="text-muted-foreground text-sm">
                  I believe in continuous learning, collaborative development,
                  and creating technology that serves people. Quality code and
                  user-centered design are at the heart of everything I build.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="mb-2 font-semibold">Beyond Code</h4>
                <p className="text-muted-foreground text-sm">
                  When I'm not coding, you'll find me exploring new
                  technologies, contributing to the developer community, or
                  sharing knowledge through writing and mentoring.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
