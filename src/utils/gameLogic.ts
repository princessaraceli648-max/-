/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tile, Artifact } from '../types';

// Historical list of Lv1 to Lv16 items with rich Song Dynasty lore
export const ARTIFACTS_DB: { [key: number]: Artifact } = {
  1: {
    level: 1,
    name: '建窑黑釉茶盏',
    type: '茶器',
    era: '宋代',
    author: '建窑匠人',
    story: '建窑出产的黑釉兔毫盏，盏口微撇，深腹敛足。釉面呈现丝丝兔毫纹理，是宋代斗茶盛会中最为推崇的首选茶盏。',
    background: '宋代崇尚白色茶沫，黑釉建盏最能衬托乳白茶色，苏轼曾赞其“道人手装双建芽，美瓷黑釉发兔毫”。',
    gradient: 'from-[#2C313C] to-[#1F232B]',
    textColor: 'text-stone-300',
    borderColor: 'border-slate-700',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Jian_ware_tea_bowl%2C_Song_dynasty%2C_reign_of_Huizong%2C_1101-1125_AD%2C_stoneware_with_iron-rich_glaze_-_Asian_Art_Museum_of_San_Francisco_-_DSC01389.JPG',
  },
  2: {
    level: 2,
    name: '龙泉窑青瓷碗',
    type: '瓷器',
    era: '南宋',
    author: '龙泉窑匠人',
    story: '胎质灰白致密，施青绿釉。釉质莹润如玉，粉青微带柔光。端庄大方，清丽绝俗。',
    background: '龙泉青瓷以温润如玉、如青梅般的青绿色著称，是宋代文人书齋茶几上的典雅常用器物。',
    gradient: 'from-[#739281] to-[#516E5D]',
    textColor: 'text-[#EAF3EC]',
    borderColor: 'border-[#8AAC97]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Celadon_bowl_with_lotus_petals%2C_Longquan_ware%2C_Southern_Song_dynasty%2C_1100s-1200s_AD%2C_stoneware_-_Guimet_Museum_-_DSC04066.jpg',
  },
  3: {
    level: 3,
    name: '汝窑天青梅花瓶',
    type: '瓷器',
    era: '北宋',
    author: '汝州官窑',
    story: '天青色釉温润纯净，施微乳浊。器身饰有极细小的冰裂开片。世称“雨过天晴云破处”之极致美感。',
    background: '汝窑名列宋代五大名窑（汝、官、哥、钧、定）之首，传世极其稀少。宋徽宗精选雨后碧天之色，专供御用。',
    gradient: 'from-[#82A9B8] to-[#598392]',
    textColor: 'text-[#F1F7F9]',
    borderColor: 'border-[#A3C8D6]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Northern_Song_Ru_Ware_Vase.jpg',
  },
  4: {
    level: 4,
    name: '大宋官窑双耳尊',
    type: '瓷器',
    era: '北宋',
    author: '汴京官窑',
    story: '直口筒身，颈部附双耳。釉面开大片墨纹，古朴稳重。釉色呈现微紫或粉青之别，气度雍容。',
    background: '官窑釉色幽雅，胎骨泛黑，具有著名的“紫口铁足”特征。器物线条内敛饱满，深受皇家祭祀与陈设珍爱。',
    gradient: 'from-[#5D7A68] to-[#3B5445]',
    textColor: 'text-[#F4FAF5]',
    borderColor: 'border-[#7AA387]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Guan-ware_vase%2C_Southern_Song_dynasty.JPG',
  },
  5: {
    level: 5,
    name: '宋椠线装书卷',
    type: '名著',
    era: '宋代',
    author: '临安书坊',
    story: '采用高超雕版印刷术印制。纸质黄润剔透，字体俊逸有力。线装古朴，墨香历久弥新，字字皆是学问。',
    background: '宋本图书雕版精美，校勘严谨，历来为藏书家所最珍视。当时文风鼎盛，造纸与印制技艺冠绝古今。',
    gradient: 'from-[#CFA25C] to-[#A4762E]',
    textColor: 'text-yellow-50',
    borderColor: 'border-[#DFC190]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Song_Dynasty_woodblock_printing.jpg',
  },
  6: {
    level: 6,
    name: '蕉叶梅花式古琴',
    type: '乐器',
    era: '北宋',
    author: '雷威（传）',
    story: '琴身细长，蕉叶式边缘。漆色斑驳，断纹如流水飞瀑。指拂琴弦，余音绕梁，声音清越悠远，入骨三分。',
    background: '琴棋书画为文人雅士四艺之首。宋徽宗曾辟有“琴品”，专藏天下名琴。文人在庭院池畔听松抚琴是极为风雅的日常。',
    gradient: 'from-[#5C4D3C] to-[#3B2F22]',
    textColor: 'text-amber-10',
    borderColor: 'border-amber-700',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Zhongni-style_guqin_%E2%80%9CSong_Feng%E2%80%9D%2C_Song_Dynasty.jpg',
  },
  7: {
    level: 7,
    name: '溪山行旅山水轴',
    type: '书画',
    era: '北宋',
    author: '范宽',
    story: '皴法如雨点，山体雄浑高耸，瀑布如银练飞下。展现了巍峨厚重的北方山水气象，观之如身临其境、心神震撼。',
    background: '这件惊世巨作以全景式布局描绘高山大川，笔力千钧。画面上方巨岩壁立，中间瀑流坠空，山脚驴队行旅，生动传神。',
    gradient: 'from-[#4D5340] to-[#2E3325]',
    textColor: 'text-stone-200',
    borderColor: 'border-[#6F775B]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Fan_Kuan_-_Travelers_among_Mountains_and_Streams_-_National_Palace_Museum.jpg',
  },
  8: {
    level: 8,
    name: '东坡词集手抄谱',
    type: '名著',
    era: '北宋',
    author: '苏轼（苏东坡）',
    story: '手抄苏门精选词章集，附带悠扬的宋代古乐谱。录有“大江东去，浪淘尽”等豪放词作，字里行间见飘逸不羁之风骨。',
    background: '宋词是宋代文学的巅峰代表，词作配合燕乐歌唱。苏东坡打破了词为艳科的藩篱，开创豪放词风，流芳千古。',
    gradient: 'from-[#A85139] to-[#7B321F]',
    textColor: 'text-orange-100',
    borderColor: 'border-orange-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Su_Shi_calligraphy.jpg',
  },
  9: {
    level: 9,
    name: '宋人博古点茶图',
    type: '书画',
    era: '宋代',
    author: '佚名',
    story: '设色宣纸画轴，生动重现了宋代庭院中文士童仆围合博古、烘干团茶、研碎罗筛、注汤击拂点茶的完整过程。',
    background: '点茶是宋代的代表性非遗茶艺。用茶筅在建盏内击拂，形成丰厚的乳白色沫，甚至可以使水面幻化出文字画图案（即茶百戏）。',
    gradient: 'from-[#8A7560] to-[#5C4C3C]',
    textColor: 'text-amber-50',
    borderColor: 'border-amber-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Liu_Songnian_Tea_Competition.jpg',
  },
  10: {
    level: 10,
    name: '清明上河图画卷',
    type: '传世',
    era: '北宋',
    author: '张择端',
    story: '五米长卷。细致描绘了汴京城清明节时分的繁荣街景。虹桥飞架，商户林立，舟横人喧，气象万千，美不胜收。',
    background: '作为宋代写实主义画作的巅峰之作，真实记录了十二世纪汴京的建筑、交通、市民生活，具有无可估量的历史艺术价值。',
    gradient: 'from-[#B39352] to-[#735A22]',
    textColor: 'text-stone-100',
    borderColor: 'border-yellow-600',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/AlongtheRiver_Detail.jpg',
  },
  11: {
    level: 11,
    name: '东京梦华录手稿',
    type: '名著',
    era: '南宋',
    author: '孟元老',
    story: '追述北宋都城开封府三十载往事之名作。街市风俗、御街盛况、四时节日、民间戏乐均有详尽生动的记叙。',
    background: '作者逃难南渡后，怀念昔日汴京“繁华富盛、姑述往昔记之”，成书此部，为后人研究北宋市井盛世留下了最珍贵的文字钥匙。',
    gradient: 'from-[#735639] to-[#46311D]',
    textColor: 'text-zinc-100',
    borderColor: 'border-amber-600',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Huizong_poem.jpg',
  },
  12: {
    level: 12,
    name: '千里江山图画轴',
    type: '传世',
    era: '北宋',
    author: '王希孟',
    story: '意境雄浑的长卷，纯用天然石青石绿颜料。画面奇峰起伏，江水澄澈，渔村茅棚、孤舟小桥点缀其间，绚丽耀眼。',
    background: '十八岁少年天才画师王希孟在徽宗亲自指导下绘制，采用极其昂贵的矿物颜料，展现了烟波浩渺的江南大好河山，历千年而不褪色。',
    gradient: 'from-[#175C66] to-[#0A3D44]',
    textColor: 'text-[#E0F3F5]',
    borderColor: 'border-[#29A3B5]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/A_Thousand_Li_of_Rivers_and_Mountains.jpg',
  },
  13: {
    level: 13,
    name: '大宋盛世雅集合影',
    type: '传世',
    era: '宋代',
    author: '大宋诸学士',
    story: '聚天资绰约之儒士琴师，围合于皇家茂林修竹之间。群贤毕至，探讨乾坤，泼墨挥毫，畅论千古盛世之美事。',
    background: '集合了茶会、吟诗、抚琴、鉴古、礼乐于一堂，展现大宋文化昌盛、儒雅高洁的精神风貌，凝聚了士大夫最为向往的终极世界。',
    gradient: 'from-[#9F7A23] to-[#59420F]',
    textColor: 'text-yellow-100',
    borderColor: 'border-yellow-400',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/A_Literary_Gathering_by_Emperor_Huizong_of_Song.jpg',
  },
  14: {
    level: 14,
    name: '曜变天目神盏',
    type: '茶器',
    era: '北宋',
    author: '建窑神工',
    story: '建窑黑釉瓷之极品。盏内壁现不规则曜变幽蓝光斑。注水点茶，万道彩霓瞬息幻化，星象汇于盏底。',
    background: '曜变天目世传仅三。宋徽宗赞其：“曜变乾坤、神妙无方”。霓虹色泽宛若宇宙星系微缩于盏间，是宋代美学茶道的无上瑰宝。',
    gradient: 'from-[#0A071B] via-[#101F42] to-[#402060]',
    textColor: 'text-[#EAF5FF]',
    borderColor: 'border-[#AB6CFF]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Yohen_Tenmoku_tea_bowl_Inaba.jpg',
  },
  15: {
    level: 15,
    name: '定窑白釉孩儿枕',
    type: '瓷器',
    era: '北宋',
    author: '定窑名工',
    story: '定氏瓷器无双之神珍。通体施白釉，釉色柔和温润如凝脂。伏卧婴儿神态憨态可掬、恬静温顺。',
    background: '白瓷冠绝，孩儿枕兼具清暑实用与绝世雕塑艺术，传神刻画童子之天真，亦寄托百子昌盛、万家安康之祥瑞。',
    gradient: 'from-[#FAF1DA] via-[#EDE0C4] to-[#C2AF8F]',
    textColor: 'text-[#3B2F22]',
    borderColor: 'border-[#DFC190]',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/White_Ding_ware_ceramic_pillow_in_the_shape_of_a_child%2C_Song_dynasty%2C_11th-12th_century_AD%2C_National_Palace_Museum_in_Taipei_-_DSC01314.jpg',
  },
  16: {
    level: 16,
    name: '大宋风华（终极）',
    type: '传世',
    era: '盛宋',
    author: '华夏文明',
    story: '包含了大宋政治、哲学、艺术、美学的无上神魂之盛世大典。仙鹤飞旋不歇，天青余韵不褪。',
    background: '融和曜变之变、汝盏之静、千里江山之势，代表了中华文明中人与造物完美契合的终极境界。今日清明雅集，共鉴大宋千年之不朽风骨。',
    gradient: 'from-[#6F8F72] via-[#CFA25C] to-[#121A16]',
    textColor: 'text-white',
    borderColor: 'border-[#F1C40F] shadow-xl shadow-amber-950/40 font-bold',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Cranes_of_Good_Omen_by_Emperor_Huizong_of_Song.jpg',
  }
};

// Dynamically proxy all image URLs through wsrv.nl to bypass local network blockages (such as in Mainland China), resize them to 400px and convert to WebP to speed up asset loading.
Object.keys(ARTIFACTS_DB).forEach((key) => {
  const numKey = Number(key);
  const art = ARTIFACTS_DB[numKey];
  if (art && art.imageUrl && art.imageUrl.startsWith('http') && !art.imageUrl.includes('wsrv.nl')) {
    art.imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(art.imageUrl)}&w=400&output=webp&q=85`;
  }
});

// Generates a random state tile
const generateRandomTileId = (): string => {
  return 'tile_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
};

// Initialize an empty board
export const createEmptyGrid = (): Tile[] => {
  return [];
};

// Spawn a random new tile in random empty slot
export const spawnTile = (boardList: Tile[]): Tile[] => {
  // Find empty grid indices
  const allPositions = Array.from({ length: 16 }, (_, index) => {
    return { row: Math.floor(index / 4), col: index % 4 };
  });

  const emptyPositions = allPositions.filter(pos => {
    return !boardList.some(tile => tile.row === pos.row && tile.col === pos.col);
  });

  if (emptyPositions.length === 0) return boardList;

  const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  // 90% chance to spawn Lv1 (茶盏), 10% chance to spawn Lv2 (青瓷碗)
  const level = Math.random() < 0.90 ? 1 : 2;

  const newTile: Tile = {
    id: generateRandomTileId(),
    level,
    row: randomPos.row,
    col: randomPos.col,
    isNew: true
  };

  return [...boardList, newTile];
};

// Standard game initializer
export const initializeBoard = (): Tile[] => {
  let b = createEmptyGrid();
  b = spawnTile(b);
  b = spawnTile(b);
  return b;
};

// Check if player has any possible remaining moves
export const hasAvailableMoves = (boardList: Tile[]): boolean => {
  if (boardList.length < 16) return true;

  // Build grid matrix to quickly compare neighbors
  const matrix: (Tile | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));
  boardList.forEach(t => {
    matrix[t.row][t.col] = t;
  });

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const current = matrix[r][c];
      if (!current) return true; // empty spot

      // Check right neighbor
      if (c < 3) {
        const right = matrix[r][c + 1];
        if (!right || right.level === current.level) return true;
      }
      // Check bottom neighbor
      if (r < 3) {
        const bottom = matrix[r + 1][c];
        if (!bottom || bottom.level === current.level) return true;
      }
    }
  }

  return false;
};

// Slide the 2048 grid in direction - returns newBoard, scoreAdded, mergedLevels (for unlocks), and wasMoved
export const slideBoard = (
  boardList: Tile[],
  direction: 'up' | 'down' | 'left' | 'right'
): {
  newBoard: Tile[];
  scoreAdded: number;
  mergedLevels: number[];
  wasMoved: boolean;
  mergeCoordinates: { row: number; col: number; level: number }[];
} => {
  // Clear "new" and "merged" flags from existing tiles before calculation
  const cleanTiles = boardList.map(t => ({
    ...t,
    isNew: false,
    isMerged: false,
  }));

  // Create 4x4 matrix
  const grid: (Tile | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));
  cleanTiles.forEach(tile => {
    grid[tile.row][tile.col] = tile;
  });

  let scoreAdded = 0;
  const mergedLevels: number[] = [];
  let wasMoved = false;

  // Rotate helper functions so we only maintain "Slide Left" algorithm
  const rotateLeft = (matrix: (Tile | null)[][]) => {
    const res: (Tile | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[3 - c][r] = matrix[r][c];
      }
    }
    return res;
  };

  const rotateRight = (matrix: (Tile | null)[][]) => {
    const res: (Tile | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[c][3 - r] = matrix[r][c];
      }
    }
    return res;
  };

  // Convert current direction state to "Slide Left" format
  let workingGrid = grid;
  if (direction === 'up') {
    workingGrid = rotateLeft(workingGrid);
  } else if (direction === 'right') {
    workingGrid = rotateLeft(rotateLeft(workingGrid));
  } else if (direction === 'down') {
    workingGrid = rotateRight(workingGrid);
  }

  // Work on row sliding left
  const newWorkingGrid: (Tile | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));

  for (let r = 0; r < 4; r++) {
    // Extract non-null tiles in active row
    const rowTiles: Tile[] = [];
    for (let c = 0; c < 4; c++) {
      if (workingGrid[r][c]) {
        rowTiles.push(workingGrid[r][c]!);
      }
    }

    // Process merges
    const newRowTiles: Tile[] = [];
    let i = 0;
    while (i < rowTiles.length) {
      if (i + 1 < rowTiles.length && rowTiles[i].level === rowTiles[i + 1].level) {
        // Double matching adjacent level tiles
        const combinedLevel = rowTiles[i].level + 1;
        // Cap level at 16 max, though realistically sliding shouldn't exceed 16
        const finalLevel = Math.min(combinedLevel, 16);

        // Generate score & merge info
        const earnedPoints = Math.pow(2, finalLevel);
        scoreAdded += earnedPoints;
        mergedLevels.push(finalLevel);

        newRowTiles.push({
          id: generateRandomTileId(), // Create new element id for visual pop
          level: finalLevel,
          row: r,
          col: newRowTiles.length,
          isMerged: true,
        });
        wasMoved = true;
        i += 2;
      } else {
        newRowTiles.push({
          ...rowTiles[i],
          row: r,
          col: newRowTiles.length,
        });
        i++;
      }
    }

    // Fill remaining items as null
    for (let c = 0; c < 4; c++) {
      if (c < newRowTiles.length) {
        newWorkingGrid[r][c] = newRowTiles[c];
        // If coordinate index shifted, it moved!
        const originalTile = rowTiles[c];
        if (originalTile && (originalTile.col !== c || originalTile.row !== r)) {
          wasMoved = true;
        }
      } else {
        newWorkingGrid[r][c] = null;
      }
    }
    // Check if lengths differ: items slid
    if (rowTiles.length !== newRowTiles.length) {
      wasMoved = true;
    }
  }

  // Rotate back to original coordinate system
  let finalGrid = newWorkingGrid;
  if (direction === 'up') {
    finalGrid = rotateRight(finalGrid);
  } else if (direction === 'right') {
    finalGrid = rotateRight(rotateRight(finalGrid));
  } else if (direction === 'down') {
    finalGrid = rotateLeft(finalGrid);
  }

  // Re-map correct row and column values to individual Tile structures
  const flattenedBoard: Tile[] = [];
  const mergeCoordinates: { row: number; col: number; level: number }[] = [];
  
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = finalGrid[r][c];
      if (tile) {
        const rowMapped = r;
        const colMapped = c;
        flattenedBoard.push({
          ...tile,
          row: rowMapped,
          col: colMapped,
        });
        if (tile.isMerged) {
          mergeCoordinates.push({
            row: rowMapped,
            col: colMapped,
            level: tile.level,
          });
        }
      }
    }
  }

  return {
    newBoard: flattenedBoard,
    scoreAdded,
    mergedLevels,
    wasMoved,
    mergeCoordinates,
  };
};

/**
 * Super Items / Actions
 */

// Simple automatic low-level merge powerup (Combines two identical lowest level tiles available)
export const activateAutoMerge = (board: Tile[]): { board: Tile[]; success: boolean; levelMerged: number } => {
  if (board.length < 2) return { board, success: false, levelMerged: 0 };

  // Find lowest duplicate level
  const counts: { [key: number]: Tile[] } = {};
  board.forEach(t => {
    if (!counts[t.level]) counts[t.level] = [];
    counts[t.level].push(t);
  });

  const duplicateLevels = Object.keys(counts)
    .map(Number)
    .filter(level => counts[level].length >= 2)
    .sort((a, b) => a - b); // Get lowest duplicate

  if (duplicateLevels.length === 0) {
    return { board, success: false, levelMerged: 0 };
  }

  const lowLevel = duplicateLevels[0];
  const itemsOfLevel = counts[lowLevel];
  const t1 = itemsOfLevel[0];
  const t2 = itemsOfLevel[1];

  // Merge t1 and t2 into single tile of level + 1
  const mergedLevel = Math.min(lowLevel + 1, 16);

  // Filter out original items, insert new merged tile at t1's original coordinate
  const nextBoard = board.filter(t => t.id !== t1.id && t.id !== t2.id);
  nextBoard.push({
    id: generateRandomTileId(),
    level: mergedLevel,
    row: t1.row,
    col: t1.col,
    isMerged: true,
  });

  return { board: nextBoard, success: true, levelMerged: mergedLevel };
};

// Simple single tile clear (Clears level 1 & level 2 items to clear up space)
export const triggerBoardCleansing = (board: Tile[]): { board: Tile[]; countCleared: number } => {
  const filtered = board.filter(t => t.level > 2);
  const countCleared = board.length - filtered.length;
  // If count cleared was zero, remove exactly one level 3 item so player is never trapped
  if (countCleared === 0 && board.length > 0) {
    const minLevel = Math.min(...board.map(t => t.level));
    const target = board.find(t => t.level === minLevel);
    if (target) {
      return {
        board: board.filter(t => t.id !== target.id),
        countCleared: 1
      };
    }
  }

  return { board: filtered, countCleared };
};

// Shuffles all tiles on the board, maintaining their levels
export const shuffleBoardTiles = (board: Tile[]): Tile[] => {
  const levels = board.map(t => t.level);
  
  // Create coordinate array
  const coordinates: {row: number, col: number}[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      coordinates.push({row: r, col: c});
    }
  }

  // Shuffle positions
  const shuffledCoordinates = [...coordinates].sort(() => Math.random() - 0.5);

  const shuffledBoard: Tile[] = board.map((t, index) => {
    const pos = shuffledCoordinates[index];
    return {
      ...t,
      row: pos.row,
      col: pos.col,
      isNew: true
    };
  });

  return shuffledBoard;
};
