
export interface UserProfile {
  name: string;
  ign: string;
  uid: string;
  level: string;
  whatsapp: string;
  upiId?: string;
}

export interface Tournament {
  id: string;
  title: string;
  type: 'Solo' | 'Duo' | 'Squad';
  entryFee: number;
  prizePool: number;
  date: string;
  time: string;
  totalSlots: number;
  joinedSlots: number;
  rules: string;
  map: string;
}

export interface AppConfig {
  upiId: string;
  whatsapp: string;
  banners: string[];
  socialLinks: {
    discord?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface AppData {
  config: AppConfig;
  tournaments: Tournament[];
}

export interface JoinedHistory {
  tournamentId: string;
  tournamentTitle: string;
  date: string;
  entryFee: number;
  status: 'Pending' | 'Confirmed';
  joinedAt: number;
  screenshotVerified?: boolean;
}
