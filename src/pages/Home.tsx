import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import { SEO } from '@/components/SEO';
import {
  StructuredData,
  createWebsiteStructuredData,
  createPersonStructuredData,
} from '@/components/StructuredData';
import { generateHomeSEO } from '@/lib/seo';

export default function Home() {
  const seoData = generateHomeSEO();

  return (
    <div>
      <SEO {...seoData} />
      <StructuredData type="website" data={createWebsiteStructuredData()} />
      <StructuredData type="person" data={createPersonStructuredData()} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Contact />
    </div>
  );
}
