/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';

interface SplashProps {
  onEnter: () => void;
  soundEnabled: boolean;
}

export const SplashView: React.FC<SplashProps> = ({ onEnter, soundEnabled }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-12 text-[#2F2F2F] font-serif overflow-hidden select-none">
      {/* Decorative Traditional Border corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#6F8F72] opacity-80" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#6F8F72] opacity-80" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#6F8F72] opacity-80" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#6F8F72] opacity-80" />

      {/* Decorative Ink Brush overlay animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.15, 0.45, 0.15], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[600px] h-[600px] rounded-full bg-radial from-slate-400 to-transparent -z-10 filter blur-3xl pointer-events-none"
        style={{ left: '10%', top: '15%' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.1, 0.35, 0.1], scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[500px] h-[500px] rounded-full bg-radial from-emerald-200 to-transparent -z-10 filter blur-3xl pointer-events-none"
        style={{ right: '5%', bottom: '10%' }}
      />

      <div className="w-full max-w-sm flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-stone-500 font-sans tracking-[0.4em] text-xs uppercase mb-4"
        >
          - 宋代美学益智游戏 -
        </motion.div>

        {/* Vertical text banner for logo, mimicking traditional calligraphic seals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="relative flex flex-col items-center justify-center py-10 px-6 border-2 border-[#6F8F72] bg-[#F7F2E8]/90 shadow-2xl rounded-sm mb-10"
        >
          {/* Classic small red stamp seal */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-red-700 text-[#F7F2E8] text-[9px] font-bold rounded-sm flex items-center justify-center border border-red-800 leading-none shadow-sm rotate-6">
            神品
          </div>

          <h1 className="text-5xl font-extrabold tracking-[0.25em] writing-vertical text-[#2F2F2F] select-none text-shadow-sm font-serif">
            清明雅集
          </h1>
          <div className="w-1 h-12 bg-[#6F8F72] my-4 opacity-40" />
          <p className="text-stone-600 text-xs tracking-wider max-w-[200px] leading-relaxed">
            研墨点茶 $\cdot$ 抚琴博古
            <br />
            拼缀大宋盛世风华
          </p>
        </motion.div>
      </div>

      {/* Interactive elements */}
      <div className="w-full max-w-xs flex flex-col items-center space-y-8 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group relative w-full py-4 bg-gradient-to-r from-[#6F8F72] to-[#516E5D] text-[#F7F2E8] font-bold text-lg tracking-[0.5em] pl-[0.5em] rounded-sm shadow-xl hover:shadow-[#6F8F72]/30 active:translate-y-0.5 transition-all flex items-center justify-center border border-[#8AAC97] overflow-hidden"
        >
          {/* Subtle gold shine effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#C8A55A]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Play size={18} className="mr-2 fill-current animate-pulse text-[#C8A55A]" />
          开启雅集
        </motion.button>

        {/* Little interactive flavor text line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-stone-500 text-xs flex items-center space-y-1 sm:space-y-0 space-x-2"
        >
          <Sparkles size={11} className="text-[#C8A55A]" />
          <span>点击棋盘划动以合成大宋绝世瑰宝</span>
        </motion.div>
      </div>

      {/* Decorative footer landscape */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-30">
        {/* Symmetrical willow leaves branches hand-rendered vector or beautiful path */}
        <svg className="w-full h-full" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
          <path
            d="M 0,100 C 200,60 300,20 500,80 C 700,120 800,40 1000,100"
            stroke="#6F8F72"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          <circle cx="200" cy="80" r="2" fill="#6F8F72" />
          <circle cx="500" cy="50" r="3" fill="#C8A55A" />
          <circle cx="800" cy="70" r="2" fill="#6F8F72" />
        </svg>
      </div>
    </div>
  );
};
