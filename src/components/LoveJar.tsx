import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Gift, Plus, Trash2, Heart, Sparkles, Check, Clock, ShieldCheck, Edit3 } from 'lucide-react';
import { LoveMessage, Coupon } from '../types';

interface LoveJarProps {
  messages: LoveMessage[];
  setMessages: React.Dispatch<React.SetStateAction<LoveMessage[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  lovePoints: number;
  spendLovePoints: (pts: number) => boolean;
  addLovePoints: (pts: number) => void;
}

const NOTE_COLORS = {
  rose: 'bg-rose-50/90 border-rose-200 text-rose-950 shadow-sm shadow-rose-100',
  amber: 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-sm shadow-amber-100',
  sky: 'bg-sky-50/90 border-sky-200 text-sky-950 shadow-sm shadow-sky-100',
  emerald: 'bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-sm shadow-emerald-100',
  violet: 'bg-purple-50/90 border-purple-200 text-purple-950 shadow-sm shadow-purple-100',
};

export default function LoveJar({
  messages,
  setMessages,
  coupons,
  setCoupons,
  lovePoints,
  spendLovePoints,
  addLovePoints,
}: LoveJarProps) {
  const [activeTab, setActiveTab] = useState<'board' | 'shop'>('board');
  const [showAddMsg, setShowAddMsg] = useState(false);

  // New message form states
  const [newText, setNewText] = useState('');
  const [newSender, setNewSender] = useState<'Maxy' | 'Ket' | 'Both'>('Both');
  const [newColor, setNewColor] = useState<'rose' | 'amber' | 'sky' | 'emerald' | 'violet'>('rose');
  const [newEmoji, setNewEmoji] = useState('💕');

  // Coupon form states
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDescription, setCouponDescription] = useState('');
  const [couponCategory, setCouponCategory] = useState<'romantic' | 'cozy' | 'fun' | 'food'>('romantic');
  const [couponCost, setCouponCost] = useState<number>(100);

  // Filter messages
  const [messageFilter, setMessageFilter] = useState<'all' | 'Maxy' | 'Ket' | 'Both'>('all');

  const filteredMessages = messages.filter(
    (msg) => messageFilter === 'all' || msg.sender === messageFilter
  );

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newMessage: LoveMessage = {
      id: Date.now().toString(),
      sender: newSender,
      text: newText.trim(),
      createdAt: new Date().toISOString(),
      color: newColor,
      emoji: newEmoji.trim() || '💌',
    };

    setMessages([newMessage, ...messages]);
    addLovePoints(10); // 10 points for leaving a sweet note!
    
    // Reset Form
    setNewText('');
    setNewEmoji('💕');
    setShowAddMsg(false);
  };

  const handleDeleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this cute note forever?')) {
      setMessages(messages.filter((msg) => msg.id !== id));
    }
  };

  const handleRedeemCoupon = (couponId: string) => {
    const coupon = coupons.find((c) => c.id === couponId);
    if (!coupon) return;

    if (coupon.isRedeemed) {
      alert('This sweet voucher has already been redeemed! Enjoy your treat!');
      return;
    }

    // Attempt to spend points
    const success = spendLovePoints(coupon.cost);
    if (!success) {
      alert(`Oops! You need ${coupon.cost} Love Points to redeem "${coupon.title}". Click the beating heart at the top or log sweet memories to earn more points!`);
      return;
    }

    // Mark as redeemed
    setCoupons((prevCoupons) =>
      prevCoupons.map((c) =>
        c.id === couponId
          ? { ...c, isRedeemed: true, redeemedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleDeleteCoupon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this coupon card from the shop?')) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const startEditingCoupon = (coupon: Coupon, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCoupon(coupon);
    setCouponTitle(coupon.title);
    setCouponDescription(coupon.description);
    setCouponCategory(coupon.category);
    setCouponCost(coupon.cost);
    setShowAddCoupon(true);
    
    // Scroll to form smoothly
    setTimeout(() => {
      const el = document.getElementById('coupon-form-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleSubmitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponTitle.trim() || !couponDescription.trim()) return;

    if (editingCoupon) {
      setCoupons(prev => prev.map(c => 
        c.id === editingCoupon.id 
          ? { 
              ...c, 
              title: couponTitle.trim(), 
              description: couponDescription.trim(), 
              category: couponCategory, 
              cost: couponCost 
            } 
          : c
      ));
      setEditingCoupon(null);
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        title: couponTitle.trim(),
        description: couponDescription.trim(),
        category: couponCategory,
        cost: couponCost,
        icon: 'Gift',
        isRedeemed: false
      };
      setCoupons([newCoupon, ...coupons]);
      addLovePoints(15); // Bonus 15 points for designing a romantic reward!
    }

    // Reset Form
    setCouponTitle('');
    setCouponDescription('');
    setCouponCategory('romantic');
    setCouponCost(100);
    setShowAddCoupon(false);
  };

  return (
    <div id="love-jar-section" className="w-full py-20 px-4 md:px-8 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-full border border-rose-200/60 text-rose-500 mb-4"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.div>
          <h2 className="font-serif italic text-3xl sm:text-5xl font-bold text-[#2A1D15] mb-3">Our Love Jar & Coupons</h2>
          <p className="text-sm sm:text-base text-[#3D2B1F]/70 max-w-lg mx-auto font-light">
            Share quiet little notes throughout the day or redeem sweet love vouchers earned with your Love Points.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/70 p-1.5 rounded-full border border-[#3D2B1F]/10 flex gap-2 shadow-sm">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === 'board'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-[#3D2B1F]/50 hover:text-[#3D2B1F]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Love Notes Wall</span>
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === 'shop'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-[#3D2B1F]/50 hover:text-[#3D2B1F]'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Love Coupon Shop</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display */}
        {activeTab === 'board' ? (
          <div>
            {/* Notes Control Bar */}
            <div className="bg-white/70 border border-[#3D2B1F]/10 rounded-[24px] p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3D2B1F]/50">From:</span>
                <div className="flex bg-[#FFF9F5] p-1 rounded-full border border-[#3D2B1F]/10">
                  {(['all', 'Maxy', 'Ket', 'Both'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setMessageFilter(filter)}
                      className={`px-3.5 py-1 text-xs font-bold uppercase rounded-full cursor-pointer transition-all ${
                        messageFilter === filter
                          ? 'bg-rose-50 text-rose-700'
                          : 'text-[#3D2B1F]/50 hover:text-[#3D2B1F]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Available points indicator */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-bold">{lovePoints} Love Points</span>
                </div>

                <button
                  onClick={() => setShowAddMsg(!showAddMsg)}
                  className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Leave Note (+10 XP)</span>
                </button>
              </div>
            </div>

            {/* Add Message form */}
            <AnimatePresence>
              {showAddMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8"
                >
                  <form
                    onSubmit={handleAddMessage}
                    className="bg-white border border-[#3D2B1F]/15 rounded-3xl p-6 shadow-xl"
                  >
                    <h3 className="font-serif text-lg font-bold text-[#2A1D15] mb-4 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Write a Digital Sticky Note
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                          Who is writing?
                        </label>
                        <select
                          value={newSender}
                          onChange={(e) => setNewSender(e.target.value as any)}
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        >
                          <option value="Both">Both of Us</option>
                          <option value="Maxy">Maxy</option>
                          <option value="Ket">Ket</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                          Paper Shade
                        </label>
                        <select
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value as any)}
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        >
                          <option value="rose">🌹 Pastel Pink</option>
                          <option value="amber">🍯 Honey Gold</option>
                          <option value="sky">💧 Ocean Blue</option>
                          <option value="emerald">🍃 Fresh Leaf</option>
                          <option value="violet">🔮 Cosmic Lilac</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                          Stamp Emoji
                        </label>
                        <input
                          type="text"
                          value={newEmoji}
                          onChange={(e) => setNewEmoji(e.target.value)}
                          maxLength={4}
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] text-center focus:outline-none focus:border-rose-300"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                        Your cute message
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Write a sweet reminder, a private joke, or just say 'I love you'..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        required
                        className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddMsg(false)}
                        className="bg-[#FFF9F5] hover:bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-all"
                      >
                        Pin Note
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sticky Notes Wall Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMessages.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white/60 rounded-3xl border border-[#3D2B1F]/15 text-[#3D2B1F]/60 shadow-sm">
                  <p className="text-xs">
                    The love notes wall is currently empty! Pin a new sticky note to start sharing love.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg, index) => {
                  const colorClass = NOTE_COLORS[msg.color] || NOTE_COLORS.rose;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.9, rotate: (index % 2 === 0 ? -1.5 : 1.5) }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.03, rotate: 0 }}
                      className={`relative border rounded-3xl p-6 flex flex-col justify-between min-h-[160px] shadow-sm transition-all group ${colorClass}`}
                    >
                      {/* Note Header */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="text-[10px] font-bold tracking-wider uppercase opacity-70">
                          {msg.sender === 'Both' ? 'To both of us' : `From ${msg.sender}`}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-base select-none">{msg.emoji}</span>
                          <button
                            onClick={(e) => handleDeleteMessage(msg.id, e)}
                            className="p-1 text-[#3D2B1F]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            style={{ opacity: 'inherit' }}
                            title="Tear off note"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Msg text */}
                      <p className="text-sm font-medium leading-relaxed mb-4 italic break-words whitespace-pre-wrap">
                        "{msg.text}"
                      </p>

                      {/* Note Footer Timestamp */}
                      <div className="text-[9px] font-bold tracking-wider uppercase opacity-50 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-rose-500/80" />
                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Love Coupons Shop */}
            <div className="bg-white/70 border border-[#3D2B1F]/10 rounded-[24px] p-5 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3D2B1F]/50">Coupons Vibe</span>
                <h3 className="font-serif text-lg font-bold text-rose-600 mt-1">
                  Available balance: {lovePoints} Love Points
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="text-xs text-[#3D2B1F]/70 max-w-sm text-center sm:text-right font-medium">
                  Spend Love Points earned from logging memories and dreams to unlock virtual romantic gift cards!
                </div>
                <button
                  onClick={() => {
                    setEditingCoupon(null);
                    setCouponTitle('');
                    setCouponDescription('');
                    setCouponCategory('romantic');
                    setCouponCost(100);
                    setShowAddCoupon(!showAddCoupon);
                  }}
                  className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>
            </div>

            {/* Add/Edit Coupon form */}
            <AnimatePresence>
              {showAddCoupon && (
                <motion.div
                  id="coupon-form-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8"
                >
                  <form
                    onSubmit={handleSubmitCoupon}
                    className="bg-white border border-[#3D2B1F]/15 rounded-3xl p-6 shadow-xl"
                  >
                    <h3 className="font-serif text-lg font-bold text-[#2A1D15] mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-rose-500" />
                      {editingCoupon ? 'Edit Custom Love Coupon' : 'Create a Custom Love Coupon'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                          Coupon Reward Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1-Hour Gaming Pass or Cozy Foot Massage"
                          value={couponTitle}
                          onChange={(e) => setCouponTitle(e.target.value)}
                          required
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                          Category
                        </label>
                        <select
                          value={couponCategory}
                          onChange={(e) => setCouponCategory(e.target.value as any)}
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        >
                          <option value="romantic">🌹 Romantic</option>
                          <option value="cozy">🏡 Cozy Time</option>
                          <option value="food">🍽️ Food / Treats</option>
                          <option value="fun">🎉 Fun / Playful</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                          Description (What do they get?)
                        </label>
                        <input
                          type="text"
                          placeholder="What makes this reward special? Be specific!"
                          value={couponDescription}
                          onChange={(e) => setCouponDescription(e.target.value)}
                          required
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1.5">
                          Cost (Love Points)
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={1000}
                          value={couponCost}
                          onChange={(e) => setCouponCost(Number(e.target.value))}
                          required
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCoupon(false);
                          setEditingCoupon(null);
                          setCouponTitle('');
                          setCouponDescription('');
                        }}
                        className="bg-[#FFF9F5] hover:bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-all"
                      >
                        {editingCoupon ? 'Update Coupon' : 'Create Reward'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  className={`group border rounded-3xl p-5 sm:p-6 relative flex flex-col justify-between transition-all ${
                    coupon.isRedeemed
                      ? 'bg-white/40 border-[#3D2B1F]/5 opacity-60'
                      : 'bg-white/80 border-[#3D2B1F]/10 hover:border-rose-200 hover:bg-white hover:shadow-[0_8px_25px_rgba(61,43,31,0.02)]'
                  }`}
                  whileHover={coupon.isRedeemed ? {} : { y: -4 }}
                >
                  <div>
                    {/* Header: cost / actions */}
                    <div className="flex justify-between items-center mb-4 gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${
                          coupon.isRedeemed
                            ? 'border-[#3D2B1F]/10 text-[#3D2B1F]/50 bg-white'
                            : 'border-rose-200 text-rose-700 bg-rose-50 font-bold'
                        }`}>
                          {coupon.category}
                        </span>

                        {/* Actions for custom coupons & general editing/deleting */}
                        <div className="flex items-center gap-1 opacity-45 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => startEditingCoupon(coupon, e)}
                            className="p-1 text-[#3D2B1F]/40 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-all"
                            title="Edit coupon"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteCoupon(coupon.id, e)}
                            className="p-1 text-[#3D2B1F]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                            title="Remove coupon"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {!coupon.isRedeemed ? (
                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          <span>{coupon.cost} LP</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>REDEEMED</span>
                        </div>
                      )}
                    </div>

                    <h4 className={`font-serif text-lg font-bold mb-2 ${
                      coupon.isRedeemed ? 'text-[#3D2B1F]/40 line-through' : 'text-[#2A1D15]'
                    }`}>
                      {coupon.title}
                    </h4>

                    <p className="text-[#3D2B1F]/70 text-xs leading-relaxed mb-6">
                      {coupon.description}
                    </p>
                  </div>

                  {/* Redeem Action */}
                  <div>
                    {coupon.isRedeemed ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Ready for fulfillment!
                        </span>
                        {coupon.redeemedAt && (
                          <span className="opacity-75">
                            {new Date(coupon.redeemedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRedeemCoupon(coupon.id)}
                        disabled={lovePoints < coupon.cost}
                        className={`w-full font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all text-center ${
                          lovePoints >= coupon.cost
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:scale-[1.01]'
                            : 'bg-white text-[#3D2B1F]/40 border border-[#3D2B1F]/10 cursor-not-allowed'
                        }`}
                      >
                        {lovePoints >= coupon.cost ? 'Buy & Redeem Coupon' : `Requires ${coupon.cost} Love Points`}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )                         }
      </div>
    </div>
  );
}
