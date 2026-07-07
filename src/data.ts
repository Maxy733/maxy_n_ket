import { GalleryItem, BucketItem, LoveMessage, Coupon, WallpaperOption } from './types';

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: 'none',
    name: 'None',
    url: '',
    credit: 'No wallpaper image'
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1920&auto=format&fit=crop',
    credit: 'Unsplash / Warm holding hands'
  },
  {
    id: 'starlight-dreams',
    name: 'Starlight Dreams',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1920&auto=format&fit=crop',
    credit: 'Unsplash / Cozy golden hour'
  },
  {
    id: 'forest-whispers',
    name: 'Forest Whispers',
    url: 'https://images.unsplash.com/photo-1501901657866-51d42a34107e?q=80&w=1920&auto=format&fit=crop',
    credit: 'Unsplash / Serene walk together'
  },
  {
    id: 'lavender-sky',
    name: 'Lavender Fields',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1920&auto=format&fit=crop',
    credit: 'Unsplash / Pastel floral landscape'
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: '1',
    title: 'The First Spark ☕',
    caption: 'Where it all began. Talking for hours over iced lattes, accidentally spilling coffee, and discovering our shared love for books.',
    date: '2024-07-15',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    category: 'cozy'
  },
  {
    id: '2',
    title: 'Summer Road Trip 🚗',
    caption: 'Driving along the coast with wind in our hair, singing along to old acoustic songs, and watching the wild sunset.',
    date: '2024-08-20',
    url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=800&auto=format&fit=crop',
    category: 'travel'
  },
  {
    id: '3',
    title: 'Cooking Disaster! 🧁',
    caption: 'Attempting to bake a homemade chocolate souffle which collapsed gloriously, leading to us ordering a giant pizza instead!',
    date: '2024-11-05',
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
    category: 'food'
  },
  {
    id: '4',
    title: 'Starlight Campfire ✨',
    caption: 'Roasting marshmallows, wrapped in a single cozy blanket, whispering our big dreams under the quiet starry night.',
    date: '2025-01-18',
    url: 'https://images.unsplash.com/photo-1523685563539-df033d5ba4b9?q=80&w=800&auto=format&fit=crop',
    category: 'adventure'
  }
];

export const DEFAULT_BUCKET_LIST: BucketItem[] = [
  {
    id: 'b1',
    title: 'Witness the Northern Lights in Iceland 🌌',
    category: 'travel',
    completed: false
  },
  {
    id: 'b2',
    title: 'Take a professional couple baking class 🧁',
    category: 'food',
    completed: true,
    targetDate: '2024-03-10'
  },
  {
    id: 'b3',
    title: 'Skydiving over the valley 🪂',
    category: 'adventure',
    completed: false
  },
  {
    id: 'b4',
    title: 'Build a giant cardboard living room fort 🏰',
    category: 'cozy',
    completed: true,
    targetDate: '2023-12-25'
  },
  {
    id: 'b5',
    title: 'Rent a cabin with a fireplace for a winter week ❄️',
    category: 'cozy',
    completed: false
  },
  {
    id: 'b6',
    title: 'Learn tandem salsa dancing 💃🕺',
    category: 'adventure',
    completed: false
  }
];

export const DEFAULT_MESSAGES: LoveMessage[] = [
  {
    id: 'm1',
    sender: 'Ket',
    text: 'Thank you for always making my coffee exactly how I like it. You are my sunshine! ☀️',
    createdAt: '2026-07-05T09:30:00.000Z',
    color: 'rose',
    emoji: '☕'
  },
  {
    id: 'm2',
    sender: 'Maxy',
    text: 'Good luck with your presentation today! I believe in you so much, my little superstar. 💖',
    createdAt: '2026-07-06T08:15:00.000Z',
    color: 'sky',
    emoji: '🚀'
  },
  {
    id: 'm3',
    sender: 'Both',
    text: 'Remind us to buy milk and cat food on our way home tonight!',
    createdAt: '2026-07-06T18:40:00.000Z',
    color: 'amber',
    emoji: '🛒'
  }
];

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c1',
    title: 'Breakfast in Bed 🍳',
    description: 'Redeem this for a fresh hot breakfast cooked and served to you in bed, with complete cleanup included!',
    category: 'food',
    cost: 150,
    icon: 'Coffee',
    isRedeemed: false
  },
  {
    id: 'c2',
    title: 'Veto Any Movie Choice 🎬',
    description: 'Instant veto power over any movie selection. Ideal for escaping 3-hour action movies or indie dramas!',
    category: 'romantic',
    cost: 100,
    icon: 'Tv',
    isRedeemed: false
  },
  {
    id: 'c3',
    title: '15-Min Shoulder Massage 💆‍♂️',
    description: 'A deep relaxing shoulder and neck rub accompanied by peaceful ambient ocean sounds.',
    category: 'cozy',
    cost: 200,
    icon: 'Sparkles',
    isRedeemed: true,
    redeemedAt: '2026-06-12T20:15:00.000Z'
  },
  {
    id: 'c4',
    title: 'Late-Night Ice Cream Run 🍦',
    description: 'Maxy/Ket must immediately go to the nearest convenience store to satisfy a midnight sweet tooth craving.',
    category: 'food',
    cost: 120,
    icon: 'Heart',
    isRedeemed: false
  }
];

export const TRIVIA_QUESTIONS = [
  "What is each of your absolute favorite midnight snack?",
  "Who is more likely to fall asleep first during a movie night?",
  "What was the first movie or show we watched together?",
  "If we could teleport anywhere in the world right now, where would we go?",
  "What is a silly quirk about Maxy that Ket secretly loves?",
  "What is a silly habit of Ket that Maxy finds absolutely adorable?",
  "What song immediately makes you think of each other?",
  "Who is the better driver, and who is the better DJ in the car?",
  "If we won the lottery tomorrow, what is the first thing we would buy?"
];
