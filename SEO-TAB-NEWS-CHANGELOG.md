# Tab News 扩展记录

日期：2026-07-19

- Release、Guides、Story、Features、Locations、Platforms、Preorder、FAQ 共 8 个一级详情 Tab 新增可见 News 模块。
- 每个 Tab 严格配置 5 篇相关新闻，共新增 40 篇独立 News URL。
- 新增 `/news/` 聚合页，按 8 个主题归类全部新闻。
- 每篇新闻均包含独立 title、description、H1、canonical、NewsArticle 与 Breadcrumb 结构化数据。
- 内容基于 Natsume 2026-03-11、2026-05-12、2026-06-18 三次官方发布，明确区分已确认信息与仍未公布的信息。
- 新增生成与验证命令：`node scripts/generate-tab-news.mjs`、`node scripts/tab-news-audit.mjs`。
