import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Mic, Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const WishForm: React.FC = () => {
  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Check permission status on mount if supported
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as any })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'denied') {
            setPermissionError('Microphone access is blocked. Please click the lock icon in your browser address bar to allow it.');
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              setPermissionError(null);
            } else if (permissionStatus.state === 'denied') {
              setPermissionError('Microphone access is blocked. Please allow it in your browser settings.');
            }
          };
        })
        .catch(err => console.warn('Permissions API not supported for microphone:', err));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    setPermissionError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(blob);
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Microphone access was denied. To fix this: \n1. Click the lock icon in your address bar.\n2. Toggle "Microphone" to ON.\n3. Refresh this page.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('No microphone found on your device.');
      } else {
        setPermissionError(err.message || 'Could not access microphone.');
      }
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !wish) return;
    setLoading(true);

    try {
      let voiceUrl = null;
      if (audioBlob) {
        // In a real app, upload to Supabase Storage. For now, we'll use base64 if small or just skip
        // Since we don't have storage buckets defined, we'll try to store as base64 if possible
        // but base64 can be large. Let's assume text/image for now or small voice.
        const reader = new FileReader();
        voiceUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(audioBlob);
        });
      }

      const { error } = await supabase.from('wishes').insert([
        {
          name,
          content: wish,
          image_url: image,
          voice_url: voiceUrl,
        },
      ]);

      if (error) {
        console.error('Error inserting wish:', error.message, error.details, error.hint);
        throw error;
      }

      setName('');
      setWish('');
      setImage(null);
      setAudioBlob(null);
      alert('Wish sent to the stars! 🌟');
    } catch (err) {
      console.error('Error submitting wish:', err);
      alert('Failed to send wish. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass-card p-6 max-w-xl mx-auto mt-12 relative z-10"
    >
      <h2 className="text-2xl font-bold mb-6 text-center glow-text">Send a Cosmic Wish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="Astronaut Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Your Wish</label>
          <textarea
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors h-32"
            placeholder="Write your message to Sho..."
            required
          />
        </div>
        
        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/10">
            <ImageIcon size={20} />
            <span className="text-sm">Add Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border border-white/10",
              isRecording ? "bg-red-500/50 animate-pulse" : "bg-white/5 hover:bg-white/10"
            )}
          >
            <Mic size={20} />
            <span className="text-sm">{isRecording ? 'Recording...' : 'Hold to Record'}</span>
          </button>
        </div>

        {permissionError && (
          <div className="text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20 whitespace-pre-line">
            {permissionError}
          </div>
        )}

        {image && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => setImage(null)} className="absolute top-0 right-0 bg-black/50 p-1 text-xs">X</button>
          </div>
        )}

        {audioBlob && <div className="text-xs text-cyan-400">Voice note recorded! ✅</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all glow-border"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          Send to Space
        </button>
      </form>
    </motion.div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
