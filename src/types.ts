/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Song Dynasty Scholar Ranks
export type ScholarRank = '秀才' | '举人' | '进士' | '翰林' | '学士' | '大学士';

export interface PlayerState {
  rank: ScholarRank;
  exp: number; // For level up through synthesis & yaji activities
  score: number;
  highScore: number;
  coins: number;
  teaCharm: number; // For 点茶 system
  unlockedList: number[]; // Array of unique item levels unlocked
  signedInDays: number; // 7-day sign-in progress (0-7)
  lastSignDate: string | null; // Track consecutive log-ins
  itemsInventory: {
    undoCards: number;
    shuffleCards: number;
    autoMergeCards: number;
  };
  unlockedSkins: string[]; // Active and unlocked skin IDs
  currentSkin: string; // Active theme skin ID ('celadon' | 'ink' | 'palace')
  unlockedAvatars: string[]; // Active and unlocked avatar IDs
  currentAvatar: string; // Active avatar ID
  unlockedTrails: string[]; // Active and unlocked trail IDs
  currentTrail: string; // Active trail ID
  activeBuff: 'none' | 'double_score' | 'auto_synthesis';
  buffTurnsRemaining: number;
}

export interface Tile {
  id: string; // Unique tile instance id for key tracking
  level: number; // 1 to 16
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface Artifact {
  level: number;
  name: string;
  type: '茶器' | '瓷器' | '书画' | '乐器' | '名著' | '传世';
  era: string; // e.g. "北宋"
  author: string; // e.g. "佚名" or "徽宗赵佶" or "孟元老"
  story: string;
  background: string;
  gradient: string; // Tailwind class background
  textColor: string; // Text styling
  borderColor: string;
  imageUrl?: string;
}

export interface YajiQuest {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  type: 'merge' | 'score' | 'coins' | 'tea';
  rewardCoins: number;
  rewardExp: number;
  progress: number;
  unlocked: boolean;
  completed: boolean;
  claimed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  itemType: 'undo' | 'shuffle' | 'automerge' | 'skin' | 'avatar' | 'trail';
  skinId?: string; // Also used for avatarId or trailId

  quantityInStock?: number; // For limited items
}

export interface LiteratiCharacter {
  id: string;
  name: string;
  title: string;
  quote: string;
  buffDescription: string;
  color: string;
  borderColor: string;
  avatar: string; // Emoji or SVG description
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  title: string;
  score: number;
  isPlayer?: boolean;
}

export interface SettingsState {
  musicOn: boolean;
  soundOn: boolean;
  vibrationOn: boolean;
  language: 'zh' | 'zt' | 'en';
}
