import React, { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { GalaxyBackground } from './components/GalaxyBackground';
import { WishForm } from './components/WishForm';
import { WishesDisplay } from './components/WishesDisplay';
import { JarSection } from './components/JarSection';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Rocket, Stars } from 'lucide-react';

export default function App() {
  useEffect(() => {
    const checkConnection = async () => {
      const { error: wishesError } = await supabase.from('wishes').select('id').limit(1);
      const { error: jarError } = await supabase.from('jar_messages').select('id').limit(1);
      
      if (wishesError) console.warn('Supabase "wishes" table check failed:', wishesError.message);
      if (jarError) console.warn('Supabase "jar_messages" table check failed:', jarError.message);
      
      if (!wishesError && !jarError) {
        console.log('Successfully connected to Supabase tables! 🚀');
      }
    };
    checkConnection();
    
    // Birthday celebration effect
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <GalaxyBackground />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Stars className="text-yellow-400 animate-pulse" size={32} />
            <span className="bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase border border-cyan-500/30">
              Mission: Birthday Celebration
            </span>
            <Stars className="text-yellow-400 animate-pulse" size={32} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter glow-text">
            Happiest Birthday <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Sho
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto leading-relaxed font-light">
            To the brightest star in our universe. May your journey through the cosmos be filled with infinite joy and wonder.
          </p>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12"
          >
            <button 
              onClick={() => document.getElementById('wishes')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 group"
            >
              Explore the Galaxy
              <Rocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
            </button>
          </motion.div>
        </motion.div>

        {/* Decorative Planet */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-purple-600 to-blue-900 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-bl from-pink-600 to-indigo-900 rounded-full blur-3xl opacity-20 animate-pulse" />
      </section>

      {/* Main Content */}
      <main className="pb-32">
        <section id="wishes">
          <WishForm />
          <WishesDisplay />
        </section>

        <section id="jars">
          <JarSection />
        </section>
      </main>

      <MusicPlayer />

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center opacity-50 text-sm">
        <p>© 2026 Cosmic Birthday Celebration • Made with ✨ for Sho</p>
      </footer>
    </div>
  );
}
