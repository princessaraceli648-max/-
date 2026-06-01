/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Sparkles, AlertCircle, ArrowLeft, Coins, Award, HelpCircle, CupSoda, Volume2, VolumeX } from 'lucide-react';
import { Tile, PlayerState, LiteratiCharacter } from '../types';
import { ARTIFACTS_DB, slideBoard, spawnTile, initializeBoard, hasAvailableMoves, activateAutoMerge, triggerBoardCleansing, shuffleBoardTiles } from '../utils/gameLogic';
import { SoundManager } from './SoundManager';

interface GamePlayProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings') => void;
  settings: { musicOn: boolean; soundOn: boolean; vibrationOn: boolean };
}

// Encounter list
const LITERATI_POOL: LiteratiCharacter[] = [
  {
    id: 'sushi',
    name: '苏轼',
    title: '端明殿学士',
    quote: '“明月几时有？把酒问青天。不知天上宫阙，今夕是何年。”',
    buffDescription: '仙游人间，喜赠铜钱两百文！',
    color: 'from-[#6F8F72] to-[#516E5D]',
    borderColor: 'border-[#6F8F72]',
    avatar: '👨‍🎨',
  },
  {
    id: 'ouyangxiu',
    name: '欧阳修',
    title: '翰林学士',
    quote: '“醉翁之意不在酒，在乎山水之间也。山水之乐，得之心而寓之酒也。”',
    buffDescription: '醉意游吟，指点匠心。随机晋升一个低级物品！',
    color: 'from-amber-600 to-amber-800',
    borderColor: 'border-amber-600',
    avatar: '👨‍🦳',
  },
  {
    id: 'wanganshi',
    name: '王安石',
    title: '同中书门下平章事',
    quote: '“春风又绿江南岸，明月何时照我还？一水护田将绿绕，两山排闼送青来。”',
    buffDescription: '推行新政，清扫积弊。随机清除两个普通茶盏！',
    color: 'from-blue-600 to-blue-800',
    borderColor: 'border-blue-600',
    avatar: '👨‍💼',
  },
  {
    id: 'liqingzhao',
    name: '李清照',
    title: '易安居士',
    quote: '“常记溪亭日暮，沉醉不知归路。兴尽晚回舟，误入藕花深处。”',
    buffDescription: '柔转心旋，寻回过往。赠送一张珍贵【撤回卡】！',
    color: 'from-rose-500 to-pink-700',
    borderColor: 'border-rose-400',
    avatar: '👩‍🎤',
  },
  {
    id: 'luyou',
    name: '陆游',
    title: '宝华阁侍制',
    quote: '“矮纸斜行闲作草，晴窗细乳戏分茶。素衣莫起风尘叹，犹及清明可到家。”',
    buffDescription: '戏分点茶，雅趣盎然。额外拨赠 60 点精纯雅趣！',
    color: 'from-[#4D6F59] to-[#395342]',
    borderColor: 'border-[#4D6F59]',
    avatar: '👨‍🎓',
  },
  {
    id: 'xinqiji',
    name: '辛弃疾',
    title: '枢密都承旨',
    quote: '“众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。”',
    buffDescription: '金戈铁马，指破乾坤。御赐一卷【洗牌符】以度危局！',
    color: 'from-[#726B5E] to-[#454038]',
    borderColor: 'border-[#726B5E]',
    avatar: '🧔',
  },
  {
    id: 'liuyong',
    name: '柳永',
    title: '屯田员外郎',
    quote: '“今宵酒醒何处？杨柳岸，晓风残月。”',
    buffDescription: '浅斟低唱，市井清欢。赠予一卷【天工合璧符】（自动合成卡）！',
    color: 'from-[#B08975] to-[#8C5D47]',
    borderColor: 'border-[#B08975]',
    avatar: '🧑‍🎨',
  },
  {
    id: 'yanshu',
    name: '晏殊',
    title: '同平章事',
    quote: '“无可奈何花落去，似曾相识燕归来。小园香径独徘徊。”',
    buffDescription: '宰相风雅，珠玉词华。丰盛赠予 30 点雅趣与 150 文铜钱！',
    color: 'from-[#916B89] to-[#694261]',
    borderColor: 'border-[#916B89]',
    avatar: '👮',
  },
];

export const GamePlayView: React.FC<GamePlayProps> = ({ player, setPlayer, onNavigate, settings }) => {
  const [board, setBoard] = useState<Tile[]>([]);
  const [historyStack, setHistoryStack] = useState<{ board: Tile[]; score: number; teaCharm: number }[]>([]);
  const [encounter, setEncounter] = useState<LiteratiCharacter | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victoryCelebration, setVictoryCelebration] = useState<number | null>(null); // Track levels like 10, 12, 14, 15, 16
  const [localScore, setLocalScore] = useState(0);
  const [boardAnimate, setBoardAnimate] = useState<any>({ scale: 1, x: 0, y: 0, rotate: 0 });
  const [combo, setCombo] = useState(0);
  const [comboVisible, setComboVisible] = useState(false);
  const [particles, setParticles] = useState<{
    id: string;
    x: number;
    y: number;
    tx: number;
    ty: number;
    color: string;
    size: number;
    duration: number;
    rotate: number;
  }[]>([]);

  const triggerMergeParticles = (row: number, col: number, level: number) => {
    let levelColor = '#FFE082'; // Gold default
    if (level === 1) levelColor = '#9CA3AF'; // Silver/Grey
    else if (level <= 4) levelColor = '#8AAC97'; // Celadon green / Blue-green
    else if (level <= 7) levelColor = '#DFC190'; // Amber/Wood/Scroll
    else if (level <= 11) levelColor = '#F59E0B'; // Imperial gold
    else levelColor = '#3B82F6'; // Grand cyan

    const cellX = col * 24.8 + 12.2;
    const cellY = row * 24.8 + 12.2;

    const newParticles = Array.from({ length: 12 }).map((_, idx) => {
      const angle = (idx * (360 / 12) + Math.random() * 20) * (Math.PI / 180);
      const speed = 4 + Math.random() * 8;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed;

      return {
        id: `particle_${Date.now()}_${Math.random().toString(36).substring(2, 11)}_${idx}`,
        x: cellX,
        y: cellY,
        tx,
        ty,
        color: Math.random() < 0.4 ? '#FFFDF9' : levelColor,
        size: 3 + Math.random() * 5,
        duration: 0.4 + Math.random() * 0.4,
        rotate: Math.random() * 360,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1500);
  };

  // Initialize board
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const initial = initializeBoard();
    setBoard(initial);
    setHistoryStack([]);
    setGameOver(false);
    setEncounter(null);
    setVictoryCelebration(null);
    setLocalScore(0);
    SoundManager.playSuccess(settings.soundOn);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || encounter || showHelp || victoryCelebration) return;

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') direction = 'up';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') direction = 'down';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') direction = 'left';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') direction = 'right';

      if (direction) {
        e.preventDefault();
        handleSlide(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver, encounter, showHelp, victoryCelebration, player]);

  // Touch SWIPE triggers
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameOver || encounter || showHelp || victoryCelebration) return;

    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(diffX) > 40 || Math.abs(diffY) > 40) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) handleSlide('right');
        else handleSlide('left');
      } else {
        if (diffY > 0) handleSlide('down');
        else handleSlide('up');
      }
    }
  };

  // Central movement handle
  const handleSlide = (dir: 'up' | 'down' | 'left' | 'right') => {
    // Record current state in undo stack (max depth 10)
    const currentSnapshot = {
      board: JSON.parse(JSON.stringify(board)),
      score: localScore,
      teaCharm: player.teaCharm,
    };

    const result = slideBoard(board, dir);

    if (!result.wasMoved) return;

    // Trigger board sliding container physical animation
    let moveX = 0, moveY = 0;
    if (dir === 'left') moveX = -12;
    else if (dir === 'right') moveX = 12;
    else if (dir === 'up') moveY = -12;
    else if (dir === 'down') moveY = 12;

    setBoardAnimate({
      x: [0, moveX, 0],
      y: [0, moveY, 0],
      scale: [1, 0.98, 1],
      transition: { duration: 0.22, ease: 'easeInOut' }
    });

    // Tactile haptic feedback
    if (settings.vibrationOn && navigator.vibrate) {
      if (result.mergeCoordinates && result.mergeCoordinates.length > 0) {
        navigator.vibrate([15, 30, 20]);
      } else {
        navigator.vibrate(10);
      }
    }

    // Accumulate consecutive combo level matches
    if (result.mergeCoordinates && result.mergeCoordinates.length > 0) {
      setCombo((prev) => {
        const next = prev + result.mergeCoordinates.length;
        setComboVisible(true);
        return next;
      });
    } else {
      setCombo(0);
      setComboVisible(false);
    }

    // Trigger visual/audio feedback
    SoundManager.playSlide(settings.soundOn);

    // Dynamic particle burst based on merge coordinates from slide
    if (result.mergeCoordinates && result.mergeCoordinates.length > 0) {
      result.mergeCoordinates.forEach((mc) => {
        triggerMergeParticles(mc.row, mc.col, mc.level);
      });
    }

    let nextBoard = result.newBoard;
    nextBoard = spawnTile(nextBoard);

    const points = result.scoreAdded;
    const doubleActive = player.activeBuff === 'double_score';
    const finalPoints = doubleActive ? points * 2 : points;

    // Process new merges
    let newlyUnlocked: number[] = [];
    result.mergedLevels.forEach((lvl) => {
      SoundManager.playMerge(lvl, settings.soundOn);

      // Check if unlocked for the first time
      if (!player.unlockedList.includes(lvl) && !newlyUnlocked.includes(lvl)) {
        newlyUnlocked.push(lvl);
      }

      // Check if level warrants celebratory display scroll (Levels 10, 12, 14, 15, 16)
      if ([10, 12, 14, 15, 16].includes(lvl)) {
        setVictoryCelebration(lvl);
        SoundManager.playSuccess(settings.soundOn);
      }
    });

    const teaAdded = result.mergedLevels.reduce((acc, curr) => acc + curr * 2, 0);
    const coinsAdded = result.mergedLevels.reduce((acc, curr) => acc + curr * 3, 0);

    // Update coordinates and verify game over status
    setBoard(nextBoard);
    setLocalScore((prev) => prev + finalPoints);
    setHistoryStack((prev) => [currentSnapshot, ...prev].slice(0, 10));

    // Experience calculation
    const expHeuristic = Math.floor(finalPoints / 10) + (result.mergedLevels.length * 4);

    // Determine if we trigger a Literati Character Encounter (8% chance per successful slide)
    let triggeredEncounter: LiteratiCharacter | null = null;
    if (Math.random() < 0.08 && !encounter) {
      triggeredEncounter = LITERATI_POOL[Math.floor(Math.random() * LITERATI_POOL.length)];
      SoundManager.playEncounter(settings.soundOn);
    }

    setPlayer((prev) => {
      const nextExp = prev.exp + expHeuristic;
      let nextRank = prev.rank;

      // Check level rankings
      if (nextExp >= 8000) nextRank = '大学士';
      else if (nextExp >= 3500) nextRank = '学士';
      else if (nextExp >= 1500) nextRank = '翰林';
      else if (nextExp >= 600) nextRank = '进士';
      else if (nextExp >= 200) nextRank = '举人';

      const nextUnlockedList = [...prev.unlockedList];
      newlyUnlocked.forEach((u) => {
        if (!nextUnlockedList.includes(u)) {
          nextUnlockedList.push(u);
        }
      });

      // Update state
      let buffTurns = prev.buffTurnsRemaining;
      let activeBuff = prev.activeBuff;
      if (buffTurns > 0) {
        buffTurns--;
        if (buffTurns === 0) activeBuff = 'none';
      }

      return {
        ...prev,
        score: prev.score + finalPoints,
        highScore: Math.max(prev.highScore, prev.score + finalPoints),
        teaCharm: Math.min(prev.teaCharm + teaAdded, 200), // Max 200 tea charm capacity
        coins: prev.coins + coinsAdded,
        exp: nextExp,
        rank: nextRank,
        unlockedList: nextUnlockedList,
        buffTurnsRemaining: buffTurns,
        activeBuff,
      };
    });

    // Handle encounter popup assignment
    if (triggeredEncounter) {
      setEncounter(triggeredEncounter);
    }

    // Check if board locked up
    if (!hasAvailableMoves(nextBoard)) {
      setGameOver(true);
    }
  };

  // Undo move function
  const handleUndo = () => {
    if (historyStack.length === 0) return;

    const useCard = player.itemsInventory.undoCards > 0;
    if (!useCard && player.coins < 80) return; // Costs 80 copper coins if no item cards

    const snapshot = historyStack[0];
    setBoard(snapshot.board);
    setLocalScore(snapshot.score);
    setHistoryStack((prev) => prev.slice(1));

    setPlayer((prev) => ({
      ...prev,
      teaCharm: snapshot.teaCharm,
      coins: useCard ? prev.coins : Math.max(prev.coins - 80, 0),
      itemsInventory: {
        ...prev.itemsInventory,
        undoCards: useCard ? prev.itemsInventory.undoCards - 1 : prev.itemsInventory.undoCards,
      },
    }));

    SoundManager.playClick(settings.soundOn);
  };

  // Shuffle tool
  const handleShuffleTool = () => {
    if (player.itemsInventory.shuffleCards <= 0 && player.coins < 100) return;

    const shuffled = shuffleBoardTiles(board);
    setBoard(shuffled);

    setPlayer((prev) => ({
      ...prev,
      coins: prev.itemsInventory.shuffleCards > 0 ? prev.coins : prev.coins - 100,
      itemsInventory: {
        ...prev.itemsInventory,
        shuffleCards: prev.itemsInventory.shuffleCards > 0 ? prev.itemsInventory.shuffleCards - 1 : 0,
      },
    }));

    SoundManager.playSlide(settings.soundOn);
  };

  // Double automerge tool
  const handleAutoMergeTool = () => {
    if (player.itemsInventory.autoMergeCards <= 0 && player.coins < 150) return;

    const result = activateAutoMerge(board);
    if (!result.success) return;

    setBoard(result.board);

    // Trigger particle burst at merged tile coordinate
    const mergedTile = result.board.find((t) => t.isMerged);
    if (mergedTile) {
      triggerMergeParticles(mergedTile.row, mergedTile.col, mergedTile.level);
    }

    if (result.levelMerged > 0) {
      SoundManager.playMerge(result.levelMerged, settings.soundOn);
    }

    setPlayer((prev) => ({
      ...prev,
      coins: prev.itemsInventory.autoMergeCards > 0 ? prev.coins : prev.coins - 150,
      itemsInventory: {
        ...prev.itemsInventory,
        autoMergeCards: prev.itemsInventory.autoMergeCards > 0 ? prev.itemsInventory.autoMergeCards - 1 : 0,
      },
    }));
  };

  // Point tea ritual trigger functions
  const performTeaRitual = (type: 'dragon' | 'tuan' | 'jian' | 'show') => {
    let cost = 0;
    let desc = '';

    if (type === 'dragon') {
      cost = 30;
      if (player.teaCharm < cost || board.length === 0) return;
      // Upgrade random low level tile (1 or 2) to (level + 1)
      const targetList = board.filter((t) => t.level < 4);
      if (targetList.length > 0) {
        const rand = targetList[Math.floor(Math.random() * targetList.length)];
        triggerMergeParticles(rand.row, rand.col, rand.level + 1);
        setBoard((prev) =>
          prev.map((t) => (t.id === rand.id ? { ...t, level: t.level + 1, isMerged: true } : t))
        );
        SoundManager.playMerge(rand.level + 1, settings.soundOn);
      }
    } else if (type === 'tuan') {
      cost = 60;
      if (player.teaCharm < cost) return;
      const result = activateAutoMerge(board);
      if (result.success) {
        setBoard(result.board);
        const mergedTile = result.board.find((t) => t.isMerged);
        if (mergedTile) {
          triggerMergeParticles(mergedTile.row, mergedTile.col, mergedTile.level);
        }
        SoundManager.playMerge(result.levelMerged, settings.soundOn);
      }
    } else if (type === 'jian') {
      cost = 100;
      if (player.teaCharm < cost) return;
      const result = triggerBoardCleansing(board);
      setBoard(result.board);
      SoundManager.playSuccess(settings.soundOn);
    } else if (type === 'show') {
      cost = 150;
      if (player.teaCharm < cost) return;
      setPlayer((prev) => ({
        ...prev,
        activeBuff: 'double_score',
        buffTurnsRemaining: 15,
      }));
      SoundManager.playSuccess(settings.soundOn);
    }

    setPlayer((prev) => ({
      ...prev,
      teaCharm: Math.max(prev.teaCharm - cost, 0),
    }));
  };

  // Handle Encounter Character Blessing
  const claimLiteratiBlessing = () => {
    if (!encounter) return;

    if (encounter.id === 'sushi') {
      setPlayer((prev) => ({ ...prev, coins: prev.coins + 200 }));
    } else if (encounter.id === 'ouyangxiu') {
      // Find lowest level tile on board, upgrade it
      if (board.length > 0) {
        const lowestLevel = Math.min(...board.map((t) => t.level));
        const target = board.find((t) => t.level === lowestLevel);
        if (target) {
          triggerMergeParticles(target.row, target.col, Math.min(target.level + 1, 16));
          setBoard((prev) =>
            prev.map((t) => (t.id === target.id ? { ...t, level: Math.min(t.level + 1, 16), isMerged: true } : t))
          );
          SoundManager.playMerge(lowestLevel + 1, settings.soundOn);
        }
      }
    } else if (encounter.id === 'wanganshi') {
      // Clear up to two level 1 tiles
      const levelOnes = board.filter((t) => t.level === 1);
      if (levelOnes.length > 0) {
        const toRemove = levelOnes.slice(0, 2).map((t) => t.id);
        setBoard((prev) => prev.filter((t) => !toRemove.includes(t.id)));
        SoundManager.playSuccess(settings.soundOn);
      }
    } else if (encounter.id === 'liqingzhao') {
      setPlayer((prev) => ({
        ...prev,
        itemsInventory: {
          ...prev.itemsInventory,
          undoCards: prev.itemsInventory.undoCards + 1,
        },
      }));
    } else if (encounter.id === 'luyou') {
      setPlayer((prev) => ({
        ...prev,
        teaCharm: Math.min(prev.teaCharm + 60, 200),
      }));
      SoundManager.playSuccess(settings.soundOn);
    } else if (encounter.id === 'xinqiji') {
      setPlayer((prev) => ({
        ...prev,
        itemsInventory: {
          ...prev.itemsInventory,
          shuffleCards: prev.itemsInventory.shuffleCards + 1,
        },
      }));
      SoundManager.playSuccess(settings.soundOn);
    } else if (encounter.id === 'liuyong') {
      setPlayer((prev) => ({
        ...prev,
        itemsInventory: {
          ...prev.itemsInventory,
          autoMergeCards: prev.itemsInventory.autoMergeCards + 1,
        },
      }));
      SoundManager.playSuccess(settings.soundOn);
    } else if (encounter.id === 'yanshu') {
      setPlayer((prev) => ({
        ...prev,
        coins: prev.coins + 150,
        teaCharm: Math.min(prev.teaCharm + 30, 200),
      }));
      SoundManager.playSuccess(settings.soundOn);
    }

    setEncounter(null);
    SoundManager.playClick(settings.soundOn);
  };

  // Helper coordinate grid template
  const backgroundCells = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col justify-between px-3 py-4 text-[#2F2F2F] select-none">
      {/* Stylesheet for premium gameplay tile animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmerSweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          30% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(241, 196, 15, 0.4), inset 0 0 4px rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 16px rgba(241, 196, 15, 0.7), inset 0 0 8px rgba(255,255,255,0.3); }
        }
        @keyframes purpleGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(171, 108, 255, 0.5), inset 0 0 5px rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 18px rgba(171, 108, 255, 0.85), inset 0 0 9px rgba(255,255,255,0.35); }
        }
      `}} />

      {/* HUD Navigation row */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => {
            SoundManager.playClick(settings.soundOn);
            onNavigate('menu');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F7F2E8] border border-stone-300 rounded-sm hover:border-[#6F8F72] text-xs font-serif shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft size={13} />
          <span>回廊 (主页)</span>
        </button>

        {/* Level display */}
        <div className="flex items-center space-x-1 font-serif text-xs">
          <span className="px-2 py-0.5 bg-[#6F8F72]/20 border border-[#6F8F72] text-[#425945] rounded-sm font-bold">
            {player.rank}
          </span>
          <button
            onClick={() => {
              SoundManager.playClick(settings.soundOn);
              setShowHelp(true);
            }}
            className="p-1.5 bg-[#F7F2E8] border border-stone-300 rounded-sm text-stone-500 hover:text-stone-800"
          >
            <HelpCircle size={14} />
          </button>
        </div>
      </div>

      {/* Main stats boxes */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#F7F2E8]/90 border border-stone-200 shadow-sm p-1.5 text-center rounded-sm">
          <span className="text-[10px] text-stone-400 font-serif block leading-none mb-1">聚贤分</span>
          <span className="text-lg font-black font-mono tracking-tight text-[#2F2F2F]">
            {localScore}
          </span>
          {player.activeBuff === 'double_score' && (
            <span className="text-[8px] px-1 py-0.2 bg-orange-100 border border-orange-300 text-orange-600 rounded-full block mx-auto w-max font-semibold scale-90">
              双倍得 (剩{player.buffTurnsRemaining}步)
            </span>
          )}
        </div>

        <div className="bg-[#F7F2E8]/90 border border-[#C8A55A]/50 shadow-sm p-1.5 text-center rounded-sm">
          <span className="text-[10px] text-stone-400 font-serif block leading-none mb-1">最高积淀</span>
          <span className="text-lg font-black font-mono tracking-tight text-[#8A6A32]">
            {player.highScore}
          </span>
        </div>

        {/* Tea Gauge */}
        <div className="bg-[#F7F2E8]/95 border border-[#6F8F72]/50 shadow-sm p-1.5 text-center rounded-sm flex flex-col justify-between relative overflow-hidden">
          <span className="text-[10px] text-stone-400 font-serif block leading-none">点茶茶韵</span>
          <div className="text-lg font-black font-mono tracking-tight text-[#4A6B53]">
            {player.teaCharm} <span className="text-[9px] font-normal text-stone-500">/200</span>
          </div>

          {/* Micro green horizontal water bar */}
          <div className="w-full bg-[#E5ECE7] h-1.5 rounded-full overflow-hidden border border-stone-200 mt-1">
            <div
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{ width: `${Math.min((player.teaCharm / 200) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4x4 Grid Segment */}
      <motion.div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        animate={boardAnimate}
        className="relative aspect-square w-full bg-[#E4DCCE] border-4 border-[#3D2F22] rounded-md p-1.5 shadow-2xl flex flex-col justify-center select-none overflow-hidden"
      >
        {/* Background cells template */}
        <div className="grid grid-cols-4 gap-1.5 w-full h-full absolute inset-0 p-1.5 z-0 pointer-events-none">
          {backgroundCells.map((i) => (
            <div key={i} className="bg-[#D1C6B5] border border-[#BFB3A1]/50 rounded-sm w-full h-full" />
          ))}
        </div>

        {/* Floating Active Game Tiles */}
        <div className="grid grid-cols-4 gap-1.5 w-full h-full relative z-10">
          <AnimatePresence>
            {board.map((t) => {
              const artifact = ARTIFACTS_DB[t.level] || ARTIFACTS_DB[1];
              const gridRow = t.row + 1;
              const gridCol = t.col + 1;
              const isLegendary = t.level >= 8;
              const hasGlow = t.level >= 5;

              // Tailored box-shadow glow based on tier
              let baseBoxShadow = '0 3px 6px rgba(0,0,0,0.2)';
              if (t.level >= 13) {
                baseBoxShadow = '0 0 14px rgba(171, 108, 255, 0.75), inset 0 0 6px rgba(255,255,255,0.25)';
              } else if (t.level >= 9) {
                baseBoxShadow = '0 0 12px rgba(23, 92, 102, 0.65), inset 0 0 5px rgba(255,255,255,0.2)';
              } else if (t.level >= 5) {
                baseBoxShadow = '0 0 10px rgba(207, 162, 92, 0.55), inset 0 0 4px rgba(255,255,255,0.15)';
              }

              return (
                <motion.div
                  key={t.id}
                  layoutId={t.id}
                  initial={t.isNew ? { scale: 0.5, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`absolute w-[22%] h-[22%] flex flex-col justify-between items-center p-1.5 cursor-grab shadow-md rounded-md border text-center transition-all hover:scale-105 active:scale-95 duration-200 hover:shadow-xl ${artifact.gradient} ${artifact.borderColor} overflow-hidden`}
                  style={{
                    top: `${t.row * 24.8 + 1.2}%`,
                    left: `${t.col * 24.8 + 1.2}%`,
                    boxShadow: baseBoxShadow,
                    animation: t.level >= 13 
                      ? 'purpleGlow 3.5s infinite ease-in-out' 
                      : t.level >= 8 
                        ? 'goldGlow 3.5s infinite ease-in-out' 
                        : undefined,
                  }}
                >
                  {/* Real artifact picture background with higher visibility and vibrancy */}
                  {artifact.imageUrl && (
                    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
                      <img
                        src={artifact.imageUrl}
                        alt={artifact.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter brightness-[0.72] saturate-[1.25] contrast-[1.1] transition-transform duration-500 hover:scale-110"
                      />
                      {/* Rich ambient vignette shadow at bottom for high legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/55" />
                    </div>
                  )}

                  {/* Shimmering glass sweep highlight staggered by tile position */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10">
                    <div 
                      className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent absolute top-0 -left-[50%]"
                      style={{ 
                        animation: 'shimmerSweep 4.5s infinite ease-in-out',
                        animationDelay: `${(t.row * 4 + t.col) * 350}ms`
                      }}
                    />
                  </div>

                  {/* Item level badge with elegant bronze stamp look */}
                  <div className="self-start text-[8.5px] px-1 bg-[#3D2F22]/95 text-[#F1EAD9] border border-[#C8A55A]/70 rounded-sm font-black font-mono tracking-tighter leading-none py-[1.5px] flex items-center space-x-[2px] z-10 shadow-sm relative">
                    <span className="font-extrabold">等级 {t.level}</span>
                    {isLegendary && <Sparkles size={7} className="text-[#F1C40F] animate-pulse" />}
                  </div>

                  {/* Core Calligraphy artifact name with stark high contrast drop shadow */}
                  <div
                    className="font-serif text-[10.5px] leading-tight font-black text-[#FAF4EC] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] writing-vertical tracking-tight h-14 overflow-hidden flex items-center justify-center z-10 relative font-serif"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.95), -1px -1px 3px rgba(0, 0, 0, 0.9)' }}
                  >
                    {artifact.name.slice(0, 5)}
                  </div>

                  {/* Mini Vermilion Red Seal tag */}
                  <div className="self-end text-[7px] font-bold text-red-100 bg-[#C8102E]/95 rounded-sm leading-none px-[2px] py-[1.5px] border border-red-500 scale-90 z-10 shadow-sm shadow-black/50 font-serif">
                    印
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Combo Badge overlay */}
        <AnimatePresence>
          {comboVisible && combo > 1 && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 15 }}
              animate={{ scale: 1.1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 15 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none bg-[#FAF4EC]/95 border-2 border-[#C8A55A] shadow-xl rounded-sm py-2.5 px-3 text-center"
              style={{
                backgroundImage: 'radial-gradient(ellipse at center, rgba(200,165,90,0.15) 0%, rgba(0,0,0,0) 80%)',
              }}
            >
              <div className="flex items-center space-x-1 justify-center">
                <Sparkles size={11} className="text-[#C8A55A] animate-pulse" />
                <span className="font-serif font-bold text-[#8A6A32] text-[10px] tracking-widest whitespace-nowrap">
                  群贤连璧
                </span>
                <Sparkles size={11} className="text-[#C8A55A] animate-pulse" />
              </div>
              <div className="text-base font-black font-mono text-[#3D2F22] tracking-normal leading-none mt-1">
                Lianbi × {combo}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particles Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}%`,
                  y: `${p.y}%`,
                  scale: 0.8,
                  opacity: 1,
                }}
                animate={{
                  x: `${p.x + p.tx}%`,
                  y: `${p.y + p.ty}%`,
                  scale: 0,
                  opacity: 0,
                  rotate: p.rotate,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: p.duration,
                  ease: 'easeOut',
                }}
                className="absolute w-2 h-2 rounded-full flex items-center justify-center pointer-events-none"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Tea Art Actions (点茶技法) */}
      <div className="mt-3.5 bg-[#F7F2E8]/90 border border-[#6F8F72] rounded-sm p-3 shadow-md">
        <h4 className="font-serif font-bold text-xs text-[#516E5D] flex items-center mb-2 border-b border-stone-200 pb-1">
          <CupSoda size={13} className="mr-1" />
          点茶演礼 (消耗茶韵)
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            disabled={player.teaCharm < 30}
            onClick={() => performTeaRitual('dragon')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm text-[10px] border transition-all ${
              player.teaCharm >= 30
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 active:scale-95'
                : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="font-bold font-serif leading-none">龙井茶</span>
            <span className="text-[8px] mt-1 text-stone-500">30韵 ➔ 晋升</span>
          </button>

          <button
            disabled={player.teaCharm < 60}
            onClick={() => performTeaRitual('tuan')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm text-[10px] border transition-all ${
              player.teaCharm >= 60
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 active:scale-95'
                : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="font-bold font-serif leading-none">御品团茶</span>
            <span className="text-[8px] mt-1 text-stone-500">60韵 ➔ 合一</span>
          </button>

          <button
            disabled={player.teaCharm < 100}
            onClick={() => performTeaRitual('jian')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm text-[10px] border transition-all ${
              player.teaCharm >= 100
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100 active:scale-95'
                : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="font-bold font-serif leading-none">建盏点茶</span>
            <span className="text-[8px] mt-1 text-stone-500">100韵 ➔ 净局</span>
          </button>

          <button
            disabled={player.teaCharm < 150}
            onClick={() => performTeaRitual('show')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-sm text-[10px] border transition-all ${
              player.teaCharm >= 150
                ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 active:scale-95'
                : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="font-bold font-serif leading-none">茶百戏点</span>
            <span className="text-[8px] mt-1 text-stone-500">150韵 ➔ 2倍分</span>
          </button>
        </div>
      </div>

      {/* Tool Utility Drawers */}
      <div className="grid grid-cols-3 gap-2 mt-3 mb-6">
        <button
          onClick={handleUndo}
          className="flex flex-col items-center justify-center p-2 bg-[#F7F2E8]/95 border border-stone-300 rounded-sm text-xs hover:border-[#6F8F72] shadow-sm font-serif"
        >
          <div className="flex items-center space-x-1">
            <RotateCcw size={13} className="text-stone-500" />
            <span className="font-bold">撤回卡</span>
          </div>
          <span className="text-[9px] text-stone-500 mt-1">
            {player.itemsInventory.undoCards > 0 ? `充足 (${player.itemsInventory.undoCards}张)` : '铜钱: 80文'}
          </span>
        </button>

        <button
          onClick={handleShuffleTool}
          className="flex flex-col items-center justify-center p-2 bg-[#F7F2E8]/95 border border-stone-300 rounded-sm text-xs hover:border-[#6F8F72] shadow-sm font-serif"
        >
          <div className="flex items-center space-x-1">
            <Sparkles size={13} className="text-[#C8A55A]" />
            <span className="font-bold">刷新卡</span>
          </div>
          <span className="text-[9px] text-stone-500 mt-1">
            {player.itemsInventory.shuffleCards > 0 ? `拥有 (${player.itemsInventory.shuffleCards}张)` : '铜钱: 100文'}
          </span>
        </button>

        <button
          onClick={handleAutoMergeTool}
          className="flex flex-col items-center justify-center p-2 bg-[#F7F2E8]/95 border border-stone-300 rounded-sm text-xs hover:border-emerald-700 shadow-sm font-serif animate-pulse"
        >
          <div className="flex items-center space-x-1">
            <Sparkles size={13} className="text-emerald-600" />
            <span className="font-bold">自动合成</span>
          </div>
          <span className="text-[9px] text-stone-500 mt-1">
            {player.itemsInventory.autoMergeCards > 0 ? `拥灌 (${player.itemsInventory.autoMergeCards}张)` : '铜钱: 150文'}
          </span>
        </button>
      </div>

      {/* Popups & Dialogs Overlay (AnimatePresence) */}
      <AnimatePresence>
        {/* Literati Encounter Dialog Box */}
        {encounter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-sm bg-[#F7F2E8] border-4 border-[#C8A55A] rounded-md shadow-2xl p-6 relative overflow-hidden text-[#2F2F2F]"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#6F8F72]/10 pointer-events-none" />

              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{encounter.avatar}</span>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#3D2F22] flex items-center space-x-2">
                    <span>{encounter.name}</span>
                    <span className="text-xs font-normal border border-stone-400 rounded-md px-1 py-0.5 scale-90">
                      {encounter.title}
                    </span>
                  </h3>
                  <div className="text-[10px] text-[#A4762E] font-mono tracking-widest font-semibold">
                    ─── 文人雅士奇遇临坊 ───
                  </div>
                </div>
              </div>

              {/* Quotation area */}
              <blockquote className="bg-stone-50 border-l-4 border-[#6F8F72] text-xs font-serif p-3 italic rounded-sm mb-4 leading-relaxed text-stone-700">
                {encounter.quote}
              </blockquote>

              <div className="bg-emerald-50 border border-emerald-200 text-xs p-3 rounded-sm mb-6 flex items-start space-x-2">
                <Sparkles size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-800 block mb-0.5">奇缘馈赠：</span>
                  <span className="text-stone-700 leading-normal">{encounter.buffDescription}</span>
                </div>
              </div>

              <button
                onClick={claimLiteratiBlessing}
                className="w-full py-3 bg-gradient-to-r from-[#C8A55A] to-[#A4762E] text-[#3D2F22] border border-amber-500 shadow-lg text-sm font-extrabold font-serif tracking-[0.2em] pl-[0.2em] rounded-sm active:translate-y-0.5 hover:brightness-105 animate-pulse"
              >
                接受雅人赠礼
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Game Help Modal */}
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs font-serif"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#F7F2E8] border-2 border-[#6F8F72] rounded-sm p-5 shadow-2xl relative"
            >
              <h3 className="text-lg font-black text-center mb-3">《清明雅集》玩法明细</h3>
              <div className="text-xs text-stone-600 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                <p className="font-sans leading-relaxed">
                  <span className="font-bold text-[#6F8F72]">1. 基础玩法：</span>
                  上下左右滑动棋盘，相同级的物品在碰撞时将合并并晋升，最终解锁终极传世名作【大宋风华】。
                </p>
                <p className="font-sans leading-relaxed">
                  <span className="font-bold text-[#C8A55A]">2. 点茶茶韵：</span>
                  合成高级物品将收获大量茶韵（满载200韵）。消耗茶韵可发动对局秘技，让您在败局边缘起死回生。
                </p>
                <p className="font-sans leading-relaxed">
                  <span className="font-bold text-indigo-500">3. 文人偶遇：</span>
                  滑行中有机会召临李清照、苏轼等大家！他们会展现绝活赠阅道具与财帛。
                </p>
                <p className="font-sans leading-relaxed">
                  <span className="font-bold text-amber-600">4. 道具换购：</span>
                  撤回卡可为您遮掩漏棋，在集市商城多加置备。
                </p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-4 py-2 bg-[#6F8F72] text-[#F7F2E8] text-xs font-bold rounded-sm shadow-md"
              >
                明了闭窗
              </button>
            </div>
          </motion.div>
        )}

        {/* Great Masterpiece Fullscroll Unfold Victory Animation! */}
        {victoryCelebration !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2F2F2F]/95 flex flex-col items-center justify-center p-6 text-white text-center font-serif"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -2 }}
              animate={{ scale: [0.8, 1.05, 1], rotate: 0 }}
              transition={{ duration: 1.5 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#1E2E25] to-[#121A15] border-2 border-yellow-500/50 rounded-sm p-6 relative shadow-2xl"
            >
              {/* Gold sparkling borders */}
              <div className="absolute top-2 left-2 border-t border-l border-yellow-500/80 w-6 h-6" />
              <div className="absolute top-2 right-2 border-t border-r border-yellow-500/80 w-6 h-6" />
              <div className="absolute bottom-2 left-2 border-b border-l border-yellow-500/80 w-6 h-6" />
              <div className="absolute bottom-2 right-2 border-b border-r border-yellow-500/80 w-6 h-6" />

              <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-500 block mb-2">- 达成千载不朽巨作 -</span>
              <h2 className="text-3xl font-black text-yellow-400 mb-4 tracking-wider leading-none">
                {ARTIFACTS_DB[victoryCelebration]?.name || '盛世绝墨'}
              </h2>

               <div className="relative border border-yellow-600/30 rounded-sm overflow-hidden h-42 bg-[#121A15] flex flex-col justify-center items-center p-3 shadow-inner mb-4">
                {/* Visual rendering representing horizontal painting unfolding */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'easeInOut' }}
                  className="absolute inset-y-0 bg-gradient-to-r from-yellow-800/20 via-emerald-800/30 to-yellow-800/20 w-full z-0 h-full border-l border-r border-yellow-400/60"
                />

                {ARTIFACTS_DB[victoryCelebration]?.imageUrl ? (
                  <img
                    src={ARTIFACTS_DB[victoryCelebration].imageUrl}
                    alt={ARTIFACTS_DB[victoryCelebration].name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-sm border border-yellow-500/50 shadow-md z-10 filter saturate-90 contrast-105 transform hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="text-[60px] select-none z-10 animate-pulse">
                    {victoryCelebration === 10 ? '📜' : victoryCelebration === 12 ? '⛰️' : victoryCelebration === 14 ? '🍵' : victoryCelebration === 15 ? '🏺' : '👑'}
                  </span>
                )}
                <p className="text-[11px] text-yellow-200/90 z-10 font-sans italic max-w-xs leading-relaxed mt-2 select-none text-center">
                  “{ARTIFACTS_DB[victoryCelebration]?.story.slice(0, 50)}...”
                </p>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed max-w-sm mx-auto mb-6">
                您不仅精擅博弈，更解锁了大宋文化史上独一无二的稀世国粹宝券！
              </p>

              <button
                onClick={() => setVictoryCelebration(null)}
                className="py-2.5 px-8 bg-gradient-to-r from-yellow-500 to-amber-600 text-[#121A15] text-xs font-extrabold tracking-widest uppercase rounded-sm border border-yellow-400 shadow-md transform hover:scale-105 active:scale-95 transition-all"
              >
                卷轴收合 ➔ 继续合成
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Game Over Panel */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#3D2F22]/90 flex items-center justify-center p-4 backdrop-blur-xs font-serif text-white"
          >
            <div className="w-full max-w-sm bg-[#F7F2E8] border-4 border-[#3D2F22] rounded-sm p-6 text-center text-[#2F2F2F] shadow-2xl relative">
              <span className="text-3xl">🍂</span>
              <h3 className="text-2xl font-black mt-2 mb-1 tracking-wider text-[#3D2F22]">棋终雅散</h3>
              <p className="text-xs text-stone-500 mb-4">棋局填塞，无法再施展腾挪之势。</p>

              <div className="bg-stone-50 border border-stone-200 rounded-sm p-3 mb-6 grid grid-cols-2 gap-2 text-left">
                <div>
                  <span className="text-[10px] text-stone-400 font-sans block leading-none mb-1">本次聚贤得分</span>
                  <span className="text-xl font-bold font-mono tracking-tight text-[#3D2F22]">
                    {localScore}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-sans block leading-none mb-1">最高记录积淀</span>
                  <span className="text-xl font-bold font-mono tracking-tight text-[#6F8F72]">
                    {player.highScore}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    SoundManager.playClick(settings.soundOn);
                    onNavigate('menu');
                  }}
                  className="flex-1 py-2.5 bg-stone-200 text-stone-800 text-xs font-bold rounded-sm border border-stone-300 hover:bg-stone-300 transition-colors"
                >
                  主页回廊
                </button>
                <button
                  onClick={resetGame}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#6F8F72] to-[#516E5D] text-[#F7F2E8] text-xs font-bold rounded-sm border border-[#8AAC97] shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  重研一局
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
