"use client";

/**
 * Hauntify Landing Page
 * Built with Kiro IDE - https://kiro.ai
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { Mic, Map, Calendar, Music, Zap, Smartphone, ArrowRight, CheckCircle2, MessageCircle, Sparkles, MapPin, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import { AnimatedTimeline } from "@/components/AnimatedTimeline";

const LandingPage = () => {
  const router = useRouter();

  const features = [
    {
      title: "Professional Voice Acting",
      description: "Your story doesn't just appear as text—it's narrated by a chilling AI voice that sends shivers down your spine.",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Live Location Tracking",
      description: "Every haunted location mentioned in your story appears instantly on a real map. Watch the horror spread geographically.",
      color: "from-red-500 to-orange-600"
    },
    {
      title: "Story Timeline",
      description: "Major events automatically appear on an interactive timeline, showing when each terrifying moment happens.",
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Full Audio Control",
      description: "Play, pause, or jump to any part of the narration. You control the pace of your horror experience.",
      color: "from-orange-600 to-red-500"
    },
    {
      title: "Real-Time Generation",
      description: "Watch your story being written word by word, in real-time. The suspense builds as the AI creates.",
      color: "from-amber-600 to-orange-600"
    },
    {
      title: "Works Everywhere",
      description: "Create horror stories on your phone, tablet, or desktop. The experience adapts beautifully to any screen.",
      color: "from-orange-500 to-red-600"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Tell Us Your Fear",
      description: "Type anything that scares you. 'A haunted mansion', 'a demon in the basement', 'a cursed mirror'—whatever sends chills down your spine.",
      color: "from-orange-500 to-amber-500"
    },
    {
      number: 2,
      title: "Watch It Come Alive",
      description: "Our AI starts writing your story immediately. You'll see it appear word by word, building tension with every sentence.",
      color: "from-amber-500 to-orange-600"
    },
    {
      number: 3,
      title: "Hear the Horror",
      description: "A professional AI voice reads your story out loud with perfect dramatic timing. It's like having your own personal narrator.",
      color: "from-orange-600 to-red-500"
    },
    {
      number: 4,
      title: "Track the Timeline",
      description: "Important events—like 'midnight encounter' or '1885 murder'—automatically show up on a visual timeline as your story unfolds.",
      color: "from-red-500 to-orange-600"
    },
    {
      number: 5,
      title: "See Where It Happens",
      description: "Every location in your story—whether it's a forest, cemetery, or old house—gets pinned to a real, interactive map.",
      color: "from-orange-600 to-amber-500"
    },
    {
      number: 6,
      title: "Experience It Your Way",
      description: "Pause the audio, explore the map, click on timeline events, or just sit back and let the horror wash over you.",
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-img.jpg')" }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Gradient overlay at bottom for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 drop-shadow-[0_0_30px_rgba(255,140,0,0.5)]">
              <span className="bg-linear-to-b from-white via-orange-300 to-orange-600 bg-clip-text text-transparent">Hauntify</span>
            </h1>
          </div>
          
          <p className="text-2xl md:text-xl text-zinc-200 mb-4 drop-shadow-lg">
            Your Personal <span className="text-orange-400">Horror Story Generator</span>
          </p>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 drop-shadow-lg">
            Just type what scares you. We'll turn it into a spine-chilling experience.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => router.push('/dashboard')}
            className="px-12 py-6 text-lg rounded-xl bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 font-medium border-0"
          >
            Create Your Story
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
              What Makes It Terrifying
            </h2>
            <p className="text-lg text-zinc-400">Everything you need to craft the perfect horror experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <MagicCard
                key={index}
                className="cursor-pointer bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl"
                gradientSize={150}
                gradientColor="#ff8c00"
                gradientOpacity={0.4}
                gradientFrom="#ff8c00"
                gradientTo="#ff4500"
              >
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </MagicCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Animated Timeline */}
      <section className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
              From Idea to Nightmare in Seconds
            </h2>
            <p className="text-lg text-zinc-400">Here's how we turn your fears into a fully immersive experience</p>
          </div>
          
          <AnimatedTimeline steps={steps} />
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
              Everything Happens at Once
            </h2>
            <p className="text-lg text-zinc-400">While AI writes, the voice narrates, locations appear, and events build on the timeline</p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/30 transition-colors duration-300">
            <div className="relative bg-zinc-900/50 backdrop-blur-sm p-12 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-6">👻</div>
                <p className="text-xl text-white mb-8">
                  A complete horror storytelling studio in your browser
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
                    🗺️ Live Map Updates
                  </span>
                  <span className="px-4 py-2 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
                    💬 Streaming Story
                  </span>
                  <span className="px-4 py-2 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
                    📅 Event Timeline
                  </span>
                  <span className="px-4 py-2 bg-zinc-800 rounded-lg text-zinc-300 text-sm">
                    🎵 Voice Narration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative py-24 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              Ready to Scare Yourself?
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Type one sentence about what scares you most. We'll handle the rest. Free. No signup. Just pure horror.
            </p>
          </div>
          
          <Button 
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="px-10 py-6 text-lg rounded-xl bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 font-medium mb-8 border-0"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2 inline-block" />
          </Button>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black relative overflow-hidden">
        {/* Footer background image and overlay */}
        <div className="absolute inset-0 w-full h-full  bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg-footer.jpg')" }} />
        <div className="absolute inset-0 w-full h-full  " />
        <div className="relative max-w-7xl mx-auto px-4 py-12 z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-linear-to-b from-white via-orange-300 to-orange-600 bg-clip-text text-transparent mb-3">
                Hauntify
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                Transform your fears into immersive horror stories with AI-powered narration, interactive maps, and dynamic timelines.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => router.push('/dashboard')} className="text-sm text-zinc-400 hover:text-orange-500 transition-colors">
                    Get Started
                  </button>
                </li>
                <li>
                  <a href="#features" className="text-sm text-zinc-400 hover:text-orange-500 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-orange-500 transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Info */}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-zinc-500">
                © {new Date().getFullYear()} Hauntify. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-500 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
