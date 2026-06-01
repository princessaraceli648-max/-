/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Coins, Check, AlertCircle } from 'lucide-react';
import { PlayerState, ShopItem } from '../types';
import { SoundManager } from './SoundManager';
import {
  AVATAR_SKINS_POOL,
  BACKGROUND_SKINS_POOL,
  TRAIL_SKINS_POOL,
  AvatarSkin,
  BackgroundSkin,
  TrailSkin
} from './SkinConfig';

interface ShopProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  onNavigate: (view: 'splash' | 'menu' | 'game' | 'book' | 'yaji' | 'shop' | 'activity' | 'settings' | 'diancha' | 'feihua') => void;
  soundEnabled: boolean;
}

type ShopTab = 'items' | 'skins' | 'avatars' | 'trails';

export const ShopView: React.FC<ShopProps> = ({ player, setPlayer, onNavigate, soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<ShopTab>('items');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const SHOP_ITEMS: ShopItem[] = [
    {
      id: 'item_undo',
      name: '文心撤回符',
      description: '悔退错手之棋。在对局中可无损回撤一步。',
      price: 120,
      icon: '📿',
      itemType: 'undo',
    },
    {
      id: 'item_shuffle',
      name: '清风刷新卡',
      description: '重新拨转局面。随机重组打乱对局积木位置。',
      price: 180,
      icon: '🍃',
      itemType: 'shuffle',
    },
    {
      id: 'item_automerge',
      name: '匠心合成丸',
      description: '瞬合通幽。一键合拼当前局格中最低等级重复物。',
      price: 220,
      icon: '💊',
      itemType: 'automerge',
    },
  ];

  const handlePurchaseItem = (item: ShopItem) => {
    if (player.coins < item.price) return;

    SoundManager.playSuccess(soundEnabled);

    setPlayer((prev) => {
      const inv = { ...prev.itemsInventory };
      if (item.itemType === 'undo') {
        inv.undoCards = (inv.undoCards || 0) + 1;
      } else if (item.itemType === 'shuffle') {
        inv.shuffleCards = (inv.shuffleCards || 0) + 1;
      } else if (item.itemType === 'automerge') {
        inv.autoMergeCards = (inv.autoMergeCards || 0) + 1;
      }

      return {
        ...prev,
        coins: prev.coins - item.price,
        itemsInventory: inv,
      };
    });

    setSuccessMsg(`您已成功购入【${item.name}】！`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handlePurchaseCosmetic = (category: 'skin' | 'avatar' | 'trail', itemId: string, price: number, name: string) => {
    if (player.coins < price) return;

    SoundManager.playSuccess(soundEnabled);

    setPlayer((prev) => {
      // Unlocked lists backups with fallback initialization
      const unlockedSkinsList = [...(prev.unlockedSkins || ['celadon'])];
      const unlockedAvatarsList = [...(prev.unlockedAvatars || ['avatar_chizi'])];
      const unlockedTrailsList = [...(prev.unlockedTrails || ['trail_spark'])];

      if (category === 'skin') {
        if (!unlockedSkinsList.includes(itemId)) unlockedSkinsList.push(itemId);
      } else if (category === 'avatar') {
        if (!unlockedAvatarsList.includes(itemId)) unlockedAvatarsList.push(itemId);
      } else if (category === 'trail') {
        if (!unlockedTrailsList.includes(itemId)) unlockedTrailsList.push(itemId);
      }

      return {
        ...prev,
        coins: prev.coins - price,
        unlockedSkins: unlockedSkinsList,
        unlockedAvatars: unlockedAvatarsList,
        unlockedTrails: unlockedTrailsList,
      };
    });

    setSuccessMsg(`恭喜您买下并解锁了【${name}】！`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const equipCosmetic = (category: 'skin' | 'avatar' | 'trail', itemId: string, name: string) => {
    SoundManager.playClick(soundEnabled);

    setPlayer((prev) => {
      const update: Partial<PlayerState> = {};
      if (category === 'skin') {
        update.currentSkin = itemId;
      } else if (category === 'avatar') {
        update.currentAvatar = itemId;
      } else if (category === 'trail') {
        update.currentTrail = itemId;
      }
      return {
        ...prev,
        ...update,
      };
    });

    setSuccessMsg(`已成功装配更换【${name}】！`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col px-3.5 py-4 text-[#2F2F2F] font-serif select-none">
      {/* Header Index */}
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

        {/* Big Balance Box */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full shadow-sm text-amber-700 font-bold font-mono">
          <Coins size={14} className="text-[#C8A55A]" />
          <span>{player.coins}文</span>
        </div>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl font-bold tracking-widest text-[#2F2F2F]">汴京百宝集市</h2>
        <p className="text-[10px] text-stone-500 font-sans mt-1 leading-relaxed">
          商贾云集，华采纷呈。花费您的铜钱，解锁心仪的华美背景、文人面貌或流晖拖尾
        </p>
      </div>

      {/* Success Notifications Overlay */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-amber-950 text-amber-50 text-xs font-bold px-4 py-2.5 rounded-sm shadow-lg border border-amber-800 block text-center min-w-[240px]"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic Tab Switcher */}
      <div className="grid grid-cols-4 border-b border-stone-300 mb-4 text-center select-none bg-stone-100 rounded-sm p-1 gap-1">
        {[
          { tabId: 'items' as const, label: '精奇巧药', emoji: '📿' },
          { tabId: 'skins' as const, label: '背景皮肤', emoji: '🏺' },
          { tabId: 'avatars' as const, label: '头像皮肤', emoji: '🧑‍🎓' },
          { tabId: 'trails' as const, label: '滑屏拖尾', emoji: '✨' },
        ].map((t) => (
          <button
            key={t.tabId}
            onClick={() => {
              SoundManager.playClick(soundEnabled);
              setActiveTab(t.tabId);
            }}
            className={`py-2 text-[10px] leading-relaxed font-serif font-bold rounded-sm border transition-all ${
              activeTab === t.tabId
                ? 'bg-[#6F8F72] text-[#F7F2E8] border-[#6F8F72] shadow-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:border-[#6F8F72]/50'
            }`}
          >
            <div className="text-sm mb-0.5">{t.emoji}</div>
            <div>{t.label}</div>
          </button>
        ))}
      </div>

      {/* Main Merchants Item List Container */}
      <div className="flex-1 overflow-y-auto max-h-[58vh] space-y-3.5 pr-1 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'items' && (
            <motion.div
              key="items_list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {SHOP_ITEMS.map((item) => {
                const canAfford = player.coins >= item.price;
                const currentQuantity =
                  item.itemType === 'undo'
                    ? player.itemsInventory?.undoCards || 0
                    : item.itemType === 'shuffle'
                    ? player.itemsInventory?.shuffleCards || 0
                    : player.itemsInventory?.autoMergeCards || 0;

                return (
                  <div
                    key={item.id}
                    className="bg-[#F7F2E8]/90 border border-stone-200 hover:border-[#6F8F72]/40 rounded-sm p-3 shadow-md flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-center text-2xl filter drop-shadow-sm select-none">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-xs">{item.name}</h3>
                          <span className="text-[9px] bg-stone-250 border border-stone-300 text-stone-600 px-1 rounded font-mono">
                            携有: {currentQuantity}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-sans mt-0.5 max-w-[190px] leading-relaxed">
                          {item.description}
                        </p>
                        <span className="text-[10px] text-amber-700 font-bold font-mono tracking-wide block mt-1">
                          需要： {item.price} 文
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => handlePurchaseItem(item)}
                      className={`text-xs px-3.5 py-1.5 rounded-sm font-bold shadow-sm flex items-center transition-all ${
                        canAfford
                          ? 'bg-amber-600 text-amber-50 hover:bg-amber-700 active:scale-95 cursor-pointer'
                          : 'bg-stone-150 border border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      购买
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'skins' && (
            <motion.div
              key="skins_list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {BACKGROUND_SKINS_POOL.map((skinItem) => {
                const isUnlocked = (player.unlockedSkins || ['celadon']).includes(skinItem.id);
                const isEquipped = (player.currentSkin || 'celadon') === skinItem.id;
                const canAfford = player.coins >= skinItem.price;

                return (
                  <div
                    key={skinItem.id}
                    className={`bg-[#F7F2E8]/90 border rounded-sm p-3 shadow-md flex items-center justify-between transition-all ${
                      isEquipped ? 'border-[#6F8F72] bg-[#F2F7F2]' : 'border-stone-200 hover:border-[#6F8F72]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-center text-2xl filter drop-shadow-sm select-none">
                        {skinItem.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs">{skinItem.name}</h3>
                        <p className="text-[10px] text-stone-500 font-sans mt-0.5 max-w-[190px] leading-relaxed">
                          {skinItem.desc}
                        </p>
                        {!isUnlocked && (
                          <span className="text-[10px] text-amber-700 font-bold font-mono tracking-wide block mt-1">
                            价格： {skinItem.price} 文
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="text-[10px] px-2.5 py-1.5 bg-[#6F8F72] text-[#F7F2E8] rounded-sm font-bold flex items-center">
                          <Check size={11} className="mr-0.5" />
                          已配用
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => equipCosmetic('skin', skinItem.id, skinItem.name)}
                          className="text-xs px-3.5 py-1.5 bg-stone-200 border border-stone-350 text-stone-850 rounded-sm hover:bg-stone-300 active:scale-95 transition-transform font-bold"
                        >
                          启用
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => handlePurchaseCosmetic('skin', skinItem.id, skinItem.price, skinItem.name)}
                          className={`text-xs px-3.5 py-1.5 rounded-sm font-bold shadow-sm flex items-center transition-all ${
                            canAfford
                              ? 'bg-amber-600 text-amber-50 hover:bg-amber-700 active:scale-95 cursor-pointer'
                              : 'bg-stone-150 border border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          兑换
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'avatars' && (
            <motion.div
              key="avatars_list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {AVATAR_SKINS_POOL.map((avatarItem) => {
                const isUnlocked = (player.unlockedAvatars || ['avatar_chizi']).includes(avatarItem.id);
                const isEquipped = (player.currentAvatar || 'avatar_chizi') === avatarItem.id;
                const canAfford = player.coins >= avatarItem.price;

                return (
                  <div
                    key={avatarItem.id}
                    className={`bg-[#F7F2E8]/90 border rounded-sm p-3 shadow-md flex items-center justify-between transition-all ${
                      isEquipped ? 'border-[#6F8F72] bg-[#F2F7F2]' : 'border-stone-200 hover:border-[#6F8F72]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-center text-3xl filter drop-shadow-sm select-none">
                        {avatarItem.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs">{avatarItem.name}</h3>
                        <p className="text-[10px] text-stone-500 font-sans mt-0.5 max-w-[190px] leading-relaxed">
                          {avatarItem.desc}
                        </p>
                        {!isUnlocked && (
                          <span className="text-[10px] text-amber-700 font-bold font-mono tracking-wide block mt-1">
                            价格： {avatarItem.price} 文
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="text-[10px] px-2.5 py-1.5 bg-[#6F8F72] text-[#F7F2E8] rounded-sm font-bold flex items-center">
                          <Check size={11} className="mr-0.5" />
                          已用
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => equipCosmetic('avatar', avatarItem.id, avatarItem.name)}
                          className="text-xs px-3.5 py-1.5 bg-stone-200 border border-stone-350 text-stone-850 rounded-sm hover:bg-stone-300 active:scale-95 transition-transform font-bold"
                        >
                          换上
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => handlePurchaseCosmetic('avatar', avatarItem.id, avatarItem.price, avatarItem.name)}
                          className={`text-xs px-3.5 py-1.5 rounded-sm font-bold shadow-sm flex items-center transition-all ${
                            canAfford
                              ? 'bg-amber-600 text-amber-50 hover:bg-amber-700 active:scale-95 cursor-pointer'
                              : 'bg-stone-150 border border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          面谈
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'trails' && (
            <motion.div
              key="trails_list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {TRAIL_SKINS_POOL.map((trailItem) => {
                const isUnlocked = (player.unlockedTrails || ['trail_spark']).includes(trailItem.id);
                const isEquipped = (player.currentTrail || 'trail_spark') === trailItem.id;
                const canAfford = player.coins >= trailItem.price;

                return (
                  <div
                    key={trailItem.id}
                    className={`bg-[#F7F2E8]/90 border rounded-sm p-3 shadow-md flex items-center justify-between transition-all ${
                      isEquipped ? 'border-[#6F8F72] bg-[#F2F7F2]' : 'border-stone-200 hover:border-[#6F8F72]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-center text-2xl filter drop-shadow-sm select-none">
                        {trailItem.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs">{trailItem.name}</h3>
                        <p className="text-[10px] text-stone-500 font-sans mt-0.5 max-w-[190px] leading-relaxed">
                          {trailItem.desc}
                        </p>
                        {!isUnlocked && (
                          <span className="text-[10px] text-amber-700 font-bold font-mono tracking-wide block mt-1">
                            价格： {trailItem.price} 文
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="text-[10px] px-2.5 py-1.5 bg-[#6F8F72] text-[#F7F2E8] rounded-sm font-bold flex items-center">
                          <Check size={11} className="mr-0.5" />
                          装配中
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => equipCosmetic('trail', trailItem.id, trailItem.name)}
                          className="text-xs px-3.5 py-1.5 bg-stone-200 border border-stone-350 text-stone-850 rounded-sm hover:bg-stone-300 active:scale-95 transition-transform font-bold"
                        >
                          装配
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => handlePurchaseCosmetic('trail', trailItem.id, trailItem.price, trailItem.name)}
                          className={`text-xs px-3.5 py-1.5 rounded-sm font-bold shadow-sm flex items-center transition-all ${
                            canAfford
                              ? 'bg-amber-600 text-amber-50 hover:bg-amber-700 active:scale-95 cursor-pointer'
                              : 'bg-stone-150 border border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          购得
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="bg-[#FAF2E6] border border-amber-200 rounded-sm p-2 flex items-start space-x-1.5 mt-2 opacity-90 select-none">
        <AlertCircle size={13} className="text-amber-700 mt-0.5 flex-shrink-0" />
        <span className="text-[9px] text-stone-650 font-sans leading-normal">
          所有的头像皮肤及指尖拖尾均在全国雅集和对局中直接展现。快去积攒铜钱，丰富你的汴京风貌吧！
        </span>
      </div>
    </div>
  );
};
