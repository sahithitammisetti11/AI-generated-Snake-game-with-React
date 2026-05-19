import { Play, Pause, SkipForward, SkipBack, Music, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

// Using reliable placeholder tracks from SoundHelix
const TRACKS = [
  { id: 1, title: 'Neon Highway', artist: 'AI Synthwave', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '7:05' },
  { id: 2, title: 'Cybernetic Pulse', artist: 'AI Generated', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '6:12' },
  { id: 3, title: 'Digital Dreaming', artist: 'Neural Grooves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '5:44' }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="bg-gray-900 border border-pink-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(236,72,153,0.1)] w-full max-w-sm flex flex-col relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-black rounded-xl border border-pink-500/50 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(236,72,153,0.3)]">
          <Music className={`w-8 h-8 text-pink-500 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying && (
            <div className="absolute bottom-1 right-1 flex space-x-[2px]">
              <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-cyan-400 rounded-t-sm" />
              <motion.div animate={{ height: [8, 4, 16, 8] }} transition={{ repeat: Infinity, duration: 1.1 }} className="w-1 bg-cyan-400 rounded-t-sm" />
              <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1 bg-cyan-400 rounded-t-sm" />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div 
            key={currentTrack.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-white font-bold tracking-wide truncate">{currentTrack.title}</span>
            <span className="text-pink-400/80 text-sm truncate">{currentTrack.artist}</span>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden relative cursor-pointer group">
        <motion.div 
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-pink-500 to-cyan-400"
          style={{ width: `${progress}%` }}
          layout
        />
        {/* Glow effect on progress */}
        <motion.div 
          className="absolute left-0 top-0 bottom-0 bg-cyan-400 mix-blend-screen blur-sm opacity-50"
          style={{ width: `${progress}%` }}
          layout
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-4">
          <button onClick={prevTrack} className="text-gray-300 hover:text-white transition-colors cursor-pointer bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-pink-600 hover:bg-pink-500 text-white rounded-full flex items-center justify-center transition-all shadow-[0_0_15px_rgba(236,72,153,0.5)] cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" className="ml-1" />}
          </button>
          
          <button onClick={nextTrack} className="text-gray-300 hover:text-white transition-colors cursor-pointer bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="w-9"></div> {/* Spacer for centering controls */}
      </div>

      {/* Playlist preview implicitly shown or just track info */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Up Next Playlist</p>
        <div className="space-y-2">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id} 
              className={`text-xs flex justify-between py-1 px-2 rounded ${idx === currentTrackIndex ? 'bg-pink-500/10 text-pink-400' : 'text-gray-500'}`}
            >
              <span className="truncate pr-4">{idx + 1}. {track.title}</span>
              <span className="opacity-50 flex-shrink-0">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
