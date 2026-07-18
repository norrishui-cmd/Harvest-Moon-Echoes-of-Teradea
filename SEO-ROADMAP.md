# Harvest Moon: Echoes of Teradea 发布前 2000 URL SEO 计划

更新日期：2026-07-18  
目标发布日期：2026-09-24  
站点：https://harvestmoonechoesofteradea.wiki/

## 结论与约束

当前代码原有 19 条 URL，但多数是未发布游戏的内容模板，不足以回答具体玩家问题。第一阶段不把“页面存在”当作“可索引内容”：只有包含明确答案、官方事实、唯一搜索意图、canonical、内链和来源说明的页面才能进入 sitemap。

要在发布前实现 2000 条高质量可索引 URL，需要在预览版、媒体评测版或合法的提前游玩数据出现后启动结构化采集。若没有这些数据，宁可准备 2000 条候选记录，也不要公开 2000 个空页面。目标是 2000 条通过质量门的 URL，而不是 2000 个模板目录。

## 2000 URL 信息架构配额

| 集群 | 目标 URL | 主要意图 | 激活所需证据 |
|---|---:|---|---|
| 核心、平台、功能、购买与新手 | 90 | release、platform、features、beginner | 官方公告、商店页、实测 |
| 角色、恋爱、礼物、日程与事件 | 220 | character、gift、schedule、heart event | 游戏内人物与事件数据 |
| 主线、支线、村庄修复与卡关 | 300 | quest、walkthrough、stuck、trigger | 任务日志、实测步骤与奖励 |
| 道具、材料、矿石、采集物 | 350 | where to find、use、sell or keep | 图鉴、地点与用途数据 |
| 作物、种子、动物、鱼类 | 300 | season、profit、location、care | 生长周期、价格、季节与位置 |
| 食谱、料理与营地烹饪 | 220 | recipe、ingredients、unlock、effect | 配方、解锁、效果与材料来源 |
| 地点、洞穴、岛屿、地图与商店 | 180 | location、map、shop、route | 地图、坐标、营业时间与库存 |
| 节日、日历、生日与季节事件 | 120 | date、time、requirements、rewards | 完整日历与触发条件 |
| 工具、升级、能力与 Power Statues | 100 | upgrade、cost、best order、puzzle | 成本、效果、谜题与奖励 |
| Bug、性能、版本、补丁与 FAQ | 80 | fix、not working、performance | 玩家复现、补丁说明、平台测试 |
| 对比、清单、计算器与专题攻略 | 40 | best、calculator、checklist | 以上数据库完成后衍生 |
| **合计** | **2000** |  |  |

## 阶段计划

### 第一阶段：技术与事实基础（已开始，7/17–7/24）

- 修正正式发售日与完整平台信息。
- 建立 `seo/indexable-urls.json`，由质量批准清单生成 sitemap。
- 未验证的作物、任务、礼物和地图模板设为 `noindex, follow`，保留内链和后续升级入口。
- 发布平台、已确认功能、已命名地点及预购奖励页面。
- 建立自动审计：title、description、canonical、H1、schema、重复项、noindex 与 sitemap 一致性。
- 目标：20–40 条真正可索引 URL；候选库存 300 条。

### 第二阶段：官方资料与搜索需求覆盖（7/25–8/15）

- 每次官方预告、角色介绍、商店页更新后，在 48 小时内建立或升级对应页面。
- 建立 10 名恋爱候选人的实体记录，但只有信息足以回答问题时才开放索引。
- 扩充平台长尾：价格、版本、文件大小、语言、预载、Steam Deck、性能；未知字段不单独建页。
- 收集 Google 自动补全、GSC、Reddit 与视频评论问题，形成 800 条去重候选 URL。
- 目标：120–250 条可索引 URL，800 条候选记录。

### 第三阶段：结构化游戏数据采集（8/16–9/10）

- 取得合法预览/评测数据后优先采集：角色、礼物、日程、作物、鱼、食谱、材料、地点、商店、任务。
- 每条实体记录必须包含“直接答案 + 获取/完成步骤 + 条件 + 用途/奖励 + 相关页”。
- 每日上线以 40–80 条为上限，抽查 10%，任何虚构、重复或空字段立即停止该批次。
- 目标：1000–1400 条可索引 URL，2000 条候选记录准备完毕。

### 第四阶段：发布前冲刺（9/11–9/23）

- 完成剩余实体数据、站内链接和 hub 覆盖；任何孤儿页不得进入 sitemap。
- 发布首周路线、赚钱、升级、恢复村庄、恋爱与 Power Statue 专题。
- 分批更新 sitemap；高价值页从首页与 hub 获得两跳内链接。
- 目标：2000 条通过质量门的可索引 URL。若关键数据仍不可验证，则保留候选状态，不以薄内容强行凑数。

## 单页质量门

每个准备索引的 URL 必须同时满足：

1. 一个 URL 只承接一个明确搜索意图，并在首屏给出直接答案。
2. 内容中至少有一项不可由同类模板替换的具体信息，如步骤、地点、数值、条件、奖励或平台事实。
3. title、description、H1 和 canonical 唯一；没有占位词和“稍后更新”作为主要内容。
4. 至少链接到所属 hub 和两个真实相关页面；hub 能回链到该页。
5. 结构化数据与页面可见内容一致；未公开的价格、礼物、任务和地点不得推测。
6. 进入 `seo/indexable-urls.json` 后才允许进入 sitemap；审计脚本必须通过。

## 每周检查

- 页面增长：候选、已完成、已索引、被排除 URL 数量及集群分布。
- 索引与 sitemap：发现、抓取、canonical、重复与“已抓取未编入索引”比例。
- 内容缺口：GSC 新查询、卡关问题、低 CTR 页面和内部搜索零结果。
- 竞品与社区：新增页面、官方公告、Reddit/YouTube 高频问题。
- 变现准备：首页与 hub 不堆广告；攻略页在答案之后预留广告位。
- 下周只选择三个最高杠杆动作，避免同时改动大量标题导致无法判断效果。

## 第一阶段交付状态

- 原有 URL：19
- 新增事实型页面：18
- 当前 sitemap 可索引 URL：22
- 暂不索引、等待真实游戏数据升级的旧模板：15
- 自动 SEO 审计：`node scripts/seo-audit.mjs`
- 重新生成已确认页面：`node scripts/generate-confirmed-pages.mjs`
- 重建索引策略与 sitemap：`node scripts/apply-indexing-policy.mjs`

## 第二轮交付状态（2026-07-18）

- 新增 20 条事实型叶子页面，覆盖 Happilia、野生动物惩罚、远程岛屿、航海图、Guardian Spirits、移动能力、角色实体、预购零售商与 FAQ 长尾。
- 将原有 `characters/` 与 `faq/` 两个薄模板重写为事实型 hub，并重新开放索引。
- 刷新 `features/` hub，使全部已确认机制获得双向内部链接。
- sitemap 可索引 URL 从 22 条提升到 44 条。
- 仍保持 13 个缺乏真实游戏数据的旧模板为 `noindex, follow`；作物价格、礼物、日程、任务步骤和地图坐标没有被虚构。
- 新增生成命令：`node scripts/generate-round2-pages.mjs`。

## 第三轮交付状态（2026-07-18）

- 新增 21 条事实型叶子页面和 `guides/`、`story/` 两个新 hub。
- 覆盖矿洞与矿石、寻宝、旅行商人、体力恢复、稀有动物、宠物与坐骑、迷雾、Guardian Wolf、村庄灾害和恢复 Teradea 等深层搜索意图。
- 增加 11 条可直接回答的 FAQ，包括狼驯服、熊与老虎、最大体力、Forest Goddess Statue、远程岛屿、旅行商人和确认村庄。
- sitemap 可索引 URL 从 44 条提升到 67 条；HTML 页面从 57 条提升到 80 条。
- 13 个缺乏具体答案的旧模板继续保持 `noindex, follow`。
- 新增生成命令：`node scripts/generate-round3-pages.mjs`。

## 德语与日语扩展（2026-07-18）

- 新增德语与日语各 16 条核心内容 URL，共 32 条本地化页面，覆盖首页、发行、平台、预购、功能、地点、角色、恋爱、攻略、故事与 FAQ。
- 16 组英语、德语、日语对应页均配置双向 `hreflang`，包含 `x-default`；每页使用独立 canonical 与正确的 `html lang`。
- 所有本地化页面都明确标注为非官方攻略语言，不将攻略翻译误写成游戏本体已确认支持德语或日语。
- sitemap 可索引 URL 从 67 条提升到 99 条；HTML 页面从 80 条提升到 112 条；13 条推测型旧页继续保持 `noindex, follow`。
- 新增生成与审计命令：`node scripts/generate-i18n-de-ja.mjs`、`node scripts/i18n-audit.mjs`。

## AdSense 全站配置（2026-07-18）

- 发布商 ID `ca-pub-9505220977121599` 已部署到全部 112 个 HTML 页面的 `<head>`。
- 全站同时配置异步 AdSense 脚本和 `google-adsense-account` 元标记。
- 根目录新增标准 `/ads.txt`：`google.com, pub-9505220977121599, DIRECT, f08c47fec0942fa0`。
- 新增可重复执行的配置与审计命令：`node scripts/configure-adsense.mjs`、`node scripts/adsense-audit.mjs`。
