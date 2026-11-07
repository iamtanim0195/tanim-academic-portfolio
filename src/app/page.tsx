import Link from 'next/link';
import { ArrowRight, Download, BookOpen, Bot, Eye, Brain, Cpu, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const researchDomains = [
    { title: 'Robotics', description: 'Autonomous navigation, kinematic modeling, and control systems.', icon: Bot },
    { title: 'Reinforcement Learning', description: 'Deep Q-learning, policy gradients, and multi-agent simulation.', icon: Brain },
    { title: 'Computer Vision', description: 'Object detection, spatial perception, and scene reconstruction.', icon: Eye },
    { title: 'Intelligent Systems', description: 'Embedded AI, real-time decision pipelines, and sensor fusion.', icon: Cpu },
  ];

  const sampleSkills = ['Python', 'C++', 'PyTorch', 'ROS2', 'OpenCV', 'TypeScript', 'Next.js', 'Linux', 'Git', 'Docker'];

  return (
    <main className="py-12 space-y-20">
      {/* Hero Section Placeholder */}
      <section className="py-8 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono">
                <Sparkles size={14} />
                <span>Scholarship & Research Candidate</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-text leading-tight">
                Computer Science & <br />
                <span className="text-accent">Robotics Researcher</span>
              </h1>

              <p className="text-secondary-text text-base sm:text-lg leading-relaxed max-w-2xl">
                B.Sc. Computer Science & Engineering student specializing in autonomous system control, reinforcement learning models, and computer vision perception pipelines.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/projects">
                  <Button variant="accent" size="lg" className="gap-2">
                    <span>Explore My Research</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <a href="#cv" download>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Download size={18} />
                    <span>View CV</span>
                  </Button>
                </a>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <span className="text-xs text-secondary-text font-mono">CONNECT //</span>
                <SocialLinks />
              </div>
            </div>

            {/* Avatar Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-accent/40 bg-surface flex items-center justify-center p-4 shadow-2xl">
                <div className="w-full h-full rounded-full bg-background/80 border border-border-subtle flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Bot size={48} className="text-accent animate-pulse" />
                  <span className="font-mono text-xs text-secondary-text">[ Profile Photo / Video ]</span>
                  <span className="text-[11px] text-accent font-mono">Hero Mode: Interactive</span>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Research Domains Section */}
      <section className="py-8 bg-surface/50 border-y border-border-subtle">
        <Container>
          <SectionHeading
            eyebrow="CORE FOCUS"
            title="Research Interests"
            subtitle="Current investigations centering on intelligent autonomous agents, perception, and optimal decision making."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchDomains.map((domain) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.title}
                  className="p-6 bg-surface border border-border-subtle rounded-xl space-y-3 hover:border-accent/40 transition-all hover:-translate-y-1"
                >
                  <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-lg text-accent w-fit">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-primary-text">{domain.title}</h3>
                  <p className="text-xs text-secondary-text leading-relaxed">{domain.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Technical Skills Preview */}
      <section className="py-8">
        <Container>
          <SectionHeading
            eyebrow="TOOLING & STACK"
            title="Technical Skills"
            subtitle="Core programming languages, ML frameworks, and robotic development platforms."
          />

          <div className="p-8 bg-surface border border-border-subtle rounded-xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
              Featured Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {sampleSkills.map((skill) => (
                <SkillBadge key={skill} name={skill} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Recent Feed & Publications Teaser */}
      <section className="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Feed Teaser */}
            <div className="p-8 bg-surface border border-border-subtle rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent">// RECENT UPDATES</span>
                <Link href="/feed" className="text-xs text-secondary-text hover:text-accent flex items-center gap-1 font-mono">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              <h3 className="text-xl font-bold text-primary-text">Academic Activity Feed</h3>
              <p className="text-xs text-secondary-text">
                Live stream of ongoing project milestones, reading notes, and scholarship application progress.
              </p>
            </div>

            {/* Publications Teaser */}
            <div className="p-8 bg-surface border border-border-subtle rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent">// OUTPUTS</span>
                <Link href="/publications" className="text-xs text-secondary-text hover:text-accent flex items-center gap-1 font-mono">
                  View Papers <BookOpen size={12} />
                </Link>
              </div>
              <h3 className="text-xl font-bold text-primary-text">Publications & Manuscripts</h3>
              <p className="text-xs text-secondary-text">
                Peer-reviewed conference papers, workshop submissions, and technical research preprints.
              </p>
            </div>

          </div>
        </Container>
      </section>
    </main>
  );
}