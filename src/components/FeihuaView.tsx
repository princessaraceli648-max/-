/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Sparkles, AlertCircle, Clock, Volume2, Award, Zap, Book } from 'lucide-react';
import { PlayerState } from '../types';
import { SoundManager } from './SoundManager';

interface FeihuaProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings' | 'diancha' | 'feihua') => void;
  soundEnabled: boolean;
}

interface PoetChallenge {
  id: string;
  name: string;
  title: string;
  difficulty: string;
  keyword: string;
  desc: string;
  avatar: string;
  rounds: {
    opponentLine: string;
    choices: { text: string; correct: boolean; hint: string }[];
  }[];
}

const POET_CHALLENGES: PoetChallenge[] = [
  {
    id: 'sushi',
    name: '苏轼',
    title: '大宋第一词手 · 东坡居士',
    difficulty: '举人级挑战',
    keyword: '月',
    desc: '东坡邀您共饮，以“月”为飞花。你能接下大学士的清辉明月词吗？',
    avatar: '👨‍🎓',
    rounds: [
      {
        opponentLine: '明月几时有？把酒问青天。',
        choices: [
          { text: '今宵酒醒何处？杨柳岸，晓风残月。', correct: true, hint: '柳永《雨霖铃》' },
          { text: '无可奈何花落去，似曾相识燕归来。', correct: false, hint: '晏殊《浣溪沙》不含“月”' },
          { text: '矮纸斜行闲作草，晴窗细乳戏分茶。', correct: false, hint: '陆游《临安春雨初霁》不含“月”' },
          { text: '小楫轻舟，梦入芙蓉浦。', correct: false, hint: '周邦彦《苏幕遮》不含“月”' }
        ]
      },
      {
        opponentLine: '庭下如积水空明，水中藻、荇交横，盖竹柏影也。',
        choices: [
          { text: '春江潮水连海平，海上明月共潮生。', correct: true, hint: '张若虚《春江花月夜》' },
          { text: '昨夜雨疏风骤，浓睡不消残酒。', correct: false, hint: '李清照《如梦令》不含“月”' },
          { text: '帘卷西风，人比黄花瘦。', correct: false, hint: '李清照《醉花阴》不含“月”' },
          { text: '只恐双溪舴艋舟，载不动许多愁。', correct: false, hint: '李清照《武陵春》不含“月”' }
        ]
      },
      {
        opponentLine: '人有悲欢离合，月有阴晴圆缺，此事古难全。',
        choices: [
          { text: '三十功名尘与土，八千里路云和月。', correct: true, hint: '岳飞《满江红》' },
          { text: '大江东去，浪淘尽，千古风流人物。', correct: false, hint: '苏轼《念奴娇》不含“月”' },
          { text: '金戈铁马，气吞万里如虎。', correct: false, hint: '辛弃疾《永遇乐》不含“月”' },
          { text: '两情若是久长时，又岂在朝朝暮暮。', correct: false, hint: '秦观《鹊桥仙》不含“月”' }
        ]
      }
    ]
  },
  {
    id: 'liqingzhao',
    name: '李清照',
    title: '千古第一才女 · 易安居士',
    difficulty: '进士级挑战',
    keyword: '花',
    desc: '易安居士闺阁清谈，以“花”为令，尽显漱玉词派的婉约细腻。',
    avatar: '👩‍🎤',
    rounds: [
      {
        opponentLine: '昨夜雨疏风骤，浓睡不消残酒。试问卷帘人，却道海棠依旧。却知否，应是绿肥红瘦。',
        choices: [
          { text: '无可奈何花落去，似曾相识燕归来。', correct: true, hint: '晏殊《浣溪沙》' },
          { text: '明月几时有？把酒问青天。', correct: false, hint: '苏轼《水调歌头》不含“花”' },
          { text: '金戈铁马，气吞万里如虎。', correct: false, hint: '辛弃疾《永遇乐》不含“花”' },
          { text: '大江东去，浪淘尽，千古风流人物。', correct: false, hint: '苏轼《念奴娇》不含“花”' }
        ]
      },
      {
        opponentLine: '卖花担上。买得一枝春欲放。泪染轻匀。犹带彤霞晓露痕。',
        choices: [
          { text: '西塞山前白鹭飞，桃花流水鳜鱼肥。', correct: true, hint: '张志和《渔歌子》' },
          { text: '众里寻他千百度，蓦然回首。', correct: false, hint: '辛弃疾《青玉案》不含“花”' },
          { text: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。', correct: false, hint: '李清照《声声慢》不含“花”' },
          { text: '只恐双溪舴艋舟，载不动许多愁。', correct: false, hint: '李清照《武陵春》不含“花”' }
        ]
      },
      {
        opponentLine: '帘卷西风，人比黄花瘦。',
        choices: [
          { text: '竹外桃花三两枝，春江水暖鸭先知。', correct: true, hint: '苏轼《惠崇春江晚景》' },
          { text: '不恨此花飞尽，恨西园、落红难缀。', correct: true, hint: '苏轼《水龙吟》' }, 
          { text: '莫道不销魂，帘卷西风。', correct: false, hint: '李清照《醉花阴》不含“花”' },
          { text: '今宵酒醒何处？杨柳岸晓风残月。', correct: false, hint: '柳永《雨霖铃》不含“花”' }
        ]
      }
    ]
  },
  {
    id: 'xinqiji',
    name: '辛弃疾',
    title: '词中之龙 · 稼轩居士',
    difficulty: '学士级挑战',
    keyword: '秋',
    desc: '稼轩将军抗金豪迈，以“秋”为名。看你能否对上豪放派的满江豪情。',
    avatar: '🧔',
    rounds: [
      {
        opponentLine: '少年不识愁滋味，爱上层楼。爱上层楼，为赋新词强说愁。而今识尽愁滋味，欲说还休。欲说还休，却道天凉好个秋。',
        choices: [
          { text: '萧萧暮雨洒江天，一番洗清秋。', correct: true, hint: '柳永《八声甘州》' },
          { text: '竹外桃花三两枝，春江水暖鸭先知。', correct: false, hint: '苏轼《惠崇春江晚景》不含“秋”' },
          { text: '两情若是久长时，又岂在朝朝暮暮。', correct: false, hint: '秦观《鹊桥仙》不含“秋”' },
          { text: '大江东去，浪淘尽，千古风流人物。', correct: false, hint: '苏轼《念奴娇》不含“秋”' }
        ]
      },
      {
        opponentLine: '秋晚纯鲈江上，夜深儿女灯前。',
        choices: [
          { text: '落叶他乡树，寒灯独夜人。', correct: false, hint: '戴叔伦《江乡故人偶会》不含“秋”' },
          { text: '银烛秋光冷画屏，轻罗小扇扑流萤。', correct: true, hint: '杜牧《秋夕》' },
          { text: '莫道不销魂，帘卷西风。', correct: false, hint: '李清照不含“秋”' },
          { text: '无可奈何花落去，似曾相识燕归来。', correct: false, hint: '晏殊不含“秋”' }
        ]
      },
      {
        opponentLine: '风萧萧兮易水寒，壮士一去兮不复还。',
        choices: [
          { text: '万里悲秋常作客，百年多病独登台。', correct: true, hint: '杜甫《登高》' },
          { text: '三十功名尘与土，八千里路云和月。', correct: false, hint: '岳飞不含“秋”' },
          { text: '只恐双溪舴艋舟，载不动许多愁。', correct: false, hint: '李清照不含“秋”' },
          { text: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。', correct: false, hint: '李清照不含“秋”' }
        ]
      }
    ]
  }
];

export const FeihuaView: React.FC<FeihuaProps> = ({ player, setPlayer, onNavigate, soundEnabled }) => {
  const [selectedPoet, setSelectedPoet] = useState<PoetChallenge | null>(null);
  const [gameState, setGameState] = useState<'selection' | 'intro' | 'duel' | 'result'>('selection');
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [timer, setTimer] = useState<number>(12);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [userSuccess, setUserSuccess] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);

  // Timer run loop
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (gameState === 'duel' && !hasAnswered) {
      setTimer(12);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentRound, hasAnswered]);

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    SoundManager.playClick(soundEnabled); // Play bad buzz
    setHasAnswered(true);
    setUserSuccess(false);
  };

  const handleStartDuel = (poet: PoetChallenge) => {
    SoundManager.playSuccess(soundEnabled);
    setSelectedPoet(poet);
    setGameState('intro');
  };

  const handleBeginRounds = () => {
    SoundManager.playClick(soundEnabled);
    setGameState('duel');
    setCurrentRound(0);
    setScore(0);
    setHasAnswered(false);
    setUserSuccess(null);
  };

  const handleSelectChoice = (correct: boolean) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    
    if (correct) {
      SoundManager.playSuccess(soundEnabled);
      setUserSuccess(true);
      setScore(prev => prev + 1);
    } else {
      SoundManager.playClick(soundEnabled);
      setUserSuccess(false);
    }
  };

  const handleNextRound = () => {
    if (!selectedPoet) return;
    
    if (currentRound < selectedPoet.rounds.length - 1) {
      setCurrentRound(prev => prev + 1);
      setHasAnswered(false);
      setUserSuccess(null);
    } else {
      // Duel finished! Commit rewards
      const isWin = score >= 2; // Pass with at least 2 correct out of 3
      const rewardCoins = isWin ? (selectedPoet.id === 'xinqiji' ? 180 : selectedPoet.id === 'liqingzhao' ? 120 : 80) : 20;
      const rewardExp = isWin ? (selectedPoet.id === 'xinqiji' ? 150 : selectedPoet.id === 'liqingzhao' ? 100 : 60) : 10;
      
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins + rewardCoins,
        exp: prev.exp + rewardExp
      }));

      setGameState('result');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#FDFBF7] flex flex-col p-4 text-[#2F2F2F]">
      {/* Navigation and Top info bar */}
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
        <div className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-sm text-xs font-serif border border-indigo-200/55">
          <Book size={12} className="mr-0.5" />
          <span>诗词飞花令</span>
        </div>
      </div>

      {/* Title */}
      {gameState === 'selection' && (
        <div className="text-center mb-5">
          <h2 className="text-2xl font-serif font-black tracking-widest text-[#243525] flex items-center justify-center space-x-1">
            <span>飞花诗笔对决</span>
          </h2>
          <p className="text-[10px] text-stone-500 font-serif leading-relaxed mt-1">
            大宋风行飞花之令，与名满天下的词圣才女临窗对词，赢得满腹经纶与汴京碎银！
          </p>
        </div>
      )}

      {/* MAIN SCREEN: CHOOSE POET CHALLENGE */}
      {gameState === 'selection' && (
        <div className="flex-1 flex flex-col space-y-4 justify-center py-2">
          {POET_CHALLENGES.map((poet) => (
            <motion.div
              key={poet.id}
              whileHover={{ scale: 1.02 }}
              className="bg-[#FAF6EE] border-2 border-[#6F8F72]/30 hover:border-[#6F8F72] rounded-sm p-4 shadow-md flex justify-between items-center relative overflow-hidden transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-4xl border border-amber-250 shadow-inner">
                  {poet.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif font-black text-base text-[#2F2F2F]">{poet.name}</h3>
                    <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-800 text-[9px] font-bold rounded-sm">
                      {poet.difficulty}
                    </span>
                  </div>
                  <p className="text-stone-500 text-[10px] mt-1 font-serif max-w-[190px] leading-relaxed">
                    飞花主题: <strong className="text-[#C23A2B] font-serif text-xs">【{poet.keyword}】</strong>
                  </p>
                  <p className="text-stone-400 text-[9px] mt-0.5 max-w-[190px] h-3.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {poet.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleStartDuel(poet)}
                className="px-3.5 py-2 bg-[#6F8F72] hover:bg-[#516E5D] text-[#F7F2E8] font-bold font-serif text-xs tracking-wider rounded-sm shadow-sm cursor-pointer"
              >
                应誓对齐
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* SCREEN 2: DUEL INTRO PREVIEW */}
      {gameState === 'intro' && selectedPoet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FAF4EC]/95 border-2 border-[#6F8F72] rounded-sm p-5 shadow-lg text-center flex-1 flex flex-col justify-center"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-md border border-amber-200">
            {selectedPoet.avatar}
          </div>
          <h3 className="font-serif font-black text-xl text-[#3D2F22] mb-0.5">{selectedPoet.name}</h3>
          <p className="text-[10px] font-mono text-amber-700 tracking-wider mb-4 uppercase">{selectedPoet.title}</p>
          
          <div className="py-4 px-5 bg-[#6F8F72]/10 border border-dashed border-[#6F8F72]/50 rounded-sm mb-6 max-w-sm mx-auto">
            <span className="text-[10px] text-[#516E5D] font-serif block mb-1">大学士飞花词旨:</span>
            <p className="text-stone-700 font-serif text-xs leading-relaxed italic">
              “今日大好雅意，吾与学者就以“<strong className="text-[#C23A2B] text-sm font-black mx-0.5">{selectedPoet.keyword}</strong>”字对行飞花之雅令。凡接词三轮，胜其半数，即可赏银。且听好了！”
            </p>
          </div>

          <button
            onClick={handleBeginRounds}
            className="w-full py-2.5 bg-[#6F8F72] text-[#F7F2E8] hover:bg-[#516E5D] font-serif font-bold tracking-widest pl-[0.5em] text-xs rounded-sm shadow-md cursor-pointer"
          >
            开始唱和令对
          </button>
        </motion.div>
      )}

      {/* SCREEN 3: DUEL GAMEPLAY SCREEN */}
      {gameState === 'duel' && selectedPoet && (
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Opponent's line Box */}
          <div className="bg-[#FAF4EC] border border-[#6F8F72] rounded-sm p-4 relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[10px] text-stone-500 font-serif">
              {selectedPoet.name} 吟诵:
            </div>
            
            <div className="flex items-center justify-center space-x-3.5 my-3.5">
              <div className="w-10 h-10 bg-[#E8DCC4] rounded-full flex items-center justify-center text-2xl border border-[#C8A55A]/50">
                {selectedPoet.avatar}
              </div>
              <p className="flex-1 font-serif text-sm font-bold text-stone-800 leading-relaxed pl-1">
                {/* Dynamically highlight the keyword in line */}
                {selectedPoet.rounds[currentRound].opponentLine.split('').map((char, index) => (
                  <span key={index} className={char === selectedPoet.keyword ? "text-[#C23A2B] font-extrabold text-base mx-0.5 border-b border-dashed border-[#C23A2B]" : ""}>
                    {char}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* VS Divider & Turn progress and Clock Timer */}
          <div className="flex items-center justify-between px-2 my-2 bg-[#F3ECE0]/30 py-1.5 border-t border-b border-light-200">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-serif text-stone-500">
                回合: <strong>{currentRound + 1} / 3</strong>
              </span>
              <span className="text-[10px] font-serif text-stone-400">|</span>
              <span className="text-[10px] font-serif text-stone-500">
                对答成功数: <strong>{score}</strong>
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-[#C23A2B] font-mono text-xs font-bold">
              <Clock size={12} className="animate-pulse" />
              <span>{timer}s</span>
            </div>
          </div>

          {/* User's response options selection */}
          <div className="space-y-2.5 mt-2 flex-1 flex flex-col justify-center">
            <h4 className="text-[10px] font-serif text-stone-400 mb-1">
              请接取下联对句，其中必须含有 “<span className="text-[#C23A2B] font-extrabold">{selectedPoet.keyword}</span>” :
            </h4>

            {selectedPoet.rounds[currentRound].choices.map((choice, idx) => (
              <motion.button
                key={idx}
                disabled={hasAnswered}
                whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                whileTap={!hasAnswered ? { scale: 0.99 } : {}}
                onClick={() => handleSelectChoice(choice.correct)}
                className={`w-full text-left p-3.5 rounded-sm border text-xs font-serif leading-relaxed transition-all flex items-start justify-between cursor-pointer ${
                  hasAnswered
                    ? choice.correct
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                    : 'bg-[#FAF6EE] border-stone-300 hover:border-[#6F8F72] hover:bg-[#FAF4EC]'
                }`}
              >
                <span>
                  {choice.text.split('').map((char, cIdx) => (
                    <span key={cIdx} className={char === selectedPoet.keyword ? "text-[#C23A2B] font-extrabold" : ""}>
                      {char}
                    </span>
                  ))}
                </span>
                {hasAnswered && choice.correct && (
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded-sm font-sans whitespace-nowrap ml-1 font-bold">
                    {choice.hint} ➔
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Turn feedback and next round action button */}
          <div className="mt-4 min-h-[64px] flex flex-col justify-end">
            <AnimatePresence>
              {hasAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border rounded-sm p-3 shadow-md flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-xl">
                      {userSuccess === true ? '🎉' : '❌'}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold font-serif ${userSuccess === true ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {userSuccess === true ? '切合对章！才华横溢' : '出律沉底！答错了'}
                      </h4>
                      <p className="text-[9px] text-stone-500 mt-0.5">
                        {userSuccess === true ? '下一回合即将继续，请稳住心火。' : '痛哉！若无此词可答，亦多积累雅量。'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextRound}
                    className="px-4 py-2 bg-gradient-to-r from-[#6F8F72] to-[#516E5D] text-white font-bold font-serif text-xs rounded-sm hover:-translate-y-0.5 transition-transform cursor-pointer"
                  >
                    {currentRound < selectedPoet.rounds.length - 1 ? '下一轮令' : '结算对决'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}

      {/* SCREEN 4: RESULTS */}
      {gameState === 'result' && selectedPoet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FAF4EC]/95 border-2 border-indigo-300 rounded-sm p-4 text-center shadow-xl flex-1 flex flex-col justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-3xl mx-auto mb-3">
            {score >= 2 ? '🏆' : '📚'}
          </div>

          <h3 className="font-serif font-extrabold text-lg text-indigo-900 tracking-wide mb-1">
            飞花唱和词笔结案
          </h3>
          <p className="text-[10px] text-stone-500 font-serif">
            与 {selectedPoet.name} 飞花对局最终评算
          </p>

          <div className="my-4 border-t border-b border-stone-200 py-3 bg-white/60 px-2 rounded-sm">
            <div className="flex justify-between items-center text-xs font-serif text-stone-600 mb-1.5">
              <span>三轮对辞成功数:</span>
              <span className="font-black text-stone-800 font-mono text-sm">{score} / 3</span>
            </div>
            <div className="flex justify-between items-center text-xs font-serif text-stone-600">
              <span>对决战况:</span>
              <span className={`font-black ${score >= 2 ? 'text-emerald-700' : 'text-stone-500'}`}>
                {score >= 2 ? '御前词魁 (大获全胜)' : '遗珠之憾 (词穷不战)'}
              </span>
            </div>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-2.5 mb-5 max-w-xs mx-auto w-full">
            <div className="bg-white p-2 rounded border border-indigo-100 flex flex-col items-center">
              <span className="text-[9px] text-stone-400 font-serif">赐赐铜钱</span>
              <span className="text-sm font-bold text-amber-600">
                +{score >= 2 ? (selectedPoet.id === 'xinqiji' ? 180 : selectedPoet.id === 'liqingzhao' ? 120 : 80) : 20} 文
              </span>
            </div>
            <div className="bg-white p-2 rounded border border-indigo-100 flex flex-col items-center">
              <span className="text-[9px] text-stone-400 font-serif">功勋增长</span>
              <span className="text-sm font-bold text-emerald-700">
                +{score >= 2 ? (selectedPoet.id === 'xinqiji' ? 150 : selectedPoet.id === 'liqingzhao' ? 100 : 60) : 10} EXP
              </span>
            </div>
          </div>

          <p className="text-[10px] text-stone-500 font-serif mb-5 leading-relaxed max-w-sm mx-auto">
            {score >= 2 
              ? `大宋才子真乃饱学之士！在以【${selectedPoet.keyword}】字为飞花令的斗词中，您反应电掣，对词精到流畅，让${selectedPoet.name}大加赞谓，引为翰墨知己！` 
              : `虽然本场落于下风，但与${selectedPoet.name}高人当窗共对辞章，大饱耳福，亦增长了数十EXP学业点。勤于翻看通鉴，方能再次战胜仙贤。`}
          </p>

          <button
            onClick={() => {
              SoundManager.playClick(soundEnabled);
              onNavigate('menu');
            }}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:brightness-105 transition-all font-serif font-black text-xs tracking-wider rounded-sm shadow-md cursor-pointer"
          >
            领赏归去
          </button>
        </motion.div>
      )}

    </div>
  );
};
