
import { AppData } from './types';

export const COLORS = {
  accent: '#ff4d00',
  background: '#0a0a0a',
  card: 'rgba(255, 255, 255, 0.05)',
};

export const MOCK_DATA: AppData = {
  config: {
    upiId: 'pawanponnam-1@okicici',
    whatsapp: '9867637326',
    banners: [
      'https://picsum.photos/seed/ff1/800/400',
      'https://picsum.photos/seed/ff2/800/400',
      'https://picsum.photos/seed/ff3/800/400'
    ],
    socialLinks: {
      discord: 'https://discord.gg/ffhub',
      youtube: 'https://youtube.com/@ffhub',
      instagram: 'https://instagram.com/ffhub'
    }
  },
  tournaments: [
    {
      id: 't1',
      title: 'Diamond Cup - Season 1',
      type: 'Squad',
      entryFee: 100,
      prizePool: 5000,
      date: '2024-06-25',
      time: '19:00',
      totalSlots: 48,
      joinedSlots: 32,
      map: 'Bermuda',
      rules: '1. No hacks allowed. 2. Mobile only. 3. Reach 10 min before start.'
    },
    {
      id: 't2',
      title: 'Solo Rush Night',
      type: 'Solo',
      entryFee: 30,
      prizePool: 1200,
      date: '2024-06-26',
      time: '21:00',
      totalSlots: 48,
      joinedSlots: 15,
      map: 'Purgatory',
      rules: '1. Teaming leads to ban. 2. Screenshot required for kill verification.'
    }
  ]
};

export const ADMIN_PASSCODE = 'Pawan1645@';
