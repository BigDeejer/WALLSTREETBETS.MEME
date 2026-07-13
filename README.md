# $WSB — Reddit-style website

A responsive single-page website for the independent $WSB meme-token community on Robinhood Chain. The design combines familiar forum conventions—post cards, voting rails, flairs, pinned posts, rules and sidebar widgets—with a black trading-terminal theme accented by Reddit orange and Robinhood green.

## Run locally

```bash
pnpm install
pnpm dev
```

Use `npm install` and `npm run dev` if npm is your preferred package manager.

## Production build

```bash
pnpm build
```

The production files are written to `dist/`. The project is configured for Vercel.

## Live token data

Price, market cap, liquidity and 24-hour change are loaded from the Dexscreener pair API and refreshed every 30 seconds. The Token post embeds the Dexscreener chart.

The homepage also contains a compact live chart directly beneath the supplied WSB character image. The character is stored at `public/wsb-guy.jpg`; the recoloured Robinhood feather is stored at `public/robinhood-feather-green.png`.

## Confirmed links

- X: `https://x.com/wsbrobinhood`
- Telegram: `https://t.me/robinhoodwsb`
- Dexscreener pair: `https://dexscreener.com/robinhood/0x87363fa61d24f96ac35e3b1f2de40aa2506bbd07`
- Token contract: `0x6c2bA1C07cb717E1b188fCc7C823D5681e4c7E78`

Basebot is intentionally disabled until an official project URL is provided.

## Meme generator

The Meme Machine is a styled Coming Soon experience. It does not make paid API calls. Before enabling public OpenAI image generation, add authentication or rate limiting, server-side API-key storage, moderation and an explicit usage budget.

## Content notes

- The site describes the project as independent and does not claim endorsement by Reddit, r/wallstreetbets, Robinhood, GameStop or named community figures.
- The phrase "defining WSB meme token" is presented as an ambition, not a verified exclusivity claim.
- Roadmap spending is described as an intention subject to available revenue and community priorities.
- Confirm fee percentages, wallets, token supply, taxes, liquidity terms and other financial claims before publishing them.
