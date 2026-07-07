import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Edit3,
  Heart, 
  Search, 
  X, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { GalleryItem } from '../types';

interface MemoryGalleryProps {
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  addLovePoints: (pts: number) => void;
}

const CATEGORY_LABELS = {
  travel: '✈️ Travel',
  food: '🍔 Food',
  cozy: '☕ Cozy',
  adventure: '🔥 Adventure'
};

const CATEGORY_COLORS = {
  travel: 'text-sky-700 bg-sky-50 border-sky-200/50',
  food: 'text-amber-800 bg-amber-50 border-amber-200/50',
  cozy: 'text-purple-700 bg-purple-50 border-purple-200/50',
  adventure: 'text-rose-700 bg-rose-50 border-rose-200/50'
};

// Preset beautiful couple/adventure photos for instant seeding
const PHOTO_PRESETS = [
  {
    title: 'Parisian Dream 🥐',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
    caption: 'Dreaming of our future getaway to the city of lights and cozy morning bakeries.',
    category: 'travel' as const
  },
  {
    title: 'Campfire Cocoa ☕',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    caption: 'Warm mugs, a crackling wooden fireplace, and your head resting on my shoulder.',
    category: 'cozy' as const
  },
  {
    title: 'Gelato Date 🍦',
    url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop',
    caption: 'Sticky fingers, sweet smiles, and stealing bites of each other\'s scoops.',
    category: 'food' as const
  },
  {
    title: 'Mountain Ascent ⛰️',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    caption: 'Conquering the steep peaks together, breathless from the view and our laughter.',
    category: 'adventure' as const
  }
];

export default function MemoryGallery({ gallery, setGallery, addLovePoints }: MemoryGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'travel' | 'food' | 'cozy' | 'adventure'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<'travel' | 'food' | 'cozy' | 'adventure'>('cozy');
  const [newUrl, setNewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Editing state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState<'travel' | 'food' | 'cozy' | 'adventure'>('cozy');
  const [editUrl, setEditUrl] = useState('');
  const [isEditDragging, setIsEditDragging] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening lightbox
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCaption(item.caption);
    setEditDate(item.date);
    setEditCategory(item.category);
    setEditUrl(item.url);
  };

  const processEditFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64Url = e.target.result as string;
        setEditUrl(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processEditFile(e.target.files[0]);
    }
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const finalUrl = editUrl.trim();
    if (!editTitle.trim() || !editCaption.trim() || !editDate || !finalUrl) {
      alert('Please fill out all fields and provide or upload a photo!');
      return;
    }

    const updatedGallery = gallery.map((item) => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          title: editTitle.trim(),
          caption: editCaption.trim(),
          date: editDate,
          url: finalUrl,
          category: editCategory
        };
      }
      return item;
    });

    setGallery(updatedGallery);
    setEditingItem(null);
  };

  // Loved Photos Tracking
  const [lovedPhotos, setLovedPhotos] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('maxy_ket_loved_photos');
    return saved ? JSON.parse(saved) : {};
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Sort Gallery Items
  const filteredGallery = gallery
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.caption.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first

  // Handle local image file reading
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64Url = e.target.result as string;
        setUploadPreview(base64Url);
        setNewUrl(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = newUrl.trim();
    if (!newTitle.trim() || !newCaption.trim() || !newDate || !finalUrl) {
      alert('Please fill out all fields and provide or upload a photo!');
      return;
    }

    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      caption: newCaption.trim(),
      date: newDate,
      url: finalUrl,
      category: newCategory
    };

    setGallery([newItem, ...gallery]);
    addLovePoints(20); // Award 20 Love Points for saving a memory card!

    // Reset Form
    setNewTitle('');
    setNewCaption('');
    setNewDate('');
    setNewCategory('cozy');
    setNewUrl('');
    setUploadPreview(null);
    setShowAddForm(false);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening lightbox
    if (confirm('Are you sure you want to remove this sweet photo from your gallery?')) {
      setGallery(gallery.filter((item) => item.id !== id));
      // Clean love state
      const updatedLoves = { ...lovedPhotos };
      delete updatedLoves[id];
      setLovedPhotos(updatedLoves);
      localStorage.setItem('maxy_ket_loved_photos', JSON.stringify(updatedLoves));
    }
  };

  const toggleLovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...lovedPhotos, [id]: !lovedPhotos[id] };
    setLovedPhotos(updated);
    localStorage.setItem('maxy_ket_loved_photos', JSON.stringify(updated));
    if (updated[id]) {
      addLovePoints(5); // Small reward for reacting!
    }
  };

  const selectPreset = (preset: typeof PHOTO_PRESETS[0]) => {
    setNewTitle(preset.title);
    setNewCaption(preset.caption);
    setNewCategory(preset.category);
    setNewUrl(preset.url);
    setUploadPreview(preset.url);
  };

  const clearUpload = () => {
    setNewUrl('');
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Lightbox Navigation
  const handlePrevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === null || prev === 0 ? filteredGallery.length - 1 : prev - 1));
    }
  };

  const handleNextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === null || prev === filteredGallery.length - 1 ? 0 : prev + 1));
    }
  };

  // Photo Counter Stats
  const photosCount = gallery.length;
  const travelCount = gallery.filter(i => i.category === 'travel').length;
  const cozyCount = gallery.filter(i => i.category === 'cozy').length;
  const adventureCount = gallery.filter(i => i.category === 'adventure').length;

  return (
    <div id="gallery-section" className="w-full py-20 px-4 md:px-8 bg-transparent">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-rose-50 rounded-full border border-rose-200/60 text-rose-500 mb-4"
          >
            <Camera className="w-6 h-6" />
          </motion.div>
          <h2 className="font-serif italic text-3xl sm:text-5xl font-bold text-[#2A1D15] mb-3">Our Love Gallery</h2>
          <p className="text-sm sm:text-base text-[#3D2B1F]/70 max-w-lg mx-auto font-light">
            Capturing our candid snapshots, warm weekend getaways, food escapades, and timeless milestones.
          </p>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Memories', count: photosCount, color: 'text-rose-600 bg-rose-50/50' },
            { label: 'Travel Snaps', count: travelCount, color: 'text-sky-600 bg-sky-50/50' },
            { label: 'Cozy Frames', count: cozyCount, color: 'text-purple-600 bg-purple-50/50' },
            { label: 'Adventures', count: adventureCount, color: 'text-rose-700 bg-rose-50/50' }
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-2xl border border-[#3D2B1F]/5 text-center shadow-[0_4px_12px_rgba(61,43,31,0.01)] ${stat.color}`}>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-1">{stat.label}</div>
              <div className="font-serif italic text-2xl font-extrabold">{stat.count}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white/70 border border-[#3D2B1F]/10 rounded-[32px] p-4 sm:p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-[0_10px_30px_rgba(61,43,31,0.03)]">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#3D2B1F]/40" />
            <input 
              type="text" 
              placeholder="Search snapshots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFF9F5]/80 border border-[#3D2B1F]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-rose-300"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center justify-center w-full md:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-[#FFF9F5]/80 text-[#3D2B1F]/60 border border-[#3D2B1F]/10 hover:text-[#3D2B1F]'
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === key
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-[#FFF9F5]/80 text-[#3D2B1F]/60 border border-[#3D2B1F]/10 hover:text-[#3D2B1F]'
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full md:w-auto bg-[#FFF9F5]/80 hover:bg-rose-50 text-[#3D2B1F] text-xs font-bold px-5 py-2.5 rounded-full flex items-center justify-center gap-2 border border-[#3D2B1F]/10 shadow-sm cursor-pointer transition-all shrink-0"
          >
            <Upload className="w-4 h-4 text-rose-500" />
            <span>Save Photo (+20 XP)</span>
          </button>
        </div>

        {/* Collapsible Add Photo Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <form onSubmit={handleAddPhoto} className="bg-white border border-[#3D2B1F]/15 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A1D15] flex items-center gap-2 mb-1">
                    <Camera className="w-4.5 h-4.5 text-rose-500" />
                    Archive a Sweet Memory Frame
                  </h3>
                  <p className="text-xs text-[#3D2B1F]/60">Save a direct photo URL or upload a file from your device!</p>
                </div>

                {/* Instant Presets for easy testing */}
                <div className="bg-[#FFF9F5] p-4 rounded-2xl border border-[#3D2B1F]/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#3D2B1F]/50 mb-2">
                    🌟 Test with one of our aesthetic couple presets:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PHOTO_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectPreset(preset)}
                        className="text-left p-1.5 rounded-xl border border-[#3D2B1F]/10 hover:border-rose-300 hover:bg-white text-xs flex items-center gap-2 transition-all cursor-pointer bg-white/50"
                      >
                        <img src={preset.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <span className="truncate font-semibold text-[#3D2B1F]/80">{preset.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Uploader + URL input container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Upload drag and drop */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px] ${
                      isDragging 
                        ? 'border-rose-500 bg-rose-50/40' 
                        : uploadPreview 
                        ? 'border-emerald-300 bg-emerald-50/20' 
                        : 'border-[#3D2B1F]/15 hover:border-rose-300 hover:bg-rose-50/10'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {uploadPreview ? (
                      <div className="relative flex flex-col items-center">
                        <img src={uploadPreview} alt="Preview" className="w-24 h-24 rounded-xl object-cover shadow-md mb-2 border border-white" />
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">✓ Photo Loaded</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); clearUpload(); }}
                          className="text-[10px] text-rose-500 hover:underline mt-1 font-bold"
                        >
                          Clear Photo
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-[#3D2B1F]/30 mb-2 group-hover:text-rose-500 transition-colors" />
                        <span className="text-xs font-bold text-[#3D2B1F]/70">Drag & Drop photo here</span>
                        <span className="text-[10px] text-[#3D2B1F]/50 mt-1">or click to choose local file</span>
                      </div>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                        OR Photo URL
                      </label>
                      <input 
                        type="url" 
                        placeholder="https://images.unsplash.com/... or paste link"
                        value={newUrl}
                        onChange={(e) => {
                          setNewUrl(e.target.value);
                          setUploadPreview(e.target.value || null);
                        }}
                        className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                          Date Captured
                        </label>
                        <input 
                          type="date" 
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          required
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                          Category
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        >
                          <option value="cozy">☕ Cozy Time</option>
                          <option value="travel">✈️ Travel</option>
                          <option value="food">🍔 Food & Cafes</option>
                          <option value="adventure">🔥 Adventure</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                      Photo Frame Title
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Picnic in Botanical Gardens"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                      Caption / Short Diary Note
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ket brought the cutest strawberries, Maxy forgot the blanket..."
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                      required
                      className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D2B1F]/5">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-[#FFF9F5] hover:bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F] font-bold text-xs px-4 py-2.5 rounded-full cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Post Photo (+20 XP)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Grid */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-[32px] border border-[#3D2B1F]/15 text-[#3D2B1F]/60 shadow-sm">
            <ImageIcon className="w-12 h-12 text-[#3D2B1F]/20 mx-auto mb-3" />
            <p className="text-sm font-semibold mb-1">No sweet snapshots saved here yet.</p>
            <p className="text-xs text-[#3D2B1F]/50">Click 'Save Photo' above to start pinning your memory polaroids!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredGallery.map((item, index) => {
              const isLoved = !!lovedPhotos[item.id];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
                  onClick={() => setLightboxIndex(index)}
                  className="group bg-white rounded-[24px] overflow-hidden border border-[#3D2B1F]/10 shadow-[0_8px_20px_rgba(61,43,31,0.02)] hover:shadow-[0_15px_35px_rgba(61,43,31,0.06)] hover:border-rose-200 cursor-pointer transition-all flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-rose-50/20">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay Action Buttons */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* React/Love Button */}
                      <button
                        onClick={(e) => toggleLovePhoto(item.id, e)}
                        className={`p-2 rounded-full backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
                          isLoved 
                            ? 'bg-rose-500/90 border-rose-400 text-white' 
                            : 'bg-white/80 border-[#3D2B1F]/10 text-rose-500 hover:bg-white hover:scale-110'
                        }`}
                        title={isLoved ? 'Loved!' : 'Love this snap'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLoved ? 'fill-white text-white' : 'fill-none'}`} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={(e) => startEditing(item, e)}
                        className="p-2 bg-white/80 hover:bg-rose-50 rounded-full backdrop-blur-md border border-[#3D2B1F]/10 text-[#3D2B1F]/50 hover:text-amber-600 hover:scale-110 shadow-sm transition-all cursor-pointer"
                        title="Edit memory card"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeletePhoto(item.id, e)}
                        className="p-2 bg-white/80 hover:bg-rose-50 rounded-full backdrop-blur-md border border-[#3D2B1F]/10 text-[#3D2B1F]/50 hover:text-rose-600 hover:scale-110 shadow-sm transition-all cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Category Label */}
                    <span className={`absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${CATEGORY_COLORS[item.category]}`}>
                      {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>

                  {/* Caption & Metadata Container */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#3D2B1F]/50 font-bold mb-1.5 uppercase">
                      <Calendar className="w-3 h-3 text-rose-500/80" />
                      {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#2A1D15] group-hover:text-rose-600 transition-colors mb-1 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#3D2B1F]/70 leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full-Screen Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#2A1D15]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Lightbox Header Controls */}
              <div className="w-full flex justify-between items-center max-w-5xl mx-auto text-white">
                <div className="flex items-center gap-2">
                  <Camera className="w-4.5 h-4.5 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
                    Photo {lightboxIndex + 1} of {filteredGallery.length}
                  </span>
                </div>
                
                <button 
                  onClick={() => setLightboxIndex(null)}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer border border-white/10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Main Slider Area */}
              <div className="flex-1 w-full flex items-center justify-center relative my-4">
                {/* Left Arrow */}
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevLightbox(); }}
                  className="absolute left-2 sm:left-6 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/10 rounded-full text-white cursor-pointer transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Lightbox Image Container */}
                <div 
                  className="max-w-4xl max-h-[65vh] md:max-h-[70vh] flex flex-col items-center justify-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img 
                    key={lightboxIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    src={filteredGallery[lightboxIndex].url} 
                    alt={filteredGallery[lightboxIndex].title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl border border-white/15"
                  />
                </div>

                {/* Right Arrow */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextLightbox(); }}
                  className="absolute right-2 sm:right-6 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/10 rounded-full text-white cursor-pointer transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Footer Details */}
              <div 
                className="w-full max-w-2xl mx-auto bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 text-white text-center mb-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-rose-300 uppercase mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(filteredGallery[lightboxIndex].date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  <span className="mx-1.5">•</span>
                  <span>{CATEGORY_LABELS[filteredGallery[lightboxIndex].category]}</span>
                </div>

                <h3 className="font-serif italic text-xl sm:text-2xl font-bold mb-1 text-white">
                  {filteredGallery[lightboxIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-50/80 leading-relaxed font-light">
                  "{filteredGallery[lightboxIndex].caption}"
                </p>

                {/* Small Love button inside lightbox too */}
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={(e) => toggleLovePhoto(filteredGallery[lightboxIndex].id, e)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer ${
                      lovedPhotos[filteredGallery[lightboxIndex].id]
                        ? 'bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-950/20'
                        : 'bg-white/10 border-white/10 hover:bg-white/20 text-rose-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${lovedPhotos[filteredGallery[lightboxIndex].id] ? 'fill-white text-white' : 'fill-none'}`} />
                    <span>{lovedPhotos[filteredGallery[lightboxIndex].id] ? 'Loved Frame!' : 'React Love'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      startEditing(filteredGallery[lightboxIndex], e);
                      setLightboxIndex(null);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border bg-white/10 border-white/10 hover:bg-white/20 text-amber-300 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Photo</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Photo Modal */}
        <AnimatePresence>
          {editingItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#2A1D15]/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setEditingItem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-[#3D2B1F]/15 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2A1D15] flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-rose-500" />
                      Edit Saved Memory Card
                    </h3>
                    <p className="text-xs text-[#3D2B1F]/60 mt-1">
                      Modify details or upload a new photo from local storage.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="p-1.5 bg-[#FFF9F5] hover:bg-rose-50 border border-[#3D2B1F]/10 rounded-full transition-colors cursor-pointer text-[#3D2B1F]/50 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleUpdatePhoto} className="flex flex-col gap-6">
                  {/* File Upload / Image Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsEditDragging(true); }}
                      onDragLeave={() => setIsEditDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsEditDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          processEditFile(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => editFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px] ${
                        isEditDragging 
                          ? 'border-rose-500 bg-rose-50/40' 
                          : editUrl 
                          ? 'border-emerald-300 bg-emerald-50/10' 
                          : 'border-[#3D2B1F]/15 hover:border-rose-300 hover:bg-rose-50/10'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={editFileInputRef}
                        onChange={handleEditFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {editUrl ? (
                        <div className="relative flex flex-col items-center">
                          <img src={editUrl} alt="Preview" className="w-24 h-24 rounded-xl object-cover shadow-md mb-2 border border-white" />
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">✓ Photo Loaded</span>
                          <span className="text-[9px] text-[#3D2B1F]/50 mt-1">Click to swap local file</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-[#3D2B1F]/30 mb-2" />
                          <span className="text-xs font-bold text-[#3D2B1F]/70">Drag & Drop new photo here</span>
                          <span className="text-[10px] text-[#3D2B1F]/50 mt-1">or click to choose local file</span>
                        </div>
                      )}
                    </div>

                    {/* Image URL fallback */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                          OR Photo URL
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://images.unsplash.com/..."
                          value={editUrl.startsWith('data:') ? '' : editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                        />
                        {editUrl.startsWith('data:') && (
                          <p className="text-[10px] text-emerald-800 font-semibold mt-1">
                            Using custom uploaded local image file
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                            Date Captured
                          </label>
                          <input 
                            type="date" 
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            required
                            className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                            Category
                          </label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value as any)}
                            className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                          >
                            <option value="cozy">☕ Cozy Time</option>
                            <option value="travel">✈️ Travel</option>
                            <option value="food">🍔 Food & Cafes</option>
                            <option value="adventure">🔥 Adventure</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                        Photo Frame Title
                      </label>
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3D2B1F]/60 uppercase tracking-wider mb-1">
                        Caption / Short Diary Note
                      </label>
                      <input 
                        type="text" 
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        required
                        className="w-full bg-[#FFF9F5] border border-[#3D2B1F]/15 rounded-xl px-3.5 py-2 text-sm text-[#3D2B1F] focus:outline-none focus:border-rose-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D2B1F]/5">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="bg-[#FFF9F5] hover:bg-[#3D2B1F]/5 border border-[#3D2B1F]/10 text-[#3D2B1F] font-bold text-xs px-4 py-2.5 rounded-full cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
