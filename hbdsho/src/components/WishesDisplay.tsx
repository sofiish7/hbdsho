import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Play, User } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  content: string;
  image_url: string | null;
  voice_url: string | null;
  created_at: string;
}

export const WishesDisplay: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    const fetchWishes = async () => {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching wishes:', error.message, error.details, error.hint);
      }
      if (data) setWishes(data);
    };

    fetchWishes();

    const subscription = supabase
      .channel('wishes_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
        setWishes(prev => [payload.new as Wish, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const playVoiceNote = (url: string) => {
    const audio = new Audio(url);
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        if (error.name === 'AbortError') {
          // Ignore abort errors caused by rapid clicks or interruptions
          console.log('Playback was interrupted, but that is okay.');
        } else {
          console.error('Playback failed:', error);
        }
      });
    }
  };

  return (
    <div className="mt-20 px-4 max-w-7xl mx-auto relative z-10">
      <h2 className="text-3xl font-bold text-center mb-12 glow-text">Messages from the Galaxy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {wishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0],
              }}
              transition={{
                delay: index * 0.1,
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="glass-card p-6 flex flex-col gap-4 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <User className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-cyan-300">{wish.name}</h3>
                  <p className="text-[10px] opacity-50">{new Date(wish.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed opacity-90">{wish.content}</p>
              
              {wish.image_url && (
                <div className="rounded-lg overflow-hidden border border-white/10">
                  <img src={wish.image_url} alt="Wish" className="w-full h-auto object-cover max-h-48" />
                </div>
              )}
              
              {wish.voice_url && (
                <button 
                  onClick={() => playVoiceNote(wish.voice_url!)}
                  className="flex items-center gap-2 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 px-3 py-2 rounded-full transition-colors w-fit"
                >
                  <Play size={14} fill="currentColor" />
                  Listen to Voice Note
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
