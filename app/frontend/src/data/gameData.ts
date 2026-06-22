// 聊斋奇谭 - 婴宁篇游戏数据

export interface HiddenItem {
  id: string;
  name: string;
  icon: string; // emoji icon (fallback)
  image?: string; // item thumbnail image URL
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  hitRadius: number; // percentage radius for click detection
  hitBox?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    rotation: number;
  };
}

export interface Level {
  id: number;
  name: string;
  difficulty: number; // 1-4 stars
  background: string; // image URL
  story: string; // 核心剧情
  dialogue: {
    speaker: string;
    text: string;
  }[];
  items: HiddenItem[];
}

export const SCENE_IMAGES = {
  scene01: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj44xiaahhq/scene-01-garden-gate.png',
  scene02: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj44yiaahga/scene-02-flower-path.png',
  scene03: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj44aaaahgq/scene-03-scholar-courtyard.png',
  scene04: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj442qaahfq/scene-04-flower-pavilion.png',
  scene05: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj5rtqaahfq/scene-05-west-window.png',
  scene06: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj5slyaahgq/scene-06-moonlit-pavilion.png',
  scene07: '/assets/level7-bg.jpg',
  scene08: '/assets/level8-bg.jpg',
  scene09: '/assets/level9-bg.jpg',
  scene10: '/assets/level10-bg.jpg',
  mainMenu: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj6lqyaahfq/main-menu-bg.png',
  lingmei: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvkap6qaahha/character-lingmei.png',
  storyteller: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvkaqqqaahia/character-storyteller.png',
};

const LEVEL_SCENE_ASSETS: Record<number, string> = {
  1: '/assets/level1-bg.jpg',
  2: '/assets/level2-bg.jpg',
  3: '/assets/level3-bg.jpg',
  4: '/assets/level4-bg.jpg',
  5: '/assets/level5-bg.jpg',
  6: '/assets/level6-bg.jpg',
  7: '/assets/level7-bg.jpg',
  8: '/assets/level8-bg.jpg',
  9: '/assets/level9-bg.jpg',
  10: '/assets/level10-bg.jpg',
};

const LEVEL_TARGET_ASSETS: Record<number, string[]> = {
  1: [
    '第一关狐族玉坠.png',
    '第一关手帕.png',
    '第一关铜铃.png',
    '第一关木梳.png',
    '第一关信笺.png',
  ],
  2: [
    '第二关绣鞋.png',
    '第二关玉.png',
    '第二关书信.png',
    '第二关碎银.png',
    '第二关木盒.png',
  ],
  3: [
    '第三关密函.png',
    '第三关恶霸令牌.png',
    '第三关狐佩拓印.png',
    '第三关毒糕.png',
    '第三关黑珠串.png',
  ],
  4: [
    '第四关鬼母银簪.png',
    '第四关狐族秘卷.png',
    '第四关护身香包.png',
    '第四关旧绢帕.png',
    '第四关引路烛.png',
  ],
  5: [
    '第五关金钗.png',
    '第五关藏脏布袋.png',
    '第五关诬陷字条.png',
    '第五关-令牌.png',
    '第五关驱邪符纸.png',
    '第五关顶针.png',
    '第五关破损绢帕.png',
    '第五关木梳.png',
  ],
  6: [
    '第六关休书.png',
    '第六关施暴木仗.png',
    '第六关恶霸约定书.png',
    '第六关狐毛护符.png',
    '第六关求救竹.png',
    '第六关铜烛台.png',
    '第六关破损砚台.png',
    '第六关麻线团.png',
    '第六关银手镯.png',
    '第六关木算盘.png',
  ],
  7: [
    '第七关恶霸腰牌.png',
    '第七关打手钢刀.png',
    '第七关绢扇.png',
    '第七关求救铜锣.png',
    '第七关镇邪桃木杖.png',
    '第七关铜铃铛.png',
    '第七关破损草帽.png',
    '第七关银簪.png',
    '第七关木碗.png',
    '第七关布靴.png',
    '第七关竹篮.png',
    '第七关铜钥匙.png',
  ],
  8: [
    '第八关千年花片.png',
    '第八关灵泉露滴.png',
    '第八关狐族灵石.png',
    '第八关鬼母骨片.png',
    '第八关觉醒咒纸.png',
    '第八关灵草种子.png',
    '第八关玉扣.png',
    '第八关铜制令牌.png',
    '第八关狐毛.png',
    '第八关琉璃珠.png',
    '第八关银质小铃.png',
  ],
  9: [
    '第九关恶奴皮鞭.png',
    '第九关狐族咒符.png',
    '第九关银饰.png',
    '第九关恶奴腰牌.png',
    '第九关灵草.png',
    '第九关木柴.png',
    '第九关陶碗.png',
    '第九关铜钗.png',
    '第九关麻绳.png',
    '第九关破布.png',
    '第九关银戒指.png',
    '第九关竹片.png',
    '第九关石砚.png',
    '第九关布巾.png',
    '第九关铁钳.png',
  ],
  10: [
    '第十关狐族玉坠.png',
    '第十关折扇.png',
    '第十关金钗.png',
    '第十关匕首.png',
    '第十关鬼母玉佩.png',
    '第十关铜香炉.png',
    '第十关破损字画.png',
    '第十关银酒杯.png',
    '第十关木盒钥匙.png',
    '第十关玉簪.png',
    '第十关麻布袋.png',
    '第十关铜烛台.png',
    '第十关竹笔筒.png',
    '第十关银钗.png',
    '第十关墨锭.png',
  ],
};

const getTargetImagePath = (levelId: number, index: number) => {
  const filename = LEVEL_TARGET_ASSETS[levelId]?.[index];
  return filename ? `/assets/target-ui/${filename}` : undefined;
};

const RAW_LEVELS: Level[] = [
  {
    id: 1,
    name: '入园寻踪·荒门残香',
    difficulty: 1,
    background: '/assets/level1-bg.jpg',
    story: '进入废园，初见花香残影',
    dialogue: [
      { speaker: '婴宁', text: '推开这扇荒废已久的园门，一股淡淡的海棠花香扑面而来……' },
      { speaker: '内心', text: '园中似有人居住的痕迹，可放眼望去，却无半个人影。' },
    ],
    items: [
      { id: 'fox-jade', name: '狐族玉坠', icon: '🦊', image: '/assets/level1-items.jpg', x: 35.04947024828767, y: 41.82741288892658, hitRadius: 5, hitBox: { left: 1.8, right: 1.8, top: 3.4800222849322395, bottom: 4.674809548609005, rotation: 0 } },
      { id: 'handkerchief', name: '手帕', icon: '🎀', image: '/assets/level1-items.jpg', x: 27.771604773116433, y: 45.771082878147446, hitRadius: 5, hitBox: { left: 2.9186991652397287, right: 5, top: 12.638039410418209, bottom: 8.211331403587394, rotation: 0 } },
      { id: 'copper-bell', name: '铜铃', icon: '🔔', image: '/assets/level1-items.jpg', x: 19.367548694349313, y: 23.967698959632784, hitRadius: 5, hitBox: { left: 1.8, right: 1.8, top: 5, bottom: 5, rotation: 0 } },
      { id: 'wood-comb', name: '木梳', icon: '🪮', image: '/assets/level1-items.jpg', x: 69.93478435359589, y: 74.21760509646711, hitRadius: 5, hitBox: { left: 1.8, right: 3.191352739726028, top: 2.9095764651737426, bottom: 5, rotation: 0 } },
      { id: 'letter', name: '信笺', icon: '✉️', image: '/assets/level1-items.jpg', x: 77.31573737157534, y: 76.30177916116608, hitRadius: 5, hitBox: { left: 3.739498608732873, right: 5, top: 5, bottom: 5, rotation: 0 } },
    ],
  },
  {
    id: 2,
    name: '入府惊魂·暗藏端倪',
    difficulty: 2,
    background: '/assets/level2-bg.jpg',
    story: '嫁入王家，气氛诡异，婆母刻薄',
    dialogue: [
      { speaker: '旁白', text: '婴宁随王子服嫁入王家，本以为能得一世安稳，可踏入王府的那一刻，便觉气氛诡异。' },
      { speaker: '婴宁', text: '公子曾说会待我好，可为何入府之后，你对我这般冷淡？婆母也总用冰冷的眼神看我，这王府之中，为何处处透着古怪？' },
      { speaker: '王母', text: '一个山野来的狐妖，也配嫁入我王家？若不是看你还有几分姿色，又似有宝物在身，我怎会容你踏入这王府大门！' },
      { speaker: '王子服', text: '婴宁，你多心了，母亲性子本就如此，你好生适应便是。' },
    ],
    items: [
      { id: 'embroidered-shoe', name: '绣鞋', icon: '👡', image: '/assets/level2-items.jpg', x: 22.21005458047945, y: 68.78057819710052, hitRadius: 5, hitBox: { left: 1.6500000000000001, right: 3.3746254280821937, top: 5, bottom: 3.4788111473106653, rotation: 0 } },
      { id: 'half-jade', name: '玉珏', icon: '💎', image: '/assets/level2-items.jpg', x: 76.14481217893837, y: 75.13080286312933, hitRadius: 5, hitBox: { left: 3.208074700342465, right: 1.6500000000000001, top: 1.6500000000000001, bottom: 3.5938692213596255, rotation: 0 } },
      { id: 'harsh-letter', name: '书信', icon: '✉️', image: '/assets/level2-items.jpg', x: 16.154791845034246, y: 41.8877638766093, hitRadius: 5, hitBox: { left: 5, right: 2.6465512628424683, top: 5, bottom: 5, rotation: 0 } },
      { id: 'silver-pieces', name: '碎银', icon: '🪙', image: '/assets/level2-items.jpg', x: 69.42877782534248, y: 71.09022975280682, hitRadius: 5, hitBox: { left: 2.3341850385273943, right: 5, top: 5, bottom: 3.051885135707977, rotation: 0 } },
      { id: 'carved-box', name: '木盒', icon: '📦', image: '/assets/level2-items.jpg', x: 81.8197372645548, y: 67.41562609759347, hitRadius: 5, hitBox: { left: 5, right: 5, top: 5, bottom: 5, rotation: 0 } },
    ],
  },
  {
    id: 3,
    name: '伪善面具·暗中勾结',
    difficulty: 3,
    background: '/assets/level3-bg.jpg',
    story: '书房偷听，发现王子服与恶霸密谋',
    dialogue: [
      { speaker: '旁白', text: '婴宁心中不安，趁王子服和王母不备，悄悄溜进了书房，想要查清心中的疑惑。' },
      { speaker: '婴宁', text: '我听到了，他们说……他们盯上了我身上的狐族玉佩，说那是狐族至宝，能换大笔钱财。原来，你的温柔都是假的，王子服，你从一开始，就是在算计我！' },
      { speaker: '旁白', text: '婴宁看着收集到的密函、令牌和狐佩拓印，所有的天真与期待，在这一刻彻底崩塌。' },
    ],
    items: [
      { id: 'secret-letter', name: '密函', icon: '📄', image: '/assets/level3-items.jpg', x: 67.97149240154108, y: 67.6336308694757, hitRadius: 5, hitBox: { left: 5, right: 3.0789811643835634, top: 3.8118739932418464, bottom: 5, rotation: 0 } },
      { id: 'bully-token', name: '恶霸令牌', icon: '🏷️', image: '/assets/level3-items.jpg', x: 85.17764073202055, y: 72.72043310281349, hitRadius: 5, hitBox: { left: 1.5, right: 5, top: 3.1245533930020457, bottom: 3.5308900650380934, rotation: 0 } },
      { id: 'fox-rubbing', name: '狐佩拓印', icon: '🦊', image: '/assets/level3-items.jpg', x: 35, y: 67, hitRadius: 5, hitBox: { left: 5, right: 5, top: 5, bottom: 5, rotation: 0 } },
      { id: 'poison-cake', name: '毒糕', icon: '🍪', image: '/assets/level3-items.jpg', x: 56.08898758561646, y: 66.44611043152835, hitRadius: 5, hitBox: { left: 1.5, right: 5.159193065068486, top: 2.246478617365291, bottom: 5, rotation: 0 } },
      { id: 'black-beads', name: '黑珠串', icon: '📿', image: '/assets/level3-items.jpg', x: 71.29394531249999, y: 18.220233265105918, hitRadius: 5, hitBox: { left: 2.1790052440068592, right: 1.5, top: 5, bottom: 7.4228808119466585, rotation: 0 } },
    ],
  },
  {
    id: 4,
    name: '鬼母叮嘱·遗落信物',
    difficulty: 3,
    background: '/assets/level4-bg.jpg',
    story: '梦回深山旧屋，鬼母传授灵力',
    dialogue: [
      { speaker: '旁白', text: '婴宁心事重重，梦回深山旧屋，这里是她与鬼母相依为命的地方。' },
      { speaker: '鬼母', text: '我的孩儿，娘知道你受委屈了。娘生前，便料到你可能会遭遇不测，所以在旧屋中留下了护身信物，还有狐族的秘卷。' },
      { speaker: '婴宁', text: '娘亲，我好傻，我被王子服的花言巧语蒙蔽，差点酿成大错。他们要抢我的狐族玉佩，还要害我，我该怎么办？' },
      { speaker: '鬼母', text: '孩儿，你本是狐族血脉，天生拥有强大的灵力，只是尚未觉醒。集齐这些信物，你便能自保，便能反击！' },
    ],
    items: [
      { id: 'ghost-mother-pin', name: '鬼母银簪', icon: '📍', image: '/assets/level4-items.png', x: 21.523412417059077, y: 55.94371862396598, hitRadius: 5, hitBox: { left: 6.223044199486301, right: 1.35, top: 1.35, bottom: 3.206305182457889, rotation: 0 } },
      { id: 'fox-scroll', name: '狐族秘卷', icon: '📜', image: '/assets/level4-items.png', x: 38.525120983385065, y: 62.12146082878146, hitRadius: 5, hitBox: { left: 5, right: 1.35, top: 5, bottom: 7.546416849346585, rotation: 0 } },
      { id: 'protection-pouch', name: '护身香包', icon: '🎒', image: '/assets/level4-items.png', x: 26.055488272889022, y: 53.574957685879355, hitRadius: 5, hitBox: { left: 1.35, right: 2.8221318493150704, top: 2.033923964780122, bottom: 5, rotation: 0 } },
      { id: 'old-kerchief', name: '旧绢帕', icon: '🧣', image: '/assets/level4-items.png', x: 76.9474742314587, y: 58.6438558988458, hitRadius: 5, hitBox: { left: 2.2134524828767184, right: 2.340943386130141, top: 2.1320261121271216, bottom: 4.940654256543169, rotation: 0 } },
      { id: 'guide-candle', name: '引路烛', icon: '🕯️', image: '/assets/level4-items.png', x: 80.85787002354452, y: 53.74473155134618, hitRadius: 5, hitBox: { left: 1.35, right: 2.21445580051369, top: 5, bottom: 5, rotation: 0 } },
    ],
  },
  {
    id: 5,
    name: '恶婆刁难·寻物自证',
    difficulty: 4,
    background: '/assets/level5-bg.jpg',
    story: '王母诬陷偷窃，婴宁当众拆穿',
    dialogue: [
      { speaker: '旁白', text: '婴宁从深山旧屋回到王家，刚踏入卧房，便被王母拦住，诬陷她偷拿了家中的金钗和银两。' },
      { speaker: '王母', text: '你这个狐妖！刚回府就偷我王家的钱财，今天你必须交出狐族玉佩，否则我就打断你的腿！' },
      { speaker: '婴宁', text: '我没有偷！是你故意把金钗藏起来，又把赃物藏在墙角，还写了诬陷我的字条！大家看，这就是证据！' },
      { speaker: '旁白', text: '婴宁当众拆穿了王母的阴谋，这是她第一次反击，第一次打脸恶婆！' },
    ],
    items: [
      { id: 'gold-hairpin', name: '金钗', icon: '✨', image: '/assets/level5-items.png', x: 74.76527718321918, y: 78.75653711531241, hitRadius: 4, hitBox: { left: 1.228836686643831, right: 2.476963827054803, top: 4, bottom: 10.209502585778822, rotation: -51.537210088196105 } },
      { id: 'hidden-bag', name: '藏赃布袋', icon: '👝', image: '/assets/level5-items.png', x: 12.13043129280822, y: 69.27214262356631, hitRadius: 4, hitBox: { left: 4, right: 4, top: 4, bottom: 9.729286518827138, rotation: 0 } },
      { id: 'slander-note', name: '诬陷字条', icon: '📝', image: '/assets/level5-items.png', x: 65.54205907534246, y: 79.53624102244238, hitRadius: 4, hitBox: { left: 4, right: 4, top: 2.7216442404350403, bottom: 4, rotation: 14.808845929594666 } },
      { id: 'innocence-token', name: '令牌', icon: '🏅', image: '/assets/level5-items.png', x: 56.37876055991813, y: 56.08023786742888, hitRadius: 4, hitBox: { left: 1.2000000000000002, right: 1.2000000000000002, top: 1.4190657284387171, bottom: 4, rotation: -43.56556370784974 } },
      { id: 'exorcism-paper', name: '驱邪符纸', icon: '📃', image: '/assets/level5-items.png', x: 13.40099261558219, y: 44.42652633618758, hitRadius: 4, hitBox: { left: 1.2000000000000002, right: 1.5789945419520546, top: 4, bottom: 4, rotation: 0 } },
      { id: 'copper-thimble', name: '顶针', icon: '⭕', image: '/assets/level5-items.png', x: 72.14208315496575, y: 77.59851506957985, hitRadius: 4, hitBox: { left: 1.2000000000000002, right: 1.2000000000000002, top: 1.2000000000000002, bottom: 3.6590647595286185, rotation: 0 } },
      { id: 'torn-kerchief', name: '破损绢帕', icon: '🎀', image: '/assets/level5-items.png', x: 58.76763372551903, y: 51.57724484358158, hitRadius: 4, hitBox: { left: 1.9579141695205493, right: 1.2000000000000002, top: 4, bottom: 2.5084840190390807, rotation: -50.44546465098223 } },
      { id: 'wooden-comb', name: '木梳', icon: '〰️', image: '/assets/level5-items.png', x: 69.47023491010275, y: 72.78706989475214, hitRadius: 4, hitBox: { left: 4, right: 2.659902076198634, top: 1.2000000000000002, bottom: 4, rotation: -18.23891250217279 } },
    ],
  },
  {
    id: 6,
    name: '渣男摊牌·威逼利诱',
    difficulty: 4,
    background: '/assets/level6-bg.jpg',
    story: '王子服撕破伪善面具，暴力威逼',
    dialogue: [
      { speaker: '旁白', text: '王母诬陷不成，王子服见事情败露，再也不愿伪装，彻底撕破了伪善的面具。' },
      { speaker: '王子服', text: '婴宁，别给脸不要脸！我对你的温柔，全是装的！我要的，从来都是你身上的狐族玉佩！今天你交也得交，不交也得交！' },
      { speaker: '婴宁', text: '王子服，你真是无可救药。我真是瞎了眼，才会相信你的花言巧语。想要我的狐族玉佩，除非我死！' },
      { speaker: '旁白', text: '这一刻，她彻底觉醒，复仇的种子，在她心中生根发芽。' },
    ],
    items: [
      { id: 'divorce-letter', name: '休书', icon: '📋', image: '/assets/level6-items.png', x: 77.92723146203448, y: 64.0275329429433, hitRadius: 4, hitBox: { left: 3.820594265036391, right: 3.009725492294521, top: 4, bottom: 4, rotation: 62.653086841269314 } },
      { id: 'beating-stick', name: '施暴木杖', icon: '🪵', image: '/assets/level6-items.png', x: 60.837620565336074, y: 19.405332184771154, hitRadius: 4, hitBox: { left: 4, right: 10.469392123287669, top: 4, bottom: 1.0499999999999998, rotation: -47.5021025466893 } },
      { id: 'bully-contract', name: '恶霸约定书', icon: '📑', image: '/assets/level6-items.png', x: 53.255908077710295, y: 40.67223323179962, hitRadius: 4, hitBox: { left: 1.5405340325342394, right: 1.402498929794521, top: 1.0499999999999998, bottom: 4, rotation: 0.5955501070831034 } },
      { id: 'fox-fur-charm', name: '狐毛护符', icon: '🦊', image: '/assets/level6-items.png', x: 43.16651184918128, y: 55.593521965494695, hitRadius: 4, hitBox: { left: 1.0499999999999998, right: 1.0499999999999998, top: 2.248694999212759, bottom: 4, rotation: 0 } },
      { id: 'bamboo-plea', name: '求救竹', icon: '🎋', image: '/assets/level6-items.png', x: 21.430084437540135, y: 68.30123755556093, hitRadius: 4, hitBox: { left: 4, right: 3.5949941138698662, top: 1.0499999999999998, bottom: 3.452565795051285, rotation: 64.53258889230028 } },
      { id: 'copper-candlestick', name: '铜烛台', icon: '🕯️', image: '/assets/level6-items.png', x: 48.77685337850492, y: 38.272882174476486, hitRadius: 4, hitBox: { left: 4, right: 1.0499999999999998, top: 6.184324548548457, bottom: 4, rotation: 0 } },
      { id: 'broken-inkstone', name: '破损砚台', icon: '⬛', image: '/assets/level6-items.png', x: 84.32814004976457, y: 66.2675255398646, hitRadius: 4, hitBox: { left: 2.023464255136986, right: 4, top: 4, bottom: 4, rotation: 28.480399992386577 } },
      { id: 'hemp-ball', name: '麻线团', icon: '🧶', image: '/assets/level6-items.png', x: 25.45695746434878, y: 72.75184471398985, hitRadius: 4, hitBox: { left: 2.023798694349317, right: 1.0499999999999998, top: 2.460038514176361, bottom: 4, rotation: 0 } },
      { id: 'silver-bracelet', name: '银手镯', icon: '💍', image: '/assets/level6-items.png', x: 34.14628329342359, y: 77.8843321938547, hitRadius: 4, hitBox: { left: 2.6364913313356126, right: 1.0499999999999998, top: 1.7569731248561737, bottom: 4, rotation: 0 } },
      { id: 'wooden-abacus', name: '木算盘', icon: '🧮', image: '/assets/level6-items.png', x: 59.07851232241278, y: 78.46745673210847, hitRadius: 4, hitBox: { left: 4, right: 2.8682577054794507, top: 4, bottom: 1.8338803638257417, rotation: -13.9018925918275 } },
    ],
  },
  {
    id: 7,
    name: '恶霸上门·色胆包天',
    difficulty: 4,
    background: '/assets/level7-bg.jpg',
    story: '恶霸强闯王府，婴宁初次动用灵力',
    dialogue: [
      { speaker: '旁白', text: '王子服见威逼利诱不成，便派人通知了邻人恶霸。恶霸带着一群打手，气势汹汹地闯入王府。' },
      { speaker: '恶霸', text: '小美人，别反抗了，跟爷走，爷保证让你吃香的喝辣的！' },
      { speaker: '婴宁', text: '放肆！你这恶霸，也敢对我动手！再往前走一步，休怪我不客气！' },
      { speaker: '旁白', text: '婴宁动用了一丝狐族灵力，桃木杖发出微弱的金光，打手们被金光震慑，纷纷停下脚步。' },
    ],
    items: [
      { id: 'bully-waist-token', name: '恶霸腰牌', icon: '🏷️', x: 63.50222067636985, y: 42.624995458233904, hitRadius: 4, hitBox: { left: 0.9, right: 1.7809958261986338, top: 2.6059805975753036, bottom: 4, rotation: 0 } },
      { id: 'thug-blade', name: '打手钢刀', icon: '🗡️', x: 72.51123715753427, y: 77.46989717441595, hitRadius: 4, hitBox: { left: 6.955104880137, right: 4, top: 0.9, bottom: 3.5676238691002453, rotation: -15.60133684524556 } },
      { id: 'lewd-fan', name: '轻薄绢扇', icon: '🪭', x: 58.4896457619863, y: 31.392856710308003, hitRadius: 4, hitBox: { left: 4, right: 4, top: 4, bottom: 4, rotation: 0 } },
      { id: 'rescue-gong', name: '求救铜锣', icon: '🥁', x: 87.21069670376713, y: 31.713965627914302, hitRadius: 4, hitBox: { left: 4, right: 0.9, top: 4, bottom: 4, rotation: 0 } },
      { id: 'peach-staff', name: '镇邪桃木杖', icon: '🪵', x: 40.25913687928082, y: 42.091077549141914, hitRadius: 4, hitBox: { left: 3.0562125428082183, right: 15.62845141267124, top: 2.8, bottom: 4, rotation: -43.38670305346902 } },
      { id: 'copper-bell-7', name: '铜铃铛', icon: '🔔', x: 60.78737692636987, y: 47.226712851381315, hitRadius: 3, hitBox: { left: 0.9, right: 1.877622003424662, top: 1.157254108784386, bottom: 3, rotation: -61.41401113542013 } },
      { id: 'broken-hat', name: '破损草帽', icon: '👒', x: 26.22283015839041, y: 71.36213014884882, hitRadius: 4, hitBox: { left: 4, right: 4, top: 4, bottom: 4.821151307423065, rotation: 0 } },
      { id: 'silver-pin-7', name: '银簪', icon: '📍', x: 82.02988548801369, y: 67.7521527971223, hitRadius: 3, hitBox: { left: 3, right: 1.4665400256849437, top: 0.9, bottom: 2.325396344786654, rotation: -10.286370933075546 } },
      { id: 'wooden-bowl', name: '木碗', icon: '🥣', x: 75.9852177868151, y: 70.02419852967894, hitRadius: 4, hitBox: { left: 4, right: 0.9, top: 0.9, bottom: 4, rotation: 0 } },
      { id: 'cloth-boot', name: '布靴', icon: '👢', x: 85.77338398972603, y: 73.40030520668061, hitRadius: 4, hitBox: { left: 3.338813677226028, right: 4, top: 2.261411944239228, bottom: 9.15823513025785, rotation: 0 } },
      { id: 'bamboo-basket', name: '竹篮', icon: '🧺', x: 17.92464415667808, y: 70.26806108978164, hitRadius: 4, hitBox: { left: 4, right: 4, top: 4, bottom: 8.232320418569174, rotation: 0 } },
      { id: 'copper-key', name: '铜钥匙', icon: '🔑', x: 53.53507598458905, y: 68.86901546622744, hitRadius: 3, hitBox: { left: 3, right: 0.9, top: 0.9, bottom: 3, rotation: 0 } },
    ],
  },
  {
    id: 8,
    name: '灵力觉醒·收集秘力',
    difficulty: 5,
    background: '/assets/level8-bg.jpg',
    story: '深山灵地，唤醒狐族灵力',
    dialogue: [
      { speaker: '旁白', text: '婴宁摆脱恶霸的纠缠，毅然返回深山灵地，准备唤醒体内沉睡的狐族灵力。' },
      { speaker: '鬼母', text: '我的孩儿，此刻便是你觉醒灵力的最佳时机。千年花片引灵，灵泉露滴润脉，狐族灵石聚气——凝神静气，唤醒你身为狐族后裔的真正力量！' },
      { speaker: '婴宁', text: '娘亲，我记住了。那些人欺我、辱我、算计我，今日，我便觉醒灵力，护自己周全，报所有恩怨！' },
      { speaker: '旁白', text: '婴宁彻底觉醒狐族灵力，从前的娇憨天真彻底褪去，取而代之的是冷艳与决绝。' },
    ],
    items: [
      { id: 'millennium-petal', name: '千年花片', icon: '🌸', x: 19.19810841181507, y: 48.96651204476367, hitRadius: 4, hitBox: { left: 1.8947051583904084, right: 1.7680329623287676, top: 0.75, bottom: 4, rotation: 0 } },
      { id: 'spirit-dew', name: '灵泉露滴', icon: '💧', x: 21.99850171232877, y: 57.23721341456031, hitRadius: 4, hitBox: { left: 4, right: 0.75, top: 0.75, bottom: 8.869378807513897, rotation: 0 } },
      { id: 'fox-spirit-stone', name: '狐族灵石', icon: '💎', x: 69.19128585188358, y: 31.961788608039537, hitRadius: 4, hitBox: { left: 4, right: 0.75, top: 4, bottom: 4, rotation: 0 } },
      { id: 'ghost-bone', name: '鬼母骨片', icon: '🦴', x: 82.32924871575342, y: 46.2504995942689, hitRadius: 3, hitBox: { left: 6.064800941780831, right: 3, top: 3.148969927452846, bottom: 3, rotation: -45.45392817067376 } },
      { id: 'awakening-paper', name: '觉醒咒纸', icon: '📃', x: 7.2330506207191805, y: 56.31406009664879, hitRadius: 4, hitBox: { left: 4, right: 4, top: 4, bottom: 4, rotation: 34.56944746324332 } },
      { id: 'spirit-seed', name: '灵草种子', icon: '🌱', x: 9.256876070205479, y: 76.86516404859084, hitRadius: 3, hitBox: { left: 3, right: 3, top: 3, bottom: 3, rotation: 0 } },
      { id: 'jade-button', name: '玉扣', icon: '⚪', x: 27.201252140410954, y: 78.09043564620248, hitRadius: 3, hitBox: { left: 1.766922624143831, right: 3, top: 3, bottom: 3, rotation: 0 } },
      { id: 'copper-token-8', name: '铜制令牌', icon: '🏷️', x: 92.33510809075342, y: 62.05046810469074, hitRadius: 4, hitBox: { left: 4, right: 1.0288420376712395, top: 0.75, bottom: 7.072656145917861, rotation: 0 } },
      { id: 'fox-fur-8', name: '狐毛', icon: '🦊', x: 43.26911654537672, y: 19.059503191347627, hitRadius: 3, hitBox: { left: 3, right: 0.8472147902397253, top: 0.75, bottom: 3, rotation: -26.948971980611987 } },
      { id: 'glass-bead', name: '琉璃珠', icon: '🔮', x: 65.63476562500001, y: 76.67947242845203, hitRadius: 3, hitBox: { left: 3, right: 1.2967010916095916, top: 0.8302469509610404, bottom: 5.761999345985686, rotation: 0 } },
      { id: 'silver-bell-8', name: '银质小铃', icon: '🔔', x: 86.1083850599315, y: 16.461031647026058, hitRadius: 3, hitBox: { left: 3, right: 0.75, top: 3, bottom: 3.425714873981132, rotation: 0 } },
    ],
  },
  {
    id: 9,
    name: '锋芒初露·惩治恶奴',
    difficulty: 4,
    background: '/assets/level9-bg.jpg',
    story: '觉醒后返回王家，惩治欺凌下人的恶奴',
    dialogue: [
      { speaker: '旁白', text: '婴宁觉醒灵力后，径直返回王家。恶奴们正仗着王母的势力，肆意欺凌府中下人。' },
      { speaker: '恶奴头目', text: '哟，这不是那个被公子和老夫人嫌弃的狐妖吗？怎么，从山里跑回来送死？' },
      { speaker: '婴宁', text: '你们这些仗势欺人的恶奴，往日里欺辱我、欺凌下人，今日，我便让你们付出代价。' },
      { speaker: '旁白', text: '婴宁挥动狐族咒符，金光迸发，将恶奴们震倒在地。从今日起，王家的规矩，由我来定！' },
    ],
    items: [
      { id: 'whip', name: '恶奴皮鞭', icon: '🪢', x: 69.96528520976027, y: 50.915426259885905, hitRadius: 4, hitBox: { left: 4, right: 4, top: 4, bottom: 4, rotation: -53.22785133627698 } },
      { id: 'fox-talisman', name: '狐族咒符', icon: '📃', x: 30.999929767765405, y: 23.911520719536863, hitRadius: 4, hitBox: { left: 3.174269584760278, right: 0.6000000000000001, top: 3.345380115542529, bottom: 8.272287960080899, rotation: -14.534014184089846 } },
      { id: 'stolen-silver', name: '被抢银饰', icon: '💍', x: 15.692504151226721, y: 74.95188225925612, hitRadius: 3, hitBox: { left: 3, right: 0.8458770333904102, top: 3, bottom: 2.156442646577929, rotation: -38.61501305453395 } },
      { id: 'servant-token', name: '恶奴腰牌', icon: '🏷️', x: 64.05294214536067, y: 48.12652603340317, hitRadius: 4, hitBox: { left: 3.414396939212324, right: 0.6000000000000001, top: 3.617280511584525, bottom: 2.1524095582981033, rotation: -77.49316267020295 } },
      { id: 'spirit-grass', name: '灵草', icon: '🌿', x: 88.23228308272688, y: 62.77695197536546, hitRadius: 3, hitBox: { left: 3, right: 5.091917273116437, top: 22.997698838519028, bottom: 0.6000000000000001, rotation: 0 } },
      { id: 'firewood', name: '木柴', icon: '🪵', x: 11.644798801369863, y: 65.52586384390857, hitRadius: 4, hitBox: { left: 4, right: 4.095984053938356, top: 4, bottom: 4, rotation: 23.814934470339516 } },
      { id: 'clay-bowl', name: '陶碗', icon: '🥣', x: 22.148530933954937, y: 67.11816653445081, hitRadius: 4, hitBox: { left: 0.6000000000000001, right: 4, top: 3.3120738309494158, bottom: 4, rotation: 0 } },
      { id: 'copper-pin-9', name: '铜钗', icon: '📍', x: 74.0646404109589, y: 82.1210410938995, hitRadius: 3, hitBox: { left: 4.066526648116422, right: 3, top: 3, bottom: 3, rotation: -28.956175347603345 } },
      { id: 'hemp-rope', name: '麻绳', icon: '🪢', x: 76.88267579797196, y: 59.820771312994296, hitRadius: 4, hitBox: { left: 4, right: 2.1866705907534225, top: 2.9366211682633505, bottom: 4, rotation: -22.78364701706243 } },
      { id: 'torn-cloth', name: '破布', icon: '🧷', x: 20.604973779965754, y: 57.245521818644264, hitRadius: 3, hitBox: { left: 3, right: 3, top: 3, bottom: 4.273511209078684, rotation: -22.815871739939197 } },
      { id: 'silver-ring', name: '银戒指', icon: '💍', x: 6.149517007070046, y: 79.77255895212373, hitRadius: 3, hitBox: { left: 0.6000000000000001, right: 1.8297971960616444, top: 1.1015417781922565, bottom: 3, rotation: 0 } },
      { id: 'bamboo-slip', name: '竹片', icon: '🎋', x: 92.08130384471318, y: 77.26403897743653, hitRadius: 3, hitBox: { left: 3, right: 6.0029296875, top: 2.622730630881577, bottom: 2.2250043903738828, rotation: -73.76053690507278 } },
      { id: 'stone-inkstone', name: '石砚', icon: '⬛', x: 20.948757641935998, y: 81.59973794009713, hitRadius: 4, hitBox: { left: 0.6000000000000001, right: 4.582927547089042, top: 4, bottom: 1.8738479053374846, rotation: -27.453781334358126 } },
      { id: 'cloth-towel', name: '布巾', icon: '🧻', x: 83.35303152424015, y: 91.67739305654803, hitRadius: 3, hitBox: { left: 3, right: 3.8501444777397182, top: 7.774910073031577, bottom: 3, rotation: -41.58868681069472 } },
      { id: 'iron-pliers', name: '铁钳', icon: '🔧', x: 16.003841138865837, y: 85.83197168663028, hitRadius: 3, hitBox: { left: 7.900537778253425, right: 3, top: 3, bottom: 3, rotation: -21.22404861529428 } },
    ],
  },
  {
    id: 10,
    name: '恩怨了结·狐归深山',
    difficulty: 5,
    background: '/assets/level10-bg.jpg',
    story: '终极对决，惩治恶人，归隐深山',
    dialogue: [
      { speaker: '旁白', text: '婴宁惩治完恶奴，径直闯入王家大堂，找到了王子服、王母和恶霸——这三个算计她、伤害她的人。' },
      { speaker: '王子服', text: '婴宁，我知道错了，我不该算计你，求你饶我一命！' },
      { speaker: '婴宁', text: '你们当初算计我、欺辱我，害我失去天真，如今，该了结所有恩怨了。' },
      { speaker: '鬼母', text: '我的孩儿，你做到了。狐族玉佩物归原主，从此，你便是狐族的守护者，愿你往后，自在随心。' },
      { speaker: '旁白', text: '恩怨了结，婴宁带着双玉佩重返深山。她不再是天真爱笑的狐女，而是清冷强大的狐族守护者。' },
    ],
    items: [
      { id: 'fox-jade-final', name: '狐族玉佩', icon: '💎', x: 32.395732095796774, y: 46.69028221020505, hitRadius: 4, hitBox: { left: 0.44999999999999996, right: 1.3589335402397253, top: 3.0599585033972403, bottom: 0.44999999999999996, rotation: 0 } },
      { id: 'wang-fan', name: '王子服折扇', icon: '🪭', x: 61.97590490889875, y: 43.772866467535444, hitRadius: 4, hitBox: { left: 4, right: 1.4345168022260282, top: 2.0494628604648426, bottom: 4, rotation: 0 } },
      { id: 'wang-mother-pin', name: '王母金钗', icon: '✨', x: 86.43741262775578, y: 30.280913152349008, hitRadius: 3, hitBox: { left: 0.44999999999999996, right: 3, top: 3, bottom: 1.9184541039398297, rotation: 0 } },
      { id: 'bully-dagger', name: '恶霸匕首', icon: '🗡️', x: 75.20759478007278, y: 55.81691648903315, hitRadius: 4, hitBox: { left: 4, right: 1.0519183433219155, top: 0.44999999999999996, bottom: 4, rotation: -33.42363028391811 } },
      { id: 'ghost-jade', name: '鬼母玉佩', icon: '⚪', x: 49.58601086760221, y: 32.89688279669844, hitRadius: 3, hitBox: { left: 1.416320591756751, right: 0.44999999999999996, top: 1.8482081218888915, bottom: 1.5823634139547238, rotation: 0 } },
      { id: 'copper-incense', name: '铜香炉', icon: '🕯️', x: 50.54252854438679, y: 71.97092134266715, hitRadius: 4, hitBox: { left: 2.08165667808219, right: 1.0115234375, top: 2.08579698911187, bottom: 4, rotation: 0 } },
      { id: 'torn-painting', name: '破损字画', icon: '🖼️', x: 74.43827422677654, y: 13.075829894207125, hitRadius: 4, hitBox: { left: 4, right: 1.2662938784246478, top: 4, bottom: 16.055058316276476, rotation: 0 } },
      { id: 'silver-cup', name: '银酒杯', icon: '🥂', x: 88.43151562834439, y: 70.76356436288104, hitRadius: 3, hitBox: { left: 2.404238348137852, right: 0.44999999999999996, top: 1.8354911768624333, bottom: 3.66067557256531, rotation: 0 } },
      { id: 'box-key', name: '木盒钥匙', icon: '🔑', x: 18.206465838706663, y: 93.35162428694272, hitRadius: 3, hitBox: { left: 3, right: 1.6344846960616444, top: 3, bottom: 1.830646626376165, rotation: -39.283988552045535 } },
      { id: 'jade-pin-10', name: '玉簪', icon: '💚', x: 10.641039704623298, y: 61.57563440902541, hitRadius: 3, hitBox: { left: 3, right: 1.0873421446917853, top: 0.44999999999999996, bottom: 2.3272130512190046, rotation: -21.40799956548291 } },
      { id: 'hemp-bag', name: '麻布袋', icon: '👝', x: 52.92585879809236, y: 70.83974681168021, hitRadius: 4, hitBox: { left: 0.44999999999999996, right: 4, top: 4, bottom: 4, rotation: 0 } },
      { id: 'copper-candle-10', name: '铜烛台', icon: '🕯️', x: 49.208707626551806, y: 51.73511890343599, hitRadius: 3, hitBox: { left: 1.9358144263698662, right: 0.6165507277397253, top: 1.7573728002712983, bottom: 3, rotation: 0 } },
      { id: 'bamboo-holder', name: '竹笔筒', icon: '🖊️', x: 96.17085955894157, y: 72.07990480458292, hitRadius: 4, hitBox: { left: 1.391624973244845, right: 0.9181939948095106, top: 4, bottom: 4, rotation: 0 } },
      { id: 'silver-pin-10', name: '银钗', icon: '📍', x: 53.20638013865851, y: 78.01907541753971, hitRadius: 3, hitBox: { left: 2.3990127354452184, right: 1.5388350813356197, top: 1.6386813133576368, bottom: 2.1316143253357893, rotation: 13.100583861580489 } },
      { id: 'ink-stick', name: '墨锭', icon: '⬛', x: 91.34001305985126, y: 73.75955928215873, hitRadius: 3, hitBox: { left: 1.2341609589040985, right: 0.44999999999999996, top: 3, bottom: 3.79268957331621, rotation: -58.3512477184066 } },
    ],
  },
];

export const LEVELS: Level[] = RAW_LEVELS.map((level) => ({
  ...level,
  background: LEVEL_SCENE_ASSETS[level.id] ?? level.background,
  items: level.items.map((item, index) => ({
    ...item,
    image: getTargetImagePath(level.id, index),
  })),
}));

// Game state types
export type Identity = 'lingmei' | 'storyteller';

export interface GameState {
  playerIdentity: Identity | null;
  hasSeenIntro: boolean;
  completedLevels: number[];
  lives: number;
  hints: number;
  coins: number;
  diamonds: number; // 钻石数量
  items: number; // 小刀道具数量
  dailyGiftDay: number; // 1-7
  lastGiftDate: string; // YYYY-MM-DD
}

export const DEFAULT_STATE: GameState = {
  playerIdentity: null,
  hasSeenIntro: false,
  completedLevels: [],
  lives: 3,
  hints: 3,
  coins: 99999,
  diamonds: 9999,
  items: 1,
  dailyGiftDay: 1,
  lastGiftDate: '',
};

const STORAGE_KEY = 'liaozhai_qitan_save_v1';

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function resetGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// 7天礼包配置
export interface DailyGift {
  day: number;
  rewardType: 'coins' | 'hints' | 'lives' | 'items' | 'scroll' | 'skin';
  rewardName: string;
  baseAmount: number;
  doubleAmount: number;
}

export const DAILY_GIFTS: DailyGift[] = [
  { day: 1, rewardType: 'coins', rewardName: '金币', baseAmount: 100, doubleAmount: 200 },
  { day: 2, rewardType: 'hints', rewardName: '提示次数', baseAmount: 2, doubleAmount: 4 },
  { day: 3, rewardType: 'lives', rewardName: '生命', baseAmount: 1, doubleAmount: 2 },
  { day: 4, rewardType: 'items', rewardName: '道具', baseAmount: 1, doubleAmount: 2 },
  { day: 5, rewardType: 'coins', rewardName: '金币', baseAmount: 200, doubleAmount: 400 },
  { day: 6, rewardType: 'scroll', rewardName: '剧情卷轴', baseAmount: 1, doubleAmount: 2 },
  { day: 7, rewardType: 'skin', rewardName: '限定皮肤', baseAmount: 1, doubleAmount: 0 },
];
