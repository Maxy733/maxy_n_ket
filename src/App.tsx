/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  Camera, 
  Target, 
  MessageSquare, 
  Sparkles, 
  Music, 
  ChevronUp, 
  X, 
  Smile,
  ExternalLink
} from 'lucide-react';

import { GalleryItem, BucketItem, LoveMessage, Coupon, WallpaperOption } from './types';
import { 
  WALLPAPER_OPTIONS, 
  DEFAULT_GALLERY, 
  DEFAULT_BUCKET_LIST, 
  DEFAULT_MESSAGES, 
  DEFAULT_COUPONS 
} from './data';

import HomeCounter from './components/HomeCounter';
import MemoryGallery from './components/MemoryGallery';
import BucketList from './components/BucketList';
import LoveJar from './components/LoveJar';
import SparkGame from './components/SparkGame';

const SPOTIFY_PLAYLIST_STORAGE_KEY = 'maxy_ket_spotify_playlist_url';

const getSpotifyEmbedUrl = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return '';

  if (trimmedValue.includes('open.spotify.com/embed/')) {
    return trimmedValue;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    if (parsedUrl.hostname.includes('open.spotify.com')) {
      const parts = parsedUrl.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        const [resourceType, resourceId] = parts;
        return `https://open.spotify.com/embed/${resourceType}/${resourceId}?utm_source=generator`;
      }
    }
  } catch {
    const spotifyUriMatch = trimmedValue.match(/^spotify:(playlist|track|album):([A-Za-z0-9]+)$/i);
    if (spotifyUriMatch) {
      const [, resourceType, resourceId] = spotifyUriMatch;
      return `https://open.spotify.com/embed/${resourceType.toLowerCase()}/${resourceId}?utm_source=generator`;
    }
  }

  return '';
};

const getSpotifyOpenUrl = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return '';

  if (trimmedValue.includes('open.spotify.com/embed/')) {
    return trimmedValue.replace('/embed/', '/');
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    if (parsedUrl.hostname.includes('open.spotify.com')) {
      return trimmedValue;
    }
  } catch {
    const spotifyUriMatch = trimmedValue.match(/^spotify:(playlist|track|album):([A-Za-z0-9]+)$/i);
    if (spotifyUriMatch) {
      const [, resourceType, resourceId] = spotifyUriMatch;
      return `https://open.spotify.com/${resourceType.toLowerCase()}/${resourceId}`;
    }
  }

  return '';
};

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [anniversaryDate, setAnniversaryDate] = useState<string>(() => {
    const saved = localStorage.getItem('maxy_ket_anniv');
    if (!saved || saved === '2023-05-20') {
      return '2024-07-08';
    }
    return saved;
  });

  const [maxyNickname, setMaxyNickname] = useState<string>(() => {
    return localStorage.getItem('maxy_ket_nick1') || 'Maxy';
  });

  const [ketNickname, setKetNickname] = useState<string>(() => {
    return localStorage.getItem('maxy_ket_nick2') || 'Ket';
  });

  const [wallpaper, setWallpaper] = useState<WallpaperOption>(() => {
    const saved = localStorage.getItem('maxy_ket_wp');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return WALLPAPER_OPTIONS[0];
      }
    }
    return WALLPAPER_OPTIONS[0];
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('maxy_ket_gallery');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_GALLERY;
      }
    }
    return DEFAULT_GALLERY;
  });

  const [bucketList, setBucketList] = useState<BucketItem[]>(() => {
    const saved = localStorage.getItem('maxy_ket_bucket');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_BUCKET_LIST;
      }
    }
    return DEFAULT_BUCKET_LIST;
  });

  const [messages, setMessages] = useState<LoveMessage[]>(() => {
    const saved = localStorage.getItem('maxy_ket_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_MESSAGES;
      }
    }
    return DEFAULT_MESSAGES;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('maxy_ket_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_COUPONS;
      }
    }
    return DEFAULT_COUPONS;
  });

  const [lovePoints, setLovePoints] = useState<number>(() => {
    const saved = localStorage.getItem('maxy_ket_points');
    return saved ? parseInt(saved, 10) : 350; // default initial points
  });

  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState<string>(() => {
    return localStorage.getItem(SPOTIFY_PLAYLIST_STORAGE_KEY) || '';
  });

  // --- UI Layout states ---
  const [activeAnchor, setActiveAnchor] = useState('home-section');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  // Syncing states to LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_anniv', anniversaryDate);
    } catch (err) {
      console.warn('Failed to save anniversaryDate to localStorage:', err);
    }
  }, [anniversaryDate]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_nick1', maxyNickname);
    } catch (err) {
      console.warn('Failed to save maxyNickname to localStorage:', err);
    }
  }, [maxyNickname]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_nick2', ketNickname);
    } catch (err) {
      console.warn('Failed to save ketNickname to localStorage:', err);
    }
  }, [ketNickname]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_wp', JSON.stringify(wallpaper));
    } catch (err) {
      console.warn('Failed to save wallpaper to localStorage:', err);
    }
  }, [wallpaper]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_gallery', JSON.stringify(gallery));
    } catch (err) {
      console.warn('Failed to save gallery to localStorage:', err);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_bucket', JSON.stringify(bucketList));
    } catch (err) {
      console.warn('Failed to save bucketList to localStorage:', err);
    }
  }, [bucketList]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_messages', JSON.stringify(messages));
    } catch (err) {
      console.warn('Failed to save messages to localStorage:', err);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_coupons', JSON.stringify(coupons));
    } catch (err) {
      console.warn('Failed to save coupons to localStorage:', err);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('maxy_ket_points', lovePoints.toString());
    } catch (err) {
      console.warn('Failed to save lovePoints to localStorage:', err);
    }
  }, [lovePoints]);

  useEffect(() => {
    try {
      localStorage.setItem(SPOTIFY_PLAYLIST_STORAGE_KEY, spotifyPlaylistUrl);
    } catch (err) {
      console.warn('Failed to save spotifyPlaylistUrl to localStorage:', err);
    }
  }, [spotifyPlaylistUrl]);

  // Handle active navigation highlighting on scroll
  useEffect(() => {
    const sections = ['home-section', 'gallery-section', 'bucket-section', 'love-jar-section', 'game-section'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveAnchor(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Points helpers
  const addLovePoints = (pts: number) => {
    setLovePoints((prev) => prev + pts);
  };

  const spendLovePoints = (pts: number): boolean => {
    if (lovePoints < pts) return false;
    setLovePoints((prev) => prev - pts);
    return true;
  };

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveAnchor(id);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#FFF9F5] text-[#3D2B1F] font-sans selection:bg-rose-100 selection:text-rose-700 overflow-x-hidden">
      
      {/* BACKGROUND DOT GRID PATTERN */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3D2B1F 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      {/* ARTISTIC PASTEL GRADIENT CIRCLES */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-rose-100/40 to-orange-100/40 rounded-full mix-blend-multiply blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-gradient-to-tr from-blue-100/30 to-purple-100/30 rounded-full mix-blend-multiply blur-3xl pointer-events-none"></div>

      {/* FLOATING GLASSMORPHIC TOP MENU BAR */}
      <nav className="fixed top-4 inset-x-4 max-w-5xl mx-auto z-40 backdrop-blur-md bg-white/60 border border-white/40 rounded-full px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(61,43,31,0.04)]">
        {/* Logo / Nickname branding */}
        <div 
          onClick={() => handleNavClick('home-section')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <span className="font-serif italic text-base sm:text-lg font-bold pr-3 border-r border-[#3D2B1F]/10 text-[#3D2B1F]">
            {maxyNickname.substring(0, 1)}&{ketNickname.substring(0, 1)}
          </span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        {/* Anchor Nav Links */}
        <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto whitespace-nowrap no-scrollbar max-w-[calc(100%-70px)] sm:max-w-none py-1 select-none scroll-smooth">
          {[
            { id: 'home-section', label: 'Home', icon: Heart },
            { id: 'gallery-section', label: 'Gallery', icon: Camera },
            { id: 'bucket-section', label: 'Dreams', icon: Target },
            { id: 'love-jar-section', label: 'Love Jar', icon: MessageSquare },
            { id: 'game-section', label: 'Sparks', icon: Sparkles }
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeAnchor === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => handleNavClick(nav.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-all shrink-0 ${
                  isActive 
                    ? 'text-rose-500 font-extrabold bg-rose-50' 
                    : 'text-[#3D2B1F]/50 hover:text-[#3D2B1F]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 hidden sm:inline" />
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* RENDER MASTER SECTIONS IN SINGLE-SCREEN FLOW */}
      <main className="flex-1 w-full">
        {/* Section 1: Home Wallpaper & Counter */}
        <HomeCounter 
          anniversaryDate={anniversaryDate}
          setAnniversaryDate={setAnniversaryDate}
          maxyNickname={maxyNickname}
          setMaxyNickname={setMaxyNickname}
          ketNickname={ketNickname}
          setKetNickname={setKetNickname}
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
          wallpapers={WALLPAPER_OPTIONS}
          lovePoints={lovePoints}
          setLovePoints={setLovePoints}
          addLovePoints={addLovePoints}
          activeAnchor={activeAnchor}
        />

        {/* Section 2: Memory Gallery */}
        <MemoryGallery 
          gallery={gallery}
          setGallery={setGallery}
          addLovePoints={addLovePoints}
        />

        {/* Section 3: Couple Bucket List */}
        <BucketList 
          bucketList={bucketList}
          setBucketList={setBucketList}
          addLovePoints={addLovePoints}
        />

        {/* Section 4: Love Notes Wall & Coupons Shop */}
        <LoveJar 
          messages={messages}
          setMessages={setMessages}
          coupons={coupons}
          setCoupons={setCoupons}
          lovePoints={lovePoints}
          spendLovePoints={spendLovePoints}
          addLovePoints={addLovePoints}
        />

        {/* Section 5: Daily Sparks Mini Game */}
        <SparkGame 
          lovePoints={lovePoints}
          addLovePoints={addLovePoints}
        />
      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full py-12 bg-[#FFF9F5] border-t border-[#3D2B1F]/10 text-center text-xs text-[#3D2B1F]/60">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span>Made with forever love by</span>
            <strong className="text-[#3D2B1F] font-semibold italic font-serif">{maxyNickname} & {ketNickname}</strong>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <div>
            <span className="italic font-serif">© 2026 Maxy & Ket. Our digital love nest.</span>
          </div>
        </div>
      </footer>

      {/* COMPACT FLOATING COUPLES' MUSIC PLAYER */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!showMusicPlayer ? (
            /* Closed Floating Button */
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setShowMusicPlayer(true)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-rose-500 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(61,43,31,0.08)] hover:scale-110 cursor-pointer transition-all border border-[#3D2B1F]/10"
              title="Open our song player"
            >
              <Music className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          ) : (
            /* Expanded Glassmorphic Music Player */
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="backdrop-blur-md bg-white/95 border border-[#3D2B1F]/10 rounded-3xl p-5 w-[92vw] max-w-sm sm:max-w-md shadow-[0_20px_50px_rgba(61,43,31,0.1)] relative text-[#3D2B1F]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowMusicPlayer(false)}
                className="absolute top-4 right-4 p-1 text-[#3D2B1F]/40 hover:text-[#3D2B1F] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-2 mb-3 pr-7">
                <Music className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-rose-500">Our Shared Spotify Playlist</span>
              </div>

              <div className="bg-[#FFF9F5] border border-[#3D2B1F]/10 rounded-2xl p-3 mb-3">
                <p className="text-[#3D2B1F]/70 text-xs leading-5">
                  Paste your shared Spotify playlist link below. The card will convert it into an embedded player.
                </p>
                <input
                  type="url"
                  value={spotifyPlaylistUrl}
                  onChange={(event) => setSpotifyPlaylistUrl(event.target.value)}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="mt-3 w-full rounded-xl border border-[#3D2B1F]/10 bg-white px-3 py-2 text-sm text-[#3D2B1F] placeholder:text-[#3D2B1F]/35 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              {getSpotifyEmbedUrl(spotifyPlaylistUrl) ? (
                <div className="overflow-hidden rounded-2xl border border-[#3D2B1F]/10 bg-black/5 shadow-inner">
                  <iframe
                    title="Our shared Spotify playlist"
                    src={getSpotifyEmbedUrl(spotifyPlaylistUrl)}
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="block"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#3D2B1F]/15 bg-[#FFF9F5] px-4 py-8 text-center">
                  <p className="text-sm font-medium text-[#3D2B1F]">No playlist loaded yet.</p>
                  <p className="mt-1 text-xs text-[#3D2B1F]/60">Add the Spotify shared playlist URL above to bring the player to life.</p>
                </div>
              )}

              {getSpotifyOpenUrl(spotifyPlaylistUrl) && (
                <a
                  href={getSpotifyOpenUrl(spotifyPlaylistUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-400"
                >
                  Open in Spotify
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
