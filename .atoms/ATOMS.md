---
last_updated: 2026-06-01T08:37:26Z
status: active
---

# Project Context

## Project Overview
聊斋奇谭 - 新国风暖柔治愈风格的横版寻物解谜游戏Web版MVP。
- 核心玩法：横版场景寻物 + 剧情叙事解谜
- 风格：新国风、暖柔治愈、女性向、明亮通透
- 故事：婴宁篇10关，从入园寻踪到花落魂离的虐恋反转叙事
- 双身份：灵韵女灵媒(女) / 江湖说书人(男)
- 横版16:9布局，纯前端实现(localStorage持久化)

## Key Decisions
| Date | Decision | By | Rationale |
|------|----------|-----|-----------|

## Constraints
### 色彩系统(新国风定稿)
- 暖玉金 #E8C37D - 主色、按钮、边框、表头
- 柔米白 #FFF5EB - 主界面背景
- 暖白 #FFF8F2 - 面板、卡片背景
- 茶棕 #4A3728 - 正文文字
- 浅棕 #8B7355 - 副文字
- 柔胭红 #E85D75 - 生命、警告、强调
- 浅碧绿 #7EC8A0 - 成功、完成
- 灰陶色 #C4B5A5 - 未激活/锁定

### 视觉规范
- 暖柔、治愈、清雅、明亮，无恐怖、无暗黑、无暗角
- 横版16:9布局，柔光漫射，花瓣飘落，暖金粒子特效
- 字体：标题20-24px，正文14-16px

### 布局比例
- 顶部状态栏 6% / 主场景区 55% / 物品面板 22% / 底部操作栏 12%
- 物品卡片一页5个，可翻页
- 触控热区最小48×48px

### 数据持久化
- localStorage: playerIdentity(lingmei|storyteller), hasSeenIntro, completedLevels, lives, hints, coins, dailyGiftDay


