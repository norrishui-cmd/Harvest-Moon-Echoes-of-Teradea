# 德语与日语 SEO 扩展记录

日期：2026-07-18

## 本轮完成

- 德语 `/de/` 与日语 `/ja/` 各新增 16 条可索引核心 URL。
- 每个页面均有本地化 title、description、H1、正文、导航、内部链接和 JSON-LD。
- 英语、德语、日语对应页形成 16 组互惠 `hreflang`，并配置 `x-default` 指向英语页。
- 每个语言版本采用自引用 canonical，避免跨语言 canonical 合并。
- 页面显著声明这是非官方语言攻略；官方完整游戏语言列表尚未公布。
- 索引清单与 sitemap 已更新到 99 条 URL，站内链接图审计无孤立页。

## 核心路径

每种新增语言覆盖：首页、release-date、platforms、preorder、features 及五个功能子页、locations、characters、romance/candidates、guides、story、faq。

## 验证命令

```bash
node scripts/seo-audit.mjs
node scripts/seo-graph-audit.mjs
node scripts/i18n-audit.mjs
```

当前结果：112 个 HTML 页面、99 条可索引 URL、13 条 `noindex, follow` 页面，全部审计通过。
