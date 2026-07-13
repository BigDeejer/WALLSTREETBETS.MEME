import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PAIR = '0x87363fa61d24f96ac35e3b1f2de40aa2506bbd07';
const TOKEN = '0x6c2bA1C07cb717E1b188fCc7C823D5681e4c7E78';
const DEX_URL = `https://dexscreener.com/robinhood/${PAIR}`;
const API_URL = `https://api.dexscreener.com/latest/dex/pairs/robinhood/${PAIR}`;
const CHART_URL = `${DEX_URL}?embed=1&theme=dark&trades=0&info=0`;
const UNISWAP_URL = `https://app.uniswap.org/swap?chain=robinhood&outputCurrency=${TOKEN}`;
const TELEGRAM_URL = 'https://t.me/+4zR4jMlA6ZA0ODBh';

function WsbGuy({ compact = false }) {
  return <div className={`wsb-guy ${compact ? 'compact' : ''}`} aria-label="WallStreetBets character">
    <img src="/wsb-guy.jpg" alt="WallStreetBets character surrounded by dollar bills" />
  </div>;
}

const formatMoney = value => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
};

function VoteRail({ score = '4.6k' }) {
  return <div className="vote-rail" aria-label={`${score} upvotes`}><button aria-label="Upvote">▲</button><b>{score}</b><button aria-label="Downvote">▼</button></div>;
}

function Post({ id, flair, title, children, score, pinned = false, className = '' }) {
  return <article id={id} className={`post ${className}`}>
    <VoteRail score={score}/>
    <div className="post-body">
      <div className="post-meta">{pinned && <span className="pinned">📌 PINNED BY MODS</span>} posted by <b>u/wsb_on_robinhood</b> · now</div>
      <div className="post-title"><span className={`flair ${flair?.toLowerCase().replaceAll(' ', '-')}`}>{flair}</span><h2>{title}</h2></div>
      {children}
      <div className="post-actions"><span>💬 Comments</span><span>↗ Share</span><span>🔖 Save</span><span>•••</span></div>
    </div>
  </article>;
}

function App() {
  const [stats, setStats] = useState({ price: null, marketCap: null, change: null, liquidity: null });
  const [feedStatus, setFeedStatus] = useState('connecting');
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [memePrompt, setMemePrompt] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error();
        const data = await response.json();
        const pair = data.pair || data.pairs?.[0];
        if (!pair) throw new Error();
        setStats({
          price: Number(pair.priceUsd),
          marketCap: Number(pair.marketCap || pair.fdv),
          change: Number(pair.priceChange?.h24),
          liquidity: Number(pair.liquidity?.usd)
        });
        setFeedStatus('live');
      } catch { setFeedStatus('offline'); }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  const copyContract = async () => {
    await navigator.clipboard.writeText(TOKEN);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const price = stats.price ? `$${stats.price < .001 ? stats.price.toFixed(7) : stats.price.toFixed(4)}` : '—';
  const nav = [['lore','Lore / History'],['token','Token'],['roadmap','Roadmap'],['faq','FAQ'],['meme-generator','Meme Generator'],['socials','Socials']];

  return <>
    <header className="topbar">
      <a href="#top" className="reddit-mark" aria-label="Home"><span>r/</span></a>
      <a href="#top" className="top-name">wallstreetbets_on_RH</a>
      <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? '✕' : '☰'}</button>
      <nav className={mobileOpen ? 'open' : ''}>{nav.map(([id,label]) => <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)}>{label}</a>)}</nav>
      <a className="top-buy" href={UNISWAP_URL} target="_blank" rel="noreferrer">BUY $WSB</a>
    </header>

    <main id="top">
      <section className="community-banner">
        <div className="banner-pattern"><span>WSB</span><span>DIAMOND HANDS</span><span>WSB</span><span>ROBINHOOD CHAIN</span></div>
        <div className="community-head wrap">
          <WsbGuy compact/>
          <div><h1>r/wallstreetbets_on_RH</h1><p>The front page of the on-chain casino.</p></div>
          <a href={UNISWAP_URL} target="_blank" rel="noreferrer">JOIN THE TRADE</a>
        </div>
        <div className="community-tabs wrap"><a className="active" href="#top">Posts</a><a href="#lore">Lore</a><a href="#token">Token</a><a href="#roadmap">Roadmap</a><a href="#faq">FAQ</a><button>•••</button></div>
      </section>

      <section className="ticker-bar">
        <div><span><i className={feedStatus}/>{feedStatus === 'live' ? 'LIVE' : feedStatus.toUpperCase()}</span><b>$WSB {price}</b><b>MCAP {formatMoney(stats.marketCap)}</b><b className={stats.change >= 0 ? 'positive' : 'negative'}>24H {stats.change == null ? '—' : `${stats.change >= 0 ? '+' : ''}${stats.change.toFixed(2)}%`}</b><b>LIQ {formatMoney(stats.liquidity)}</b><small>DEXSCREENER · REFRESHES EVERY 30S</small></div>
      </section>

      <div className="page-grid wrap">
        <div className="feed">
          <div className="sort-row"><button className="active">🔥 Hot</button><button>✨ New</button><button>⬆ Top</button><button>•••</button></div>

          <Post flair="Official" title="THE CASINO IS ON-CHAIN." score="12.4k" pinned className="hero-post">
            <div className="hero-layout">
              <div className="hero-copy"><div className="chain-kicker"><img src="/robinhood-feather-green.png" alt="Robinhood feather"/><span>WALLSTREETBETS · ROBINHOOD CHAIN<br/>CHAIN ID 4663</span></div><h3>RETAIL MADE HISTORY.<br/><em>NOW WE TOKENIZE IT.</em></h3><p>Wall Street’s loudest internet counterculture has landed on the chain built by the buy-button company. $WSB is an independent meme token celebrating the moments, characters and chaos that changed retail trading forever.</p><div className="hero-buttons"><a href={UNISWAP_URL} target="_blank" rel="noreferrer">BUY ON UNISWAP ↗</a><a className="secondary" href={DEX_URL} target="_blank" rel="noreferrer">VIEW CHART</a></div></div>
              <div className="hero-visual">
                <div className="money-rain" aria-hidden="true">
                  <span className="d1">💎</span><span className="b1">💵</span><span className="d2">◆</span>
                  <span className="b2">💵</span><span className="d3">💎</span><span className="b3">$100</span>
                </div>
                <WsbGuy/>
                <div className="mini-chart">
                  <div><b>$WSB LIVE</b><span>{price} · <em className={stats.change >= 0 ? 'positive' : 'negative'}>{stats.change == null ? '—' : `${stats.change >= 0 ? '+' : ''}${stats.change.toFixed(2)}%`}</em></span></div>
                  <iframe title="$WSB compact live chart" src={CHART_URL} loading="lazy" allowFullScreen/>
                </div>
              </div>
            </div>
            <button className="contract-line" onClick={copyContract}><span>CONTRACT</span><code>{TOKEN}</code><b>{copied ? 'COPIED ✓' : 'COPY'}</b></button>
          </Post>

          <Post id="lore" flair="DD" title="The story of WallStreetBets: from obscure subreddit to market-moving force" score="9.8k">
            <p className="post-lead">WallStreetBets turned the sterile language of finance into memes, screenshots, conviction and collective spectacle. What began in 2012 as a home for aggressive trades grew into one of the most consequential retail-investor communities of the modern market era.</p>
            <div className="timeline">
              <div><time>2012</time><section><h3>THE SUBREDDIT OPENS</h3><p>A new forum gives high-risk retail traders their own language: YOLOs, tendies, loss porn and positions—or ban. It makes markets feel participatory, funny and brutally transparent.</p></section></div>
              <div><time>2019</time><section><h3>GUH ENTERS THE LEXICON</h3><p>u/ControlTheNarrative exploits a Robinhood leverage loophole, records the instant an options trade collapses and gives the internet one immortal syllable: “GUH.” The loss becomes community folklore.</p></section></div>
              <div><time>2019–20</time><section><h3>ROARING KITTY POSTS THE THESIS</h3><p>Keith Gill—u/DeepFuckingValue on Reddit and Roaring Kitty elsewhere—shares a deeply researched, contrarian GameStop position. The screenshots look absurd until they don’t.</p></section></div>
              <div className="highlight"><time>JAN 2021</time><section><h3>RETAIL MOVES THE MARKET</h3><p>GameStop erupts. Social interest, trading volume and price accelerate together. Broker restrictions, congressional hearings and global headlines follow. A subreddit becomes part of the market’s permanent vocabulary.</p></section></div>
              <div><time>NOW</time><section><h3>THE BIGGEST RETAIL MOMENT, ON-CHAIN</h3><p>Robinhood built its own blockchain. So we’re putting retail trading’s biggest cultural event on it. $WSB tokenizes the lore—OG ticker, OG chaos, new chain.</p></section></div>
            </div>
            <div className="source-note"><b>RECEIPTS:</b> <a href="https://www.sec.gov/newsroom/press-releases/2021-212" target="_blank" rel="noreferrer">SEC report ↗</a><a href="https://www.congress.gov/event/117th-congress/senate-event/328828/text" target="_blank" rel="noreferrer">Congressional record ↗</a><a href="https://www.reddit.com/r/wallstreetbets/comments/drt5tr" target="_blank" rel="noreferrer">GUH archive ↗</a></div>
          </Post>

          <Post id="token" flair="Token" title="$WSB live chart, token details and ways to buy" score="6.9k">
            <div className="token-stats"><div><span>PRICE</span><b>{price}</b></div><div><span>MARKET CAP</span><b>{formatMoney(stats.marketCap)}</b></div><div><span>24H</span><b className={stats.change >= 0 ? 'positive' : 'negative'}>{stats.change == null ? '—' : `${stats.change >= 0 ? '+' : ''}${stats.change.toFixed(2)}%`}</b></div><div><span>CHAIN</span><b>4663</b></div></div>
            <div className="chart-shell"><iframe title="$WSB live price chart" src={CHART_URL} loading="lazy" allowFullScreen/></div>
            <div className="buy-grid"><a href={UNISWAP_URL} target="_blank" rel="noreferrer"><b>🦄 UNISWAP</b><span>Swap ETH for $WSB ↗</span></a><a href={DEX_URL} target="_blank" rel="noreferrer"><b>📈 DEXSCREENER</b><span>Chart and transactions ↗</span></a><button disabled><b>🤖 BASEBOT</b><span>Link coming soon</span></button></div>
            <p className="warning"><b>⚠ VERIFY BEFORE YOU BUY</b> The only contract promoted by this site is <button onClick={copyContract}>{TOKEN}</button></p>
          </Post>

          <Post id="roadmap" flair="Roadmap" title="Roadmap: make $WSB impossible to ignore" score="4.2k">
            <p className="post-lead">Fees fuel the meme. Attention grows the army. Simple.</p>
            <div className="roadmap-list">
              <div className="complete"><span>01</span><section><label>DONE</label><h3>LAUNCH THE CASINO</h3><p>Token live. Liquidity live. Website live. Apes assembling.</p></section></div>
              <div className="current"><span>02</span><section><label>NOW</label><h3>BOOST THE TICKER</h3><p>Use fee revenue for Dexscreener boosts and more eyeballs.</p></section></div>
              <div><span>03</span><section><label>NEXT</label><h3>FEED THE ALGORITHM</h3><p>TikToks, Reels, X posts and memes built for retail.</p></section></div>
              <div><span>04</span><section><label>EXPAND</label><h3>APE WITH THE CHAIN</h3><p>Collabs, Spaces and raids with Robinhood Chain memecoins.</p></section></div>
              <div><span>05</span><section><label>MOON MISSION</label><h3>SUMMON THE OGs</h3><p>Get WSB legends and Reddit heavyweights watching the ticker.</p></section></div>
            </div>
          </Post>

          <Post id="faq" flair="FAQ" title="Read this before asking in the daily thread" score="3.1k">
            <div className="faq-list">
              <details open><summary>Is $WSB affiliated with Reddit or r/wallstreetbets?<span>+</span></summary><p>No. $WSB is an independent meme token and community tribute. It is not affiliated with, sponsored by or endorsed by Reddit, r/wallstreetbets, Robinhood Markets, GameStop or any individual associated with those communities. We hope to build relationships in the future, but no relationship should be assumed.</p></details>
              <details><summary>What is the point of the token?<span>+</span></summary><p>To preserve and remix a defining chapter of retail-trading culture on-chain: the memes, the characters, the wins, the losses and the moment online traders became impossible for traditional markets to ignore.</p></details>
              <details><summary>Is this the official WallStreetBets token?<span>+</span></summary><p>No. “Official” would imply an endorsement that does not exist. The project’s ambition is to become the defining WSB-themed meme community on Robinhood Chain through transparent work and culture—not through misleading claims.</p></details>
              <details><summary>How are project fees intended to be used?<span>+</span></summary><p>The current intention is to direct available project fee revenue toward visibility, content, collaborations and community growth. Before publishing specific percentages, wallets or guarantees, those details should be confirmed and made independently verifiable.</p></details>
              <details><summary>What is the correct contract?<span>+</span></summary><p><code>{TOKEN}</code> on Robinhood Chain. Always verify it against multiple official channels before swapping.</p></details>
            </div>
          </Post>

          <Post id="meme-generator" flair="Coming Soon" title="WSB Meme Machine v0.1 — currently behind Wendy’s" score="2.7k" className="meme-post">
            <div className="terminal-head"><span>●</span><span>●</span><span>●</span><b>meme_machine.exe</b></div>
            <div className="meme-machine"><div className="meme-preview"><WsbGuy/><div>COMING<br/>SOON</div></div><div className="meme-form"><label>DESCRIBE YOUR MEME</label><textarea value={memePrompt} onChange={e => setMemePrompt(e.target.value)} placeholder="A diamond-handed ape watching the chart at 3AM..."/><div className="style-pills"><button className="selected">WSB CLASSIC</button><button>LOSS PORN</button><button>GAIN POST</button></div><button className="disabled-action" disabled>GENERATE MEME · COMING SOON</button><p>Planned: instant WSB-inspired image generation, caption controls, download and one-click posting to X.</p></div></div>
          </Post>

          <Post id="socials" flair="Socials" title="Official links — if it isn’t here, verify twice" score="1.9k">
            <div className="social-grid"><a href="https://x.com/wsbrobinhood" target="_blank" rel="noreferrer"><span>𝕏</span><div><b>FOLLOW ON X</b><small>@wsbrobinhood</small></div><em>↗</em></a><a href={TELEGRAM_URL}><span>➤</span><div><b>JOIN TELEGRAM</b><small>@robinhoodwsb</small></div><em>↗</em></a><a href={DEX_URL} target="_blank" rel="noreferrer"><span>▥</span><div><b>DEXSCREENER</b><small>Live chart and trades</small></div><em>↗</em></a><button onClick={copyContract}><span>◇</span><div><b>CONTRACT</b><small>{copied ? 'Copied to clipboard' : 'Tap to copy'}</small></div><em>{copied ? '✓' : '⧉'}</em></button></div>
          </Post>
        </div>

        <aside>
          <section className="about-card"><div className="card-head">About Community</div><div className="card-body"><h3>r/wallstreetbets_on_RH</h3><p>Tokenizing the history, chaos and impact of retail trading on Robinhood Chain.</p><div className="community-numbers"><div><b>∞</b><span>Diamond hands</span></div><div><b>4663</b><span>Chain ID</span></div></div><hr/><p className="created">🎂 Created on-chain · 2026</p><a href="https://x.com/wsbrobinhood" target="_blank" rel="noreferrer">JOIN THE COMMUNITY</a></div></section>
          <section className="rules-card"><div className="card-head">r/WSB Rules</div><ol><li><b>Positions or ban</b><div>Verify the contract.</div></li><li><b>No financial advice</b><div>Sir, this is a casino.</div></li><li><b>Memes must slap</b><div>Low-effort FUD gets downvoted.</div></li><li><b>No fake endorsements</b><div>Independent means independent.</div></li><li><b>Apes together strong</b><div>Don’t be exit liquidity on purpose.</div></li></ol></section>
          <section className="links-card"><div className="card-head">Official Links</div><a href="https://x.com/wsbrobinhood" target="_blank" rel="noreferrer">𝕏 X / Twitter <span>↗</span></a><a href={TELEGRAM_URL}>➤ Telegram <span>↗</span></a><a href={DEX_URL} target="_blank" rel="noreferrer">▥ Dexscreener <span>↗</span></a><a href={UNISWAP_URL} target="_blank" rel="noreferrer">🦄 Uniswap <span>↗</span></a></section>
          <p className="aside-disclaimer">$WSB is an independent meme token with no intrinsic value or expectation of financial return. Not affiliated with Reddit, WallStreetBets, Robinhood Markets or GameStop. Always do your own research.</p>
        </aside>
      </div>
    </main>

    <footer><div className="wrap"><WsbGuy compact/><div><b>r/wallstreetbets_on_RH</b><p>The front page of the on-chain casino.</p></div><p>Not financial advice · Independent community project · © 2026 $WSB</p><a href="#top">BACK TO TOP ↑</a></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
