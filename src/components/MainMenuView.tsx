/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Users, ShoppingCart, Calendar, Settings, Award, Coins, Flame, Palette, Feather, Compass, Landmark, Wind, Sparkles } from 'lucide-react';
import { ScholarRank, PlayerState } from '../types';
import { AVATAR_SKINS_POOL } from './SkinConfig';

interface MainMenuProps {
  player: PlayerState;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings' | 'diancha' | 'feihua') => void;
  soundEnabled: boolean;
  onPlayClick: () => void;
}

const RANK_THRESHOLDS: { [key in ScholarRank]: number } = {
  '秀才': 200,
  '举人': 600,
  '进士': 1500,
  '翰林': 3500,
  '学士': 8000,
  '大学士': 99999,
};

const RANK_NEXT: { [key in ScholarRank]: ScholarRank | '' } = {
  '秀才': '举人',
  '举人': '进士',
  '进士': '翰林',
  '翰林': '学士',
  '学士': '大学士',
  '大学士': '',
};

export const MainMenuView: React.FC<MainMenuProps> = ({ player, onNavigate, onPlayClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Compute Shi Chen (Twelve Shichens) based on real-time hour
  const getShichen = () => {
    const hour = currentTime.getHours();
    if (hour >= 23 || hour < 1) return { name: '子时', title: '夜半', poem: '姑苏城外寒山寺，夜半钟声到客船。' };
    if (hour >= 1 && hour < 3) return { name: '丑时', title: '鸡鸣', poem: '三更灯火五更鸡，正是男儿读书时。' };
    if (hour >= 3 && hour < 5) return { name: '寅时', title: '平旦', poem: '平旦破晓出晨曦，雄鸡一唱天下白。' };
    if (hour >= 5 && hour < 7) return { name: '卯时', title: '日出', poem: '日出江花红胜火，春来江水绿如蓝。' };
    if (hour >= 7 && hour < 9) return { name: '辰时', title: '食时', poem: '食时珍馐味幽远，清茗一盏醒心脾。' };
    if (hour >= 9 && hour < 11) return { name: '巳时', title: '隅中', poem: '隅中骄阳映深院，清风徐来带墨香。' };
    if (hour >= 11 && hour < 13) return { name: '午时', title: '日中', poem: '日午独觉无余事，草堂坐卧赏清幽。' };
    if (hour >= 13 && hour < 15) return { name: '未时', title: '日昳', poem: '日昳光影动池台，清梦初醒茶一杯。' };
    if (hour >= 15 && hour < 17) return { name: '申时', title: '晡时', poem: '晡时微雨湿飞檐，闲抚古琴听碎玉。' };
    if (hour >= 17 && hour < 19) return { name: '酉时', title: '日入', poem: '夕阳无限好，只是近黄昏。' };
    if (hour >= 19 && hour < 21) return { name: '戌时', title: '黄昏', poem: '月上柳梢头，人约黄昏后。' };
    return { name: '亥时', title: '人定', poem: '人定萧条万虑空，静看星河入御沟。' };
  };

  const shichen = getShichen();
  const currentThreshold = RANK_THRESHOLDS[player.rank];
  const nextRank = RANK_NEXT[player.rank];
  const expProgressPercent = Math.min((player.exp / currentThreshold) * 100, 100);
  const currentAvatarEmoji = AVATAR_SKINS_POOL.find(a => a.id === player.currentAvatar)?.emoji || player.rank[0];

  const menuItems = [
    {
      id: 'game',
      name: '游戏开始',
      desc: '合成至尊千里大江山',
      icon: <Play className="w-5 h-5 text-[#FAF4EC]" />,
      iconBg: 'bg-[#6F8F72] shadow-emerald-950/20',
      action: () => {
        onPlayClick();
        onNavigate('game');
      },
      highlight: true,
      tag: '荐',
      tagColor: 'bg-amber-600',
    },
    {
      id: 'diancha',
      name: '点茶斗茶室',
      desc: '击拂白乳，画韵水丹青（获茶韵）',
      icon: <Palette className="w-5 h-5 text-emerald-800" />,
      iconBg: 'bg-[#E3EDE4] border border-emerald-300/40',
      action: () => onNavigate('diancha'),
      tag: '茶',
      tagColor: 'bg-emerald-600',
    },
    {
      id: 'feihua',
      name: '飞花词笔',
      desc: '风雅对决，名宿唱和斗词（获功勋）',
      icon: <Feather className="w-5 h-5 text-indigo-700" />,
      iconBg: 'bg-indigo-50 border border-indigo-200/40',
      action: () => onNavigate('feihua'),
      tag: '词',
      tagColor: 'bg-indigo-600',
    },
    {
      id: 'book',
      name: '大宋珍藏（图鉴）',
      desc: '宋瓷书画，博览通鉴',
      icon: <BookOpen className="w-5 h-5 text-[#9C753A]" />,
      iconBg: 'bg-amber-50 border border-amber-200/40',
      action: () => onNavigate('book'),
    },
    {
      id: 'yaji',
      name: '文人雅集',
      desc: '曲水流觞，诗词大会',
      icon: <Users className="w-5 h-5 text-amber-800" />,
      iconBg: 'bg-orange-50 border border-amber-200/40',
      action: () => onNavigate('yaji'),
      tag: '雅',
      tagColor: 'bg-amber-700',
    },
    {
      id: 'shop',
      name: '汴京集市（商城）',
      desc: '换购妙药符卡与古韵风物',
      icon: <ShoppingCart className="w-5 h-5 text-amber-900" />,
      iconBg: 'bg-yellow-50 border border-amber-300/40',
      action: () => onNavigate('shop'),
    },
    {
      id: 'activity',
      name: '限时活动',
      desc: '七日奉茶，汴京风物志',
      icon: <Calendar className="w-5 h-5 text-rose-700" />,
      iconBg: 'bg-rose-50 border border-rose-250/30',
      action: () => onNavigate('activity'),
      tag: '新',
      tagColor: 'bg-rose-600',
    },
    {
      id: 'settings',
      name: '书房静室（设置）',
      desc: '曲律乐效与墨迹清理',
      icon: <Settings className="w-5 h-5 text-stone-700" />,
      iconBg: 'bg-stone-100 border border-stone-200/40',
      action: () => onNavigate('settings'),
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col px-4 py-6 text-[#2F2F2F] select-none relative overflow-visible">
      
      {/* Exquisite visual shaders for paper texture */}
      <div className="absolute inset-0 bg-radial-at-t from-[#F9F6EE] via-transparent to-transparent pointer-events-none opacity-40" />

      {/* Embedded Style Tag for Floating Traditional Wind/Petals */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatSlow {
          0% { transform: translateY(-20px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(115vh) translateX(-80px) rotate(360deg); opacity: 0; }
        }
        @keyframes swayWind {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
          100% { transform: rotate(0deg); }
        }
      `}} />

      {/* Floating Cherry Blossom Petals & Golden Wind Particles */}
      <div className="absolute inset-x-0 top-0 h-[120vh] overflow-hidden pointer-events-none z-[1]">
        <div className="absolute top-[-5%] left-[15%] w-3 h-1.5 rounded-full bg-rose-200/50 blur-[0.3px]" style={{ animation: 'floatSlow 16s linear infinite', animationDelay: '0s' }} />
        <div className="absolute top-[-5%] left-[55%] w-4 h-2 rounded-full bg-emerald-250/40 blur-[0.3px]" style={{ animation: 'floatSlow 21s linear infinite', animationDelay: '3s' }} />
        <div className="absolute top-[-5%] left-[85%] w-3.5 h-2 rounded-full bg-amber-200/45 blur-[0.3px]" style={{ animation: 'floatSlow 13s linear infinite', animationDelay: '6s' }} />
        <div className="absolute top-[-5%] left-[35%] w-2.5 h-1.5 rounded-full bg-rose-200/40 blur-[0.3px]" style={{ animation: 'floatSlow 25s linear infinite', animationDelay: '10s' }} />
        <div className="absolute top-[-5%] left-[70%] w-3 h-2 rounded-full bg-emerald-240/35 blur-[0.8px]" style={{ animation: 'floatSlow 18s linear infinite', animationDelay: '14s' }} />
      </div>

      {/* Ambient Celestial Clock (Realtime twelve hours decoration) */}
      <div className="absolute top-2 right-4 w-12 h-12 opacity-80 pointer-events-none select-none z-[12] mt-4 mr-3 flex items-center justify-center">
        <Compass size={14} className="text-[#C8A55A] animate-[spin_40s_linear_infinite] absolute" />
        <div className="text-[9px] font-serif text-[#C8A55A] font-extrabold rotate-12 bg-[#F9F6EE]/95 px-1.5 py-0.5 border border-[#C8A55A]/35 rounded-sm shadow-sm scale-85 z-10">
          {shichen.name}
        </div>
      </div>

      {/* Decorative Traditional Tally Board Layout - Player Identity */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#F6EFE2]/95 border-2 border-[#3D2F22] rounded-md relative overflow-hidden shadow-[0_6px_20px_rgba(61,47,34,0.14)] p-4 mb-5 border-b-[6px] border-b-[#3D2F22] z-10"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(111,143,114,0.02) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      >
        {/* Subtle Silk borders decoration */}
        <div className="absolute inset-y-0 left-0.5 w-[3px] bg-gradient-to-b from-[#C8A55A] via-[#6F8F72] to-[#C8A55A] opacity-80" />
        <div className="absolute inset-y-0 right-0.5 w-[3px] bg-gradient-to-b from-[#C8A55A] via-[#6F8F72] to-[#C8A55A] opacity-80" />
        
        {/* Imperial Seal Overlay in Background */}
        <div className="absolute bottom-1 right-8 w-14 h-14 bg-[#C8102E]/6 text-[#C8102E]/25 text-[5px] border border-dashed border-[#C8102E]/20 rounded-sm rotate-12 flex items-center justify-center font-serif leading-tight text-center p-1 pointer-events-none select-none">
          至尊<br />大宋御览
        </div>

        {/* Real-time Double hour banner */}
        <div className="mb-3 pb-1 border-b border-[#3D2F22]/20 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
            <span className="text-[10px] font-serif font-black text-emerald-800 tracking-wider">
              {shichen.name} · {shichen.title}
            </span>
          </div>
          <span className="text-[8px] font-serif text-[#C8A55A] font-bold text-right italic truncate max-w-[210px] tracking-wide">
            “{shichen.poem}”
          </span>
        </div>

        {/* User Identity Details banner */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Spinning active ring around active user avatar */}
              <div className="absolute -inset-1 rounded-full border border-dashed border-[#C8A55A]/50 animate-[spin_20s_linear_infinite]" />
              <div className="w-12 h-12 bg-gradient-to-br from-[#3D2F22] to-[#1A130D] rounded-full flex items-center justify-center border border-[#C8A55A] shadow-inner text-[#F7F2E8] font-bold text-2xl relative z-10">
                {currentAvatarEmoji}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1 flex-wrap gap-y-0.5">
                <span className="font-bold text-md font-serif text-[#3D2F22]">大宋才子</span>
                <span className="px-1.5 py-0.5 bg-[#3D2F22] text-[#F7F2E8] text-[9px] rounded-sm font-semibold flex items-center border border-[#C8A55A]/30 leading-none">
                  <Award size={9} className="mr-0.5 text-[#C8A55A]" />
                  {player.rank}
                </span>
              </div>
              <p className="text-[9px] text-stone-500 mt-1 font-mono flex items-center">
                <Sparkles size={9} className="text-[#C8A55A] mr-0.5" />
                功勋总览: <span className="font-bold ml-1 text-stone-700">{player.exp} EXP</span>
              </p>
            </div>
          </div>

          {/* Golden Copper coins */}
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-[#3D2F22]/5 border border-[#3D2F22]/20 rounded-full shadow-inner text-[#3D2F22] font-black font-mono">
              <Coins size={13} className="text-[#C8A55A]" />
              <span className="text-sm">{player.coins}</span>
            </div>
          </div>
        </div>

        {/* Refined "Painting Scroll" Progress Bar */}
        {nextRank && (
          <div className="w-full mt-3 bg-gradient-to-r from-transparent via-[#3D2F22]/5 to-transparent p-1.5 rounded-sm">
            <div className="flex justify-between items-center text-[9px] text-[#3D2F22]/80 mb-0.5 pr-1 font-serif">
              <span>晋升至 <b className="text-dark bg-[#3D2F22]/10 px-1 rounded-sm">{nextRank}</b></span>
              <span className="font-mono">尚需 {currentThreshold - player.exp} 功勋</span>
            </div>

            <div className="relative flex items-center h-4 mt-1">
              {/* Left Scroll Spindle */}
              <div className="absolute left-0 w-1 y-full h-4 bg-[#735A22] rounded-full border border-[#3D2F22] z-10 animate-pulse" />
              
              {/* Progress Groove (Rice paper scroll backing) */}
              <div className="flex-1 mx-0.5 bg-[#DFD6C3] border border-dashed border-[#3D2F22]/30 h-1.5 rounded-sm overflow-hidden relative">
                {/* Visual grid markings mimicking traditional calligraphic guidelines */}
                <div className="absolute inset-0 flex justify-around opacity-25 pointer-events-none">
                  <span className="border-r border-[#3D2F22] h-full" />
                  <span className="border-r border-[#3D2F22] h-full" />
                  <span className="border-r border-[#3D2F22] h-full" />
                </div>
                {/* Active Green Unfolding bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${expProgressPercent}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#6F8F72] via-[#516E5D] to-[#3D2F22] relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                </motion.div>
              </div>

              {/* Unfolding handle - Golden Jade Pendant moving dynamically */}
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: `calc(${expProgressPercent}% - 6px)` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute w-3 h-3 rounded-full bg-radial from-[#FFE4A0] to-[#C8A55A] border border-[#3D2F22] shadow-sm z-20 flex items-center justify-center cursor-pointer"
              >
                <div className="w-1 h-1 rounded-full bg-[#3D2F22]" />
              </motion.div>

              {/* Right Scroll Spindle */}
              <div className="absolute right-0 w-1 y-full h-4 bg-[#735A22] rounded-full border border-[#3D2F22] z-10 animate-pulse" />
            </div>
          </div>
        )}
      </motion.div>

      {/* Grid Highlights with fine-crafted borders */}
      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          whileHover={{ y: -1.5 }}
          className="bg-[#FBF9F4]/95 border border-[#3D2F22]/40 rounded-sm p-3 shadow-[0_3px_10px_rgba(61,47,34,0.08)] flex items-center justify-between border-l-3 border-l-[#C8A55A]"
        >
          <div>
            <span className="text-[#3D2F22]/60 text-[10px] font-serif block tracking-wider">最高雅集分</span>
            <span className="text-2xl font-black font-mono tracking-tight text-[#3D2F22]">
              {player.highScore}
            </span>
          </div>
          <Flame size={18} className="text-amber-600 opacity-75 animate-pulse shrink-0 ml-1" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          whileHover={{ y: -1.5 }}
          className="bg-[#FBF9F4]/95 border border-[#3D2F22]/40 rounded-sm p-3 shadow-[0_3px_10px_rgba(61,47,34,0.08)] flex items-center justify-between border-l-3 border-l-[#6F8F72]"
        >
          <div>
            <span className="text-[#3D2F22]/60 text-[10px] font-serif block tracking-wider">点茶茶韵</span>
            <span className="text-2xl font-black font-mono tracking-tight text-[#516E5D]">
              {player.teaCharm}
            </span>
          </div>
          <div className="w-6.5 h-6.5 rounded-full border border-[#516E5D] bg-[#E3EDE4] flex items-center justify-center text-[#516E5D] font-bold text-xs shadow-inner animate-[swayWind_5s_infinite_ease-in-out]">
            茶
          </div>
        </motion.div>
      </div>

      {/* Exquisite Hanging Title Plaque */}
      <div className="text-center mb-6 relative flex flex-col items-center z-10">
        {/* Plaque chains */}
        <div className="flex justify-between w-28 h-4 opacity-40">
          <div className="w-[1.5px] h-full bg-[#3D2F22] border-dashed border-t" />
          <div className="w-[1.5px] h-full bg-[#3D2F22] border-dashed border-t" />
        </div>
        <motion.div 
          animate={{ rotate: [0, 0.4, -0.4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative px-8 py-2 bg-gradient-to-b from-[#F2EADA] to-[#EBE2D0] border-2 border-[#3D2F22] shadow-[0_4px_10px_rgba(61,47,34,0.15)] rounded-sm min-w-[185px]"
        >
          {/* Wooden border corners */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#3D2F22]/40" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#3D2F22]/40" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#3D2F22]/40" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#3D2F22]/40" />

          {/* Vermilion Stamp seal on title */}
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#C8102E]/90 text-white text-[7px] font-bold rounded-sm rotate-12 flex items-center justify-center border border-[#9A0D22] shadow-inner font-serif scale-85">
            雅集
          </div>

          <h2 className="text-xl font-bold text-[#3D2F22] tracking-[0.3em] font-serif pl-[0.3em]">
            雅集行廊
          </h2>
          <div className="text-[7.5px] font-mono text-stone-500 uppercase tracking-[0.35em] mt-0.5">
            - BIANJING YAJI -
          </div>
        </motion.div>
        
        {/* Decorative Hanging Tassel */}
        <motion.div 
          animate={{ rotate: [-2, 3, -3, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1.5px] h-5 bg-[#C8102E] origin-top relative flex justify-center"
        >
          <div className="absolute bottom-0 w-2 h-2 rounded-full bg-[#C8102E] flex items-center justify-center shadow-sm">
            <span className="text-[4px] scale-75 text-amber-300">★</span>
          </div>
        </motion.div>
      </div>

      {/* Main Verticals Menu */}
      <div className="flex-1 flex flex-col space-y-3 pb-12 z-10 relative">
        {menuItems.map((item, index) => {
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ 
                scale: 1.025, 
                backgroundColor: item.highlight ? '#FCFAF4' : '#FAF6EE',
                boxShadow: '0 8px 20px rgba(61,47,34,0.12)'
              }}
              whileTap={{ scale: 0.985 }}
              onClick={item.action}
              className={`w-full text-left p-3.5 rounded-sm flex items-center justify-between transition-all border relative overflow-hidden ${
                item.highlight
                  ? 'bg-gradient-to-r from-[#FCFAF4] to-[#F1EDE3] border-2 border-[#3D2F22] shadow-[0_5px_15px_rgba(111,143,114,0.15)] font-bold'
                  : 'bg-[#FDFBF7]/95 border-[#3D2F22]/20 hover:border-[#3D2F22]'
              }`}
            >
              {/* Premium Background Paper lines overlay for texture */}
              <div className="absolute inset-0 bg-radial-at-br from-stone-400/[0.03] to-transparent pointer-events-none" />
              
              {/* Woodblock margin accent line to make it look extremely premium */}
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                item.highlight ? 'bg-[#6F8F72]' : 'bg-[#C8A55A]/50'
              }`} />

              <div className="flex items-center space-x-3.5 pl-1.5">
                <div className={`p-2 rounded-full flex items-center justify-center ${item.iconBg} relative`}>
                  {/* Rotating decorative halo around highlight icons */}
                  {item.highlight && (
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#FAF4EC] animate-[spin_10s_linear_infinite]" />
                  )}
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-bold font-serif leading-tight ${item.highlight ? 'text-lg text-[#3E5240]' : 'text-[#3D2F22]'}`}>
                      {item.name}
                    </h3>

                    {/* Pulse vermilion seal/tag */}
                    {item.tag && (
                      <span className={`px-1 rounded-sm text-yellow-50 text-[8px] font-serif ${item.tagColor} leading-none py-0.5 animate-pulse`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5 max-w-[210px] truncate leading-tight font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
              
              {/* Classical "➔" entry button with exquisite texture */}
              <div className="flex items-center space-x-1.5 pr-1.5">
                <span className="text-[11px] font-semibold tracking-wider font-serif text-[#C8A55A] hover:text-[#3D2F22]">
                  {item.highlight ? '开启' : '雅鉴'}
                </span>
                <span className="text-xs text-[#C8A55A] transform translate-y-[0.5px]">➔</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
