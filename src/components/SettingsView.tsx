/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Languages, HelpCircle, HardDriveDownload } from 'lucide-react';
import { SettingsState } from '../types';
import { SoundManager } from './SoundManager';

interface SettingsProps {
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings') => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsProps> = ({ settings, setSettings, onNavigate, onResetData }) => {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleMusic = () => {
    const nextVal = !settings.musicOn;
    setSettings((prev) => ({ ...prev, musicOn: nextVal }));
    SoundManager.playClick(settings.soundOn);
    // Control BGM playback safely
    if (nextVal) {
      SoundManager.startBGM(true);
    } else {
      SoundManager.stopBGM();
    }
  };

  const toggleSound = () => {
    const nextVal = !settings.soundOn;
    setSettings((prev) => ({ ...prev, soundOn: nextVal }));
    SoundManager.playClick(nextVal);
  };

  const toggleVibration = () => {
    setSettings((prev) => ({ ...prev, vibrationOn: !prev.vibrationOn }));
    SoundManager.playClick(settings.soundOn);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const changeLanguage = (lang: 'zh' | 'zt' | 'en') => {
    setSettings((prev) => ({ ...prev, language: lang }));
    SoundManager.playClick(settings.soundOn);
    setSuccessMsg(`语设已变换 / Setting updated!`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const triggerReset = () => {
    onResetData();
    setResetConfirm(false);
    SoundManager.playSuccess(settings.soundOn);
    setSuccessMsg('修行状态大梦一空，尽归初始！');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col px-3 py-4 text-[#2F2F2F] font-serif select-none">
      {/* Header index */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            SoundManager.playClick(settings.soundOn);
            onNavigate('menu');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F2E8] border border-stone-300 rounded-sm text-xs shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft size={13} />
          <span>回廊 (主页)</span>
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-widest text-[#2F2F2F]">书房静室 (设置)</h2>
        <p className="text-[10px] text-stone-500 font-sans mt-1">
          调琴弄丝，整理心神。在此处拂试过往墨渍与音韵选择
        </p>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#3D2F22] text-[#FAF4EC] text-xs font-bold px-4 py-2 rounded-sm shadow-md block text-center"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto max-h-[66vh] space-y-4 pr-1 pb-16">
        {/* Toggle option card */}
        <div className="bg-[#F7F2E8]/90 border border-stone-200 rounded-sm p-4 shadow-md space-y-4">
          <h4 className="font-bold text-sm text-[#3D2F22] border-b border-stone-200 pb-1.5 mb-2 flex items-center">
            <Volume2 size={14} className="mr-1.5 text-[#6F8F72]" />
            律乐调弦 (音量与触感)
          </h4>

          {/* Music Switch */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs font-serif block">琴曲背景乐 (BGM)</span>
              <span className="text-[9px] text-stone-500 font-sans mt-0.5">幽雅古埙笙箫乐律慢播。</span>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${
                settings.musicOn ? 'bg-[#6F8F72]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  settings.musicOn ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound FX Switch */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs font-serif block">弹击器鸣声 (SFX)</span>
              <span className="text-[9px] text-stone-500 font-sans mt-0.5">清亮古琴拨弦、清脆建盏撞击。</span>
            </div>
            <button
              onClick={toggleSound}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${
                settings.soundOn ? 'bg-[#6F8F72]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  settings.soundOn ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vibration switch */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs font-serif block">丝指微震动 (Haptic)</span>
              <span className="text-[9px] text-stone-500 font-sans mt-0.5">每次合成碰撞产生微震感知。</span>
            </div>
            <button
              onClick={toggleVibration}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${
                settings.vibrationOn ? 'bg-[#6F8F72]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  settings.vibrationOn ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Translation configuration */}
        <div className="bg-[#F7F2E8]/90 border border-stone-200 rounded-sm p-4 shadow-md space-y-3">
          <h4 className="font-bold text-sm text-[#3D2F22] border-b border-stone-200 pb-1.5 flex items-center">
            <Languages size={14} className="mr-1.5 text-indigo-500" />
            方言书体 (Language)
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'zh' as const, name: '简体中文' },
              { code: 'zt' as const, name: '繁體中文' },
              { code: 'en' as const, name: 'English' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`py-1.5 font-sans border text-xs font-semibold rounded-sm transition-all ${
                  settings.language === lang.code
                    ? 'bg-[#2F2F2F] font-bold text-white border-[#2F2F2F]'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-[#6F8F72]'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Danger Data Resets */}
        <div className="bg-[#FBF5F2]/90 border border-red-200 rounded-sm p-4 shadow-md space-y-3">
          <h4 className="font-bold text-sm text-red-800 border-b border-red-100 pb-1.5 flex items-center">
            <RefreshCw size={14} className="mr-1.5 text-red-650" />
            尘缘重置 (System Reset)
          </h4>
          <p className="text-[10px] text-stone-500 font-sans leading-normal">
            此举将洗清您一生的合成积分、通鉴收集记录与背包铜钱，一切归宿秀才尘世。
          </p>

          {!resetConfirm ? (
            <button
              onClick={() => {
                SoundManager.playClick(settings.soundOn);
                setResetConfirm(true);
              }}
              className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-300 text-xs rounded-sm transition-all w-full select-none"
            >
              一键拂拭过往
            </button>
          ) : (
            <div className="space-y-2 select-none">
              <span className="text-[10px] text-red-700 font-sans font-bold block mb-1">您当真要一梦成空吗？此举不可覆退！</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setResetConfirm(false)}
                  className="flex-1 py-1.5 bg-stone-200 text-stone-850 hover:bg-stone-300 rounded-sm text-xs font-bold"
                >
                  否，且留浮华
                </button>
                <button
                  onClick={triggerReset}
                  className="flex-1 py-1.5 bg-red-700 text-white hover:bg-red-800 rounded-sm text-xs font-bold"
                >
                  是，尽扫尘缘
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
