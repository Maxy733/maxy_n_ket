import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Heart, Star, Compass, HelpCircle } from 'lucide-react';
import { TRIVIA_QUESTIONS } from '../data';

interface SparkGameProps {
  lovePoints: number;
  addLovePoints: (pts: number) => void;
}

export default function SparkGame({ lovePoints, addLovePoints }: SparkGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(TRIVIA_QUESTIONS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [sparkLevel, setSparkLevel] = useState(0); // 0 to 10 clicks to fill
  const [gameUnlockedPoints, setGameUnlockedPoints] = useState(false);

  const drawNewQuestion = () => {
    setIsSpinning(true);
    setTimeout(() => {
      let nextQ = currentQuestion;
      while (nextQ === currentQuestion) {
        const rnd = Math.floor(Math.random() * TRIVIA_QUESTIONS.length);
        nextQ = TRIVIA_QUESTIONS[rnd];
      }
      setCurrentQuestion(nextQ);
      setIsSpinning(false);
      addLovePoints(5); // 5 points for drawing a question!
    }, 600);
  };

  const handleSparkClick = () => {
    if (sparkLevel < 10) {
      setSparkLevel(prev => prev + 1);
      addLovePoints(1); // 1 point per spark charge!
    } else {
      // Completed charge!
      setSparkLevel(0);
      addLovePoints(15); // Bonus 15 points on full charge!
      setGameUnlockedPoints(true);
      setTimeout(() => setGameUnlockedPoints(false), 2000);
    }
  };

  return (
    <div id="game-section" className="w-full pt-20 pb-6 px-4 md:px-8 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-full border border-rose-200/60 text-rose-500 mb-4"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <h2 className="font-serif italic text-3xl sm:text-5xl font-bold text-[#2A1D15] mb-3">Daily Love Sparks</h2>
          <p className="text-sm sm:text-base text-[#3D2B1F]/70 max-w-lg mx-auto font-light">
            Draw random sweet conversation starters or click together to charge up the Couples Spark Meter!
          </p>
        </div>

        {/* Game Layout split into two side-by-side bento boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Question Generator Bento Card */}
          <div className="bg-white/70 border border-[#3D2B1F]/10 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(61,43,31,0.03)] min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Chemistry Sparks
                </span>
                <HelpCircle className="w-5 h-5 text-[#3D2B1F]/35" />
              </div>

              <p className="text-xs text-[#3D2B1F]/50 font-bold mb-6 uppercase tracking-wider">
                Ask each other today's romantic prompt:
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-lg sm:text-xl font-bold text-[#2A1D15] leading-relaxed text-center mb-6 italic"
                >
                  "{currentQuestion}"
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={drawNewQuestion}
              disabled={isSpinning}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
            >
              <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Drawing Spark Card...' : 'Draw New Spark Card (+5 LP)'}</span>
            </button>
          </div>

          {/* Couples Chemistry Meter Clicker */}
          <div className="bg-white/70 border border-[#3D2B1F]/10 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-[0_10px_30px_rgba(61,43,31,0.03)] min-h-[300px] relative overflow-hidden">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                Sparks Energy
              </span>
              <div className="text-xs text-[#3D2B1F]/50 font-bold">{sparkLevel}/10 Charge</div>
            </div>

            {/* Spark Clicker Trigger */}
            <div className="relative my-4">
              <motion.button
                onClick={handleSparkClick}
                className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white shadow-md cursor-pointer focus:outline-none"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-white text-white" />
              </motion.button>

              {/* Glowing halo wave behind heart */}
              <div 
                className="absolute inset-0 rounded-full bg-rose-500/15 animate-ping -z-0"
                style={{ animationDuration: '2s' }}
              />

              <AnimatePresence>
                {gameUnlockedPoints && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-0 text-center font-bold text-amber-800 text-sm z-20 pointer-events-none drop-shadow flex items-center justify-center gap-1"
                  >
                    <Star className="w-4 h-4 fill-amber-300 text-amber-600" />
                    <span>Double Spark! +15 LP</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Spark level progress bar */}
            <div className="w-full">
              <div className="text-xs text-[#3D2B1F]/60 font-bold mb-2 uppercase tracking-widest">
                Charge Spark Meter together
              </div>
              <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#3D2B1F]/10 relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-rose-400 to-rose-600"
                  animate={{ width: `${sparkLevel * 10}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="text-[10px] text-[#3D2B1F]/50 mt-2 font-semibold">
                Tap to charge spark level. Full charge awards a **+15 Love Points** bonus!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
