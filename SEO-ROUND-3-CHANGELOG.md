# SEO Round 3 Changelog

Date: 2026-07-18  
Domain: https://harvestmoonechoesofteradea.wiki/

## Outcome

- HTML pages: 57 → 80
- Quality-approved sitemap URLs: 44 → 67
- New fact-supported leaf pages: 21
- New indexable hubs: Player Guides and Story
- Speculative legacy templates kept `noindex, follow`: 13
- Orphan indexable pages: 0

## New clusters

### Player guides

- Treasure hunting
- Mining caves, ore and gems
- Traveling merchants
- Stamina recovery and upgrades
- Rare animals
- Pets versus mounts

### Story and world

- The mist covering Teradea
- The rumored guardian wolf
- Village disasters
- Restoring Teradea

### Search-focused FAQ

- Ore and gem locations
- Stamina recovery
- Traveling merchant inventory
- Finding remote islands
- Taming wolves
- Bears and tigers
- Forest Goddess Statue
- Increasing maximum stamina
- Pets traveling with the player
- Rare animals
- Confirmed villages

## Quality controls

- Every indexable URL has a unique title, description, H1 and canonical.
- JSON-LD parses successfully and matches visible content.
- All internal links resolve.
- Every indexable leaf has at least one inbound link from another indexable page.
- Only URLs in `seo/indexable-urls.json` enter the sitemap.
- No unverified task steps, gift data, crop values, shop inventories or map coordinates were published.

## Rebuild and validation

```bash
node scripts/generate-confirmed-pages.mjs
node scripts/generate-round2-pages.mjs
node scripts/generate-round3-pages.mjs
node scripts/apply-indexing-policy.mjs
node scripts/seo-audit.mjs
node scripts/seo-graph-audit.mjs
```

Expected final result: 80 HTML pages, 67 indexable URLs and no orphan indexable pages.
