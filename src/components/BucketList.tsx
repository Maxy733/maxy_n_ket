import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle2, Circle, Plus, Trash2, Heart, Award, Flame, Tent, Coffee, HelpCircle } from 'lucide-react';
import { BucketItem } from '../types';

interface BucketListProps {
  bucketList: BucketItem[];
  setBucketList: React.Dispatch<React.SetStateAction<BucketItem[]>>;
  addLovePoints: (pts: number) => void;
}

const CATEGORY_ICONS = {
  travel: Tent,
  food: Coffee,
  adventure: Flame,
  cozy: Heart
};

const CATEGORY_COLORS = {
  travel: 'text-sky-700 bg-sky-50 border-sky-200/50',
  food: 'text-amber-800 bg-amber-50 border-amber-200/50',
  adventure: 'text-rose-700 bg-rose-50 border-rose-200/50',
  cozy: 'text-purple-700 bg-purple-50 border-purple-200/50'
};

export default function BucketList({ bucketList, setBucketList, addLovePoints }: BucketListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'adventure' | 'travel' | 'food' | 'cozy'>('cozy');

  // Calculations
  const completedItems = bucketList.filter(item => item.completed);
  const totalItemsCount = bucketList.length;
  const completionPercentage = totalItemsCount > 0 ? Math.round((completedItems.length / totalItemsCount) * 100) : 0;

  const handleToggleComplete = (id: string) => {
    setBucketList(prevList =>
      prevList.map(item => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          if (nextCompleted) {
            addLovePoints(30); // Earn 30 love points for achieving a bucket list dream!
          }
          return {
            ...item,
            completed: nextCompleted,
            targetDate: nextCompleted ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return item;
      })
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BucketItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      completed: false
    };

    setBucketList([newItem, ...bucketList]);
    addLovePoints(15); // Earn 15 love points for brainstorming a new goal!

    setNewTitle('');
    setNewCategory('cozy');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering toggle complete
    if (confirm('Delete this dream from your bucket list?')) {
      setBucketList(bucketList.filter(item => item.id !== id));
    }
  };

  return (
    <div id="bucket-section" className="w-full py-20 px-4 md:px-8 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-full border border-rose-200/60 text-rose-500 mb-4"
          >
            <Target className="w-6 h-6" />
          </motion.div>
          <h2 className="font-serif italic text-3xl sm:text-5xl font-bold text-[#2A1D15] mb-3">Our Couple Bucket List</h2>
          <p className="text-sm sm:text-base text-[#3D2B1F]/70 max-w-lg mx-auto font-light">
            Big dreams and tiny adventures. Ticking them off side by side, building our lifetime of memories.
          </p>
        </div>

        {/* Progress Display Board */}
        <div className="bg-white/70 border border-[#3D2B1F]/10 rounded-[32px] p-6 sm:p-8 mb-8 shadow-[0_10px_30px_rgba(61,43,31,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-[#3D2B1F]/50 uppercase mb-1">Adventure Meter</div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-600">
                {completedItems.length} of {totalItemsCount} Dreams Achieved ({completionPercentage}%)
              </h3>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#FFF9F5]/80 hover:bg-rose-50 text-[#3D2B1F] text-xs font-bold px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 border border-[#3D2B1F]/10 cursor-pointer transition-all self-start sm:self-center shadow-sm"
            >
              <Plus className="w-4 h-4 text-rose-500" />
              <span>Dream Big (+15 XP)</span>
            </button>
          </div>

          {/* Premium Progress Bar */}
          <div className="relative w-full h-4 bg-white rounded-full overflow-hidden border border-[#3D2B1F]/10 flex items-center">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            {/* Heart locator on progress */}
            <motion.div
              className="absolute -translate-x-1/2 flex items-center justify-center text-rose-500 filter drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]"
              animate={{ left: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-600 scale-110" />
            </motion.div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-[11px] text-[#3D2B1F]/60 font-semibold">
            <Award className="w-4 h-4 text-rose-500" />
            <span>Completing custom bucket list wishes rewards you with virtual **Love Points** to spend on cute coupons!</span>
          </div>
        </div>

        {/* Add Bucket Item Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="overflow-hidden mb-8"
            >
              <form onSubmit={handleAddItem} className="bg-white/95 border border-[#3D2B1F]/15 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                    What is our next shared dream?
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Try scuba diving or build a patio garden"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                  />
                </div>

                <div className="w-full sm:w-44">
                  <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                    Adventure Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                  >
                    <option value="adventure">🔥 Adventure</option>
                    <option value="travel">✈️ Travel</option>
                    <option value="food">🍽️ Food / Dining</option>
                    <option value="cozy">🏡 Cozy / Home</option>
                  </select>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-full cursor-pointer transition-all whitespace-nowrap"
                  >
                    Add Dream
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-[#FFF9F5] hover:bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bucket List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bucketList.map((item, index) => {
            const IconComponent = CATEGORY_ICONS[item.category] || HelpCircle;
            const categoryStyle = CATEGORY_COLORS[item.category] || 'text-zinc-400 bg-zinc-500/10';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                onClick={() => handleToggleComplete(item.id)}
                className={`group backdrop-blur-md border rounded-2xl p-4 sm:p-5 flex items-start gap-4 cursor-pointer select-none transition-all ${
                  item.completed 
                    ? 'bg-white/40 border-[#3D2B1F]/5 opacity-60' 
                    : 'bg-white/80 border-[#3D2B1F]/10 hover:bg-white hover:border-rose-200 hover:shadow-[0_8px_25px_rgba(61,43,31,0.03)]'
                }`}
              >
                {/* Checkbox circle trigger */}
                <div className="mt-1 shrink-0 transition-transform group-hover:scale-110">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#3D2B1F]/40 group-hover:text-rose-400/80" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border mb-2 ${categoryStyle}`}>
                    <IconComponent className="w-2.5 h-2.5" />
                    {item.category}
                  </span>

                  <h4 className={`text-sm sm:text-base font-serif font-bold leading-snug truncate ${
                    item.completed ? 'line-through text-[#3D2B1F]/40 font-medium' : 'text-[#2A1D15]'
                  }`}>
                    {item.title}
                  </h4>

                  {item.completed && item.targetDate && (
                    <span className="block text-[10px] text-rose-600/80 font-medium mt-1">
                      ✓ Completed on {new Date(item.targetDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[#3D2B1F]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all shrink-0"
                  title="Remove from list"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
