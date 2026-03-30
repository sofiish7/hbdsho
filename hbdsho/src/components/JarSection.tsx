import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, History, X, Send, Loader2 } from 'lucide-react';

const JARS = [
  { 
    id: 'joy', 
    name: 'Jar of Joy', 
    icon: Heart, 
    color: 'text-pink-400', 
    bg: 'bg-pink-500/20', 
    border: 'border-pink-500/30',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80&w=600', 
    accent: '#ff00ff',
    description: 'Filled with pink nebulae and sparkling hearts of joy.'
  },
  { 
    id: 'motivation', 
    name: 'Jar of Motivation', 
    icon: Sparkles, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/20', 
    border: 'border-yellow-500/30',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bc0a?auto=format&fit=crop&q=80&w=600', 
    accent: '#ffff00',
    description: 'A glowing sun of pure cosmic energy and motivation.'
  },
  { 
    id: 'nostalgia', 
    name: 'Jar of Nostalgia', 
    icon: History, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/20', 
    border: 'border-blue-500/30',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267953ba?auto=format&fit=crop&q=80&w=600', 
    accent: '#00ffff',
    description: 'Contains the deep blue echoes of distant moons and memories.'
  },
];

export const JarSection: React.FC = () => {
  const [selectedJar, setSelectedJar] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [jarType, setJarType] = useState('joy');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedJar) {
      fetchJarMessages(selectedJar);
    }
  }, [selectedJar]);

  const fetchJarMessages = async (type: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jar_messages')
      .select('*')
      .eq('jar_type', type)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching jar messages for ${type}:`, error.message, error.details, error.hint);
    }
    if (data) setMessages(data);
    setLoading(false);
  };

  const handleJarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('jar_messages').insert([
        { name, message, jar_type: jarType }
      ]);
      if (error) {
        console.error('Error inserting jar message:', error.message, error.details, error.hint);
        throw error;
      }
      setName('');
      setMessage('');
      alert(`Message added to the ${jarType} jar! ✨`);
      if (selectedJar === jarType) fetchJarMessages(jarType);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-32 px-4 max-w-7xl mx-auto relative z-10">
      <h2 className="text-3xl font-bold text-center mb-12 glow-text">Cosmic Jars of Memories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
        {JARS.map((jar, index) => (
          <motion.div
            key={jar.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center text-center group"
          >
            {/* 3D Jar Container */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [-2, 2, -2]
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              onClick={() => setSelectedJar(jar.id)}
              className="relative cursor-pointer mb-8"
            >
              {/* Floating Celestial Elements around the jar */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-12 -left-12 text-yellow-400/60 pointer-events-none"
              >
                <Sparkles size={48} />
              </motion.div>
              
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-12 text-cyan-400/60 pointer-events-none"
              >
                <div className="w-10 h-10 rounded-full border-4 border-current border-t-transparent" />
              </motion.div>

              <motion.div 
                animate={{ 
                  x: [-20, 20, -20],
                  y: [20, -20, 20]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 text-pink-400/60 pointer-events-none"
              >
                <Heart size={32} />
              </motion.div>

              {/* The Jar Image with Mask and Effects */}
              <div className="relative w-64 h-80">
                {/* Jar Shape Mask/Container */}
                <div className="absolute inset-0 rounded-[40px_40px_60px_60px] overflow-hidden border-4 border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.15)] group-hover:border-white/40 transition-all duration-500 bg-black/40">
                  <img 
                    src={jar.image} 
                    alt={jar.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Internal Pulsing Glow */}
                  <motion.div 
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 mix-blend-screen"
                    style={{ background: `radial-gradient(circle at center, ${jar.accent} 0%, transparent 70%)` }}
                  />
                  
                  {/* Glass Reflection Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-30" />
                  <div className="absolute top-6 left-6 w-14 h-40 bg-white/20 blur-2xl rounded-full -rotate-12" />
                  <div className="absolute bottom-10 right-6 w-8 h-20 bg-white/10 blur-xl rounded-full rotate-45" />
                </div>
                
                {/* Jar Lid (3D-like) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-52 h-10 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-700 rounded-2xl border-b-4 border-black/30 z-10 shadow-2xl flex items-center justify-center">
                  <div className="w-44 h-1 bg-white/20 rounded-full blur-[1px]" />
                </div>
                
                {/* Jar Base Shadow */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-56 h-10 bg-black/60 blur-3xl rounded-full scale-y-50" 
                />
              </div>
            </motion.div>

            {/* Text Below Jar */}
            <div className="space-y-2">
              <h3 className={`text-3xl font-black ${jar.color} glow-text uppercase tracking-tighter`}>{jar.name}</h3>
              <p className="text-sm text-white/60 max-w-[200px] leading-tight font-medium italic">
                {jar.description}
              </p>
              <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold mt-4 animate-pulse">
                <Sparkles size={12} />
                <span>TAP TO OPEN</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 max-w-xl mx-auto mb-20">
        <h3 className="text-xl font-bold mb-6 text-center">Contribute to a Jar</h3>
        <form onSubmit={handleJarSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
              required
            />
            <select
              value={jarType}
              onChange={(e) => setJarType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="joy" className="bg-gray-900">Jar of Joy</option>
              <option value="motivation" className="bg-gray-900">Jar of Motivation</option>
              <option value="nostalgia" className="bg-gray-900">Jar of Nostalgia</option>
            </select>
          </div>
          <textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 h-24"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            Add to Jar
          </button>
        </form>
      </div>

      <AnimatePresence>
        {selectedJar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  {React.createElement(JARS.find(j => j.id === selectedJar)!.icon, { 
                    className: JARS.find(j => j.id === selectedJar)!.color,
                    size: 24
                  })}
                  {JARS.find(j => j.id === selectedJar)!.name}
                </h3>
                <button onClick={() => setSelectedJar(null)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-cyan-500" size={40} /></div>
                ) : messages.length === 0 ? (
                  <p className="text-center py-12 opacity-50 italic text-lg">This jar is waiting for its first spark of magic...</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <p className="text-lg mb-2 italic">"{msg.message}"</p>
                      <p className="text-sm font-bold text-cyan-400">— {msg.name}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
