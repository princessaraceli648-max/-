/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Gift, CheckCircle, HelpCircle, Sparkles, Coins, Award } from 'lucide-react';
import { PlayerState } from '../types';
import { SoundManager } from './SoundManager';

interface YajiProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings') => void;
  soundEnabled: boolean;
}

interface YajiActivity {
  id: string;
  name: string;
  titleName: string;
  desc: string;
  objective: string;
  target: number;
  currentValue: (player: PlayerState) => number;
  rewardCoins: number;
  rewardExp: number;
  visualEmoji: string;
  backgroundTheme: string;
  borderTheme: string;
}

export const YajiView: React.FC<YajiProps> = ({ player, setPlayer, onNavigate, soundEnabled }) => {
  // Local persistence for claimed quests
  const [claimedQuests, setClaimedQuests] = useState<string[]>([]);
  const [showRewardModal, setShowRewardModal] = useState<{ coins: number; exp: number; name: string } | null>(null);

  const ACTIVITIES: YajiActivity[] = [
    {
      id: 'qushuliushang',
      name: '曲水流觞',
      titleName: '茂林修竹 · 流觞唱和',
      desc: '合成至 Lv5 “宋椠线装书卷” 或更高以上品级。',
      objective: '解锁物品等级',
      target: 5,
      currentValue: (p) => Math.max(0, ...p.unlockedList),
      rewardCoins: 150,
      rewardExp: 50,
      visualEmoji: '🛶',
      backgroundTheme: 'from-[#E4ECE7] to-[#C9DACF]',
      borderTheme: 'border-[#6F8F72]',
    },
    {
      id: 'poetrygathering',
      name: '诗词大会',
      titleName: '博古雅致 · 词曲会友',
      desc: '于清明雅集中累积获取最高单局雅致分 1500 分以上。',
      objective: '最高聚贤分值',
      target: 1500,
      currentValue: (p) => p.highScore,
      rewardCoins: 200,
      rewardExp: 80,
      visualEmoji: '📜',
      backgroundTheme: 'from-[#FAF2E6] to-[#E9D5B3]',
      borderTheme: 'border-[#C8A55A]',
    },
    {
      id: 'dianshameeting',
      name: '点茶盛会',
      titleName: '水磨百戏 · 点茶论道',
      desc: '合成至至少一件 Lv3 汝窑极品，或者积累了相当的功勋。',
      objective: '解锁通鉴品级',
      target: 4,
      currentValue: (p) => Math.max(0, ...p.unlockedList),
      rewardCoins: 250,
      rewardExp: 100,
      visualEmoji: '🍵',
      backgroundTheme: 'from-[#ECE6F2] to-[#DAC9EB]',
      borderTheme: 'border-indigo-400',
    },
    {
      id: 'lanternfestival',
      name: '汴京灯会',
      titleName: '夜市万家 · 御街灯火',
      desc: '在汴京极市中合成至极致绝世之作 Lv10 清明上河图卷。',
      objective: '合成文物等级',
      target: 10,
      currentValue: (p) => Math.max(0, ...p.unlockedList),
      rewardCoins: 500,
      rewardExp: 200,
      visualEmoji: '🏮',
      backgroundTheme: 'from-[#FCECE4] to-[#F7D8CA]',
      borderTheme: 'border-rose-450',
    },
  ];

  const handleClaim = (act: YajiActivity) => {
    const current = act.currentValue(player);
    if (current < act.target || claimedQuests.includes(act.id)) return;

    SoundManager.playSuccess(soundEnabled);
    setClaimedQuests((prev) => [...prev, act.id]);

    setPlayer((prev) => {
      const nextExp = prev.exp + act.rewardExp;
      let nextRank = prev.rank;

      if (nextExp >= 8000) nextRank = '大学士';
      else if (nextExp >= 3500) nextRank = '学士';
      else if (nextExp >= 1500) nextRank = '翰林';
      else if (nextExp >= 600) nextRank = '进士';
      else if (nextExp >= 200) nextRank = '举人';

      return {
        ...prev,
        coins: prev.coins + act.rewardCoins,
        exp: nextExp,
        rank: nextRank,
      };
    });

    setShowRewardModal({
      coins: act.rewardCoins,
      exp: act.rewardExp,
      name: act.name,
    });
  };

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

        <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full text-xs font-mono font-bold text-amber-700">
          <Coins size={12} className="text-[#C8A55A]" />
          <span>{player.coins}文</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-widest text-[#2F2F2F]">文人社雅集</h2>
        <p className="text-[10px] text-stone-500 font-sans mt-1">
          躬逢胜饯，群贤毕至。在雅会中展现通才识鉴，完成名士试题
        </p>
      </div>

      {/* Quests Container */}
      <div className="flex-1 overflow-y-auto max-h-[68vh] space-y-4 pr-1 pb-16">
        {ACTIVITIES.map((act) => {
          const val = act.currentValue(player);
          const isComplete = val >= act.target;
          const isClaimed = claimedQuests.includes(act.id);
          const percent = Math.min((val / act.target) * 100, 100);

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${act.backgroundTheme} border-2 ${act.borderTheme} p-4 rounded-sm shadow-md text-[#2F2F2F]`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-3xl filter drop-shadow-sm select-none">{act.visualEmoji}</span>
                  <div>
                    <h3 className="font-bold text-base leading-tight">{act.name}</h3>
                    <span className="text-[9px] font-sans text-stone-600 block mt-0.5">{act.titleName}</span>
                  </div>
                </div>

                {isClaimed ? (
                  <div className="flex items-center space-x-1 text-emerald-800 text-xs font-bold font-sans bg-emerald-100 border border-emerald-300 rounded-sm px-2 py-0.5 scale-95 shadow-inner">
                    <CheckCircle size={12} />
                    <span>已领取</span>
                  </div>
                ) : isComplete ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(act)}
                    className="px-3 py-1 bg-[#2F2F2F] text-white border border-stone-850 text-xs font-bold font-sans rounded-sm shadow-md animate-bounce"
                  >
                    领赏文
                  </motion.button>
                ) : (
                  <div className="text-[10px] font-bold text-amber-900 border border-amber-400 bg-amber-100 rounded-sm px-1.5 py-0.5">
                    未达成
                  </div>
                )}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-sans mb-3 pr-4">
                {act.desc}
              </p>

              {/* Progress Slider */}
              <div className="w-full">
                <div className="flex justify-between items-center text-[10px] text-stone-600 font-mono mb-1">
                  <span>{act.objective}: {val} / {act.target}</span>
                  <span>{Math.floor(percent)}%</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-current h-full"
                    style={{ width: `${percent}%`, color: isComplete ? '#2F2F2F' : '#685D4F' }}
                  />
                </div>
              </div>

              {/* Rewards overview line */}
              <div className="mt-3.5 pt-2 border-t border-black/10 flex items-center space-x-4 text-[10px] text-stone-700 font-semibold font-sans">
                <span className="flex items-center space-x-1.5">
                  <Coins size={11} className="text-amber-800" />
                  <span>铜钱 +{act.rewardCoins}文</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Award size={11} className="text-emerald-800" />
                  <span>学者功勋 +{act.rewardExp} EXP</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Gift size={11} className="text-indigo-800" />
                  <span>精美宝券</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Claim Rewards Modal Overlay */}
      <AnimatePresence>
        {showRewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRewardModal(null)}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs font-serif text-[#2F2F2F]"
          >
            <motion.div
              initial={{ scale: 0.85, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#F9F5EC] border-4 border-yellow-600 rounded-sm p-6 text-center shadow-2xl relative"
            >
              {/* Gold light burst animation circles */}
              <div className="absolute inset-0 bg-radial from-yellow-100 to-transparent opacity-40 pointer-events-none" />

              <span className="text-4xl animate-spin inline-block mb-2">✨</span>
              <h3 className="text-2xl font-black text-[#A4762E] tracking-wider mb-2">赐封贺彩</h3>
              <p className="text-xs text-stone-600 mb-4 font-sans leading-relaxed">
                贺喜大才子！您在雅会【{showRewardModal.name}】活动中拔得头筹，朝廷特颁赐如下钱粮：
              </p>

              {/* Items awarded list */}
              <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 inline-flex items-center justify-around w-full mb-6 text-center select-none font-mono">
                <div>
                  <div className="text-lg font-black text-amber-700">+{showRewardModal.coins}文</div>
                  <div className="text-[10px] text-stone-400 font-sans font-semibold mt-0.5">大国铜钱</div>
                </div>
                <div className="w-[1px] h-8 bg-stone-300" />
                <div>
                  <div className="text-lg font-black text-emerald-800">+{showRewardModal.exp} EXP</div>
                  <div className="text-[10px] text-stone-400 font-sans font-semibold mt-0.5">学者功勋</div>
                </div>
              </div>

              <button
                onClick={() => setShowRewardModal(null)}
                className="w-full py-2 bg-[#2F2F2F] text-amber-50 text-xs font-semibold tracking-wider rounded-sm shadow-md"
              >
                谢恩领命
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
