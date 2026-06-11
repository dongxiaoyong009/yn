// 聊斋奇谭 - 婴宁篇游戏数据

export interface HiddenItem {
  id: string;
  name: string;
  icon: string; // emoji icon (fallback)
  image?: string; // item thumbnail image URL
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  hitRadius: number; // percentage radius for click detection
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
  scene07: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj5vkaaahha/scene-07-corridor.png',
  scene08: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj5xxqaahia/scene-08-barrier.png',
  scene09: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj6mjyaahhq/scene-09-bronze-mirror.png',
  scene10: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj6ktqaahga/scene-10-falling-petals.png',
  mainMenu: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvj6lqyaahfq/main-menu-bg.png',
  lingmei: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvkap6qaahha/character-lingmei.png',
  storyteller: 'https://mgx-backend-cdn.metadl.com/generate/images/1123964/2026-06-01/pvkaqqqaahia/character-storyteller.png',
};

export const LEVELS: Level[] = [
  {
    id: 1,
    name: '入园寻踪·荒门残香',
    difficulty: 1,
    background: '/assets/level1-bg.jpg',
    story: '进入废园，初见花香残影',
    dialogue: [
      { speaker: '？？？', text: '推开这扇荒废已久的园门，一股淡淡的海棠花香扑面而来……' },
      { speaker: '内心', text: '园中似有人居住的痕迹，可放眼望去，却无半个人影。' },
    ],
    items: [
      { id: 'fox-jade', name: '狐族玉坠', icon: '🦊', image: '/assets/level1-items.jpg', x: 34, y: 42, hitRadius: 5 },
      { id: 'handkerchief', name: '手帕', icon: '🎀', image: '/assets/level1-items.jpg', x: 29, y: 43, hitRadius: 5 },
      { id: 'copper-bell', name: '铜铃', icon: '🔔', image: '/assets/level1-items.jpg', x: 19, y: 23, hitRadius: 5 },
      { id: 'wood-comb', name: '木梳', icon: '🪮', image: '/assets/level1-items.jpg', x: 70, y: 75, hitRadius: 5 },
      { id: 'letter', name: '信笺', icon: '✉️', image: '/assets/level1-items.jpg', x: 78, y: 77, hitRadius: 5 },
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
      { id: 'embroidered-shoe', name: '绣鞋', icon: '👡', image: '/assets/level2-items.jpg', x: 23, y: 68, hitRadius: 5 },
      { id: 'half-jade', name: '玉珏', icon: '💎', image: '/assets/level2-items.jpg', x: 76, y: 75, hitRadius: 5 },
      { id: 'harsh-letter', name: '书信', icon: '✉️', image: '/assets/level2-items.jpg', x: 14, y: 41, hitRadius: 5 },
      { id: 'silver-pieces', name: '碎银', icon: '🪙', image: '/assets/level2-items.jpg', x: 70, y: 71, hitRadius: 5 },
      { id: 'carved-box', name: '木盒', icon: '📦', image: '/assets/level2-items.jpg', x: 82, y: 68, hitRadius: 5 },
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
      { id: 'secret-letter', name: '密函', icon: '📄', image: '/assets/level3-items.jpg', x: 65, y: 68, hitRadius: 5 },
      { id: 'bully-token', name: '恶霸令牌', icon: '🏷️', image: '/assets/level3-items.jpg', x: 87, y: 74, hitRadius: 5 },
      { id: 'fox-rubbing', name: '狐佩拓印', icon: '🦊', image: '/assets/level3-items.jpg', x: 35, y: 67, hitRadius: 5 },
      { id: 'poison-cake', name: '毒糕', icon: '🍪', image: '/assets/level3-items.jpg', x: 57, y: 68, hitRadius: 5 },
      { id: 'black-beads', name: '黑珠串', icon: '📿', image: '/assets/level3-items.jpg', x: 70, y: 20, hitRadius: 5 },
    ],
  },
  {
    id: 4,
    name: '鬼母叮嘱·遗落信物',
    difficulty: 3,
    background: '/assets/level4-bg.png',
    story: '梦回深山旧屋，鬼母传授灵力',
    dialogue: [
      { speaker: '旁白', text: '婴宁心事重重，梦回深山旧屋，这里是她与鬼母相依为命的地方。' },
      { speaker: '鬼母', text: '我的孩儿，娘知道你受委屈了。娘生前，便料到你可能会遭遇不测，所以在旧屋中留下了护身信物，还有狐族的秘卷。' },
      { speaker: '婴宁', text: '娘亲，我好傻，我被王子服的花言巧语蒙蔽，差点酿成大错。他们要抢我的狐族玉佩，还要害我，我该怎么办？' },
      { speaker: '鬼母', text: '孩儿，你本是狐族血脉，天生拥有强大的灵力，只是尚未觉醒。集齐这些信物，你便能自保，便能反击！' },
    ],
    items: [
      { id: 'ghost-mother-pin', name: '鬼母银簪', icon: '📍', image: '/assets/level4-items.png', x: 20, y: 42, hitRadius: 5 },
      { id: 'fox-scroll', name: '狐族秘卷', icon: '📜', image: '/assets/level4-items.png', x: 45, y: 55, hitRadius: 5 },
      { id: 'protection-pouch', name: '护身香包', icon: '🎒', image: '/assets/level4-items.png', x: 22, y: 62, hitRadius: 5 },
      { id: 'old-kerchief', name: '旧绢帕', icon: '🧣', image: '/assets/level4-items.png', x: 72, y: 48, hitRadius: 5 },
      { id: 'guide-candle', name: '引路烛', icon: '🕯️', image: '/assets/level4-items.png', x: 75, y: 55, hitRadius: 5 },
    ],
  },
  {
    id: 5,
    name: '恶婆刁难·寻物自证',
    difficulty: 4,
    background: '/assets/level5-bg.png',
    story: '王母诬陷偷窃，婴宁当众拆穿',
    dialogue: [
      { speaker: '旁白', text: '婴宁从深山旧屋回到王家，刚踏入卧房，便被王母拦住，诬陷她偷拿了家中的金钗和银两。' },
      { speaker: '王母', text: '你这个狐妖！刚回府就偷我王家的钱财，今天你必须交出狐族玉佩，否则我就打断你的腿！' },
      { speaker: '婴宁', text: '我没有偷！是你故意把金钗藏起来，又把赃物藏在墙角，还写了诬陷我的字条！大家看，这就是证据！' },
      { speaker: '旁白', text: '婴宁当众拆穿了王母的阴谋，这是她第一次反击，第一次打脸恶婆！' },
    ],
    items: [
      { id: 'gold-hairpin', name: '金钗', icon: '✨', image: '/assets/level5-items.png', x: 70, y: 35, hitRadius: 4 },
      { id: 'hidden-bag', name: '藏赃布袋', icon: '👝', image: '/assets/level5-items.png', x: 15, y: 55, hitRadius: 4 },
      { id: 'slander-note', name: '诬陷字条', icon: '📝', image: '/assets/level5-items.png', x: 68, y: 52, hitRadius: 4 },
      { id: 'innocence-token', name: '令牌', icon: '🏅', image: '/assets/level5-items.png', x: 35, y: 38, hitRadius: 4 },
      { id: 'exorcism-paper', name: '驱邪符纸', icon: '📃', image: '/assets/level5-items.png', x: 12, y: 40, hitRadius: 4 },
      { id: 'copper-thimble', name: '顶针', icon: '⭕', image: '/assets/level5-items.png', x: 75, y: 45, hitRadius: 4 },
      { id: 'torn-kerchief', name: '破损绢帕', icon: '🎀', image: '/assets/level5-items.png', x: 40, y: 72, hitRadius: 4 },
      { id: 'wooden-comb', name: '木梳', icon: '〰️', image: '/assets/level5-items.png', x: 62, y: 62, hitRadius: 4 },
    ],
  },
  {
    id: 6,
    name: '渣男摊牌·威逼利诱',
    difficulty: 4,
    background: '/assets/level6-bg.png',
    story: '王子服撕破伪善面具，暴力威逼',
    dialogue: [
      { speaker: '旁白', text: '王母诬陷不成，王子服见事情败露，再也不愿伪装，彻底撕破了伪善的面具。' },
      { speaker: '王子服', text: '婴宁，别给脸不要脸！我对你的温柔，全是装的！我要的，从来都是你身上的狐族玉佩！今天你交也得交，不交也得交！' },
      { speaker: '婴宁', text: '王子服，你真是无可救药。我真是瞎了眼，才会相信你的花言巧语。想要我的狐族玉佩，除非我死！' },
      { speaker: '旁白', text: '这一刻，她彻底觉醒，复仇的种子，在她心中生根发芽。' },
    ],
    items: [
      { id: 'divorce-letter', name: '休书', icon: '📋', image: '/assets/level6-items.png', x: 72, y: 42, hitRadius: 4 },
      { id: 'beating-stick', name: '施暴木杖', icon: '🪵', image: '/assets/level6-items.png', x: 88, y: 65, hitRadius: 4 },
      { id: 'bully-contract', name: '恶霸约定书', icon: '📑', image: '/assets/level6-items.png', x: 45, y: 38, hitRadius: 4 },
      { id: 'fox-fur-charm', name: '狐毛护符', icon: '🦊', image: '/assets/level6-items.png', x: 35, y: 50, hitRadius: 4 },
      { id: 'bamboo-plea', name: '求救竹', icon: '🎋', image: '/assets/level6-items.png', x: 12, y: 72, hitRadius: 4 },
      { id: 'copper-candlestick', name: '铜烛台', icon: '🕯️', image: '/assets/level6-items.png', x: 78, y: 35, hitRadius: 4 },
      { id: 'broken-inkstone', name: '破损砚台', icon: '⬛', image: '/assets/level6-items.png', x: 65, y: 55, hitRadius: 4 },
      { id: 'hemp-ball', name: '麻线团', icon: '🧶', image: '/assets/level6-items.png', x: 15, y: 62, hitRadius: 4 },
      { id: 'silver-bracelet', name: '银手镯', icon: '💍', image: '/assets/level6-items.png', x: 50, y: 78, hitRadius: 4 },
      { id: 'wooden-abacus', name: '木算盘', icon: '🧮', image: '/assets/level6-items.png', x: 38, y: 75, hitRadius: 4 },
    ],
  },
  {
    id: 7,
    name: '恶霸上门·色胆包天',
    difficulty: 4,
    background: SCENE_IMAGES.scene07,
    story: '恶霸强闯王府，婴宁初次动用灵力',
    dialogue: [
      { speaker: '旁白', text: '王子服见威逼利诱不成，便派人通知了邻人恶霸。恶霸带着一群打手，气势汹汹地闯入王府。' },
      { speaker: '恶霸', text: '小美人，别反抗了，跟爷走，爷保证让你吃香的喝辣的！' },
      { speaker: '婴宁', text: '放肆！你这恶霸，也敢对我动手！再往前走一步，休怪我不客气！' },
      { speaker: '旁白', text: '婴宁动用了一丝狐族灵力，桃木杖发出微弱的金光，打手们被金光震慑，纷纷停下脚步。' },
    ],
    items: [
      { id: 'bully-waist-token', name: '恶霸腰牌', icon: '🏷️', x: 55, y: 45, hitRadius: 4 },
      { id: 'thug-blade', name: '打手钢刀', icon: '🗡️', x: 38, y: 52, hitRadius: 4 },
      { id: 'lewd-fan', name: '轻薄绢扇', icon: '🪭', x: 60, y: 40, hitRadius: 4 },
      { id: 'rescue-gong', name: '求救铜锣', icon: '🥁', x: 88, y: 55, hitRadius: 4 },
      { id: 'peach-staff', name: '镇邪桃木杖', icon: '🪵', x: 15, y: 68, hitRadius: 4 },
      { id: 'copper-bell-7', name: '铜铃铛', icon: '🔔', x: 52, y: 50, hitRadius: 3 },
      { id: 'broken-hat', name: '破损草帽', icon: '👒', x: 12, y: 75, hitRadius: 4 },
      { id: 'silver-pin-7', name: '银簪', icon: '📍', x: 72, y: 78, hitRadius: 3 },
      { id: 'wooden-bowl', name: '木碗', icon: '🥣', x: 82, y: 72, hitRadius: 4 },
      { id: 'cloth-boot', name: '布靴', icon: '👢', x: 32, y: 80, hitRadius: 4 },
      { id: 'bamboo-basket', name: '竹篮', icon: '🧺', x: 8, y: 55, hitRadius: 4 },
      { id: 'copper-key', name: '铜钥匙', icon: '🔑', x: 10, y: 60, hitRadius: 3 },
    ],
  },
  {
    id: 8,
    name: '灵力觉醒·收集秘力',
    difficulty: 5,
    background: SCENE_IMAGES.scene08,
    story: '深山灵地，唤醒狐族灵力',
    dialogue: [
      { speaker: '旁白', text: '婴宁摆脱恶霸的纠缠，毅然返回深山灵地，准备唤醒体内沉睡的狐族灵力。' },
      { speaker: '鬼母', text: '我的孩儿，此刻便是你觉醒灵力的最佳时机。千年花片引灵，灵泉露滴润脉，狐族灵石聚气——凝神静气，唤醒你身为狐族后裔的真正力量！' },
      { speaker: '婴宁', text: '娘亲，我记住了。那些人欺我、辱我、算计我，今日，我便觉醒灵力，护自己周全，报所有恩怨！' },
      { speaker: '旁白', text: '婴宁彻底觉醒狐族灵力，从前的娇憨天真彻底褪去，取而代之的是冷艳与决绝。' },
    ],
    items: [
      { id: 'millennium-petal', name: '千年花片', icon: '🌸', x: 15, y: 45, hitRadius: 4 },
      { id: 'spirit-dew', name: '灵泉露滴', icon: '💧', x: 50, y: 35, hitRadius: 4 },
      { id: 'fox-spirit-stone', name: '狐族灵石', icon: '💎', x: 48, y: 55, hitRadius: 4 },
      { id: 'ghost-bone', name: '鬼母骨片', icon: '🦴', x: 85, y: 72, hitRadius: 3 },
      { id: 'awakening-paper', name: '觉醒咒纸', icon: '📃', x: 30, y: 68, hitRadius: 4 },
      { id: 'spirit-seed', name: '灵草种子', icon: '🌱', x: 18, y: 58, hitRadius: 3 },
      { id: 'jade-button', name: '玉扣', icon: '⚪', x: 42, y: 72, hitRadius: 3 },
      { id: 'copper-token-8', name: '铜制令牌', icon: '🏷️', x: 78, y: 48, hitRadius: 4 },
      { id: 'fox-fur-8', name: '狐毛', icon: '🦊', x: 40, y: 28, hitRadius: 3 },
      { id: 'rune-stone', name: '符文石', icon: '🪨', x: 82, y: 62, hitRadius: 4 },
      { id: 'glass-bead', name: '琉璃珠', icon: '🔮', x: 55, y: 75, hitRadius: 3 },
      { id: 'silver-bell-8', name: '银质小铃', icon: '🔔', x: 25, y: 78, hitRadius: 3 },
    ],
  },
  {
    id: 9,
    name: '锋芒初露·惩治恶奴',
    difficulty: 4,
    background: SCENE_IMAGES.scene09,
    story: '觉醒后返回王家，惩治欺凌下人的恶奴',
    dialogue: [
      { speaker: '旁白', text: '婴宁觉醒灵力后，径直返回王家。恶奴们正仗着王母的势力，肆意欺凌府中下人。' },
      { speaker: '恶奴头目', text: '哟，这不是那个被公子和老夫人嫌弃的狐妖吗？怎么，从山里跑回来送死？' },
      { speaker: '婴宁', text: '你们这些仗势欺人的恶奴，往日里欺辱我、欺凌下人，今日，我便让你们付出代价。' },
      { speaker: '旁白', text: '婴宁挥动狐族咒符，金光迸发，将恶奴们震倒在地。从今日起，王家的规矩，由我来定！' },
    ],
    items: [
      { id: 'whip', name: '恶奴皮鞭', icon: '🪢', x: 28, y: 48, hitRadius: 4 },
      { id: 'fox-talisman', name: '狐族咒符', icon: '📃', x: 42, y: 35, hitRadius: 4 },
      { id: 'stolen-silver', name: '被抢银饰', icon: '💍', x: 55, y: 75, hitRadius: 3 },
      { id: 'servant-token', name: '恶奴腰牌', icon: '🏷️', x: 25, y: 55, hitRadius: 4 },
      { id: 'spirit-grass', name: '灵草', icon: '🌿', x: 78, y: 62, hitRadius: 3 },
      { id: 'firewood', name: '木柴', icon: '🪵', x: 12, y: 72, hitRadius: 4 },
      { id: 'clay-bowl', name: '陶碗', icon: '🥣', x: 48, y: 80, hitRadius: 4 },
      { id: 'copper-pin-9', name: '铜钗', icon: '📍', x: 30, y: 78, hitRadius: 3 },
      { id: 'hemp-rope', name: '麻绳', icon: '🪢', x: 15, y: 65, hitRadius: 4 },
      { id: 'torn-cloth', name: '破布', icon: '🧷', x: 62, y: 68, hitRadius: 3 },
      { id: 'silver-ring', name: '银戒指', icon: '💍', x: 58, y: 78, hitRadius: 3 },
      { id: 'bamboo-slip', name: '竹片', icon: '🎋', x: 75, y: 72, hitRadius: 3 },
      { id: 'stone-inkstone', name: '石砚', icon: '⬛', x: 18, y: 42, hitRadius: 4 },
      { id: 'cloth-towel', name: '布巾', icon: '🧻', x: 28, y: 60, hitRadius: 3 },
      { id: 'iron-pliers', name: '铁钳', icon: '🔧', x: 10, y: 78, hitRadius: 3 },
    ],
  },
  {
    id: 10,
    name: '恩怨了结·狐归深山',
    difficulty: 5,
    background: SCENE_IMAGES.scene10,
    story: '终极对决，惩治恶人，归隐深山',
    dialogue: [
      { speaker: '旁白', text: '婴宁惩治完恶奴，径直闯入王家大堂，找到了王子服、王母和恶霸——这三个算计她、伤害她的人。' },
      { speaker: '王子服', text: '婴宁，我知道错了，我不该算计你，求你饶我一命！' },
      { speaker: '婴宁', text: '你们当初算计我、欺辱我，害我失去天真，如今，该了结所有恩怨了。' },
      { speaker: '鬼母', text: '我的孩儿，你做到了。狐族玉佩物归原主，从此，你便是狐族的守护者，愿你往后，自在随心。' },
      { speaker: '旁白', text: '恩怨了结，婴宁带着双玉佩重返深山。她不再是天真爱笑的狐女，而是清冷强大的狐族守护者。' },
    ],
    items: [
      { id: 'fox-jade-final', name: '狐族玉佩', icon: '💎', x: 42, y: 42, hitRadius: 4 },
      { id: 'wang-fan', name: '王子服折扇', icon: '🪭', x: 58, y: 38, hitRadius: 4 },
      { id: 'wang-mother-pin', name: '王母金钗', icon: '✨', x: 65, y: 32, hitRadius: 3 },
      { id: 'bully-dagger', name: '恶霸匕首', icon: '🗡️', x: 72, y: 45, hitRadius: 4 },
      { id: 'ghost-jade', name: '鬼母玉佩', icon: '⚪', x: 35, y: 18, hitRadius: 3 },
      { id: 'copper-incense', name: '铜香炉', icon: '🕯️', x: 38, y: 55, hitRadius: 4 },
      { id: 'torn-painting', name: '破损字画', icon: '🖼️', x: 20, y: 28, hitRadius: 4 },
      { id: 'silver-cup', name: '银酒杯', icon: '🥂', x: 80, y: 55, hitRadius: 3 },
      { id: 'box-key', name: '木盒钥匙', icon: '🔑', x: 45, y: 62, hitRadius: 3 },
      { id: 'jade-pin-10', name: '玉簪', icon: '💚', x: 82, y: 48, hitRadius: 3 },
      { id: 'hemp-bag', name: '麻布袋', icon: '👝', x: 10, y: 68, hitRadius: 4 },
      { id: 'copper-candle-10', name: '铜烛台', icon: '🕯️', x: 78, y: 62, hitRadius: 3 },
      { id: 'bamboo-holder', name: '竹笔筒', icon: '🖊️', x: 85, y: 52, hitRadius: 4 },
      { id: 'silver-pin-10', name: '银钗', icon: '📍', x: 62, y: 28, hitRadius: 3 },
      { id: 'ink-stick', name: '墨锭', icon: '⬛', x: 88, y: 58, hitRadius: 3 },
    ],
  },
];

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