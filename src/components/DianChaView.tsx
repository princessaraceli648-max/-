/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Thermometer, Wind, Sparkles, Coins, HelpCircle, Check, Award } from 'lucide-react';
import { PlayerState } from '../types';
import { SoundManager } from './SoundManager';

interface DianChaProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings' | 'diancha' | 'feihua') => void;
  soundEnabled: boolean;
}

// Preset patterns for Froth painting (水丹青 - Tea Art)
const TEA_ART_PRESETS = [
  {
    id: 'bamboo',
    name: '碧翠墨竹',
    icon: '🎋',
    desc: '苏轼云：“宁可食无肉，不可居无竹。”竹影横斜，高节清风。',
    difficulty: '举人品级',
    points: 35,
    path: [
      { x: 30, y: 70 }, { x: 45, y: 40 }, { x: 50, y: 35 }, // Stem 1
      { x: 50, y: 75 }, { x: 58, y: 45 }, { x: 62, y: 30 }, // Stem 2
      { x: 45, y: 40 }, { x: 35, y: 38 }, { x: 28, y: 44 }, // Leaf left
      { x: 58, y: 45 }, { x: 72, y: 40 }, { x: 78, y: 46 }  // Leaf right
    ]
  },
  {
    id: 'crane',
    name: '晴空仙鹤',
    icon: '🦢',
    desc: '“晴空一鹤排云上，便引诗情到碧霄。”仙鹤凌霄，吉祥高雅。',
    difficulty: '进士品级',
    points: 45,
    path: [
      { x: 50, y: 65 }, { x: 40, y: 55 }, { x: 30, y: 53 }, // Wing Left
      { x: 50, y: 65 }, { x: 65, y: 54 }, { x: 75, y: 51 }, // Wing Right
      { x: 50, y: 65 }, { x: 50, y: 40 }, { x: 46, y: 30 }, // Neck & Head
      { x: 50, y: 65 }, { x: 45, y: 80 }, { x: 55, y: 81 }  // Tail
    ]
  },
  {
    id: 'moon',
    name: '太白邀月',
    icon: '🌙',
    desc: '“明月几时有？把酒问青天。”孤月皎洁，浮云伴侧。',
    difficulty: '秀才品级',
    points: 25,
    path: [
      { x: 50, y: 25 }, { x: 65, y: 32 }, { x: 70, y: 50 }, { x: 62, y: 68 }, { x: 45, y: 75 }, // Crescent outer
      { x: 50, y: 70 }, { x: 58, y: 58 }, { x: 58, y: 42 }, { x: 50, y: 30 } // Crescent inner
    ]
  },
  {
    id: 'orchid',
    name: '幽谷雅兰',
    icon: '🌸',
    desc: '“气如兰兮长不改，心若兰兮终不移。”幽兰自芬芳，王者之香。',
    difficulty: '翰林品级',
    points: 50,
    path: [
      { x: 50, y: 80 }, { x: 35, y: 65 }, { x: 25, y: 45 }, { x: 28, y: 30 }, // Blade 1
      { x: 50, y: 80 }, { x: 62, y: 70 }, { x: 75, y: 52 }, { x: 72, y: 35 }, // Blade 2
      { x: 47, y: 65 }, { x: 53, y: 55 }, { x: 50, y: 48 }, // Petal
      { x: 52, y: 63 }, { x: 42, y: 58 }  // Stem
    ]
  }
];

export const DianChaView: React.FC<DianChaProps> = ({ player, setPlayer, onNavigate, soundEnabled }) => {
  // Game phases: 'brew' (brew temp selection) -> 'whisk' (dynamic clicking/whisking) -> 'paint' (foam drawing) -> 'finish' (results and badge)
  const [phase, setPhase] = useState<'brew' | 'whisk' | 'paint' | 'finish'>('brew');
  
  // Brew phase states
  const [temperature, setTemperature] = useState<number>(85); // Ideal is 85-92℃

  // Whisk phase states
  const [whiskProgress, setWhiskProgress] = useState<number>(0);
  const [whiskSpeed, setWhiskSpeed] = useState<number>(0);
  const [whiskStrokes, setWhiskStrokes] = useState<number>(0);
  const whiskInterval = useRef<any>(null);

  // Paint phase states
  const [selectedPreset, setSelectedPreset] = useState<typeof TEA_ART_PRESETS[0]>(TEA_ART_PRESETS[2]);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [hasStamped, setHasStamped] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  // Rewards calculation
  const [earnedCharm, setEarnedCharm] = useState<number>(0);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [earnedExp, setEarnedExp] = useState<number>(0);

  // Sound triggers on phase transition
  useEffect(() => {
    if (phase === 'whisk') {
      whiskInterval.current = setInterval(() => {
        setWhiskSpeed(prev => Math.max(0, prev - 3));
      }, 150);
    } else {
      if (whiskInterval.current) {
        clearInterval(whiskInterval.current);
      }
    }
    return () => {
      if (whiskInterval.current) {
        clearInterval(whiskInterval.current);
      }
    };
  }, [phase]);

  // Brew confirm
  const handleConfirmBrew = () => {
    SoundManager.playClick(soundEnabled);
    setPhase('whisk');
  };

  // Click / Whisk action
  const handleWhiskAction = () => {
    if (whiskProgress >= 100) return;

    // Standard haptic & click sound
    SoundManager.playSlide(soundEnabled);
    if (navigator.vibrate) {
      navigator.vibrate(12);
    }

    setWhiskStrokes(prev => prev + 1);
    setWhiskSpeed(prev => Math.min(60, prev + 8));

    // Progress increments based on speed multiplier
    const extra = (whiskSpeed > 35) ? 3.5 : 2.0;
    setWhiskProgress(prev => {
      const next = Math.min(100, prev + extra);
      if (next >= 100) {
        setTimeout(() => {
          setPhase('paint');
          SoundManager.playSuccess(soundEnabled);
        }, 500);
      }
      return next;
    });
  };

  // Drawing canvas logic
  useEffect(() => {
    if (phase === 'paint' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawTeaBase(ctx, canvas.width, canvas.height);
      }
    }
  }, [phase, drawnPoints, selectedPreset, hasStamped]);

  const drawTeaBase = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);

    // 1. Dark Rabbit-hair glaze bowl boundary background
    const gradient = ctx.createRadialGradient(w/2, h/2, 5, w/2, h/2, w/2);
    gradient.addColorStop(0, '#2F2720'); // Pale center
    gradient.addColorStop(0.7, '#19130F'); // Deep bronze
    gradient.addColorStop(1, '#0C0A08'); // Dark rim
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(w/2, h/2, w/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Subtle rabbit-hair golden filaments
    ctx.strokeStyle = 'rgba(190, 150, 90, 0.12)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 360; i += 6) {
      const rad = i * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(w/2 + Math.cos(rad) * (w/2 - 8), h/2 + Math.sin(rad) * (h/2 - 8));
      ctx.lineTo(w/2 + Math.cos(rad) * (w/4), h/2 + Math.sin(rad) * (h/4));
      ctx.stroke();
    }

    // 2. Thick milky white tea froth layer
    // The higher the temperature accuracy (optimal 88C), the smoother/richer the froth
    const tempOptimalFactor = Math.max(0.2, 1 - Math.abs(temperature - 88) / 30);
    const frothRadius = (w/2 - 10) * (whiskProgress / 100);

    const frothGrad = ctx.createRadialGradient(w/2, h/2, frothRadius * 0.2, w/2, h/2, frothRadius);
    // Excellent froth is pure snowy white, poor is slightly watery green-yellow
    const colorPeak = tempOptimalFactor > 0.85 ? '255, 255, 252' : tempOptimalFactor > 0.6 ? '247, 243, 230' : '235, 233, 215';
    frothGrad.addColorStop(0, `rgba(${colorPeak}, 0.98)`);
    frothGrad.addColorStop(0.8, `rgba(${colorPeak}, 0.90)`);
    frothGrad.addColorStop(1, 'rgba(190, 175, 155, 0)');

    ctx.fillStyle = frothGrad;
    ctx.beginPath();
    ctx.arc(w/2, h/2, frothRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw preset reference dotted guides (水丹青 background target)
    ctx.strokeStyle = 'rgba(100, 80, 50, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    selectedPreset.path.forEach((pt, i) => {
      const px = (pt.x / 100) * w;
      const py = (pt.y / 100) * h;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // 4. Draw player freehand pen strokes
    ctx.strokeStyle = '#5A4633'; // Light tea-brown fluid lines
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(90, 70, 50, 0.15)';
    ctx.shadowBlur = 2;
    
    ctx.beginPath();
    drawnPoints.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset

    // 5. Red Scholar Seal Stamp
    if (hasStamped) {
      const stampX = w * 0.78;
      const stampY = h * 0.22;
      
      // Draw elegant square red stone seal
      ctx.fillStyle = '#C23A2B';
      ctx.fillRect(stampX - 14, stampY - 14, 28, 28);
      ctx.strokeStyle = '#D45041';
      ctx.lineWidth = 1;
      ctx.strokeRect(stampX - 13, stampY - 13, 26, 26);
      
      // Stamp text: '大宋才子' style
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8px Courier New, STKaiti, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('文', stampX, stampY - 5);
      ctx.fillText('章', stampX, stampY + 5);
    }
  };

  const handleCanvasStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const coords = getEventCoords(e);
    if (coords) {
      SoundManager.playSlide(soundEnabled);
      setDrawnPoints([coords]);
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const coords = getEventCoords(e);
    if (coords) {
      setDrawnPoints(prev => [...prev, coords]);
    }
  };

  const handleCanvasEnd = () => {
    isDrawing.current = false;
  };

  const getEventCoords = (e: any) => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Map to canvas coordinate system
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  // Stamp action
  const handleApplyStamp = () => {
    if (drawnPoints.length < 5) return;
    SoundManager.playSuccess(soundEnabled);
    setHasStamped(true);
  };

  // Submit and calculate score
  const handleSubmitTeaArt = () => {
    SoundManager.playSuccess(soundEnabled);

    // Calculate accuracy by structural comparison to the preset template
    // How well did player trail cover the coordinates of selectedPreset.path
    if (drawnPoints.length === 0) {
      setAccuracy(0);
      setPhase('finish');
      return;
    }

    // Simple geometric comparison: check match rate of template dots matched by drawing lines
    let hitCount = 0;
    const canvas = canvasRef.current;
    if (canvas) {
      const w = canvas.width;
      const h = canvas.height;
      
      selectedPreset.path.forEach(target => {
        const tx = (target.x / 100) * w;
        const ty = (target.y / 100) * h;
        
        // Find if user drew any point within 16 pixels
        const matched = drawnPoints.some(uPt => {
          return Math.hypot(uPt.x - tx, uPt.y - ty) < 22;
        });
        if (matched) hitCount++;
      });
    }

    const matchScore = Math.floor((hitCount / selectedPreset.path.length) * 100);
    const finalAccuracy = Math.min(100, Math.max(10, matchScore + (hasStamped ? 5 : 0)));
    setAccuracy(finalAccuracy);

    // Factors: Froth temperature accuracy (Optimal: 88℃), clicking whisks, and tracing accuracy
    const tempFactor = Math.max(0.4, 1 - Math.abs(temperature - 88) / 40);
    const basePts = selectedPreset.points;
    const performanceFactor = (finalAccuracy / 100) * tempFactor;

    // Outputs
    const rewardCharm = Math.round(basePts * performanceFactor);
    const rewardCoins = Math.round(basePts * 2.5 * performanceFactor);
    const rewardExp = Math.round(basePts * 1.5 * performanceFactor);

    setEarnedCharm(rewardCharm);
    setEarnedCoins(rewardCoins);
    setEarnedExp(rewardExp);

    // Commit rewards
    setPlayer(prev => {
      // Find new rank if experience overflows thresholds
      let nextExp = prev.exp + rewardExp;
      return {
        ...prev,
        teaCharm: Math.min(200, prev.teaCharm + rewardCharm),
        coins: prev.coins + rewardCoins,
        exp: nextExp
      };
    });

    setPhase('finish');
  };

  const handleResetBowl = () => {
    SoundManager.playClick(soundEnabled);
    setDrawnPoints([]);
    setHasStamped(false);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#FDFBF7] flex flex-col p-4 text-[#2F2F2F]">
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2">
        <button
          onClick={() => {
            SoundManager.playClick(soundEnabled);
            onNavigate('menu');
          }}
          className="p-1 px-2 hover:bg-stone-100 rounded-sm text-stone-600 flex items-center space-x-1"
        >
          <ArrowLeft size={16} />
          <span className="font-serif text-xs">返回行廊</span>
        </button>
        <div className="flex items-center space-x-1 bg-[#6F8F72]/15 text-[#516E5D] px-2.5 py-1 rounded-sm text-xs font-serif border border-[#6F8F72]/30">
          <span>煮水点茶 · 水丹青</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-serif font-black tracking-widest text-[#243525] flex items-center justify-center space-x-1.5">
          <span>点茶斗茶室</span>
          <Sparkles className="text-[#C8A55A] animate-pulse" size={16} />
        </h2>
        <p className="text-[10px] text-stone-500 font-serif leading-relaxed mt-1">
          点茶：大宋士子四般闲事之一，击拂茶汤，以雪白泡沫托出宋词风雅画境。
        </p>
      </div>

      {/* Current Player Inventory Indicator */}
      <div className="bg-[#FAF6EE] border border-stone-200 round-sm p-2 flex justify-between text-xs font-mono mb-4 text-stone-600">
        <div className="flex items-center space-x-1">
          <span className="font-serif">茶道茶韵:</span>
          <span className="font-bold text-[#A4762E]">{player.teaCharm} / 200</span>
        </div>
        <div className="flex items-center space-x-1">
          <Coins size={12} className="text-amber-500" />
          <span className="font-bold">{player.coins}文</span>
        </div>
      </div>

      {/* Phase Renderers */}
      <div className="flex-1 flex flex-col justify-center">
        
        {/* PHASE 1: BREWING TEMPERATURE */}
        {phase === 'brew' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FAF4EC]/95 border-2 border-[#6F8F72] rounded-sm p-5 shadow-lg flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-[#6F8F72]/10 rounded-full flex items-center justify-center text-3xl mb-3">
              🍵
            </div>
            <h3 className="font-serif font-bold text-[#516E5D] text-base mb-1">第一步：调羹煮水</h3>
            <p className="text-center text-xs text-stone-500 mb-6">
              点茶以 **88℃** 的“缾笙微响”蟹眼水为最佳。水温过高则老，过低则茶末沉底无法起膏。
            </p>

            {/* Simulated Water Kettle Thermometer slider */}
            <div className="w-full flex items-center justify-between space-x-4 mb-6">
              <Thermometer size={24} className="text-[#C23A2B] animate-pulse" />
              <div className="flex-1">
                <div className="flex justify-between font-mono text-[10px] text-stone-400 mb-1">
                  <span>温吞水 60℃</span>
                  <span className="text-[#C8A55A]">蟹眼沸鸣 88℃</span>
                  <span>滚沸 100℃</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={temperature}
                  onChange={(e) => {
                    setTemperature(parseInt(e.target.value));
                    if (Math.random() < 0.15) SoundManager.playSlide(soundEnabled);
                  }}
                  className="w-full accent-[#C8A55A] h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="font-mono text-base font-bold text-[#3D2F22] w-12 text-right">
                {temperature}℃
              </span>
            </div>

            {/* Quality Hint */}
            <div className="py-2.5 px-4 bg-[#6F8F72]/10 border border-[#6F8F72]/30 rounded-sm text-center text-xs text-[#516E5D] font-serif mb-6 w-full">
              {temperature === 88 ? (
                <span>🌟 完美！“蟹眼已过鱼眼生，笙声微响最香新。”</span>
              ) : Math.abs(temperature - 88) <= 4 ? (
                <span>👍 水温上佳，能激发浓密持久的白乳茶泡沫。</span>
              ) : (
                <span>⚠️ 水温偏离标准，击拂茶末或将受限制。</span>
              )}
            </div>

            <button
              onClick={handleConfirmBrew}
              className="w-full py-3 bg-[#6F8F72] text-[#F7F2E8] shadow-md hover:bg-[#516E5D] transition-colors font-serif font-bold text-sm tracking-widest pl-[0.5em] rounded-sm cursor-pointer"
            >
              注水入盏
            </button>
          </motion.div>
        )}

        {/* PHASE 2: WHISKING (BEATING THE TEA BAMBOO WHISK) */}
        {phase === 'whisk' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-2 mb-4"
          >
            <div className="mb-2 text-center">
              <span className="text-xs font-serif bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                注水完毕 · 击拂茶汤
              </span>
              <p className="text-stone-500 text-[10px] p-1 mt-1 font-serif">
                快速连续点击或拖动茶碗，以竹筅（茶筅）疯狂搅拌茶粉，使茶沫升华雪白！
              </p>
            </div>

            {/* Bowl with rising tea froth particles */}
            <div className="relative w-56 h-56 rounded-full border-4 border-[#3D2F22] bg-[#111] shadow-2xl flex items-center justify-center overflow-hidden mb-6 select-none">
              
              {/* Outer water level */}
              <div 
                className="absolute inset-0 bg-[#354D3D] opacity-40 transition-all duration-300 pointer-events-none"
                style={{ scale: 0.95 }}
              />

              {/* White Froth cloud layer */}
              <motion.div
                animate={{
                  scale: (whiskProgress / 100) * 0.9 + 0.1,
                  rotate: whiskSpeed * 10
                }}
                className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#FFFEFA] to-[#EEEDD5] border border-[#DDD] blur-[3px] pointer-events-none opacity-90 flex items-center justify-center"
              >
                {/* Whisk froth pattern lines */}
                {whiskProgress > 40 && (
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#A4762E]/30 animate-spin-slow opacity-60" />
                )}
              </motion.div>

              {/* Interactive tap target bowl area */}
              <div
                onClick={handleWhiskAction}
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center text-center justify-items-center group"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="bg-[#FAF4EC]/85 hover:bg-[#FAF4EC] rounded-full p-3.5 border border-[#C8A55A] shadow-lg flex flex-col items-center justify-center select-none"
                >
                  <Wind className="text-[#6F8F72] animate-bounce mb-1" size={24} />
                  <span className="font-serif font-black text-xs text-[#3D2F22] select-none tracking-widest pl-[1px]">
                    击拂筅帚
                  </span>
                  <span className="font-mono text-[9px] text-stone-500 mt-0.5">STROKES: {whiskStrokes}</span>
                </motion.div>
              </div>

              {/* Dynamic swift particles */}
              {whiskSpeed > 10 && (
                <div className="absolute inset-0 border border-t-2 border-amber-300/40 rounded-full animate-spin pointer-events-none" />
              )}
            </div>

            {/* Bubble Progress Monitor bar */}
            <div className="w-full max-w-sm">
              <div className="flex justify-between items-center text-xs font-serif text-stone-600 mb-1">
                <span>泡沫稠厚度 (Froth Meter)</span>
                <span className="font-bold text-[#6F8F72] font-mono">{Math.floor(whiskProgress)}%</span>
              </div>
              <div className="w-full bg-stone-200 h-3 border border-stone-300 overflow-hidden rounded-full mb-1">
                <div
                  className="h-full bg-gradient-to-r from-[#C2D6C4] via-[#6F8F72] to-white transition-all duration-100"
                  style={{ width: `${whiskProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-[#A4762E] text-center font-serif mt-1 animate-pulse">
                已进入连环击拂: {whiskSpeed > 30 ? '🔥 极速飞拂中 (加倍)' : '⚡ 请快速点击搅拌'}
              </p>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: SHUI DAN QING (PAINTING PRESET PATTERNS ON FROTH) */}
        {phase === 'paint' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="mb-3 text-center">
              <span className="text-xs font-serif bg-[#6F8F72]/20 text-[#3E5240] px-2.5 py-0.5 rounded-full font-bold">
                第二步：画水丹青
              </span>
              <p className="text-stone-500 text-[10px] mt-1 font-serif max-w-xs mx-auto">
                茶汤泡沫已雪白凝聚！请选一个【丹青谱】，按虚线指导在白乳泡沫上按压鼠标或触摸画出墨迹茶纹。
              </p>
            </div>

            {/* Target Select Row */}
            <div className="grid grid-cols-4 gap-2 mb-3.5 w-full">
              {TEA_ART_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      SoundManager.playClick(soundEnabled);
                      setSelectedPreset(preset);
                      setDrawnPoints([]);
                      setHasStamped(false);
                    }}
                    className={`flex flex-col items-center justify-between p-1.5 border rounded-sm transition-all focus:outline-none ${
                      isSelected
                        ? 'bg-[#6F8F72]/15 border-[#6F8F72] shadow-sm'
                        : 'bg-[#FAF4EC]/40 border-stone-200'
                    }`}
                  >
                    <span className="text-lg">{preset.icon}</span>
                    <span className="text-[9px] font-bold font-serif text-[#333] whitespace-nowrap mt-1">
                      {preset.name.slice(2)}
                    </span>
                    <span className="text-[8px] font-mono text-stone-400">
                      +{preset.points}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Painting Canvas & Glazed Tea Bowl */}
            <div className="relative w-64 h-64 mx-auto select-none overflow-hidden touch-none mb-3">
              <canvas
                ref={canvasRef}
                width={256}
                height={256}
                onMouseDown={handleCanvasStart}
                onMouseMove={handleCanvasMove}
                onMouseUp={handleCanvasEnd}
                onMouseLeave={handleCanvasEnd}
                onTouchStart={handleCanvasStart}
                onTouchMove={handleCanvasMove}
                onTouchEnd={handleCanvasEnd}
                className="w-full h-full cursor-crosshair block rounded-full"
              />
            </div>

            {/* Quick Actions for Painting */}
            <div className="flex space-x-2.5 mb-2.5 w-full">
              <button
                onClick={handleResetBowl}
                className="flex-1 py-1.5 border border-stone-350 bg-white text-stone-600 hover:text-stone-800 rounded-sm text-xs font-serif font-medium cursor-pointer"
              >
                重洗笔砚 (重画)
              </button>

              <button
                onClick={handleApplyStamp}
                disabled={drawnPoints.length < 5 || hasStamped}
                className={`flex-1 py-1.5 border rounded-sm text-xs font-serif font-black tracking-widest cursor-pointer ${
                  hasStamped 
                    ? 'bg-stone-150 border-stone-300 text-stone-400'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-500 shadow-sm'
                }`}
              >
                {hasStamped ? '已加盖才子玺' : '加盖才子红色印玺'}
              </button>
            </div>

            {/* Submit design bowl button */}
            <button
              onClick={handleSubmitTeaArt}
              disabled={drawnPoints.length === 0}
              className={`w-full py-2.5 font-serif font-bold text-xs tracking-[0.25em] pl-[0.25em] rounded-sm transition-all text-center justify-center flex items-center shadow-md cursor-pointer ${
                drawnPoints.length === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                  : 'bg-[#6F8F72] text-[#F7F2E8] hover:bg-[#516E5D] border border-emerald-800'
              }`}
            >
              呈送贡茶品评
            </button>
          </motion.div>
        )}

        {/* PHASE 4: FINISHED RESULTS AND REWARDS */}
        {phase === 'finish' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF4EC]/95 border-2 border-[#C8A55A] rounded-sm p-4 text-center shadow-xl relative"
          >
            {/* Custom glowing seal background */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent pointer-events-none rounded-sm" />

            <div className="w-16 h-16 rounded-full bg-[#C8A55A]/20 flex items-center justify-center text-3xl mx-auto mb-3 border border-[#C8A55A]">
              💮
            </div>

            <h3 className="font-serif font-extrabold text-xl text-[#8A6A32] tracking-wide mb-1">
              茶汤品评结果
            </h3>
            <p className="text-[10px] text-stone-500 font-serif">
              宋廷御画师、点茶大师及大学士高度品评
            </p>

            <div className="my-4 border-t border-b border-[#C8A55A]/30 py-3 bg-white/50 px-2 rounded-sm">
              <div className="flex justify-between items-center text-xs font-serif text-stone-600 mb-1.5">
                <span>丹青契合度:</span>
                <span className="font-black text-stone-800 font-mono text-sm">{accuracy}%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-serif text-stone-600">
                <span>御评品级:</span>
                <span className="font-black text-rose-700">
                  {accuracy && accuracy > 90 
                    ? '神品 (御赞特赐)' 
                    : accuracy && accuracy > 75 
                    ? '妙品 (流丽端庄)' 
                    : accuracy && accuracy > 55 
                    ? '能品 (清新可赏)' 
                    : '凡品'}
                </span>
              </div>
            </div>

            {/* Rewards show block */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="bg-[#FAF6EE] p-2 rounded border border-stone-200">
                <div className="text-[10px] text-stone-500 font-serif">增加茶韵</div>
                <div className="text-sm font-black font-mono text-[#8A6A32]">+{earnedCharm}</div>
              </div>
              <div className="bg-[#FAF6EE] p-2 rounded border border-stone-200">
                <div className="text-[10px] text-stone-500 font-serif">赐赐铜钱</div>
                <div className="text-sm font-bold font-mono text-amber-600">+{earnedCoins}</div>
              </div>
              <div className="bg-[#FAF6EE] p-2 rounded border border-stone-200">
                <div className="text-[10px] text-stone-500 font-serif">累积功勋</div>
                <div className="text-sm font-bold font-mono text-emerald-700">+{earnedExp} EXP</div>
              </div>
            </div>

            <div className="text-left text-xs bg-amber-50/70 p-3 rounded-sm border border-amber-200/50 mb-5">
              <div className="font-serif font-black text-[#8A6A32] flex items-center space-x-1.5 mb-1 text-[11px]">
                <Award size={13} />
                <span>风雅物志记载:</span>
              </div>
              <p className="text-stone-600 text-[10px] font-sans leading-relaxed">
                {selectedPreset.desc} 您精心击拂的茶沫均匀堆起，{selectedPreset.name}的白乳图形宛如真景，{hasStamped ? '盖以才子金石印章，尽显书香世家风流气宇。' : '如幻似真，令宋代诸子流连赞叹。'}
              </p>
            </div>

            <button
              onClick={() => {
                SoundManager.playClick(soundEnabled);
                onNavigate('menu');
              }}
              className="w-full py-2.5 bg-gradient-to-r from-[#C8A55A] to-[#A4762E] text-[#3D2F22] hover:brightness-105 transition-all font-serif font-extrabold text-xs tracking-wider rounded-sm shadow-md cursor-pointer"
            >
              收下赏金与茶韵
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
