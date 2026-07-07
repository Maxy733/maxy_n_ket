import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Calendar, Settings, Image as ImageIcon, Sparkles, User, RefreshCw, ChevronDown, Upload } from 'lucide-react';
import { WallpaperOption } from '../types';

interface HomeCounterProps {
  anniversaryDate: string;
  setAnniversaryDate: (date: string) => void;
  maxyNickname: string;
  setMaxyNickname: (name: string) => void;
  ketNickname: string;
  setKetNickname: (name: string) => void;
  wallpaper: WallpaperOption;
  setWallpaper: (wp: WallpaperOption) => void;
  wallpapers: WallpaperOption[];
  lovePoints: number;
  setLovePoints: (pts: number) => void;
  addLovePoints: (pts: number) => void;
  activeAnchor: string;
}

export default function HomeCounter({
  anniversaryDate,
  setAnniversaryDate,
  maxyNickname,
  setMaxyNickname,
  ketNickname,
  setKetNickname,
  wallpaper,
  setWallpaper,
  wallpapers,
  lovePoints,
  setLovePoints,
  addLovePoints,
  activeAnchor,
}: HomeCounterProps) {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [heartScale, setHeartScale] = useState(1);
  const [anniversaryCountdown, setAnniversaryCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [tempPoints, setTempPoints] = useState('');

  const handlePointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(tempPoints, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setLovePoints(parsed);
    }
    setIsEditingPoints(false);
  };

  const [isWallpaperDragging, setIsWallpaperDragging] = useState(false);
  const wallpaperFileInputRef = useRef<HTMLInputElement>(null);

  const processWallpaperFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          // Downscale the wallpaper to a reasonable resolution suitable for screens and local storage limits
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 720;
          
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const widthRatio = MAX_WIDTH / width;
            const heightRatio = MAX_HEIGHT / height;
            const bestRatio = Math.min(widthRatio, heightRatio);
            
            width = Math.round(width * bestRatio);
            height = Math.round(height * bestRatio);
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to JPEG with 0.7 quality to achieve great quality at ~60KB to ~120KB
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            setWallpaper({
              id: 'custom-local',
              name: 'Custom Upload 🎨',
              url: compressedBase64,
              credit: 'Uploaded from your device',
            });
          }
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWallpaperFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processWallpaperFile(e.target.files[0]);
    }
  };

  // Update real-time counter
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate);
      const now = new Date();
      let diffMs = now.getTime() - start.getTime();

      if (diffMs < 0) {
        // Future date, set all to 0
        setTimeElapsed({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 });
        return;
      }

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Calculate broken-down representation
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        months -= 1;
        // get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Calculate hours, mins, secs remaining in the current day relative to start time
      const startHours = start.getHours();
      const startMinutes = start.getMinutes();
      const startSeconds = start.getSeconds();

      let diffHours = hours - startHours;
      let diffMinutes = minutes - startMinutes;
      let diffSeconds = seconds - startSeconds;

      if (diffSeconds < 0) {
        diffSeconds += 60;
        diffMinutes -= 1;
      }
      if (diffMinutes < 0) {
        diffMinutes += 60;
        diffHours -= 1;
      }
      if (diffHours < 0) {
        diffHours += 24;
      }

      setTimeElapsed({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: diffHours,
        minutes: diffMinutes,
        seconds: diffSeconds,
        totalDays,
      });

      // Calculate countdown to next anniversary
      const nextAnniversary = new Date(start);
      nextAnniversary.setFullYear(now.getFullYear());
      if (nextAnniversary.getTime() < now.getTime()) {
        nextAnniversary.setFullYear(now.getFullYear() + 1);
      }

      const remainingMs = nextAnniversary.getTime() - now.getTime();
      setAnniversaryCountdown({
        days: Math.floor(remainingMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((remainingMs / (1000 * 60 * 60)) % 24),
        mins: Math.floor((remainingMs / (1000 * 60)) % 60),
        secs: Math.floor((remainingMs / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  // Click heart effect
  const handleHeartClick = () => {
    setHeartScale(1.4);
    setTimeout(() => setHeartScale(1), 200);
    addLovePoints(5); // give 5 love points on heart beats!
  };

  return (
    <div id="home-section" className="relative isolate w-full min-h-screen flex flex-col items-center justify-center text-[#3D2B1F] px-4 pt-24 pb-28 sm:pb-32 overflow-hidden">
      {/* Background Wallpaper */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out z-0"
        style={{
          backgroundImage: wallpaper.url ? `url(\"${wallpaper.url}\")` : 'none',
          backgroundColor: '#FFF9F5',
        }}
      />
      
      {/* Soft gradient overlay for typography readability with warm cream tones */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F5]/90 via-[#FFF9F5]/10 to-[#FFF9F5]/30 z-10 pointer-events-none" />

      {/* Floating Animated Sparkles for romantic touch in soft warm hues */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-rose-500/10 rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 7,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Content Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-30 w-full max-w-4xl text-center flex flex-col items-center justify-center"
      >
        {/* Nicknames Header */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
          <motion.h1 
            className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-semibold tracking-wide text-[#2A1D15]"
            whileHover={{ scale: 1.05 }}
          >
            {maxyNickname}
          </motion.h1>
          
          <motion.div
            className="relative cursor-pointer flex items-center justify-center"
            onClick={handleHeartClick}
            animate={{ scale: [heartScale, heartScale * 1.1, heartScale] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2 }}
            whileHover={{ scale: 1.2 }}
          >
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 fill-rose-500 filter drop-shadow-[0_4px_15px_rgba(244,63,94,0.3)]" />
            <span className="absolute text-[10px] font-bold text-white mt-1 select-none pointer-events-none">+5</span>
          </motion.div>

          <motion.h1 
            className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-semibold tracking-wide text-[#2A1D15]"
            whileHover={{ scale: 1.05 }}
          >
            {ketNickname}
          </motion.h1>
        </div>

        {/* Dynamic Status / Headline */}
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-rose-600 mb-10 text-center max-w-lg">
          Our Love Story is written in the stars
        </p>

        {/* Primary Counter Banner - Artistic White/Cream card */}
        <div className="backdrop-blur-md bg-white/70 border border-[#3D2B1F]/15 rounded-[32px] p-6 sm:p-10 w-full max-w-2xl shadow-[0_15px_45px_rgba(61,43,31,0.06)] flex flex-col items-center mb-8 relative overflow-hidden">
          {isEditingPoints ? (
            <form 
              onSubmit={handlePointsSubmit} 
              className="absolute top-0 right-0 p-2 flex items-center gap-1 bg-rose-50 rounded-bl-2xl border-l border-b border-[#3D2B1F]/10 z-10"
            >
              <input
                type="number"
                min="0"
                value={tempPoints}
                onChange={(e) => setTempPoints(e.target.value)}
                className="w-16 bg-white border border-rose-200 rounded px-1.5 py-0.5 text-xs text-rose-800 font-bold focus:outline-none"
                autoFocus
                onBlur={() => {
                  // Wait a brief moment to allow button submit click if clicked, otherwise close
                  setTimeout(() => setIsEditingPoints(false), 200);
                }}
              />
              <button 
                type="submit" 
                className="text-emerald-600 hover:text-emerald-700 font-bold text-xs px-1.5 py-0.5 hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                title="Save"
              >
                ✓
              </button>
            </form>
          ) : (
            <button 
              onClick={() => {
                setTempPoints(lovePoints.toString());
                setIsEditingPoints(true);
              }}
              className="absolute top-0 right-0 p-3 flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100/80 text-rose-700 rounded-bl-2xl border-l border-b border-[#3D2B1F]/10 text-xs font-bold cursor-pointer transition-all hover:scale-105"
              title="Click to edit love points"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>{lovePoints} Love Points</span>
            </button>
          )}

          <p className="text-xs font-extrabold tracking-widest text-rose-500 uppercase mb-4">
            Total Days of Togetherness
          </p>

          <div className="text-7xl sm:text-8xl font-serif font-black text-[#2A1D15] mb-2 tracking-tight">
            {timeElapsed.totalDays}
          </div>

          <p className="text-sm sm:text-base text-[#3D2B1F]/80 font-light italic mb-8">
            ...and counting every single beautiful moment
          </p>

          {/* Broken-down detailed units */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 w-full">
            {[
              { label: 'Years', val: timeElapsed.years },
              { label: 'Months', val: timeElapsed.months },
              { label: 'Days', val: timeElapsed.days },
              { label: 'Hours', val: timeElapsed.hours },
              { label: 'Mins', val: timeElapsed.minutes },
              { label: 'Secs', val: timeElapsed.seconds },
            ].map((unit, idx) => (
              <div 
                key={unit.label} 
                className="bg-white/80 border border-[#3D2B1F]/10 rounded-2xl py-3 px-2 flex flex-col items-center justify-center transition-all hover:bg-white/10 shadow-[0_4px_12px_rgba(61,43,31,0.02)]"
              >
                <div className="text-xl sm:text-2xl font-serif font-bold text-rose-600">
                  {unit.val}
                </div>
                <div className="text-[10px] sm:text-xs font-extrabold tracking-wider uppercase text-[#3D2B1F]/50 mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Small Floating Anniversary / Quick Settings */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-light text-[#3D2B1F]/70 mb-4">
          <div className="flex items-center gap-2 bg-white/60 border border-[#3D2B1F]/10 rounded-full px-4 py-2 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>Since: <strong className="font-bold text-[#2A1D15]">{new Date(anniversaryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
          </div>

          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 bg-white/60 hover:bg-rose-50 hover:text-rose-700 border border-[#3D2B1F]/10 rounded-full px-4 py-2 cursor-pointer transition-all shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-rose-500 animate-spin-hover" />
            <span className="font-semibold">Customize</span>
          </button>
        </div>

      </motion.div>

      {/* Floating Anniversary Countdown Taskbar at Home Page Bottom */}
      <AnimatePresence>
        {activeAnchor === 'home-section' && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed bottom-20 sm:bottom-8 left-1/2 z-45 bg-rose-50/95 hover:bg-white backdrop-blur-md border border-rose-200/60 rounded-full px-5 py-2.5 shadow-[0_10px_35px_rgba(244,63,94,0.12)] flex items-center gap-3 text-xs text-rose-900 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-sans">
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
              <span className="font-extrabold uppercase tracking-widest text-[9px] text-rose-700 select-none">Next Anniversary:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-rose-600 bg-white/90 px-3.5 py-1 rounded-full border border-rose-100 shadow-sm">
              <span className="tabular-nums">{anniversaryCountdown.days}d</span>
              <span className="text-rose-300">:</span>
              <span className="tabular-nums">{anniversaryCountdown.hours}h</span>
              <span className="text-rose-300">:</span>
              <span className="tabular-nums">{anniversaryCountdown.mins}m</span>
              <span className="text-rose-300">:</span>
              <span className="tabular-nums">{anniversaryCountdown.secs}s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bounce scroll down indicator */}
      <div className="absolute bottom-2 sm:bottom-3 z-30 flex flex-col items-center opacity-70 pointer-events-none">
        <span className="text-[10px] tracking-[0.3em] uppercase mb-1 font-extrabold text-[#3D2B1F]/40">Explore Our Memories</span>
        <ChevronDown className="w-4 h-4 text-[#3D2B1F]/60 animate-bounce" />
      </div>

      {/* Settings Modal Side-Drawer */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop with minimal opacity and NO blur so the home page wallpaper remains perfectly visible and changes live */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-[#3D2B1F]/15"
            />
            
            {/* True sliding drawer container from right edge */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-[#FFF9F5] border-l border-[#3D2B1F]/15 p-6 sm:p-8 shadow-[0_0_50px_rgba(61,43,31,0.15)] overflow-y-auto text-[#3D2B1F] flex flex-col justify-between"
            >
              <h3 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2 text-rose-600">
                <Settings className="w-6 h-6 text-rose-500" />
                Customize Our Space
              </h3>
              <p className="text-xs text-[#3D2B1F]/60 mb-6">
                Your configurations are instantly saved in your local web browser, personalizing this love nest.
              </p>

              {/* Nicknames inputs */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-rose-500" />
                      Nickname 1
                    </label>
                    <input 
                      type="text" 
                      value={maxyNickname}
                      onChange={(e) => setMaxyNickname(e.target.value)}
                      className="w-full bg-white border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-rose-500" />
                      Nickname 2
                    </label>
                    <input 
                      type="text" 
                      value={ketNickname}
                      onChange={(e) => setKetNickname(e.target.value)}
                      className="w-full bg-white border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Anniversary Datepicker */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    Anniversary Start Date
                  </label>
                  <input 
                    type="date" 
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    className="w-full bg-white border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Love Points Input */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    Love Points
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={lovePoints}
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value, 10);
                      if (!isNaN(parsed) && parsed >= 0) {
                        setLovePoints(parsed);
                      } else if (e.target.value === '') {
                        setLovePoints(0);
                      }
                    }}
                    className="w-full bg-white border border-[#3D2B1F]/15 rounded-xl px-3 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Theme Wallpaper Selector */}
              <div className="mb-8">
                <label className="block text-[11px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                  Select Wallpaper Background
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {wallpapers.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => setWallpaper(wp)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        wallpaper.id === wp.id ? 'border-rose-500 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {wp.id === 'none' ? (
                        <div className="w-full h-full bg-linear-to-br from-[#FFF9F5] to-white flex items-center justify-center border border-[#3D2B1F]/10">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/55">No Image</span>
                        </div>
                      ) : (
                        <img 
                          src={wp.url} 
                          alt={wp.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-[#3D2B1F]/85 py-1 text-[10px] font-bold text-center text-white truncate">
                        {wp.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Upload custom wallpaper from local storage */}
                <div className="mt-4">
                  <label className="block text-[11px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-rose-500" />
                    Or Upload Custom Wallpaper
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsWallpaperDragging(true); }}
                    onDragLeave={() => setIsWallpaperDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsWallpaperDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        processWallpaperFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => wallpaperFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[100px] ${
                      isWallpaperDragging
                        ? 'border-rose-500 bg-rose-50/40'
                        : wallpaper.id === 'custom-local'
                        ? 'border-emerald-300 bg-emerald-50/10 animate-pulse'
                        : 'border-[#3D2B1F]/15 hover:border-rose-300 hover:bg-rose-50/10'
                    }`}
                  >
                    <input
                      type="file"
                      ref={wallpaperFileInputRef}
                      onChange={handleWallpaperFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {wallpaper.id === 'custom-local' ? (
                      <div className="relative flex flex-col items-center">
                        <img 
                          src={wallpaper.url} 
                          alt="Custom Wallpaper Preview" 
                          className="w-16 h-10 rounded-lg object-cover shadow-sm mb-1.5 border border-white"
                        />
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">✓ Custom Wallpaper Active</span>
                        <span className="text-[9px] text-[#3D2B1F]/50 mt-0.5">Click or drag here to swap image</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-[#3D2B1F]/30 mb-1" />
                        <span className="text-xs font-bold text-[#3D2B1F]/70">Drag & Drop wallpaper file here</span>
                        <span className="text-[9px] text-[#3D2B1F]/50">or click to browse local files</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer transition-all w-full text-center"
                >
                  Save & Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
