/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerState, SettingsState } from './types';
import { SongAestheticBackground } from './components/SongAestheticBackground';
import { SplashView } from './components/SplashView';
import { MainMenuView } from './components/MainMenuView';
import { GamePlayView } from './components/GamePlayView';
import { IllustratedBookView } from './components/IllustratedBookView';
import { YajiView } from './components/YajiView';
import { ShopView } from './components/ShopView';
import { ActivityView } from './components/ActivityView';
import { SettingsView } from './components/SettingsView';
import { DianChaView } from './components/DianChaView';
import { FeihuaView } from './components/FeihuaView';
import { SoundManager } from './components/SoundManager';

const DEFAULT_PLAYER_STATE: PlayerState = {
  rank: '秀才',
  exp: 0,
  score: 0,
  highScore: 0,
  coins: 120, // Startup balance for standard card buyouts
  teaCharm: 10,
  unlockedList: [1, 2], // Standard low level items unlocked
  signedInDays: 0,
  lastSignDate: null,
  itemsInventory: {
    undoCards: 2, // Give them 2 undo cards initially so they can play comfortably!
    shuffleCards: 1, // Start with 1 shuffle card
    autoMergeCards: 0,
  },
  unlockedSkins: ['celadon'],
  currentSkin: 'celadon',
  unlockedAvatars: ['avatar_chizi'],
  currentAvatar: 'avatar_chizi',
  unlockedTrails: ['trail_spark'],
  currentTrail: 'trail_spark',
  activeBuff: 'none',
  buffTurnsRemaining: 0,
};

const DEFAULT_SETTINGS_STATE: SettingsState = {
  musicOn: true,
  soundOn: true,
  vibrationOn: true,
  language: 'zh',
};

export default function App() {
  const [activeView, setActiveView] = useState<'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings' | 'diancha' | 'feihua'>('splash');

  // Load state from localStorage on init
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = localStorage.getItem('qingming_player_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Correct potential data migrations
        return {
          ...DEFAULT_PLAYER_STATE,
          ...parsed,
        };
      } catch (e) {
        return DEFAULT_PLAYER_STATE;
      }
    }
    return DEFAULT_PLAYER_STATE;
  });

  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('qingming_settings_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS_STATE,
          ...parsed,
        };
      } catch (e) {
        return DEFAULT_SETTINGS_STATE;
      }
    }
    return DEFAULT_SETTINGS_STATE;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('qingming_player_state', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('qingming_settings_state', JSON.stringify(settings));
    // Check background music triggering on adjustments
    if (settings.musicOn) {
      SoundManager.startBGM(true);
    } else {
      SoundManager.stopBGM();
    }
  }, [settings]);

  // Handle lazy loading trigger for BGM when player interacts first time
  const handleEnterApp = () => {
    setActiveView('menu');
    if (settings.musicOn) {
      SoundManager.startBGM(true);
    }
    SoundManager.playSuccess(settings.soundOn);
  };

  const handleResetData = () => {
    setPlayer(DEFAULT_PLAYER_STATE);
    setSettings(DEFAULT_SETTINGS_STATE);
    localStorage.removeItem('qingming_player_state');
    localStorage.removeItem('qingming_settings_state');
    SoundManager.stopBGM();
    setActiveView('splash');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-start overflow-x-hidden font-sans select-none selection:bg-transparent">
      {/* Universal aesthetic dynamic background */}
      <SongAestheticBackground skin={player.currentSkin || 'celadon'} trail={player.currentTrail || 'trail_spark'} />

      {/* Main router stage */}
      <main className="flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          {activeView === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <SplashView onEnter={handleEnterApp} soundEnabled={settings.soundOn} />
            </motion.div>
          )}

          {activeView === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <MainMenuView
                player={player}
                onNavigate={setActiveView}
                soundEnabled={settings.soundOn}
                onPlayClick={() => SoundManager.playClick(settings.soundOn)}
              />
            </motion.div>
          )}

          {activeView === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <GamePlayView
                player={player}
                setPlayer={setPlayer}
                onNavigate={setActiveView}
                settings={settings}
              />
            </motion.div>
          )}

          {activeView === 'book' && (
            <motion.div
              key="book"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <IllustratedBookView
                player={player}
                setPlayer={setPlayer}
                onNavigate={setActiveView}
                soundEnabled={settings.soundOn}
              />
            </motion.div>
          )}

          {activeView === 'yaji' && (
            <motion.div
              key="yaji"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <YajiView
                player={player}
                setPlayer={setPlayer}
                onNavigate={setActiveView}
                soundEnabled={settings.soundOn}
              />
            </motion.div>
          )}

          {activeView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <ShopView
                player={player}
                setPlayer={setPlayer}
                onNavigate={setActiveView}
                soundEnabled={settings.soundOn}
              />
            </motion.div>
          )}

          {activeView === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <ActivityView
                player={player}
                setPlayer={setPlayer}
                onNavigate={setActiveView}
                soundEnabled={settings.soundOn}
              />
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <SettingsView
                settings={settings}
                setSettings={setSettings}
                onNavigate={setActiveView}
                onResetData={handleResetData}
              />
            </motion.div>
          )}

          {activeView === 'diancha' && (
            <motion.div
              key="diancha"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <DianChaView
                player={player}
                setPlayer={setPlayer}
                onNavigate={setActiveView}
                soundEnabled={settings.soundOn}
              />
            </motion.div>
          )}

          {activeView === 'feihua' && (
            <motion.div
              key="feihua"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 top-0 w-full"
            >
              <FeihuaView
                player={player}
                setPlayer={setPlayer}
                onNavigate={setActiveView}
                soundEnabled={settings.soundOn}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
