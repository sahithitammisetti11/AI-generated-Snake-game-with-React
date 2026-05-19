import { useSnakeGame } from '../hooks/useSnakeGame';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export function SnakeGame() {
  const { snake, food, score, gameOver, isPaused, resetGame, gridSize } = useSnakeGame();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden group">
      
      {/* Background Decor */}
      <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-[400px] mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-xl font-bold font-mono text-cyan-400 tracking-wider">
             {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
          Neon Serpent
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-black/80 border-2 border-slate-800 rounded-lg shadow-inner overflow-hidden"
        style={{
          width: `${gridSize * 20}px`,
          height: `${gridSize * 20}px`
        }}
      >
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"
          style={{
            width: '18px',
            height: '18px',
            left: `${food.x * 20 + 1}px`,
            top: `${food.y * 20 + 1}px`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute rounded-sm ${
                isHead 
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10' 
                  : 'bg-cyan-600/80'
              }`}
              style={{
                width: '18px',
                height: '18px',
                left: `${segment.x * 20 + 1}px`,
                top: `${segment.y * 20 + 1}px`
              }}
            />
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-20">
            <h2 className="text-3xl font-black text-pink-500 mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">GAME OVER</h2>
            <p className="text-gray-400 text-sm mb-6">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="flex items-center space-x-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-full transition-all border border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="font-semibold tracking-wide uppercase text-sm">Play Again</span>
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-20">
            <div className="flex flex-col items-center">
              <Play className="w-12 h-12 text-cyan-400/50 mb-2" />
              <div className="text-cyan-400/80 font-bold tracking-[0.2em] uppercase text-sm">Paused</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls Hint */}
      <div className="mt-6 text-xs text-gray-500 flex space-x-4">
        <span>Use <strong className="text-gray-300">Arrows / WASD</strong> to move</span>
        <span><strong className="text-gray-300">Space</strong> to pause</span>
      </div>
    </div>
  );
}
