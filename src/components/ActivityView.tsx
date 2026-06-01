/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Award, Calendar, Check, Landmark, Trophy, Coins, Flame } from 'lucide-react';
import { PlayerState, LeaderboardUser } from '../types';
import { SoundManager } from './SoundManager';

interface ActivityProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings') => void;
  soundEnabled: boolean;
}

export const ActivityView: React.FC<ActivityProps> = ({ player, setPlayer, onNavigate, soundEnabled }) => {
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkedMsg, setCheckedMsg] = useState<string | null>(null);

  // Sign-in configuration
  const SIGNIN_REWARDS = [
    { day: 1, reward: '100 铜钱', emoji: '🪙', type: 'coins', amount: 100 },
    { day: 2, reward: '150 铜钱', emoji: '🪙', type: 'coins', amount: 150 },
    { day: 3, reward: '1张 悔棋撤回符', emoji: '📿', type: 'undo', amount: 1 },
    { day: 4, reward: '200 铜钱', emoji: '🪙', type: 'coins', amount: 200 },
    { day: 5, reward: '1张 重组刷新卡', emoji: '🍃', type: 'shuffle', amount: 1 },
    { day: 6, reward: '300 铜钱', emoji: '🪙', type: 'coins', amount: 300 },
    { day: 7, reward: '1张 自动合成丸', emoji: '💊', type: 'automerge', amount: 1 },
  ];

  // Leaderboard statistics - preloaded with historical figures, showing the player's real score dynamically!
  const LEADERBOARD_POOL: LeaderboardUser[] = [
    { rank: 1, name: '苏轼', title: '大学士', score: 18240 },
    { rank: 2, name: '辛弃疾', title: '枢密都承旨', score: 16800 },
    { rank: 3, name: '李清照', title: '易安居士', score: 14502 },
    { rank: 4, name: '陆游', title: '宝华阁侍制', score: 12100 },
    { rank: 5, name: '欧阳修', title: '翰林学士', score: 9800 },
    { rank: 6, name: '大宋才子（您）', title: player.rank, score: player.score, isPlayer: true },
    { rank: 7, name: '晏殊', title: '同平章事', score: 6500 },
    { rank: 8, name: '王安石', title: '平章事', score: 3200 },
    { rank: 9, name: '米芾', title: '书画博士', score: 2150 },
    { rank: 10, name: '柳永', title: '屯田员外郎', score: 1800 },
  ];

  // Sort and re-rank leaderboard dynamically based on player's real cumulative score
  const dynamicLeaderboard = [...LEADERBOARD_POOL]
    .sort((a, b) => b.score - a.score)
    .map((user, idx) => ({
      ...user,
      rank: idx + 1,
    }));

  const handleSignIn = () => {
    if (hasCheckedInToday) return;

    SoundManager.playSuccess(soundEnabled);
    setHasCheckedInToday(true);

    const nextDayIndex = Math.min((player.signedInDays % 7) + 1, 7);
    const activeReward = SIGNIN_REWARDS[nextDayIndex - 1];

    setPlayer((prev) => {
      let coins = prev.coins;
      let inventory = { ...prev.itemsInventory };

      if (activeReward.type === 'coins') {
        coins += activeReward.amount;
      } else if (activeReward.type === 'undo') {
        inventory.undoCards += activeReward.amount;
      } else if (activeReward.type === 'shuffle') {
        inventory.shuffleCards += activeReward.amount;
      } else if (activeReward.type === 'automerge') {
        inventory.autoMergeCards += activeReward.amount;
      }

      return {
        ...prev,
        signedInDays: nextDayIndex,
        coins,
        itemsInventory: inventory,
      };
    });

    setCheckedMsg(`恭喜签到成功！收获第${nextDayIndex}天赐福：【${activeReward.reward}】`);
    setTimeout(() => setCheckedMsg(null), 3000);
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

        <div className="flex items-center space-x-1.5 px-3 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-mono text-amber-700">
          <Coins size={12} className="text-[#C8A55A]" />
          <span>{player.coins}文</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-widest text-[#2F2F2F]">汴京风物志</h2>
        <p className="text-[10px] text-stone-500 font-sans mt-1">
          七日供茶奉贡，天子赐福。更有合成竞赛群贤论道排行榜
        </p>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {checkedMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-[#FAF4EC] text-xs font-bold px-4 py-2.5 rounded-sm shadow-md block text-center max-w-[280px]"
          >
            {checkedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto max-h-[66vh] space-y-6 pr-1 pb-16">
        {/* Sign-in Section */}
        <div className="bg-[#F7F2E8]/90 border border-[#6F8F72] rounded-sm p-4 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold font-serif text-sm text-[#516E5D] flex items-center">
              <Calendar size={14} className="mr-1.5" />
              司理供茶 (七日签到)
            </span>
            <button
              disabled={hasCheckedInToday}
              onClick={handleSignIn}
              className={`text-xs px-3 py-1 rounded-sm font-bold shadow-sm ${
                hasCheckedInToday
                  ? 'bg-stone-200 text-stone-500 border border-stone-300 cursor-not-allowed'
                  : 'bg-emerald-600 border border-emerald-500 text-stone-50 hover:bg-emerald-700 active:scale-95 transition-transform cursor-pointer'
              }`}
            >
              {hasCheckedInToday ? '今日已奉茶' : '每日供茶'}
            </button>
          </div>

          {/* 7 columns grid layout */}
          <div className="grid grid-cols-7 gap-1 mt-2">
            {SIGNIN_REWARDS.map((rew) => {
              const isPast = player.signedInDays >= rew.day;
              const isCurrent = player.signedInDays + 1 === rew.day && !hasCheckedInToday;

              return (
                <div
                  key={rew.day}
                  className={`flex flex-col items-center justify-between p-1 border rounded-sm aspect-[4/5] leading-none text-center ${
                    isPast
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : isCurrent
                      ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-300/50'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="text-[8px] font-mono">D{rew.day}</span>
                  <span className="text-base my-0.5 filter drop-shadow-xs select-none">{rew.emoji}</span>
                  {isPast ? (
                    <span className="text-[7px] text-emerald-700 font-bold font-sans">已奉</span>
                  ) : (
                    <span className="text-[7px] text-stone-500 font-serif">赠</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Leaderboard Panel */}
        <div className="bg-[#F7F2E8]/90 border border-stone-200 rounded-sm p-4 shadow-md">
          <h4 className="font-bold text-sm text-[#3D2F22] flex items-center mb-3">
            <Trophy size={14} className="text-[#C8A55A] mr-1.5" />
            汴京群贤博弈榜 (合成竞赛)
          </h4>

          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {dynamicLeaderboard.map((item) => {
              return (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-2 rounded-sm border ${
                    item.isPlayer
                      ? 'bg-amber-50/75 border-amber-300 ring-1 ring-amber-200'
                      : 'bg-stone-50/50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {/* Rank badges */}
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono text-xs ${
                        item.rank === 1
                          ? 'bg-yellow-500 text-white shadow-sm'
                          : item.rank === 2
                          ? 'bg-stone-300 text-stone-850'
                          : item.rank === 3
                          ? 'bg-amber-600 text-white'
                          : 'text-stone-500'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div>
                      <span className={`font-bold text-xs ${item.isPlayer ? 'text-[#3D2F22]' : 'text-stone-800'}`}>
                        {item.name}
                      </span>
                      <span className="ml-1.5 text-[8px] border border-stone-300 text-stone-400 rounded-sm px-1 font-sans">
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 font-bold font-mono text-xs text-stone-800">
                    <Flame size={12} className="text-orange-500" />
                    <span>{item.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
