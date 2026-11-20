import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { ArrowRight, Download, BookOpen, Bot, Eye, Brain, Cpu, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Button } from '@/components/ui/Button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth';
import { ViewCvControl } from '@/components/home/ViewCvControl';
import { HeroAvatarControl } from '@/components/home/HeroAvatarControl';
import {
  HeroBackgroundControl,
  LibraryChoiceItem,
} from '@/components/home/HeroBackgroundControl';



export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="py-12" aria-busy="true">
          <Container>
            <p className="text-sm text-secondary-text" role="status">
              Loading portfolio...
            </p>
          </Container>
        </main>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

async function HomePageContent() {


  await connection();

  const admin = await isAdminUser();
  const supabase = await createServerSupabaseClient();

  let cvQuery = supabase
    .from('cv_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (!admin) {
    cvQuery = cvQuery.eq('is_active', true);
  }


  const { data: cvLinks } = await cvQuery;

  const researchDomains = [
    { title: 'Robotics', description: 'Autonomous navigation, kinematic modeling, and control systems.', icon: Bot },
    { title: 'Reinforcement Learning', description: 'Deep Q-learning, policy gradients, and multi-agent simulation.', icon: Brain },
    { title: 'Computer Vision', description: 'Object detection, spatial perception, and scene reconstruction.', icon: Eye },
    { title: 'Intelligent Systems', description: 'Embedded AI, real-time decision pipelines, and sensor fusion.', icon: Cpu },
  ];

  const sampleSkills = ['Python', 'C++', 'PyTorch', 'ROS2', 'OpenCV', 'TypeScript', 'Next.js', 'Linux', 'Git', 'Docker'];

  let heroMediaQuery = supabase
    .from('hero_media_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (!admin) {
    heroMediaQuery = heroMediaQuery.eq('is_active', true);
  }

  const { data: heroMediaItems } = await heroMediaQuery;

  let heroBgQuery = supabase
    .from('hero_bg_media')
    .select('*')
    .order('created_at', { ascending: false });

  if (!admin) {
    heroBgQuery = heroBgQuery.eq('is_active', true);
  }

  const { data: heroBgItems } = await supabase
    .from('hero_bg_media')
    .select('*')
    .order('created_at', { ascending: true });

  let libraryItems: LibraryChoiceItem[] = [];
  if (admin) {
    const [{ data: assets }, { data: projects }] = await Promise.all([
      supabase.from('media_assets').select('id, title, file_type, file_url'),
      supabase.from('projects').select('id, title, image_url, extra_image_url, video_url'),
    ]);

    const fromAssets: LibraryChoiceItem[] = (assets || [])
      .filter((a) => a.file_type === 'image' || a.file_type === 'video')
      .map((a) => ({
        id: `asset-${a.id}`,
        label: a.title,
        media_type: a.file_type as 'image' | 'video',
        url: a.file_url,
        sourceLabel: 'Media Library',
      }));

    const fromAvatars: LibraryChoiceItem[] = (heroMediaItems || []).map((h) => ({
      id: `avatar-${h.id}`,
      label: h.label,
      media_type: h.media_type,
      url: h.url,
      sourceLabel: 'Hero Avatar',
    }));

    const fromProjects: LibraryChoiceItem[] = (projects || []).flatMap((p) => {
      const list: LibraryChoiceItem[] = [];
      if (p.image_url) {
        list.push({
          id: `proj-img-${p.id}`,
          label: `${p.title} (Thumb)`,
          media_type: 'image',
          url: p.image_url,
          sourceLabel: 'Project',
        });
      }
      if (p.video_url) {
        list.push({
          id: `proj-vid-${p.id}`,
          label: `${p.title} (Video)`,
          media_type: 'video',
          url: p.video_url,
          sourceLabel: 'Project',
        });
      }
      return list;
    });

    libraryItems = [...fromAssets, ...fromAvatars, ...fromProjects];
  }

  return (
    <main className="py-12 space-y-20">
      {/* Hero Section Placeholder */}
      <section className="relative overflow-hidden py-12 sm:py-20 border-b border-border-subtle">
        <HeroBackgroundControl
          isAdmin={admin}
          bgItems={heroBgItems || []}
          libraryItems={libraryItems}
        />

        <Container className="relative z-10">
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
                    <span>Explore My Projects</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <ViewCvControl isAdmin={admin} cvLinks={cvLinks || []} />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <span className="text-xs text-secondary-text font-mono">CONNECT //</span>
                <SocialLinks />
              </div>
            </div>

            {/* Avatar Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroAvatarControl isAdmin={admin} mediaItems={heroMediaItems || []} />
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