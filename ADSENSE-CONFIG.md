# AdSense 全站配置

配置日期：2026-07-18

- Publisher ID：`ca-pub-9505220977121599`
- Seller ID：`pub-9505220977121599`
- 全部 HTML 页面的 `<head>` 均包含异步 AdSense 脚本。
- 全部 HTML 页面的 `<head>` 均包含 `google-adsense-account` 元标记。
- 根目录 `/ads.txt` 包含 Google 官方卖方记录。
- 配置脚本可重复运行，不会重复注入代码。

如内容生成脚本重新生成页面，请在最后运行：

```bash
node scripts/configure-adsense.mjs
node scripts/adsense-audit.mjs
```

部署后可直接检查：

- `https://harvestmoonechoesofteradea.wiki/ads.txt`
- 首页源代码中的 `ca-pub-9505220977121599`
