/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AvatarSkin {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  price: number;
}

export interface BackgroundSkin {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
}

export interface TrailSkin {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
}

export const AVATAR_SKINS_POOL: AvatarSkin[] = [
  { id: 'avatar_chizi', name: '初学才子', emoji: '🧑‍🎓', desc: '红尘白屋，初向名流书画，文采初展。', price: 0 },
  { id: 'avatar_caizi', name: '风雅才子', emoji: '👨‍🎓', desc: '青衫落拓，斗酒双歌，一曲新词动汴京。', price: 150 },
  { id: 'avatar_cainv', name: '易安才女', emoji: '👩‍🎓', desc: '扫雪烹茶，寻寻觅觅，千古第一风流。', price: 150 },
  { id: 'avatar_linghu', name: '汴京灵狐', emoji: '🦊', desc: '御街繁华，通灵造化，红尾摇曳一抹香。', price: 300 },
  { id: 'avatar_linxiao', name: '博学林鸮', emoji: '🦉', desc: '夜观星曜，通晓天机，学贯古今中外。', price: 300 },
  { id: 'avatar_banyin', name: '威武斑寅', emoji: '🐯', desc: '重山盘踞，王威雄峙，傲视群雄天下豪。', price: 500 },
  { id: 'avatar_haoke', name: '侠骨豪客', emoji: '🥋', desc: '快马狂沙，仗剑天涯，不恋功名恋侠气。', price: 500 },
  { id: 'avatar_quanyuan', name: '九天大圣', emoji: '🐒', desc: '腾云驾雾，法力通天，傲视大宋奇景。', price: 800 }
];

export const BACKGROUND_SKINS_POOL: BackgroundSkin[] = [
  { id: 'celadon', name: '青瓷翠绿 (经典)', desc: '经典青瓷翠绿背景，清静无言，雨过天晴。', price: 0, icon: '🏺' },
  { id: 'ink', name: '宣纸墨韵 (古雅)', desc: '古墨生宣，水墨云山。换上后背景浮现飘逸的水墨粒子。', price: 400, icon: '🖌️' },
  { id: 'palace', name: '宫廷金碧 (奢华)', desc: '朱栏玉宇，金瓦流连。大华金黄光子洒落地表。', price: 800, icon: '🏮' },
  { id: 'sunset', name: '西山落晚 (烟霞)', desc: '落日余晖，暖金染霞。背景洋溢暖色夕阳柔光粒子。', price: 600, icon: '🌅' },
  { id: 'bamboo', name: '修竹幽谷 (青翠)', desc: '竹影婆娑，苍翠欲滴。竹叶与鲜嫩绿色蒸汽相伴。', price: 700, icon: '🎋' },
  { id: 'lavender', name: '紫苏清梦 (烟雨)', desc: '微风轻抚，梦幻淡紫。紫烟飘舞，如墨入水。', price: 900, icon: '🍇' }
];

export const TRAIL_SKINS_POOL: TrailSkin[] = [
  { id: 'trail_spark', name: '流金飞沙 (星屑)', desc: '手指划过空中，碎金闪烁，微尘坠落。', price: 0, icon: '✨' },
  { id: 'trail_ink', name: '墨渍晕化 (写意)', desc: '手指所及落笔成墨，写意山水，浓淡干湿。', price: 300, icon: '🖋️' },
  { id: 'trail_petal', name: '春梅拂雨 (红缨)', desc: '指尖花开，粉色花瓣随微风旋绕，柔情似水。', price: 450, icon: '🌸' },
  { id: 'trail_leaf', name: '竹梢拂影 (翠羽)', desc: '指尖游走，青翠而狭长的竹叶或柳叶悠然滑出。', price: 500, icon: '🍃' },
  { id: 'trail_bubble', name: '盏盎泛沫 (灵气)', desc: '盏中沫泡四起，宛若灵动珍珠浮动升华。', price: 550, icon: '🫧' },
  { id: 'trail_flicker', name: '仙风幽焰 (紫府)', desc: '幽紫色的香火轻拂升腾，带有一丝神异玄奇。', price: 600, icon: '🔥' }
];
