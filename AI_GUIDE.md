# Atoms 寻物游戏（婴宁篇）AI 通用开发文档

## 1. 项目概览

本仓库当前只有一个可运行工程：前端 SPA（Vite + React + TypeScript + Tailwind）。核心玩法是“寻物点击命中”：

- 关卡由数据驱动（关卡背景、剧情对白、待找物品列表）
- 关卡页将点击位置换算为百分比坐标，与物品热区做距离判定
- 进度、货币、道具等使用 localStorage 存档

工程路径：`app/frontend/`

## 2. 快速启动与验证

进入前端目录：

```bash
cd app/frontend
```

安装依赖：

```bash
pnpm i
pnpm approve-builds --all
```

可用脚本（见 `app/frontend/package.json`）：

```bash
pnpm run dev
pnpm run lint
pnpm run build
pnpm run preview
```

注意：本仓库目前没有 `test` 脚本与成体系测试用例；验证通常以 `lint + build + 本地运行试玩` 为主。

## 3. 页面流与路由

路由定义在：

- `app/frontend/src/App.tsx`

主要页面（建议按流程理解）：

- `/`：`src/pages/Index.tsx`（短暂展示后跳转）
- `/intro`：`src/pages/Intro.tsx`（开场）
- `/identity`：`src/pages/IdentitySelect.tsx`（身份写入存档）
- `/menu`：`src/pages/MainMenu.tsx`（主菜单、礼包、背包、设置等）
- `/levels`：`src/pages/LevelSelect.tsx`（关卡选择、解锁逻辑）
- `/play/:levelId`：`src/pages/GameLevel.tsx`（核心玩法）

## 4. 核心模块与职责

### 4.1 关卡数据与存档

文件：

- `app/frontend/src/data/gameData.ts`

关键内容：

- `HiddenItem`：单个待找物品（名字、图标、可选缩略图 sprite、位置与热区）
- `Level`：关卡（背景图、剧情、对白、物品列表）
- `LEVELS`：关卡列表（当前 1..10）
- `GameState` + `DEFAULT_STATE`：存档结构与默认值
- `loadGameState/saveGameState/resetGameState`
- `STORAGE_KEY = "liaozhai_qitan_save_v1"`

### 4.2 玩法页（渲染 + 交互 + 判定）

文件：

- `app/frontend/src/pages/GameLevel.tsx`

职责：

- 根据 URL 参数 `levelId` 从 `LEVELS` 取出关卡数据
- 渲染关卡背景（div backgroundImage）
- 处理点击并命中物品（百分比坐标 + 距离判定）
- 生命/胜负判定、奖励结算、写入存档
- 道具：提示（放大镜）、小刀（自动找若干物品）、购买逻辑
- UI：开场对白弹窗、暂停、胜负结算弹窗、物品卡片列表（分页与滑动）

### 4.3 画布适配（统一“游戏视口”）

文件：

- `app/frontend/src/components/GameCanvas.tsx`

职责：

- 把页面内容包裹在统一比例的“画布/容器”中，以便 `x/y/hitRadius` 使用百分比坐标稳定工作

### 4.4 音频与震动

文件：

- `app/frontend/src/utils/audioManager.ts`

职责：

- `playBgm('menu'|'game')`
- 找到物品音效与震动 `onItemFound()`
- 错误点击震动 `vibrate(...)`
- mute 状态持久化（localStorage）

## 5. 关卡配置规范（最关键）

### 5.1 HiddenItem 字段含义

`HiddenItem` 字段（在 `gameData.ts`）：

- `id: string`：全局唯一，稳定不变（会用于缩略图裁切映射）
- `name: string`：列表展示名称
- `icon: string`：emoji 兜底图标（当没有缩略图或裁切配置时使用）
- `image?: string`：物品缩略图的 sprite 图路径（可选）
- `x: number`：物品中心点 X，百分比 0..100
- `y: number`：物品中心点 Y，百分比 0..100
- `hitRadius: number`：热区半径（百分比）

### 5.2 点击命中算法（调参依据）

命中核心逻辑在 `GameLevel.tsx` 的点击处理函数中：

- 点击位置换算为百分比 `(x, y)`
- 对每个未找到物品：计算与物品中心点的距离
- 热区半径使用：
  - `effectiveRadius = max(item.hitRadius, minHitPct/2)`
  - 其中 `minHitPct` 由“等效最小 48px”换算成百分比得到

调参建议（经验规则）：

- 大多物体：`hitRadius = 3~5`
- 特别小的物体：`2~3`，但注意最小 48px 机制会兜底提升可点区域
- 要整体更容易/更难：调整最小 48px 阈值（全局影响，不建议频繁改）

### 5.3 从像素坐标换算百分比（推荐做法）

若背景图实际尺寸为 `W x H`，想把物品放在像素点 `(px, py)`：

- `x = px / W * 100`
- `y = py / H * 100`

若想让“等效热区半径”接近 `r_px` 像素，可先粗估：

- `hitRadius ≈ r_px / min(W, H) * 100`

## 6. 如何“调教”已有关卡

最常改动的地方：`app/frontend/src/data/gameData.ts` 中该关卡的 `items[]`。

调优顺序建议：

1. 如果玩家“点不到”：先增大该物品 `hitRadius`
2. 如果物品“误触太多”：适当减小 `hitRadius`，并把中心点 `x/y` 校准到更准确位置
3. 只在确有必要时调整全局最小热区阈值（等效 48px），否则会影响所有关卡手感

## 7. 如何扩展新关卡（新增第 N 关）

### 7.1 最小可用新增（只用 emoji 列表）

1. 在 `LEVELS` 末尾追加一个 `Level` 对象，保证 `id` 唯一递增
2. 为新关卡准备背景图：
   - 本地资源：放到 `app/frontend/public/assets/`，路径写 `/assets/xxx.png`
   - 或使用远程 URL（项目内已有做法）
3. 配置 `items`：
   - 先只填 `id/name/icon/x/y/hitRadius` 即可跑通

### 7.2 关卡物品缩略图（sprite 裁切）

如果要在“物品卡片栏”展示裁切缩略图（而不是 emoji），需要同时满足：

- 每个 item 提供 `image`（同一关通常共用一个 sprite）
- 并在 `GameLevel.tsx` 的 `ITEM_SPRITE_POS` 为每个 `item.id` 增加裁切映射

`ITEM_SPRITE_POS` 的含义：

- `[columnIndex, totalColumns, rowIndex, totalRows]`
- 用于计算 `backgroundSize` 与 `backgroundPosition` 完成裁切

建议：

- 每关尽量保持一个 sprite，统一网格切分（例如 1 行×5 列、2 行×5 列等）
- 新增关卡时同步补齐 `ITEM_SPRITE_POS`，否则会回退到 `icon`

### 7.3 新增关卡后的联动检查

- 选关页会自动使用 `LEVELS.map` 渲染关卡卡片（无需额外注册）
- 选关页右上角的 “已通关 / 总关卡数” 当前写死为 `10`，新增关卡后建议改为 `LEVELS.length`
  - 文件：`app/frontend/src/pages/LevelSelect.tsx`
- `GameLevel.tsx` 的 “下一关” 跳转使用 `LEVELS.length` 作为边界，无需额外修改

## 8. 资源与路径约定

本地静态资源：

- 放在 `app/frontend/public/assets/`
- 代码引用用绝对路径 `/assets/...`

远程资源：

- `gameData.ts` 的 `SCENE_IMAGES`、`audioManager.ts` 的音频 URL 目前是远程 CDN 链接

## 9. 存档与数值（常用于调试/平衡）

存档默认值在 `DEFAULT_STATE`（`gameData.ts`）：

- `lives`（生命）
- `hints`（提示次数）
- `coins`（金币）
- `diamonds`（钻石）
- `items`（小刀数量）

关卡结算逻辑在 `GameLevel.tsx`：

- 通关时将关卡 id 写入 `completedLevels`，并奖励金币（当前固定 +100）

## 10. 常见问题定位

- 关卡不存在：检查 URL `levelId` 是否匹配 `LEVELS` 中的 `id`
- 物品点不到：检查 `x/y` 是否对齐，先把 `hitRadius` 临时调大验证，再精调
- 物品列表缩略图不显示：检查 `items[].image` 与 `ITEM_SPRITE_POS[item.id]` 是否同时存在
- 装依赖时报 “Ignored build scripts”：执行 `pnpm approve-builds --all` 后重试相关命令

## 11. AI 修改代码时的最小检查清单

- 调关卡：只改 `gameData.ts` 对应关卡的 `items[]`，必要时联动 `ITEM_SPRITE_POS`
- 新增关卡：追加 `LEVELS` + 准备背景资源 +（可选）补齐缩略图裁切映射
- 新增关卡数量：同步修正 `LevelSelect.tsx` 的总关卡数显示（避免写死）
- 修改后至少跑一次：
  - `pnpm run lint`
  - `pnpm run build`
  - `pnpm run dev` 试玩点击命中与通关流程

