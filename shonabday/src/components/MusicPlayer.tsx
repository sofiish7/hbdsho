import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Music, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const Player = ReactPlayer as any;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3">
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card px-4 py-2 flex items-center gap-3 border-cyan-500/30"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-50">Now Playing</span>
              <span className="text-xs font-bold text-cyan-400">Airplanes - B.O.B</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="opacity-50" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setPlaying(!playing)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
          playing ? 'bg-cyan-500 text-white shadow-cyan-500/40' : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {playing ? <Music2 className="animate-bounce" /> : <Music />}
      </button>

      <div className="hidden">
        {Player && (
          <Player
            url="https://www.youtube.com/watch?v=kn6-c223DUU"
            playing={playing}
            volume={volume}
            loop={true}
            width="0px"
            height="0px"
          />
        )}
      </div>
    </div>
  );
};
