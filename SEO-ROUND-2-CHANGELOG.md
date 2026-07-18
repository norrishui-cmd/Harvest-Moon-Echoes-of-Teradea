# SEO Round 2 Changelog

Date: 2026-07-18  
Domain: https://harvestmoonechoesofteradea.wiki/

## Outcome

- HTML pages: 37 → 57
- Quality-approved sitemap URLs: 22 → 44
- Speculative legacy templates kept `noindex, follow`: 13
- New fact-supported leaf pages: 20
- Rebuilt indexable hubs: Characters and FAQ
- Refreshed hub: Features

## New keyword clusters

### Confirmed mechanics

- Wild animals, escape and collected-item loss
- Remote islands and nautical charts
- Happilia
- Farming, crops and animals overview
- Guardian Spirits
- Jumping, ladders and vines

### Confirmed characters

- Harvest Goddess
- Doc Jr.
- Lupo, the Bloomfield Guardian

### Buying intent

- Confirmed preorder retailers
- Physical platform availability
- Natsume Store Lupo bonus relationship

### FAQ long tails

- Is the game open world?
- Does it have multiplayer or co-op?
- How many romance candidates are there?
- Can the player get married?
- Can the player jump and climb?
- Are there remote islands?
- What is Happilia?
- What are Power Wisps?
- Can animal companions break rocks and fallen trees?
- What happens when a wild animal catches the player?

## Evidence policy

Content was checked against Natsume's March 11, 2026 title announcement, June 18, 2026 trailer announcement and official store information. No gift preferences, schedules, task steps, crop values, map coordinates or unannounced character roles were invented.

## Validation

Run in the project root:

```bash
node scripts/generate-confirmed-pages.mjs
node scripts/generate-round2-pages.mjs
node scripts/apply-indexing-policy.mjs
node scripts/seo-audit.mjs
```

The final audit must report 57 HTML pages and 44 quality-approved URLs.
