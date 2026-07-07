export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  url: string;
  category: 'travel' | 'food' | 'cozy' | 'adventure';
}

export interface BucketItem {
  id: string;
  title: string;
  category: 'adventure' | 'travel' | 'food' | 'cozy';
  completed: boolean;
  targetDate?: string;
}

export interface LoveMessage {
  id: string;
  sender: 'Maxy' | 'Ket' | 'Both';
  text: string;
  createdAt: string;
  color: 'rose' | 'amber' | 'sky' | 'emerald' | 'violet';
  emoji: string;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  category: 'romantic' | 'cozy' | 'fun' | 'food';
  cost: number; // in virtual "Love Points"
  icon: string;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
  credit: string;
}
