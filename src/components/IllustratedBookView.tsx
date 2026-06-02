/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Lock, Landmark, FileText, Compass, ExternalLink } from 'lucide-react';
import { PlayerState, Artifact } from '../types';
import { ARTIFACTS_DB } from '../utils/gameLogic';
import { SoundManager } from './SoundManager';

interface BookProps {
  player: PlayerState;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings') => void;
  soundEnabled: boolean;
}

type TabType = '全部' | '茶器' | '瓷器' | '书画' | '乐器' | '名著';

export const IllustratedBookView: React.FC<BookProps> = ({ player, setPlayer, onNavigate, soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<TabType>('全部');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  const tabs: TabType[] = ['全部', '茶器', '瓷器', '书画', '乐器', '名著'];

  // Match items based on categories
  const filteredArtifacts = Object.values(ARTIFACTS_DB).filter((art) => {
    if (activeTab === '全部') return true;
    if (activeTab === '名著') return art.type === '名著' || art.type === '传世';
    return art.type === activeTab;
  });

  const isUnlocked = (lvl: number) => {
    return player.unlockedList.includes(lvl) || lvl <= 2; // Always let items lvl 1 and lve 2 be unlocked by default
  };

  const handleUnlockAll = () => {
    if (setPlayer) {
      const allLevels = Object.values(ARTIFACTS_DB).map(art => art.level);
      setPlayer(prev => ({
        ...prev,
        unlockedList: allLevels
      }));
      SoundManager.playSuccess(soundEnabled);
    }
  };

  const totalUnlocked = Object.values(ARTIFACTS_DB).filter((art) => isUnlocked(art.level)).length;
  const totalCount = Object.keys(ARTIFACTS_DB).length;

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col px-3 py-4 text-[#2F2F2F] font-serif select-none">
      {/* Header index */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            SoundManager.playClick(soundEnabled);
            onNavigate('menu');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F2E8] border border-stone-300 rounded-sm text-xs shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft size={13} />
          <span>回廊 (主页)</span>
        </button>

        <div className="bg-[#6F8F72]/15 text-[#4E6B53] border border-[#6F8F72]/30 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center">
          <BookOpen size={12} className="mr-1.5" />
          <span>通鉴收集: {totalUnlocked}/{totalCount}</span>
        </div>
      </div>

      <div className="text-center mb-1">
        <h2 className="text-xl font-bold tracking-widest text-[#2F2F2F]">清明通鉴志</h2>
        <p className="text-[10px] text-stone-500 font-sans mt-1">
          探索引领大宋美学、文道与风尘生活的十六品珍器名录
        </p>
      </div>

      {/* Cheat Unlock All Button */}
      {totalUnlocked < totalCount && setPlayer && (
        <div className="flex justify-center my-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUnlockAll}
            className="flex items-center space-x-1 px-4 py-1.5 bg-gradient-to-r from-amber-500/15 via-[#C8A55A]/25 to-amber-500/15 border border-[#C8A55A] text-[#8A6A32] rounded-full text-[10px] font-black tracking-widest active:scale-95 transition-all shadow-md hover:brightness-115 cursor-pointer"
            style={{
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            <Compass size={11} className="mr-0.5 animate-spin-slow" />
            <span>🌌 天工开物：解锁全部通鉴 🌌</span>
          </motion.button>
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none mb-4 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              SoundManager.playClick(soundEnabled);
              setActiveTab(tab);
            }}
            className={`px-3 py-1 text-xs shrink-0 rounded-sm font-bold border transition-colors ${
              activeTab === tab
                ? 'bg-[#6F8F72] text-[#F7F2E8] border-[#6F8F72]'
                : 'bg-[#F7F2E8] border-stone-300 hover:border-[#6F8F72] text-stone-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main collectibles Grid */}
      <div className="flex-1 overflow-y-auto max-h-[66vh] pr-1 pb-16 grid grid-cols-2 gap-3 pb-8">
        {filteredArtifacts.map((art) => {
          const unlocked = isUnlocked(art.level);

          return (
            <motion.button
              key={art.level}
              whileHover={{ scale: unlocked ? 1.03 : 1 }}
              whileTap={{ scale: unlocked ? 0.97 : 1 }}
              onClick={() => {
                if (unlocked) {
                  SoundManager.playClick(soundEnabled);
                  setSelectedArtifact(art);
                }
              }}
              className={`relative aspect-[5/6] w-full p-2 rounded-md border-2 shadow-sm transition-all flex flex-col justify-between items-center text-center overflow-hidden ${
                unlocked
                  ? 'bg-[#FAF6EE] border-[#6F8F72] hover:shadow-md cursor-pointer'
                  : 'bg-stone-50 border-stone-200 pointer-events-none opacity-50'
              }`}
            >
              <div className="w-full flex justify-between items-center text-[9px] font-serif mb-1.5 z-10">
                <span className={unlocked ? 'text-[#8A6A32] font-extrabold' : 'text-stone-400'}>阶 {art.level}</span>
                <span className={`px-1.5 py-[1px] rounded text-[8px] leading-none ${
                  unlocked ? 'border-[#8A6A32]/30 text-[#8A6A32] bg-[#8A6A32]/10' : 'border-stone-300 text-stone-400 font-bold'
                }`}>
                  {art.type}
                </span>
              </div>

              {/* Core Image Container: Beautifully framed with no dark filters or obstructions */}
              <div className="w-full flex-1 min-h-[92px] max-h-[110px] my-1 relative overflow-hidden rounded border border-[#DFCEB3] bg-[#EFE9DD] shadow-inner flex items-center justify-center z-10">
                {unlocked ? (
                  art.imageUrl ? (
                    <img
                      src={art.imageUrl}
                      alt={art.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter saturate-[1.10] contrast-[1.02] brightness-100 transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <span className="text-3xl filter drop-shadow-md select-none transform transition-transform hover:scale-110">
                      {art.type === '茶器' ? '🍵' : art.type === '瓷器' ? '🏺' : art.type === '乐器' ? '🎸' : art.type === '书画' ? '🖼️' : '📜'}
                    </span>
                  )
                ) : (
                  <Lock size={16} className="text-stone-400 animate-pulse" />
                )}
              </div>

              {/* Text designation with elegant layout contrast on clear background */}
              <div className="w-full mt-1.5 z-10">
                {unlocked ? (
                  <>
                    <h3 className="text-[11.5px] font-black tracking-wide leading-tight text-[#3A220F] font-serif truncate">
                      {art.name}
                    </h3>
                    <span className="text-[8px] block text-[#8F7D6B] font-sans mt-0.5">{art.era} $\cdot$ {art.author}</span>
                  </>
                ) : (
                  <span className="text-[9.5px] text-stone-400 font-serif">合成即可解锁鉴赏</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Decorative Traditional border panel */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -1 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.85, rotate: -1 }}
              className="w-full max-w-sm bg-[#FAF4EC] text-[#2F2F2F] border-4 border-[#3D2F22] rounded-md shadow-2xl p-6 relative overflow-hidden"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(111,143,114,0.03) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
            >
              {/* Red Stamp visual block */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-red-700 border-2 border-red-800 rounded-sm flex items-center justify-center rotate-6 shadow-sm">
                <span className="text-[#FAF4EC] text-[9px] font-black leading-none text-center font-serif py-1">
                  通鉴
                  <br />
                  御编
                </span>
              </div>

              <span className="text-[#6F8F72] text-[10px] uppercase font-bold tracking-[0.2em] block mb-1">
                ── 大宋瑰宝御玩志 ──
              </span>

              <h3 className="text-2xl font-black text-[#3D2F22] tracking-wider mb-0.5 font-serif pt-1">
                {selectedArtifact.name}
              </h3>
              <p className="text-xs text-[#A4762E] font-bold font-serif mb-3 flex items-center space-x-2">
                <Landmark size={12} className="inline mr-1" />
                <span>{selectedArtifact.era} $\cdot$ {selectedArtifact.author} 监作</span>
              </p>

              {/* Premium Artifact Image Display */}
              {selectedArtifact.imageUrl && (
                <div className="my-3 relative rounded-sm border-2 border-[#3D2F22] overflow-hidden shadow-md group">
                  <img
                    src={selectedArtifact.imageUrl}
                    alt={selectedArtifact.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105 filter saturate-[0.85] contrast-[1.05]"
                  />
                  {/* Silk border lighting effect overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-transparent to-transparent p-1 pointer-events-none flex justify-between items-center">
                    <span className="text-[8px] text-yellow-100 font-sans tracking-widest pl-1">大宋神珍品鉴</span>
                    <span className="text-[8px] font-mono text-[#FAF4EC]/95 tracking-wide pr-1">
                      等第: 拾陆阶之{selectedArtifact.level}
                    </span>
                  </div>
                </div>
              )}

              {/* Split scrolling visual separator */}
              <div className="w-full h-1 border-t border-b border-stone-300 my-3.5 opacity-60" />

              <div className="space-y-4 text-xs tracking-wide leading-relaxed font-sans pr-1 max-h-[220px] overflow-y-auto">
                <div className="flex space-x-2 items-start">
                  <FileText size={14} className="text-[#6F8F72] shrink-0 mt-0.5" />
                  <p className="text-stone-700">
                    <strong className="text-stone-900 block font-serif mb-1 font-semibold">【器物考语】</strong>
                    {selectedArtifact.story}
                  </p>
                </div>

                <div className="flex space-x-2 items-start">
                  <Compass size={14} className="text-[#C8A55A] shrink-0 mt-0.5" />
                  <p className="text-stone-600">
                    <strong className="text-stone-900 block font-serif mb-1 font-semibold">【历史背景】</strong>
                    {selectedArtifact.background}
                  </p>
                </div>
              </div>

              {/* Close Buttons */}
              <button
                onClick={() => {
                  SoundManager.playClick(soundEnabled);
                  setSelectedArtifact(null);
                }}
                className="w-full mt-6 py-3 bg-[#3D2F22] text-[#FAF4EC] border border-stone-800 shadow-lg text-xs font-bold tracking-[0.4em] pl-[0.4em] rounded-sm hover:translate-y-0.5 transition-all"
              >
                卷轴收合
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
