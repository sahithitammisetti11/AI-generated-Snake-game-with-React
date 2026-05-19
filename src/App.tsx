import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-pink-500/30 overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-cyan-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 relative z-10">
        
        {/* Title / Info Column (Mobile top, Desktop left) */}
        <div className="flex flex-col items-center lg:items-start space-y-6 w-full lg:w-auto lg:sticky lg:top-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 tracking-tighter drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] mb-2">
              Neon Grooves
            </h1>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-[0.2em]">
              Play // Vibe // Repeat
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full flex justify-center lg:justify-start"
          >
            <MusicPlayer />
          </motion.div>
        </div>

        {/* Game Column (Center/Right) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex-shrink-0"
        >
          <SnakeGame />
        </motion.div>

      </div>
    </div>
  );
}
