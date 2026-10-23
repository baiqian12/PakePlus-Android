window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="version" content="8.0" />
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#fff8f0" />
<title>小灶 · 输入食材，配出菜谱</title>
<style>
  :root {
    --bg: #fff8f0;
    --surface: #ffffff;
    --thumb: #fff1e0;
    --fg: #3b2f28;
    --muted: #8a7a6d;
    --faint: #b6a598;
    --border: #f0dcc9;
    --accent: #ff7a45;
    --accent-ink: #e8571f;
    --accent-soft: rgba(255, 122, 69, 0.12);
    --ok: #41ac6d;
    --ok-soft: rgba(65, 172, 109, 0.14);
    --radius-lg: 26px;
    --radius-md: 20px;
    --radius-sm: 15px;
    --shadow-card: 0 2px 0 #f0dcc9, 0 8px 18px -12px rgba(139, 92, 55, .28);
    --font: "Yuanti SC", "YouYuan", "PingFang SC", "Hiragino Sans GB",
            "Microsoft YaHei", "Noto Sans SC", -apple-system, system-ui, sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }

  body {
    background:
      radial-gradient(circle at 12% 8%, #ffe8d4 0%, transparent 42%),
      radial-gradient(circle at 88% 92%, #e6f5ea 0%, transparent 45%),
      #fdf3e7;
    color: var(--fg);
    font-family: var(--font);
    font-size: 15px;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  button { font-family: inherit; font-size: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
  input { font-family: inherit; font-size: inherit; color: inherit; }

  .app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg);
    overflow: hidden;
  }
  @media (min-width: 560px) {
    body { padding: 26px 0; }
    .app {
      height: min(900px, calc(100vh - 52px));
      min-height: 0;
      border-radius: 30px;
      border: 1px solid var(--border);
      box-shadow: 0 30px 70px -34px rgba(25, 23, 19, 0.45), 0 2px 6px rgba(25, 23, 19, 0.05);
    }
  }

  /* ── app bar ─────────────────────────────────────────────── */
  .appbar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: calc(16px + env(safe-area-inset-top)) 20px 12px;
    background: var(--bg);
  }
  .brand { display: flex; align-items: center; gap: 9px; }
  .brand-mark {
    display: grid; place-items: center;
    width: 30px; height: 30px;
    border-radius: 9px;
    background: var(--accent);
    flex: 0 0 auto;
  }
  .brand-mark svg { width: 17px; height: 17px; stroke: #fff; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .brand h1 { margin: 0; font-size: 21px; font-weight: 700; letter-spacing: -0.02em; }
  .brand p { margin: 0; font-size: 11px; color: var(--faint); letter-spacing: 0.04em; }
  .count-chip {
    display: inline-flex; align-items: center; gap: 5px;
    height: 30px; padding: 0 11px;
    border-radius: 999px;
    background: var(--surface);
    border: 1px solid var(--border);
    font-size: 12px; color: var(--muted);
  }
  .count-chip b { color: var(--fg); font-weight: 600; }

  /* ── screens ─────────────────────────────────────────────── */
  .screens { flex: 1 1 auto; position: relative; min-height: 0; }
  .screen {
    position: absolute; inset: 0;
    overflow-y: auto; overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 26px;
    display: none;
  }
  .screen.active { display: block; animation: screenIn .30s cubic-bezier(.25,.85,.3,1) both; }
  @keyframes screenIn { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
  .screen::-webkit-scrollbar { width: 0; }

  .section-head {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 10px; padding: 20px 20px 10px;
  }
  .section-head h2 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
  .section-head span { font-size: 12px; color: var(--faint); }

  /* ── search ──────────────────────────────────────────────── */
  .search-wrap { padding: 0 20px; position: relative; }
  .search-box {
    display: flex; align-items: center; gap: 8px;
    height: 48px; padding: 0 6px 0 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    box-shadow: var(--shadow-card);
    transition: border-color .18s ease, box-shadow .18s ease;
  }
  .search-box:focus-within { border-color: rgba(192, 90, 53, 0.5); box-shadow: 0 0 0 3px var(--accent-soft); }
  .search-box > svg { width: 17px; height: 17px; stroke: var(--faint); fill: none; stroke-width: 1.9; stroke-linecap: round; flex: 0 0 auto; }
  .search-box input {
    flex: 1 1 auto; min-width: 0; height: 100%;
    border: 0; outline: 0; background: none;
    font-size: 15px; letter-spacing: -0.01em;
  }
  .search-box input::placeholder { color: var(--faint); }
  .add-btn {
    flex: 0 0 auto; display: grid; place-items: center;
    width: 36px; height: 36px; border-radius: 999px;
    background: var(--accent);
    transition: transform .12s ease, opacity .18s ease;
  }
  .add-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2.2; stroke-linecap: round; }
  .add-btn:active { transform: scale(0.92); }
  .add-btn[disabled] { opacity: .38; }
  .add-btn[hidden] { display: none !important; }

  .suggest {
    position: absolute; left: 20px; right: 20px; top: 52px; z-index: 30;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: 0 18px 36px -18px rgba(25, 23, 19, 0.35);
    overflow: hidden; display: none;
  }
  .suggest.open { display: block; }
  .suggest-row {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 8px 12px; text-align: left;
    border-bottom: 1px solid #f4f1ec;
  }
  .suggest-row:last-child { border-bottom: 0; }
  .suggest-row:active { background: #faf8f4; }
  .suggest-row img { width: 34px; height: 34px; border-radius: 9px; background: var(--thumb); object-fit: contain; padding: 3px; flex: 0 0 auto; }
  .suggest-row .s-name { font-size: 14px; font-weight: 500; }
  .suggest-row .s-en { font-size: 11px; color: var(--faint); }
  .suggest-row .s-go { margin-left: auto; font-size: 11px; color: var(--accent-ink); }

  .chips {
    display: flex; gap: 8px;
    padding: 12px 20px 2px;
    overflow-x: auto; scrollbar-width: none;
  }
  .chips::-webkit-scrollbar { display: none; }
  .chip {
    flex: 0 0 auto; height: 30px; padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 12.5px; color: var(--muted);
    display: inline-flex; align-items: center; gap: 6px;
  }
  .chip img { width: 16px; height: 16px; object-fit: contain; }
  .chip:active { background: #faf8f4; }
  .chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }
  .chip.on img { filter: none; }

  /* ── ingredient grid ─────────────────────────────────────── */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 4px 20px 0; }

  .card {
    position: relative; text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 8px 8px 10px;
    box-shadow: var(--shadow-card);
    animation: pop .26s cubic-bezier(.2,.8,.3,1) both;
  }
  @keyframes pop { from { opacity: 0; transform: translateY(7px) scale(.985); } to { opacity: 1; transform: none; } }

  .thumb {
    position: relative;
    display: grid; place-items: center;
    aspect-ratio: 1 / 1;
    border-radius: 13px;
    background: var(--thumb);
    overflow: hidden;
  }
  .thumb img { width: 100%; height: 100%; object-fit: contain; padding: 8%; }
  .thumb .badge {
    position: absolute; right: 5px; bottom: 5px;
    font-size: 9px; line-height: 1;
    padding: 3px 5px; border-radius: 5px;
    background: rgba(255, 255, 255, 0.86);
    color: var(--faint);
    letter-spacing: .02em;
  }
  .card-name { display: flex; align-items: baseline; justify-content: space-between; gap: 6px; padding: 9px 3px 0; }
  .card-name strong { font-size: 14.5px; font-weight: 600; letter-spacing: -0.01em; }
  .card-name em { font-style: normal; font-size: 11px; color: var(--faint); }
  .card-meta { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 3px 3px 0; }
  .card-meta span { font-size: 11.5px; color: var(--muted); }
  .remove {
    display: grid; place-items: center;
    width: 26px; height: 26px; border-radius: 999px;
    color: var(--faint); background: #faf8f4;
  }
  .remove svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }
  .remove:active { color: var(--accent-ink); background: var(--accent-soft); }

  /* ── empty ───────────────────────────────────────────────── */
  .empty { padding: 46px 34px 30px; text-align: center; }
  .empty-ico {
    display: grid; place-items: center;
    width: 54px; height: 54px; margin: 0 auto 14px;
    border-radius: 16px;
    background: var(--surface); border: 1px solid var(--border);
  }
  .empty-ico svg { width: 24px; height: 24px; stroke: var(--faint); fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .empty h3 { margin: 0 0 6px; font-size: 15px; font-weight: 600; }
  .empty p { margin: 0; font-size: 12.5px; color: var(--faint); line-height: 1.6; }

  /* ── recipes ─────────────────────────────────────────────── */
  .filters {
    display: flex; gap: 8px;
    padding: 0 20px 4px;
    overflow-x: auto; scrollbar-width: none;
  }
  .filters::-webkit-scrollbar { display: none; }
  .fchip {
    flex: 0 0 auto; height: 30px; padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 12.5px; color: var(--muted);
    display: inline-flex; align-items: center; gap: 5px;
  }
  .fchip b { font-weight: 600; font-variant-numeric: tabular-nums; }
  .fchip.on { background: var(--fg); border-color: var(--fg); color: #fff; }
  .fchip.on b { color: #fff; }

  .recipes { padding: 8px 20px 0; display: flex; flex-direction: column; gap: 10px; }
  .recipe {
    display: flex; align-items: center; gap: 12px;
    width: 100%; padding: 11px 12px; text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
  }
  .recipe:active { background: #fdfcfa; }
  .recipe.full { border-color: rgba(77, 124, 88, .34); }

  /* dish art：白盘子 + 主料图，纯本地合成，必然渲染 */
  .dish {
    position: relative;
    flex: 0 0 auto;
    border-radius: 13px;
    overflow: hidden;
    background: radial-gradient(120% 120% at 26% 16%, #fdf5ea 0%, #f0e7d8 100%);
  }
  .dish i {
    position: absolute; inset: 15%;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 7px rgba(60, 45, 30, .1), inset 0 0 0 1px #efe8db;
  }
  .dish img { position: absolute; object-fit: contain; }
  .dish.lg { width: 100%; height: 168px; border-radius: var(--radius-lg); }
  .dish.sm { width: 64px; height: 64px; }

  .recipe-body { flex: 1 1 auto; min-width: 0; }
  .recipe-body h3 { margin: 0 0 3px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
  .recipe-body .line2 { margin: 0; font-size: 12px; color: var(--muted); }
  .recipe-body .line2 b { color: var(--ok); font-weight: 600; }
  .missing { margin: 5px 0 0; font-size: 11.5px; color: var(--faint); display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; }
  .missing u { text-decoration: none; color: var(--accent-ink); background: var(--accent-soft); border-radius: 5px; padding: 1px 5px; }
  .match {
    flex: 0 0 auto;
    width: 42px; height: 42px;
    display: grid; place-items: center;
    border-radius: 999px;
    font-size: 11.5px; font-weight: 600;
    color: var(--muted);
    background: conic-gradient(var(--accent) calc(var(--p) * 1%), #efebe3 0);
    position: relative;
  }
  .match.done { background: conic-gradient(var(--ok) calc(var(--p) * 1%), #efebe3 0); color: var(--ok); }
  .match::after { content: ''; position: absolute; inset: 3px; border-radius: 999px; background: var(--surface); }
  .match span { position: relative; z-index: 1; }

  .no-match { padding: 34px 30px; text-align: center; }
  .no-match p { margin: 0 0 12px; font-size: 12.5px; color: var(--faint); line-height: 1.6; }
  .no-match button {
    height: 38px; padding: 0 16px; border-radius: 999px;
    background: var(--surface); border: 1px solid var(--border);
    font-size: 13px; color: var(--muted);
  }

  /* ── shopping ────────────────────────────────────────────── */
  .shop-add { display: flex; gap: 8px; padding: 0 20px; }
  .shop-add .search-box { flex: 1 1 auto; height: 44px; box-shadow: none; }
  .shop-list { padding: 14px 20px 0; display: flex; flex-direction: column; gap: 8px; }
  .shop-row {
    display: flex; align-items: center; gap: 11px;
    padding: 9px 12px 9px 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .shop-row.done { opacity: .55; }
  .shop-row.done .shop-name { text-decoration: line-through; }
  .shop-row img { width: 34px; height: 34px; border-radius: 9px; background: var(--thumb); object-fit: contain; padding: 3px; flex: 0 0 auto; }
  .tick {
    flex: 0 0 auto; width: 22px; height: 22px; border-radius: 999px;
    border: 1.5px solid var(--border);
    display: grid; place-items: center; color: transparent;
  }
  .tick svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
  .shop-row.done .tick { background: var(--ok); border-color: var(--ok); color: #fff; }
  .shop-body { flex: 1 1 auto; min-width: 0; }
  .shop-name { font-size: 14px; font-weight: 500; }
  .shop-sub { font-size: 11px; color: var(--faint); }

  /* ── tabbar ──────────────────────────────────────────────── */
  .tabbar {
    flex: 0 0 auto;
    display: grid; grid-template-columns: repeat(4, 1fr);
    padding: 6px 12px calc(6px + env(safe-area-inset-bottom));
    background: rgba(251, 250, 247, 0.94);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
  }
  .tab { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 0 2px; color: var(--faint); border-radius: 12px; }
  .tab svg { width: 21px; height: 21px; stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .tab span { font-size: 10.5px; letter-spacing: 0.01em; }
  .tab.active { color: var(--accent-ink); }

  /* ── sheet ───────────────────────────────────────────────── */
  .scrim {
    position: absolute; inset: 0;
    background: rgba(25, 23, 19, 0.32);
    opacity: 0; pointer-events: none;
    transition: opacity .22s ease;
    z-index: 40;
  }
  .scrim.open { opacity: 1; pointer-events: auto; }
  .sheet {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 50;
    max-height: 90%;
    display: flex; flex-direction: column;
    background: var(--bg);
    border-radius: 22px 22px 0 0;
    transform: translateY(101%);
    transition: transform .28s cubic-bezier(.25,.85,.3,1);
    box-shadow: 0 -20px 50px -24px rgba(25, 23, 19, 0.5);
  }
  .sheet.open { transform: none; }
  .grabber { width: 38px; height: 4px; border-radius: 999px; background: var(--border); margin: 8px auto 0; flex: 0 0 auto; }
  .sheet-scroll { overflow-y: auto; padding: 10px 20px calc(22px + env(safe-area-inset-bottom)); }
  .sheet-scroll::-webkit-scrollbar { width: 0; }
  .sheet h2 { margin: 0 0 2px; font-size: 21px; font-weight: 700; letter-spacing: -0.02em; }
  .sheet .sub { margin: 0 0 4px; font-size: 12px; color: var(--faint); letter-spacing: 0.02em; }
  .sheet h4 {
    margin: 18px 0 8px;
    font-size: 11.5px; font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .steps { display: flex; flex-direction: column; gap: 10px; }
  .step { display: flex; gap: 10px; font-size: 13.5px; line-height: 1.55; color: #2e2b26; }
  .step b {
    flex: 0 0 auto; width: 20px; height: 20px; border-radius: 999px;
    background: var(--accent-soft); color: var(--accent-ink);
    font-size: 11px; font-weight: 600;
    display: grid; place-items: center; margin-top: 1px;
  }
  .ing-list { display: flex; flex-direction: column; gap: 1px; }
  .ing-line { display: flex; align-items: center; gap: 9px; padding: 7px 0; border-bottom: 1px solid #f2eee7; font-size: 13.5px; }
  .ing-line:last-child { border-bottom: 0; }
  .ing-line img { width: 26px; height: 26px; border-radius: 7px; background: var(--thumb); object-fit: contain; padding: 2px; }
  .ing-line .amt { margin-left: auto; color: var(--faint); font-size: 12px; }
  .ing-line.have .nm::after {
    content: '有'; margin-left: 6px; font-size: 10px; color: var(--ok);
    border: 1px solid rgba(77, 124, 88, .3); border-radius: 4px; padding: 0 3px; vertical-align: 1px;
  }
  .ing-line.lack .nm::after {
    content: '缺'; margin-left: 6px; font-size: 10px; color: var(--accent-ink);
    border: 1px solid rgba(192, 90, 53, .3); border-radius: 4px; padding: 0 3px; vertical-align: 1px;
  }
  .sheet-actions { display: flex; gap: 8px; margin-top: 18px; }
  .btn {
    flex: 1 1 auto; height: 46px; border-radius: 13px;
    font-size: 14px; font-weight: 600;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:active { background: var(--accent-ink); }
  .btn-ghost { background: var(--surface); border: 1px solid var(--border); color: var(--muted); flex: 0 0 auto; padding: 0 16px; }
  .stepper { display: inline-flex; align-items: center; gap: 2px; background: #f4f1ea; border-radius: 999px; padding: 3px; }
  .stepper button { width: 30px; height: 30px; border-radius: 999px; display: grid; place-items: center; color: var(--fg); }
  .stepper button:active { background: #ece7dd; }
  .stepper svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2.4; stroke-linecap: round; }
  .stepper b { min-width: 42px; text-align: center; font-size: 13.5px; font-weight: 600; }
  .qty-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0 2px; }

  /* ── import（抖音菜谱导入）────────────────────────────── */
  .imp-wrap { padding: 0 20px; }
  .imp-area {
    width: 100%;
    min-height: 96px;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: var(--shadow-card);
    font-family: inherit;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--fg);
    resize: vertical;
    outline: 0;
  }
  .imp-area::placeholder { color: var(--faint); }
  .imp-area:focus { border-color: rgba(192, 90, 53, .5); box-shadow: 0 0 0 3px var(--accent-soft); }
  .imp-go { width: 100%; margin-top: 10px; height: 46px; }
  .imp-go[disabled] { opacity: .45; }
  .imp-note {
    margin: 12px 20px 0;
    font-size: 11.5px;
    line-height: 1.65;
    color: var(--faint);
  }
  .imp-note b { color: var(--muted); font-weight: 600; }
  .imp-stage {
    margin: 12px 20px 0;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    background: var(--accent-soft);
    font-size: 12px;
    line-height: 1.6;
    color: var(--accent-ink);
    display: none;
  }
  .imp-stage.show { display: block; }
  .imp-stage b { font-weight: 600; }

  .draft-field { margin-top: 14px; }
  .draft-field label {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: .06em;
    margin-bottom: 6px;
    text-transform: uppercase;
  }
  .draft-input, .draft-area {
    width: 100%;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface);
    font-family: inherit;
    font-size: 13.5px;
    line-height: 1.65;
    color: var(--fg);
    outline: 0;
    resize: vertical;
  }
  .draft-input { height: 42px; }
  .draft-area { min-height: 92px; }
  .draft-input:focus, .draft-area:focus { border-color: rgba(192, 90, 53, .5); box-shadow: 0 0 0 3px var(--accent-soft); }
  .draft-hint { margin: 5px 0 0; font-size: 11px; color: var(--faint); line-height: 1.5; }
  .mine-tag {
    display: inline-block;
    margin-left: 6px;
    padding: 1px 6px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .02em;
    vertical-align: 2px;
    color: var(--accent);
    background: var(--accent-soft);
    border: 1px solid rgba(192, 90, 53, .22);
  }
  .imp-note {
    margin: 0 0 14px;
    font-size: 12px;
    line-height: 1.75;
    color: var(--faint);
  }
  .imp-note b { color: var(--ink); font-weight: 600; }

  .src-chip {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 6px;
    padding: 3px 9px;
    border-radius: 999px;
    background: var(--surface);
    border: 1px solid var(--border);
    font-size: 11px;
    color: var(--muted);
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── toast ───────────────────────────────────────────────── */
  .toast {
    position: absolute; left: 50%; bottom: 78px;
    transform: translate(-50%, 10px);
    z-index: 60; max-width: 82%;
    padding: 9px 14px; border-radius: 999px;
    background: rgba(25, 23, 19, 0.9);
    color: #fff; font-size: 12.5px; text-align: center;
    opacity: 0; pointer-events: none;
    transition: opacity .2s ease, transform .2s ease;
  }
  .toast.show { opacity: 1; transform: translate(-50%, 0); }

  /* ═══════════ 卡通化：圆润、糖果色、手绘感 ═══════════ */

  /* 标题圆润一点 */
  .sheet h2 { font-weight: 800; letter-spacing: -0.01em; }
  .brand, .screen-title { font-weight: 800; }

  /* 卡片描边 + 硬投影，像贴纸 */
  .card, .recipe, .imp-card, .draft-card {
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: 0 3px 0 #f2dfcb;
    transition: transform .14s ease, box-shadow .14s ease;
  }
  .card:active, .recipe:active {
    transform: translateY(2px) scale(.995);
    box-shadow: 0 1px 0 #f2dfcb;
  }

  /* 气泡感的主按钮 */
  .btn { border-radius: 999px; font-weight: 700; }
  .btn-primary {
    background: linear-gradient(180deg, #ff9463, var(--accent));
    box-shadow: 0 3px 0 #d94d18;
  }
  .btn-primary:active { transform: translateY(2px); box-shadow: 0 1px 0 #d94d18; }
  .btn-ghost { border: 1.5px solid var(--border); border-radius: 999px; }

  /* 弹层顶部更圆 */
  .sheet { border-radius: 28px 28px 0 0; }

  /* 步骤序号做成糖果小圆片 */
  .step b {
    width: 24px; height: 24px; font-size: 12px; font-weight: 800;
    background: linear-gradient(180deg, #fff0e2, #ffd9bd);
    color: var(--accent-ink);
    border: 1.5px solid #ffc9a5;
    box-shadow: 0 2px 0 #f5c6a4;
  }
  .step { font-size: 14px; line-height: 1.62; }

  /* 时间 / 火候 高亮 pill */
  .step em.tm, .step em.fire {
    font-style: normal; font-weight: 800;
    padding: 0 5px; border-radius: 7px;
    white-space: nowrap;
  }
  .step em.tm {
    color: #b8541a;
    background: #ffe7d2;
    border-bottom: 2px solid #ffc79b;
  }
  .step em.fire {
    color: #2f7a4c;
    background: #ddf3e4;
    border-bottom: 2px solid #a9dfbe;
  }

  /* h4 后面的步数说明 */
  .h4-note {
    text-transform: none; letter-spacing: 0;
    font-weight: 500; color: var(--faint);
    font-size: 11px; margin-left: 4px;
  }

  /* 小贴士卡片 */
  .tips {
    margin-top: 16px;
    padding: 13px 15px 12px;
    background: #fff6e3;
    border: 1.5px dashed #ffcf8a;
    border-radius: var(--radius-md);
    box-shadow: 0 3px 0 #f6e3c4;
  }
  .tips-hd {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12.5px; font-weight: 800; color: #b56a12;
    margin-bottom: 5px;
  }
  .tips-hd::before { content: '💡'; font-size: 13px; }
  .tips p {
    margin: 0 0 6px; font-size: 13px; line-height: 1.6; color: #6b5334;
    padding-left: 13px; position: relative;
  }
  .tips p::before {
    content: ''; position: absolute; left: 0; top: 8px;
    width: 5px; height: 5px; border-radius: 999px; background: #ffb457;
  }
  .tips p:last-child { margin-bottom: 0; }

  /* 筛选 chip 更糖果 */
  .chip { border-radius: 999px; border: 1.5px solid var(--border); font-weight: 600; }
  .chip.on { box-shadow: 0 2px 0 #d94d18; }

  /* 搜索框更圆 */
  .search-box { border-radius: 999px; border: 1.5px solid var(--border); }
  .imp-area, .draft-input, .draft-area { border-radius: var(--radius-md); }

  /* ═══════════ 界面过渡动画 ═══════════ */
  @keyframes popIn {
    from { opacity: 0; transform: translateY(11px) scale(.985); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes tabPop {
    from { transform: scale(.82); }
    60%  { transform: scale(1.10); }
    to   { transform: scale(1); }
  }
  @keyframes pillIn {
    from { opacity: 0; transform: translateY(6px) scale(.96); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes tipIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: none; }
  }

  /* 卡片依次浮现（列表重排时也会重新播放） */
  .screen.active .card,
  .screen.active .recipe,
  .screen.active .imp-card,
  .screen.active .draft-card {
    animation: popIn .34s cubic-bezier(.25,.85,.3,1) both;
  }
  .screen.active .card:nth-child(1),  .screen.active .recipe:nth-child(1)  { animation-delay: .00s; }
  .screen.active .card:nth-child(2),  .screen.active .recipe:nth-child(2)  { animation-delay: .03s; }
  .screen.active .card:nth-child(3),  .screen.active .recipe:nth-child(3)  { animation-delay: .06s; }
  .screen.active .card:nth-child(4),  .screen.active .recipe:nth-child(4)  { animation-delay: .09s; }
  .screen.active .card:nth-child(5),  .screen.active .recipe:nth-child(5)  { animation-delay: .12s; }
  .screen.active .card:nth-child(6),  .screen.active .recipe:nth-child(6)  { animation-delay: .15s; }
  .screen.active .card:nth-child(7),  .screen.active .recipe:nth-child(7)  { animation-delay: .18s; }
  .screen.active .card:nth-child(8),  .screen.active .recipe:nth-child(8)  { animation-delay: .21s; }
  .screen.active .card:nth-child(n+9),.screen.active .recipe:nth-child(n+9){ animation-delay: .24s; }

  /* 底部导航：图标弹一下，文字跟着变 */
  .tab { transition: color .18s ease, transform .12s ease; }
  .tab.active svg { animation: tabPop .30s cubic-bezier(.34,1.56,.64,1) both; }
  .tab:active { transform: scale(.94); }

  /* 筛选胶囊 / 徽标切换 */
  .chip, .count-chip, .recipe .tag, .pill {
    transition: background .18s ease, color .18s ease, border-color .18s ease, transform .12s ease;
  }
  .chip:active { transform: scale(.96); }
  .chip.on { animation: pillIn .24s ease both; }

  /* 按钮按压反馈 */
  .btn { transition: transform .12s ease, box-shadow .12s ease, background .18s ease; }
  .btn:active { transform: scale(.97) translateY(1px); }
  .icon-btn:active, .tab:active, .card:active { transform: scale(.98); }

  /* 搜索框聚焦 */
  .search-box, .search-wrap { transition: border-color .18s ease, box-shadow .18s ease; }

  /* 详情弹层里的步骤依次进场 */
  .sheet.open .step { animation: tipIn .26s ease both; }
  .sheet.open .step:nth-child(1) { animation-delay: .04s; }
  .sheet.open .step:nth-child(2) { animation-delay: .08s; }
  .sheet.open .step:nth-child(3) { animation-delay: .12s; }
  .sheet.open .step:nth-child(4) { animation-delay: .16s; }
  .sheet.open .step:nth-child(5) { animation-delay: .20s; }
  .sheet.open .step:nth-child(6) { animation-delay: .24s; }
  .sheet.open .step:nth-child(n+7) { animation-delay: .28s; }
  .sheet.open .tips { animation: tipIn .30s ease .30s both; }

  /* 尊重系统「减弱动态效果」 */
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: .001ms !important; animation-delay: 0ms !important; transition-duration: .001ms !important; }
  }
</style>
</head>
<body>
<div class="app" id="app">

  <header class="appbar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M6 14a4 4 0 0 1-1-7.9V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.1A4 4 0 0 1 18 14" />
          <path d="M6 14v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
          <path d="M6 14h12" />
        </svg>
      </span>
      <div>
        <h1>小灶 <small style="font-size:10px;font-weight:600;opacity:.55;letter-spacing:.06em">v7</small></h1>
        <p>XIAOZAO · 有什么做什么</p>
      </div>
    </div>
    <span class="count-chip"><b id="pantryCount">0</b> 样食材</span>
  </header>

  <div class="screens">

    <!-- ── 食材 ─────────────────────────────────────────────── -->
    <main class="screen active" id="screen-pantry" data-screen="pantry">
      <div class="search-wrap">
        <div class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
          </svg>
          <input id="searchInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                 placeholder="输入食材名，如 番茄 / 鸡腿 / tofu" aria-label="输入食材名字，自动配图并匹配菜谱" />
          <button class="add-btn" id="addBtn" aria-label="添加食材" disabled>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
        <div class="suggest" id="suggest" role="listbox" aria-label="食材联想"></div>
      </div>

      <div class="chips" id="chips"></div>

      <div class="section-head">
        <h2>我的食材</h2>
        <span id="pantryHint">配图自动补全</span>
      </div>

      <div class="grid" id="pantryGrid"></div>
      <div class="empty" id="pantryEmpty">
        <div class="empty-ico">
          <svg viewBox="0 0 24 24">
            <path d="M4 7h16l-1.3 12.1a2 2 0 0 1-2 1.9H7.3a2 2 0 0 1-2-1.9L4 7Z" />
            <path d="M9 7V5a3 3 0 0 1 6 0v2" />
          </svg>
        </div>
        <h3>还没有食材</h3>
        <p>输入名字就能加进来，配图会自动补上，并立刻匹配菜谱。</p>
      </div>
    </main>

    <!-- ── 菜谱 ─────────────────────────────────────────────── -->
    <main class="screen" id="screen-recipes" data-screen="recipes">
      <div class="section-head">
        <h2>按你的食材匹配</h2>
        <span id="recipeHint">—</span>
      </div>
      <div class="search-wrap" style="margin-bottom:12px">
        <div class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
          </svg>
          <input id="recipeSearch" type="search" autocomplete="off" autocapitalize="off" spellcheck="false"
                 placeholder="搜菜名，如 带鱼 / 排骨" aria-label="按菜名搜索菜谱" />
          <button class="add-btn" id="recipeSearchClear" aria-label="清空搜索" style="display:none;background:var(--border)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
      <div class="filters" id="filters"></div>
      <div class="recipes" id="recipeList"></div>
      <div class="no-match" id="noMatch" hidden>
        <p>这个筛选下暂时没有菜谱。<br />回「食材」多加几样，结果会更多。</p>
        <button data-goto="pantry">去加食材</button>
      </div>
    </main>

    <!-- ── 清单 ─────────────────────────────────────────────── -->
    <main class="screen" id="screen-list" data-screen="list">
      <div class="section-head">
        <h2>采购清单</h2>
        <span id="shopHint">缺什么买什么</span>
      </div>
      <div class="shop-add">
        <div class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          <input id="shopInput" type="text" autocomplete="off" placeholder="添加要买的" aria-label="添加要买的食材" />
        </div>
      </div>
      <div class="shop-list" id="shopList"></div>
      <div class="empty" id="shopEmpty">
        <div class="empty-ico">
          <svg viewBox="0 0 24 24">
            <path d="M4 5h2l2.2 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21.5 8H6.5" />
            <circle cx="10.5" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" />
          </svg>
        </div>
        <h3>清单是空的</h3>
        <p>在菜谱里点「把缺的加入清单」，缺的食材会排到这里。</p>
      </div>
    </main>

    <!-- ── 导入 ─────────────────────────────────────────────── -->
    <main class="screen" id="screen-import" data-screen="import">
      <div class="section-head">
        <h2>抖音菜谱导入</h2>
        <span id="impHint">粘贴分享内容</span>
      </div>
      <div class="imp-wrap">
        <textarea class="imp-area" id="impText" spellcheck="false"
          placeholder="把抖音的整段分享内容粘贴进来，例如：&#10;3.51 复制打开抖音，看看【范大厨来了的作品】葱烧带鱼这样做也太好吃啦！ https://v.douyin.com/xxxx/"></textarea>
        <button class="btn btn-primary imp-go" id="impGo" disabled>解析并生成菜谱</button>
      </div>
      <div class="imp-stage" id="impStage"></div>
      <p class="imp-note">
        <b>说明：</b>视频里的口播声音无法被网页直接读取，这里会从分享文案里识别
        <b>菜名 + 作者</b>，再按菜名推出食材与做法，生成一份可编辑草稿，确认后才存进本地菜谱。
      </p>

      <div class="section-head">
        <h2>我的菜谱</h2>
        <span id="customHint">还没有</span>
      </div>
      <p class="imp-note">
        导入的菜会<b>直接写进「菜谱」页的本地菜谱库</b>，和内置菜谱一起按你的食材匹配，卡片上标「我的」。
        同名菜谱会被<b>更新</b>而不是重复一条；在「菜谱」里点开任意一道「我的」菜，随时能<b>编辑菜名、食材、做法</b>或删除。
      </p>
      <button class="btn btn-primary" data-goto="recipes" style="width:100%;margin-bottom:16px">去「菜谱」页查看与编辑</button>
      <div class="recipes" id="customList" hidden></div>
    </main>
  </div>

  <nav class="tabbar" aria-label="主导航">
    <button class="tab active" data-tab="pantry" aria-current="page">
      <svg viewBox="0 0 24 24">
        <path d="M4 7h16l-1.3 12.1a2 2 0 0 1-2 1.9H7.3a2 2 0 0 1-2-1.9L4 7Z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
      <span>食材</span>
    </button>
    <button class="tab" data-tab="recipes">
      <svg viewBox="0 0 24 24">
        <path d="M6.5 3.5h11A1.5 1.5 0 0 1 19 5v15.5H5V5a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </svg>
      <span>菜谱</span>
    </button>
    <button class="tab" data-tab="import">
      <svg viewBox="0 0 24 24">
        <path d="M12 16V4" /><path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
        <path d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" />
      </svg>
      <span>导入</span>
    </button>
    <button class="tab" data-tab="list">
      <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
      <span>清单</span>
    </button>
  </nav>

  <div class="scrim" id="scrim"></div>
  <section class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
    <div class="grabber"></div>
    <div class="sheet-scroll" id="sheetBody"></div>
  </section>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
</div>
<script>
(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
     1. 食材词典
        key = 中文名；value = [图源英文键(已实测可用), 单位, 分类]
     ═══════════════════════════════════════════════════════════ */
  var DICT = {
    "番茄": ["Tomato", "个", "蔬菜"], "西红柿": ["Tomato", "个", "蔬菜"],
    "鸡蛋": ["Egg", "个", "蛋奶"], "土豆": ["Potato", "个", "蔬菜"],
    "洋葱": ["Onion", "个", "蔬菜"], "大蒜": ["Garlic", "瓣", "调味"],
    "生姜": ["Ginger", "块", "调味"], "胡萝卜": ["Carrots", "根", "蔬菜"],
    "青椒": ["Green Pepper", "个", "蔬菜"], "辣椒": ["Chilli", "个", "调味"],
    "茄子": ["Aubergine", "个", "蔬菜"], "黄瓜": ["Cucumber", "根", "蔬菜"],
    "西兰花": ["Broccoli", "颗", "蔬菜"], "卷心菜": ["Cabbage", "颗", "蔬菜"],
    "菠菜": ["Spinach", "把", "蔬菜"], "生菜": ["Lettuce", "颗", "蔬菜"],
    "芹菜": ["Celery", "根", "蔬菜"], "豌豆": ["Peas", "克", "蔬菜"],
    "南瓜": ["Pumpkin", "克", "蔬菜"], "玉米": ["Sweetcorn", "根", "蔬菜"],
    "芦笋": ["Asparagus", "把", "蔬菜"], "西葫芦": ["Courgette", "根", "蔬菜"],
    "蘑菇": ["Mushrooms", "克", "蔬菜"], "香菇": ["Mushrooms", "朵", "蔬菜"],
    "金针菇": ["Mushrooms", "把", "蔬菜"], "韭菜": ["Leek", "把", "蔬菜"],
    "小葱": ["Spring Onions", "根", "调味"], "香菜": ["Coriander", "把", "调味"],
    "豆腐": ["Tofu", "块", "豆制品"], "鹰嘴豆": ["Chickpeas", "克", "豆类"],
    "红豆": ["Kidney Beans", "克", "豆类"],
    "鸡肉": ["Chicken", "克", "肉禽"], "鸡胸肉": ["Chicken", "克", "肉禽"],
    "鸡腿": ["Chicken", "只", "肉禽"], "牛肉": ["Beef", "克", "肉禽"],
    "猪肉": ["Pork", "克", "肉禽"], "羊肉": ["Lamb", "克", "肉禽"],
    "培根": ["Bacon", "片", "肉禽"], "香肠": ["Sausages", "根", "肉禽"],
    "火腿": ["Ham", "片", "肉禽"], "鸭肉": ["Duck", "克", "肉禽"],
    "虾": ["Prawns", "只", "水产"], "三文鱼": ["Salmon", "克", "水产"],
    "金枪鱼": ["Tuna", "克", "水产"], "鳕鱼": ["Cod", "克", "水产"],
    "鱿鱼": ["Squid", "只", "水产"], "鳕鱼柳": ["Cod", "克", "水产"],
    "凤尾鱼": ["Anchovies", "克", "水产"], "沙丁鱼": ["Sardines", "条", "水产"],
    "鲭鱼": ["Mackerel", "条", "水产"], "鳟鱼": ["Trout", "条", "水产"],
    "青口": ["Mussels", "克", "水产"], "蛤蜊": ["Clams", "克", "水产"],
    "牛奶": ["Milk", "毫升", "蛋奶"], "黄油": ["Butter", "克", "蛋奶"],
    "奶油": ["Cream", "毫升", "蛋奶"], "酸奶": ["Yogurt", "杯", "蛋奶"],
    "奶酪": ["Cheese", "克", "蛋奶"], "马苏里拉": ["Mozzarella", "克", "蛋奶"],
    "帕玛森": ["Parmesan", "克", "蛋奶"], "菲达": ["Feta", "克", "蛋奶"],
    "面粉": ["Flour", "克", "主食"], "淀粉": ["Corn Flour", "克", "主食"],
    "大米": ["Rice", "杯", "主食"], "米饭": ["Rice", "碗", "主食"],
    "面条": ["Noodles", "份", "主食"], "意面": ["Spaghetti", "克", "主食"],
    "面包": ["Bread", "片", "主食"], "燕麦": ["Oats", "克", "主食"],
    "橄榄油": ["Olive Oil", "汤匙", "调味"], "酱油": ["Soy Sauce", "汤匙", "调味"],
    "蚝油": ["Oyster Sauce", "汤匙", "调味"], "醋": ["Vinegar", "汤匙", "调味"],
    "蜂蜜": ["Honey", "汤匙", "调味"], "糖": ["Sugar", "汤匙", "调味"],
    "盐": ["Salt", "克", "调味"], "黑胡椒": ["Black Pepper", "克", "调味"],
    "蛋黄酱": ["Mayonnaise", "汤匙", "调味"], "芥末": ["Mustard", "汤匙", "调味"],
    "辣椒酱": ["Harissa", "汤匙", "调味"], "芝麻酱": ["Tahini", "汤匙", "调味"],
    "花生酱": ["Peanut Butter", "汤匙", "调味"], "椰奶": ["Coconut Milk", "毫升", "调味"],
    "鸡汤": ["Chicken Stock", "毫升", "调味"],
    "罗勒": ["Basil", "把", "香草"], "欧芹": ["Parsley", "把", "香草"],
    "迷迭香": ["Rosemary", "枝", "香草"], "百里香": ["Thyme", "枝", "香草"],
    "月桂叶": ["Bay Leaves", "片", "香草"],
    "肉桂": ["Cinnamon", "根", "香料"], "红椒粉": ["Paprika", "克", "香料"],
    "姜黄": ["Turmeric", "克", "香料"], "孜然": ["Cumin", "克", "香料"],
    "八角": ["Star Anise", "颗", "香料"],
    "杏仁": ["Almonds", "克", "坚果"], "核桃": ["Walnuts", "克", "坚果"],
    "花生": ["Peanuts", "克", "坚果"], "腰果": ["Cashew Nuts", "克", "坚果"],
    "松子": ["Pine Nuts", "克", "坚果"], "芝麻": ["Sesame Seed", "克", "坚果"],
    "葡萄干": ["Raisins", "克", "果干"],
    "牛油果": ["Avocado", "个", "水果"], "香蕉": ["Banana", "根", "水果"],
    "苹果": ["Apple", "个", "水果"], "橙子": ["Orange", "个", "水果"],
    "柠檬": ["Lemon", "个", "水果"], "草莓": ["Strawberries", "克", "水果"],
    "蓝莓": ["Blueberries", "克", "水果"], "芒果": ["Mango", "个", "水果"],
    "菠萝": ["Pineapple", "个", "水果"], "石榴": ["Pomegranate", "个", "水果"],
    "巧克力": ["Chocolate", "克", "其他"],
    "花椒": ["", "克", "香料"], "番茄酱": ["Ketchup", "汤匙", "调味"],
    "白萝卜": ["Radish", "根", "蔬菜"], "冬瓜": ["", "克", "蔬菜"],
    "白糖": ["Sugar", "克", "调味"],
    /* en 为空 = 图库没有可靠实拍图，直接用本地生成插图（保证一定显示） */
    "带鱼": ["", "条", "水产"], "小黄鱼": ["", "条", "水产"],
    "鲈鱼": ["Sea Bass", "条", "水产"], "鲫鱼": ["", "条", "水产"],
    "草鱼": ["", "条", "水产"], "鱿鱼须": ["Squid", "克", "水产"],
    "五花肉": ["", "克", "肉禽"], "排骨": ["", "克", "肉禽"],
    "鸡翅": ["Chicken Wings", "个", "肉禽"], "鸡爪": ["", "只", "肉禽"],
    "牛腩": ["Beef", "克", "肉禽"], "里脊": ["Pork", "克", "肉禽"],
    "豆角": ["Green Beans", "克", "蔬菜"], "豆芽": ["Beansprouts", "克", "蔬菜"],
    "木耳": ["", "克", "蔬菜"], "莲藕": ["Lotus Root", "节", "蔬菜"],
    "山药": ["", "根", "蔬菜"], "娃娃菜": ["", "颗", "蔬菜"],
    "油菜": ["", "把", "蔬菜"], "蒜苗": ["", "把", "蔬菜"],
    "大葱": ["", "根", "调味"], "葱": ["", "根", "调味"],
    "干辣椒": ["", "个", "调味"], "豆瓣酱": ["", "汤匙", "调味"],
    "生抽": ["Soy Sauce", "汤匙", "调味"], "老抽": ["", "汤匙", "调味"],
    "料酒": ["", "汤匙", "调味"], "冰糖": ["", "克", "调味"],
    "香叶": ["Bay Leaves", "片", "香草"], "五香粉": ["Five Spice", "克", "香料"],
    "白胡椒": ["White Pepper", "克", "香料"], "辣椒面": ["", "克", "香料"],
    "孜然粉": ["Cumin", "克", "香料"], "咖喱粉": ["Curry Powder", "克", "香料"],
    "芝麻油": ["Sesame Oil", "汤匙", "调味"], "辣椒粉": ["Chilli Powder", "克", "香料"]
  };

  var QUICK = ["番茄", "鸡蛋", "鸡腿", "土豆", "洋葱", "豆腐", "虾", "西兰花", "牛肉", "蘑菇"];

  /* ═══════════════════════════════════════════════════════════
     2. 菜谱库（50 道，食材名全部来自 DICT，保证可匹配）
     ═══════════════════════════════════════════════════════════ */
  var DETAIL = {
    "番茄炒蛋": { t: "12 分钟", s: ["鸡蛋 3 个打散，加一小撮盐搅到不见蛋清，静置 2 分钟。番茄 2 个切滚刀块。", "锅大火烧到微微冒烟，倒 3 汤匙油，油面起细纹（约七成热）时转中火倒入蛋液。", "蛋液边缘凝固定型约 40 秒，用铲子从外往内推成大块，八成熟（中心还微湿）就盛出，全程约 1 分钟。", "锅里留底油，中火下番茄块炒 2—3 分钟，炒到番茄塌软出红汁；太干可加 2 汤匙热水。", "加盐 2 克、糖 3 克炒匀，倒回鸡蛋，中火翻炒 30 秒让蛋吸汁，撒葱花出锅。"], tips: ["蛋液里加半汤匙水，炒出来更嫩；全程别超过 1 分半，久了发柴。", "糖不是为甜，是压番茄的酸，1 小勺就够，放多了发腻。"] },
    "西红柿鸡蛋面": { t: "15 分钟", s: ["番茄 2 个顶部划十字，开水烫 20 秒后撕皮切小块；鸡蛋 2 个打散。", "锅中火倒 2 汤匙油，倒入蛋液炒 1 分钟成大块盛出。", "同一锅下番茄块，中火炒 3 分钟压出红汤，加 1 汤匙番茄酱炒 30 秒更浓。", "倒入 600 毫升热水大火烧开，下挂面煮 3—4 分钟（按包装时间减 30 秒，后面还要回锅）。", "面条回锅，加炒蛋、盐 3 克、生抽 1 汤匙，中火再煮 1 分钟，撒葱花关火。"], tips: ["番茄一定要炒出沙才香，急着加水会寡淡。", "面条单独煮再回锅，汤不浑、面更弹。"] },
    "蒜蓉西兰花": { t: "10 分钟", s: ["西兰花 1 棵掰小朵，用淡盐水泡 5 分钟后冲净；大蒜 5 瓣切末分两份。", "锅中水大火烧开，加半勺盐和几滴油，下西兰花焯 60—90 秒，捞出立刻过凉水沥干。", "锅中火倒 2 汤匙油，下蒜末（留一半）炒 20 秒至微黄出香，别炒焦。", "转大火倒入西兰花，翻炒 40 秒，加盐 2 克、蚝油 1 汤匙炒匀。", "关火前撒剩下的生蒜末，翻两下出锅，蒜香更冲。"], tips: ["焯水加盐加油，颜色翠绿不塌；超 2 分钟就发黄。", "生熟两份蒜：熟蒜出香，生蒜提味。"] },
    "蚝油生菜": { t: "7 分钟", s: ["生菜 1 棵掰开洗净沥干，大棵的从中间剖开；大蒜 3 瓣切末。", "锅中水大火烧开，加半勺盐、几滴油，生菜下锅烫 15 秒立刻捞出摆盘。", "另起锅中火，倒 1 汤匙油下蒜末炒 20 秒。", "加蚝油 1.5 汤匙、生抽 1 茶匙、糖半茶匙、清水 3 汤匙，小火煮 30 秒至微稠。", "把汁淋在生菜上即可，趁热吃。"], tips: ["生菜只烫 15 秒，久了出水发黄。", "蚝油本身咸，基本不用再加盐。"] },
    "土豆炖牛肉": { t: "70 分钟", s: ["牛腩 500 克切 3 厘米块，冷水下锅加姜片、料酒，大火煮开撇沫再煮 3 分钟，捞出用温水洗净。", "锅中火倒 2 汤匙油，下葱段、姜片、八角 1 个炒 30 秒，倒入牛肉块中大火煸炒 3 分钟至表面微焦。", "加生抽 2 汤匙、老抽 1 茶匙炒 30 秒上色，倒入没过牛肉的开水，大火烧开。", "转最小火加盖炖 40 分钟（普通锅）；高压锅上汽后 18 分钟。", "下土豆块（滚刀 3 厘米）再炖 15—20 分钟至筷子能轻松扎透，加盐调味，大火收汁 3 分钟。"], tips: ["一定加开水，冷水会让肉紧缩变柴。", "土豆后放，早放会炖成泥。"] },
    "黑椒牛柳": { t: "20 分钟", s: ["牛里脊 300 克逆纹切 0.5 厘米粗条，加生抽 1 汤匙、料酒 1 汤匙、淀粉 1 茶匙、黑胡椒碎 1 茶匙抓匀，腌 15 分钟。", "洋葱半个、青红椒各半个切条；黑椒汁：蚝油 1 汤匙 + 生抽 1 汤匙 + 糖半茶匙 + 水 3 汤匙 + 淀粉半茶匙调匀。", "锅大火烧到冒烟，倒 2 汤匙油，牛柳下锅摊平不动煎 30 秒，再快速划散炒 40 秒至变色立刻盛出。", "锅中火下洋葱、青红椒炒 1 分钟至断生。", "倒回牛柳，淋黑椒汁，大火翻炒 30 秒至汁裹匀关火。"], tips: ["牛柳全程大火快炒，总时间不超过 1 分半，久了就老。", "腌肉加淀粉是嫩的关键，别省。"] },
    "洋葱炒鸡蛋": { t: "8 分钟", s: ["洋葱 1 个切粗丝，鸡蛋 3 个加一小撮盐打散。", "锅大火倒 2 汤匙油，倒入蛋液炒 1 分钟成大块盛出。", "同一锅补半汤匙油，中火下洋葱丝炒 2 分钟至透明微黄、边缘略焦香。", "加盐 2 克、生抽 1 茶匙炒 30 秒。", "倒回鸡蛋，大火翻炒 30 秒出锅。"], tips: ["洋葱炒到透明才甜，半生会冲鼻。", "鸡蛋先盛出再回锅，才嫩不柴。"] },
    "青椒土豆丝": { t: "10 分钟", s: ["土豆 2 个去皮切细丝，放清水里抓洗 2 遍去淀粉，泡 5 分钟后沥干。", "青椒 1 个切丝，蒜 2 瓣切片；备一小碗白醋水（1 汤匙醋 + 2 汤匙水）。", "锅大火烧热倒 2 汤匙油，下蒜片、干辣椒 2 个炒 20 秒。", "倒入土豆丝大火翻炒 1 分半，沿锅边淋醋水再炒 30 秒，土豆丝变透明。", "下青椒丝、盐 2 克炒 40 秒，断生出锅。"], tips: ["切好必须冲洗泡水，不然粘锅发黑。", "醋分两次放（下锅和起锅前），脆度最好。"] },
    "地三鲜": { t: "18 分钟", s: ["茄子 1 个切滚刀块，撒少许盐抓匀静置 10 分钟挤掉水；土豆 1 个切滚刀；青椒 1 个切块。", "锅中火烧油至六成热（筷子插入冒小泡），土豆块炸 4 分钟至金黄捞出。", "同一锅油下茄子炸 2 分钟至软塌捞出，最后青椒过油 20 秒。", "倒掉多余油留 1 汤匙，下蒜末 3 瓣炒 20 秒，倒入料汁（生抽 2 汤匙 + 蚝油 1 汤匙 + 糖 1 茶匙 + 水 4 汤匙 + 淀粉半茶匙）。", "小火煮 30 秒至浓稠，倒入三样翻匀，让汁挂上即可。"], tips: ["茄子先用盐杀水，省油不吸油。", "不想炸可改：茄子微波 3 分钟、土豆少油煎，热量减一半。"] },
    "鱼香茄子": { t: "20 分钟", s: ["茄子 2 根切条，撒盐腌 10 分钟挤水；肉末 100 克备用。", "调鱼香汁：生抽 1 汤匙 + 香醋 1.5 汤匙 + 糖 1.5 汤匙 + 淀粉 1 茶匙 + 水 5 汤匙，搅匀。", "锅中火 3 汤匙油，下茄子条煎 5 分钟至软，盛出。", "留底油下肉末炒 2 分钟散开出油，加姜蒜末、豆瓣酱 1 汤匙炒 1 分钟出红油。", "倒回茄子，淋鱼香汁，中火烧 1 分钟收浓，撒葱花出锅。"], tips: ["糖和醋 1:1 是鱼香灵魂，先尝再调。", "茄子干煸替代油炸，只要耐心煎到软。"] },
    "麻婆豆腐": { t: "15 分钟", s: ["嫩豆腐 1 盒切 2 厘米方块，放淡盐水里泡 5 分钟（不易碎）。", "锅中火烧开水，下豆腐汆 1 分钟捞出。", "炒锅下 2 汤匙油，中火炒肉末 100 克 2 分钟至出油，加豆瓣酱 1.5 汤匙、豆豉 1 茶匙、姜蒜末炒 1 分钟出红油。", "加 200 毫升热水或高汤烧开，下豆腐，小火煮 4 分钟（晃动锅别用铲）。", "分两次淋水淀粉（每次 1 茶匙淀粉 + 2 汤匙水），每次煮 30 秒，出锅撒花椒粉和葱花。"], tips: ["豆瓣酱够咸，盐最后尝了再补。", "勾芡分两次，汁才挂得住、不澥。"] },
    "豆腐蘑菇汤": { t: "15 分钟", s: ["嫩豆腐切块，香菇 4 朵、白玉菇 1 把洗净切片，姜 2 片。", "锅中火倒 1 茶匙油，下姜片、香菇炒 1 分钟出香。", "倒入 700 毫升热水，大火烧开。", "下豆腐和白玉菇，转中火煮 5 分钟。", "加盐 3 克、白胡椒少许，淋蛋液（1 个）画圈再煮 20 秒，滴香油撒葱花。"], tips: ["用热水冲汤，汤色才清亮。", "蛋液最后淋，画圈不搅才成絮。"] },
    "家常豆腐": { t: "15 分钟", s: ["北豆腐 1 块切 1 厘米三角厚片，用厨房纸吸干水。", "平底锅中火 1.5 汤匙油，豆腐片下锅煎 2 分钟一面，两面各煎至金黄（共约 4 分钟）盛出。", "留底油下五花肉片 50 克煸 1 分钟出油，加蒜片、木耳、青椒炒 1 分钟。", "加生抽 1.5 汤匙、蚝油 1 汤匙、糖半茶匙、水 4 汤匙烧开。", "放入豆腐小火焖 2 分钟，勾薄芡，撒葱段出锅。"], tips: ["豆腐先吸干水再煎，不溅油不粘锅。", "焖 2 分钟让豆腐吸汁，久了会碎。"] },
    "虾仁滑蛋": { t: "12 分钟", s: ["虾仁 150 克去虾线，加盐 1 克、白胡椒、料酒 1 茶匙、淀粉半茶匙抓匀腌 10 分钟。", "鸡蛋 3 个加 2 汤匙牛奶或水、一小撮盐打匀。", "锅中火 1 汤匙油，虾仁下锅炒 1 分钟变红卷曲盛出。", "转小火，倒入蛋液静置 10 秒，用铲从边缘往中间轻推。", "蛋液七成凝固时倒回虾仁，关火用余温翻两下，撒葱花。"], tips: ["全程小火，蛋才滑；大火立刻变橡皮。", "关火后余温还能继续熟，宁早出锅。"] },
    "黄油蒜香虾": { t: "12 分钟", s: ["大虾 300 克剪须开背去虾线，用厨房纸吸干。", "大蒜 6 瓣切末，黄油 20 克备好。", "锅中火，先放一半黄油融化，下蒜末炒 30 秒至香不焦。", "转大火下虾，两面各煎 1 分钟至变红，淋料酒 1 汤匙。", "加剩下的黄油、盐 2 克、黑胡椒，翻炒 30 秒，挤几滴柠檬汁出锅。"], tips: ["虾必须吸干水，否则黄油遇水溅且不香。", "黄油分两次放，香味有层次不糊。"] },
    "白灼虾": { t: "10 分钟", s: ["鲜虾 400 克剪须挑虾线，冲洗干净。", "锅中放 1500 毫升水，加姜 4 片、葱 2 段、料酒 1 汤匙，大火烧开。", "水大滚时下虾，煮 1 分半至 2 分钟，虾身弯成 C 形即可捞出。", "立刻过冰水 30 秒，肉质更弹。", "调蘸汁：生抽 2 汤匙 + 香醋半汤匙 + 姜末 + 几滴香油，蘸食。"], tips: ["水开再下虾，虾肉才脆；冷水下锅会柴。", "虾变 C 形熟了、变 O 形就过火。"] },
    "柠檬蜂蜜三文鱼": { t: "20 分钟", s: ["三文鱼排 2 块（约 300 克）用厨房纸吸干，两面抹盐 2 克、黑胡椒，静置 10 分钟。", "调汁：柠檬汁 1.5 汤匙 + 蜂蜜 1 汤匙 + 生抽 1 茶匙 + 橄榄油 1 汤匙，搅匀。", "平底锅中火 1 汤匙油，鱼皮朝下下锅煎 3 分钟不要动，至皮脆。", "翻面再煎 2 分钟，淋一半调汁，小火焖 1 分钟。", "关火淋剩下汁，撒柠檬片和黑胡椒，静置 2 分钟再切。"], tips: ["下锅后别急着翻，3 分钟让皮自然脱离。", "蜂蜜易糊，最后 1 分钟才放。"] },
    "香煎鳕鱼": { t: "15 分钟", s: ["鳕鱼 2 块解冻后彻底吸干水，两面抹盐 2 克、白胡椒，静置 10 分钟再吸一次水。", "薄薄拍一层面粉（可省），抖掉多余粉。", "平底锅中火 1.5 汤匙油，下鱼块煎 3 分钟不动，至底面金黄。", "翻面再煎 2—3 分钟，加黄油 10 克、蒜片 2 瓣，用勺把黄油浇在鱼上 30 秒。", "出锅挤柠檬汁，撒欧芹或葱花。"], tips: ["鳕鱼含水量高，必须吸干两次，否则煎不脆。", "中火，油温过高外面焦里面还是生的。"] },
    "金枪鱼沙拉": { t: "10 分钟", s: ["水浸金枪鱼罐头 1 罐沥干（油浸的热量高一倍）。", "生菜、圣女果 8 颗、黄瓜半根洗净切好，放冰水泡 3 分钟更脆，沥干。", "调油醋汁：橄榄油 2 汤匙 + 柠檬汁 1 汤匙 + 盐 1 克 + 黑胡椒 + 蜂蜜半茶匙，摇匀乳化。", "所有蔬菜放碗里，淋 2/3 汁拌匀。", "铺上金枪鱼、水煮蛋 1 个切瓣，淋剩余汁即可。"], tips: ["叶菜一定要沥干，带水会把酱汁稀释。", "汁先拌菜再放鱼肉，鱼不散。"] },
    "牛油果沙拉": { t: "10 分钟", s: ["牛油果 1 个对半去核，切 1.5 厘米块，挤柠檬汁防氧化。", "圣女果 8 颗对半切，洋葱 1/4 个切细丝泡冰水 5 分钟去辣，沥干。", "调汁：橄榄油 1.5 汤匙 + 柠檬汁 1 汤匙 + 蜂蜜半茶匙 + 盐 1 克 + 黑胡椒。", "牛油果、番茄、洋葱轻拌，淋汁。", "撒烤香的坚果碎或芝麻，最后放几片罗勒。"], tips: ["牛油果选按压微软的，硬的不熟、软塌的坏了。", "翻拌要轻，牛油果一压就烂。"] },
    "培根奶油意面": { t: "20 分钟", s: ["烧 2 升水，水开后加 1 汤匙盐，下意面 100 克煮（按包装时间减 1 分钟），留半碗面汤。", "培根 3 片切条，锅中火不放油煎 2 分钟至出油微脆，盛出。", "同一锅下蒜末 2 瓣、洋葱碎炒 1 分钟，倒淡奶油 150 毫升，小火煮 2 分钟至微稠（别烧开）。", "加帕玛森芝士 2 汤匙、黑胡椒，搅到融化；太稠就加 2 汤匙面汤。", "面捞进酱里翻拌 1 分钟，加培根，出锅再撒芝士和黑胡椒。"], tips: ["奶油一定小火，一沸腾就油水分离。", "面汤含淀粉，是让酱挂住面的关键。"] },
    "番茄肉酱意面": { t: "30 分钟", s: ["洋葱半个、胡萝卜半根、蒜 3 瓣切碎；番茄 2 个烫皮切丁（或番茄罐头 400 克）。", "锅中火 1 汤匙油，下洋葱、胡萝卜炒 3 分钟至软，加蒜炒 30 秒。", "下牛肉末 250 克，中大火炒 3 分钟至变色散开，加番茄丁炒 2 分钟。", "加番茄膏 1 汤匙、盐 4 克、糖 1 茶匙、黑胡椒、月桂叶 1 片，倒 100 毫升水，小火炖 15 分钟。", "另锅煮面 8—10 分钟；面捞入肉酱锅，中火翻拌 1 分钟，撒芝士。"], tips: ["肉末先炒到出油再放番茄，酱才香浓。", "炖 15 分钟不能省，番茄的酸会变甜。"] },
    "奶油蘑菇意面": { t: "20 分钟", s: ["口蘑 200 克切片，洋葱 1/4 个切碎，蒜 2 瓣切末。", "锅中火 1 汤匙黄油，下洋葱、蒜炒 1 分钟，加蘑菇中大火炒 4 分钟至出水收干、边缘焦黄。", "倒白葡萄酒或料酒 2 汤匙炒 30 秒挥发，加淡奶油 150 毫升，小火煮 2 分钟。", "加盐 2 克、黑胡椒、帕玛森 2 汤匙搅匀。", "煮好的意面 100 克入锅拌 1 分钟，太干加面汤，撒欧芹。"], tips: ["蘑菇要炒到出水再收干，才有焦香。", "菇类别焯水，焯了就只剩水味。"] },
    "蒜香橄榄油意面": { t: "15 分钟", s: ["大蒜 5 瓣切薄片，小米辣 1 个切圈，欧芹切碎。", "煮面水烧开加盐，下意面 100 克煮 8 分钟，留 1 碗面汤。", "冷锅下橄榄油 3 汤匙和蒜片，小火慢煎 3 分钟至蒜边微黄（千万别焦）。", "加辣椒圈炒 20 秒，倒入 3 汤匙面汤，煮 30 秒乳化。", "面入锅大火翻拌 1 分钟，加盐、黑胡椒、欧芹，出锅淋一点生橄榄油。"], tips: ["蒜用冷油小火煎，逼香不糊；油冒烟再下蒜就苦。", "面汤+油要搅成乳状，这是挂汁关键。"] },
    "鸡蛋三明治": { t: "10 分钟", s: ["鸡蛋 2 个冷水下锅，水开后中火煮 8 分钟（全熟）或 6 分半（溏心），捞出过冷水剥壳。", "鸡蛋压碎，加蛋黄酱 2 汤匙、盐 1 克、黑胡椒、黄芥末半茶匙拌成馅。", "吐司 4 片小火干烘 40 秒一面至微脆（也可用烤面包机）。", "抹一层薄黄油防潮，铺生菜、蛋馅，盖上另一片。", "轻压后对角切开，切口朝上装盘。"], tips: ["煮蛋从冷水开始计时，蛋黄才居中不发绿。", "抹黄油是防面包被馅料泡软的关键。"] },
    "培根鸡蛋早餐": { t: "10 分钟", s: ["培根 3 条冷锅下锅，中小火煎 3 分钟一面，翻面 2 分钟至微脆，盛出用厨房纸吸油。", "用培根出的油（约 1 汤匙）煎蛋 2 个，中小火 2 分钟至蛋白凝固、蛋黄流心。", "同一锅下番茄片或蘑菇煎 1 分钟。", "吐司烤 1 分钟。", "摆盘，撒黑胡椒和盐，趁热吃。"], tips: ["培根冷锅下，油慢慢逼出才脆不卷。", "想蛋黄流心就盖锅盖焖 20 秒。"] },
    "燕麦香蕉早餐碗": { t: "8 分钟", s: ["燕麦片 50 克加牛奶 200 毫升，中火煮 3 分钟，边煮边搅防粘底。", "煮到浓稠冒小泡关火，加蜂蜜 1 茶匙、一小撮盐搅匀，静置 2 分钟更稠。", "香蕉 1 根切片，一半压成泥拌进燕麦。", "盛碗，铺剩下香蕉片。", "撒坚果碎、蓝莓，淋一点蜂蜜。"], tips: ["加一小撮盐，燕麦的甜味会明显出来。", "想更快：燕麦+牛奶微波 2 分钟，中途搅一次。"] },
    "香蕉牛奶昔": { t: "5 分钟", s: ["香蕉 1 根（冷冻过的更绵密）切段。", "牛奶 250 毫升、香蕉、蜂蜜 1 茶匙放入搅拌杯。", "高速打 40 秒至无颗粒。", "想浓稠加 2 汤匙酸奶或燕麦；想冰加 3 块冰再打 20 秒。", "倒入杯中，撒少许肉桂粉或可可粉。"], tips: ["香蕉越熟越甜，表皮有黑点最好。", "别打太久，超过 1 分钟会起太多泡、变稀。"] },
    "草莓酸奶杯": { t: "5 分钟", s: ["草莓 8 颗洗净去蒂，一半切丁一半切片。", "杯底铺一层希腊酸奶 100 克。", "铺一层草莓丁和 2 汤匙燕麦脆/饼干碎。", "再铺一层酸奶，重复叠一层。", "顶部摆草莓片，淋蜂蜜、撒坚果碎，冷藏 10 分钟风味更好。"], tips: ["用浓稠的希腊酸奶，分层才不会塌。", "燕麦脆最后放，泡久了会软。"] },
    "鸡肉蔬菜沙拉": { t: "18 分钟", s: ["鸡胸 1 块（约 250 克）横片成两片，用盐 2 克、黑胡椒、橄榄油 1 茶匙腌 10 分钟。", "平底锅中火 1 茶匙油，鸡胸下锅煎 4 分钟一面不要动，翻面再煎 3 分钟。", "关火盖盖焖 2 分钟（利用余温到中心全熟），静置 3 分钟再切条。", "生菜、圣女果、黄瓜、紫甘蓝洗净切好，冰水泡 3 分钟沥干。", "调油醋汁拌匀蔬菜，铺上鸡肉条，撒坚果碎。"], tips: ["鸡胸煎完必须静置 3 分钟再切，汁水才不流干。", "厚薄不均就先用刀背拍平，受热才一致。"] },
    "咖喱鸡": { t: "35 分钟", s: ["鸡腿肉 400 克切块，用盐 2 克、料酒 1 汤匙腌 10 分钟；土豆 1 个、胡萝卜 1 根切滚刀，洋葱 1 个切块。", "锅中火 2 汤匙油，下洋葱炒 3 分钟至软出甜味。", "下鸡块中大火炒 3 分钟至表面变白定型。", "加土豆、胡萝卜炒 1 分钟，倒 500 毫升水没过食材，大火烧开转小火炖 15 分钟。", "关火放入咖喱块 2 块搅化，再开小火煮 5 分钟至浓稠（边煮边搅防糊底）。"], tips: ["咖喱块要关火后再放，沸腾时下容易结块。", "土豆切好泡水，去淀粉汤不浑。"] },
    "可乐鸡翅": { t: "30 分钟", s: ["鸡翅中 10 个两面各划两刀，冷水下锅加姜 3 片、料酒 1 汤匙，大火煮开撇沫再煮 2 分钟，捞出擦干。", "锅中火 1 汤匙油，下姜片爆香，鸡翅皮朝下铺平煎 2 分钟定型，翻面再煎 2 分钟至两面金黄。", "沿锅边淋料酒 1 汤匙，加生抽 2 汤匙、老抽半汤匙，翻炒 30 秒上色。", "倒入可乐 330 毫升（没过鸡翅 2/3），大火烧开转中小火加盖焖 12 分钟。", "开盖转中火收汁 3—5 分钟，边收边翻，汁浓挂勺就关火，撒白芝麻。"], tips: ["焯完一定擦干，否则下锅溅油。", "收汁用中火，大火会把糖烧成苦焦。"] },
    "宫保鸡丁": { t: "20 分钟", s: ["鸡腿肉 300 克切 1.5 厘米丁，加生抽 1 汤匙、料酒 1 汤匙、淀粉 1 茶匙抓匀腌 15 分钟。", "调碗汁：生抽 1 汤匙 + 香醋 1.5 汤匙 + 糖 1 汤匙 + 淀粉 1 茶匙 + 水 4 汤匙。", "花生米 60 克冷油小火炸 3 分钟至微黄捞出（或直接用烤花生）。", "锅大火 2 汤匙油，下鸡丁摊开 30 秒再炒 1 分钟至变白，盛出。", "下干辣椒 8 个、花椒 1 茶匙小火炒 20 秒出香，加葱段、姜蒜炒 20 秒，倒回鸡丁和碗汁，大火炒 40 秒收汁，最后放花生。"], tips: ["花生最后放，早了就不脆。", "糖醋约 1:1.5，是宫保的糊辣荔枝味。"] },
    "香菇滑鸡": { t: "25 分钟", s: ["鸡腿肉 400 克切块，加生抽 1 汤匙、蚝油 1 汤匙、料酒 1 汤匙、淀粉 1 汤匙、姜丝抓匀腌 20 分钟。", "干香菇 6 朵提前用温水泡 30 分钟，挤干切半（泡菇水留着）。", "锅大火 1 汤匙油，下鸡块煎 2 分钟至表面微黄。", "加香菇炒 1 分钟，倒入泡菇水 100 毫升、生抽 1 茶匙，加盖小火焖 8 分钟。", "开盖中火收汁 2 分钟，撒葱段、淋几滴香油。"], tips: ["腌时加淀粉锁水，鸡肉才滑嫩不柴。", "泡菇水是鲜味来源，滤掉沉渣再用。"] },
    "番茄牛腩": { t: "90 分钟", s: ["牛腩 600 克切 3 厘米块，冷水下锅加姜 4 片、料酒 2 汤匙，大火煮开撇沫再煮 3 分钟，温水洗净。", "锅中火 2 汤匙油，下葱段、姜片、八角 2 个炒 30 秒，倒入牛腩中大火翻炒 4 分钟至表面微焦。", "加生抽 2 汤匙、老抽 1 茶匙炒 30 秒，倒入没过肉的开水 1200 毫升，大火烧开转小火炖 60 分钟。", "番茄 3 个烫皮切块，另起锅 1 汤匙油中火炒 5 分钟至出浓红汤。", "把番茄糊倒进牛腩锅，再炖 20 分钟至筷子能扎透，加盐 5 克、糖 2 克调味，大火收汁 3 分钟。"], tips: ["番茄分两次放（炖番茄+炒番茄糊），香味更厚。", "炖的时候水一次加足，中途加水会救不回汤味。"] },
    "清炖萝卜牛腩": { t: "80 分钟", s: ["牛腩 600 克切块，冷水下锅焯 4 分钟撇沫，温水洗净。", "砂锅放牛腩、姜 5 片、葱 2 段、八角 1 个、花椒 1 茶匙、料酒 2 汤匙，倒 1500 毫升开水。", "大火烧开转最小火，加盖炖 50 分钟（保持微微冒泡，别大滚）。", "白萝卜 1 根切滚刀块下锅，再炖 20 分钟至萝卜透明。", "加盐 6 克、白胡椒 1 茶匙，撒香菜，关火焖 5 分钟再盛。"], tips: ["全程最小火，汤才清；大火滚会浑汤发腥。", "盐最后放，早放肉不容易烂。"] },
    "冬瓜排骨汤": { t: "60 分钟", s: ["排骨 500 克冷水下锅，加姜 3 片、料酒 1 汤匙，大火煮开撇净沫再煮 3 分钟捞出洗净。", "砂锅放排骨、姜 4 片、葱 1 段，倒 1500 毫升开水，大火烧开。", "转小火加盖炖 35 分钟，汤色变白。", "冬瓜 400 克去皮切厚片下锅，再炖 12 分钟至透明。", "加盐 5 克、白胡椒少许，撒葱花，关火焖 3 分钟。"], tips: ["排骨冷水下锅才能逼出血水。", "冬瓜后放，炖久了会化在汤里。"] },
    "回锅肉": { t: "25 分钟", s: ["五花肉 400 克整块冷水下锅，加姜 3 片、料酒、花椒 10 粒，中火煮 18 分钟至筷子能扎透。", "捞出放凉（或冰水泡 5 分钟）后切 2 毫米薄片。", "青蒜 2 根斜切段（白绿分开），锅中火烧热不放油，下肉片煸 3 分钟至出油卷边（灯盏窝）。", "把肉推到一边，用锅内油下豆瓣酱 1.5 汤匙炒 1 分钟出红油，加甜面酱 1 茶匙、豆豉 1 茶匙炒匀。", "加青蒜白炒 30 秒，淋生抽 1 茶匙、糖半茶匙，最后下青蒜叶大火炒 20 秒出锅。"], tips: ["肉煮到七分熟就行，全熟切片易碎。", "煸出油卷边才香，别急着下酱。"] },
    "蒜泥白肉": { t: "25 分钟", s: ["五花肉或后腿肉 400 克冷水下锅，加姜 3 片、葱 1 段、料酒 2 汤匙、花椒 10 粒，中火煮 20 分钟。", "关火后让肉在汤里泡 10 分钟再捞，肉质更嫩，放凉切薄片。", "调蒜泥汁：蒜末 4 瓣 + 生抽 2 汤匙 + 香醋 1 汤匙 + 糖 1 茶匙 + 辣椒油 2 汤匙 + 花椒粉少许 + 肉汤 2 汤匙。", "黄瓜 1 根切薄片垫盘底，肉片叠放其上。", "淋满蒜泥汁，静置 5 分钟入味，撒葱花。"], tips: ["肉片越薄越好，微冻 20 分钟更好切。", "蒜泥现捣最香，捣时加一小撮盐。"] },
    "孜然羊肉": { t: "18 分钟", s: ["羊腿肉 350 克切薄片，加生抽 1 汤匙、料酒 1 汤匙、淀粉 1 茶匙、孜然粉 1 茶匙抓匀腌 15 分钟。", "洋葱半个切丝，香菜切段，干辣椒 3 个剪段。", "锅大火烧到冒烟，倒 2.5 汤匙油，羊肉下锅摊平 30 秒后快速划散，炒 1 分钟至变色盛出。", "锅中火下洋葱炒 1 分钟、干辣椒炒 20 秒。", "倒回羊肉，加孜然粒 1 汤匙、辣椒粉 1 茶匙、盐 2 克，大火翻炒 40 秒，撒香菜出锅。"], tips: ["羊肉要大火快炒，全程不超过 2 分钟，久了发柴。", "孜然粒最后放，香味才冲。"] },
    "红烧肉": { t: "70 分钟", s: ["五花肉 500 克切 3 厘米见方，冷水下锅加姜 3 片、料酒 2 汤匙，水开后再煮 3 分钟，捞出用温水洗净擦干。", "锅中火 1 汤匙油，下冰糖 25 克小火炒 4 分钟，化开后变枣红色冒小泡（别炒到发黑）。", "立刻倒入肉块翻炒 2 分钟裹上糖色，加姜片、葱段、八角 2 个、桂皮 1 小块炒 1 分钟出香。", "加生抽 2 汤匙、老抽 1 汤匙、料酒 2 汤匙炒匀，倒开水没过肉，大火烧开转最小火加盖炖 45 分钟。", "开盖中大火收汁 5 分钟，边收边翻，汁浓亮红裹住肉就关火。"], tips: ["炒糖色宁浅勿深，发黑就苦，得重做。", "中途别加冷水，肉会紧缩变硬。"] },
    "香肠土豆焖饭": { t: "35 分钟", s: ["大米 300 克淘洗后沥干；香肠 2 根切薄片，土豆 1 个切 1.5 厘米丁。", "锅中火 1 汤匙油，下土豆丁煎 3 分钟至边缘金黄，加香肠片炒 1 分钟出油。", "电饭锅放米，加水比平时少一成（约 1:1.1），因为土豆会出水。", "铺上土豆香肠，加生抽 1 汤匙、盐 2 克，启动标准煮饭（约 25 分钟）。", "跳闸后别开盖，焖 8 分钟再拌匀，撒葱花。"], tips: ["水要比平时少，否则饭会烂。", "焖 8 分钟是让米粒吸匀水汽，口感才松。"] },
    "蛋炒饭": { t: "10 分钟", s: ["隔夜冷饭 300 克用手抓散，加 1 茶匙油拌开（粒粒分明）；鸡蛋 2 个打散。", "锅大火烧到微微冒烟，倒 2 汤匙油，倒入蛋液炒 20 秒成碎块盛出一半。", "同一锅下米饭，中大火用铲背压散翻炒 2 分钟至米粒跳动。", "加盐 2 克、白胡椒，倒回鸡蛋炒 30 秒，沿锅边淋生抽 1 茶匙。", "撒葱花、几滴香油，大火翻炒 20 秒出锅。"], tips: ["必须用冷饭，热饭会粘成坨。", "锅要够热再下饭，饭才香不粘。"] },
    "蔬菜蛋花汤": { t: "10 分钟", s: ["番茄 1 个切小块，菠菜或青菜 100 克洗净切段，鸡蛋 1 个打散。", "锅中火 1 茶匙油，下番茄炒 2 分钟出汁。", "倒 700 毫升热水，大火烧开煮 2 分钟。", "下青菜煮 1 分钟，加盐 3 克、白胡椒。", "关火，一手倒蛋液一手搅圈，形成蛋花，滴香油。"], tips: ["关火再倒蛋液，蛋花才细嫩不成块。", "番茄先炒出汁，汤才鲜不寡。"] },
    "罗宋汤": { t: "50 分钟", s: ["牛腩 300 克切块，冷水下锅焯 3 分钟撇沫洗净。", "锅中火 2 汤匙油，下洋葱 1 个炒 3 分钟，加番茄 3 个炒 5 分钟出浓汁。", "加牛腩、1000 毫升热水，大火烧开转小火炖 30 分钟。", "下土豆 1 个、胡萝卜 1 根、卷心菜 200 克，再炖 15 分钟。", "加番茄酱 2 汤匙、盐 5 克、糖 3 克、黑胡椒，煮 3 分钟，出锅前撒欧芹。"], tips: ["番茄要炒到完全成糊，汤才红亮浓稠。", "卷心菜最后放，保留脆甜。"] },
    "南瓜浓汤": { t: "25 分钟", s: ["南瓜 500 克去皮切 2 厘米块，洋葱半个切丝。", "锅中火 1 汤匙黄油，下洋葱炒 3 分钟至透明。", "加南瓜块炒 2 分钟，倒 500 毫升水或高汤，大火烧开转小火煮 15 分钟至南瓜一压就散。", "稍放凉，用搅拌机打 40 秒至顺滑（或手持棒打）。", "倒回锅，加淡奶油 100 毫升、盐 3 克、黑胡椒，小火加热 3 分钟（别煮沸）。"], tips: ["南瓜煮到能一压就烂，打出来才细腻。", "奶油最后加、别煮沸，否则会分层。"] },
    "凉拌黄瓜": { t: "8 分钟", s: ["黄瓜 2 根洗净，用刀背拍裂后切 3 厘米段。", "加盐 3 克抓匀腌 8 分钟，倒掉渗出的水（这步决定脆度）。", "调汁：蒜末 3 瓣 + 生抽 1.5 汤匙 + 香醋 1 汤匙 + 糖 1 茶匙 + 香油 1 茶匙 + 辣椒油 1 茶匙。", "汁倒入黄瓜拌匀。", "冷藏 10 分钟更爽口，撒芝麻和香菜。"], tips: ["拍裂比切片更挂汁入味。", "腌出水一定倒掉，不然越放越稀。"] },
    "蒜蓉菠菜": { t: "8 分钟", s: ["菠菜 400 克洗净切段，大蒜 4 瓣切末。", "锅中水大火烧开，加半勺盐、几滴油，菠菜下锅烫 20 秒立刻捞出（去草酸）。", "捞出后轻轻挤掉水，别挤太干。", "锅中火 1.5 汤匙油，下蒜末炒 20 秒出香。", "倒入菠菜大火翻炒 30 秒，加盐 2 克炒匀出锅。"], tips: ["菠菜必须焯水去草酸，否则涩口。", "焯完再炒，全程不超过 1 分钟。"] },
    "清炒芦笋": { t: "8 分钟", s: ["芦笋 300 克洗净，切掉根部老硬段，用削皮刀削去下半段粗皮，切 4 厘米段。", "锅中水烧开加半勺盐，芦笋焯 45 秒捞出过凉水。", "锅中火 1.5 汤匙油，下蒜片 2 瓣炒 20 秒。", "倒入芦笋大火翻炒 1 分钟。", "加盐 2 克、白胡椒，淋几滴香油出锅。"], tips: ["削掉下半段粗皮，口感才嫩不塞牙。", "焯 45 秒定色，炒久了发黄软塌。"] },
    "烤蔬菜拼盘": { t: "35 分钟", s: ["南瓜、彩椒、西葫芦、口蘑、洋葱各 200 克切 2 厘米块，大小尽量一致。", "全部放盆里，加橄榄油 2 汤匙、盐 4 克、黑胡椒、干罗勒，抓匀。", "烤箱 200℃ 预热 10 分钟。", "蔬菜平铺烤盘（别堆叠），中层烤 20 分钟。", "取出翻面，再烤 8 分钟至边缘焦黄，出炉挤柠檬汁。"], tips: ["平铺不叠，才有焦香不是焖熟。", "根茎类切小一点，和叶菜同时熟。"] },
    "鹰嘴豆沙拉": { t: "12 分钟", s: ["熟鹰嘴豆 250 克冲洗沥干（罐头要洗掉泡沫）。", "黄瓜半根、圣女果 8 颗、红洋葱 1/4 个切丁，欧芹切碎。", "调汁：橄榄油 2 汤匙 + 柠檬汁 1.5 汤匙 + 盐 2 克 + 黑胡椒 + 孜然粉半茶匙。", "所有材料放碗里，淋汁拌匀。", "冷藏 15 分钟让味道融合，撒菲达芝士或芝麻。"], tips: ["罐头鹰嘴豆要冲洗，去掉表面泡沫才不涩。", "提前拌好冷藏更入味，可放 2 天。"] },
    "蒜香烤鸡腿": { t: "45 分钟", s: ["琵琶腿 4 个（约 600 克）用叉子在肉厚处扎几下。", "腌料：蒜末 5 瓣 + 生抽 2 汤匙 + 蚝油 1 汤匙 + 料酒 1 汤匙 + 蜂蜜 1 汤匙 + 黑胡椒 + 盐 2 克，抓匀腌 30 分钟（隔夜更好）。", "烤箱 200℃ 预热 10 分钟。", "鸡腿放烤架，中层烤 20 分钟。", "翻面刷一层蜂蜜腌汁，再烤 12 分钟至表皮焦亮、叉子扎不出血水。"], tips: ["扎孔和腌 30 分钟是入味关键，腌短了只有表面咸。", "蜂蜜最后刷，早刷会烤黑。"] },
    "葱烧带鱼": { t: "30 分钟", s: ["带鱼 2 条（约 600 克）去头去内脏，刮净腹内黑膜，切 6 厘米段，用料酒 2 汤匙、盐 2 克、姜片腌 15 分钟。", "用厨房纸把鱼段彻底吸干，薄薄拍一层玉米淀粉，抖掉多余粉。", "平底锅中火烧 3 汤匙油，鱼段下锅后 3 分钟不要动，一面定型金黄再翻面煎 2 分钟，盛出。", "锅中留 2 汤匙油，下大葱段（2 根切 6 厘米）中小火煎 3 分钟至两面金黄出香，加姜 3 片、蒜 3 瓣炒 30 秒。", "加生抽 2 汤匙、香醋 1 汤匙、糖 1 茶匙、热水 200 毫升烧开，放回带鱼铺上葱段，加盖中小火焖 8 分钟。", "开盖大火收汁 3 分钟至浓稠挂勺，淋几滴香油出锅。"], tips: ["带鱼必须吸干水再煎，否则粘锅破皮。", "下锅后 3 分钟别翻动，等它自己脱锅。", "银白色的鱼皮别刮掉，那层是营养的「银脂」，不腥。"] },
    "红烧带鱼": { t: "35 分钟", s: ["带鱼 2 条（约 600 克）处理干净切段，用料酒、盐、姜片腌 15 分钟，吸干水拍薄淀粉。", "平底锅中火 3 汤匙油，鱼段两面各煎 2—3 分钟至金黄定型，盛出。", "锅中火下姜蒜、八角 1 个炒 30 秒，加生抽 2 汤匙、老抽半汤匙、糖 1 茶匙、料酒 1 汤匙、热水 250 毫升烧开。", "放回带鱼，小火焖 10 分钟（中途轻晃锅，别翻鱼）。", "大火收汁 3 分钟，汁浓时撒葱段，出锅。"], tips: ["焖的时候晃锅不翻鱼，鱼块才完整。", "老抽只为上色，半汤匙足够，多了发黑。"] },
    "香煎带鱼": { t: "20 分钟", s: ["带鱼 2 条（约 500 克）处理干净切 6 厘米段，用盐 3 克、料酒 2 汤匙、姜片、白胡椒腌 15 分钟。", "吸干表面水分，薄拍一层面粉或淀粉，静置 2 分钟回潮。", "平底锅中火烧 3 汤匙油，油热到筷子插入冒小泡。", "鱼段下锅，一面煎 3 分钟不要动，翻面再煎 2 分半至两面金黄酥脆。", "出锅放厨房纸上吸油，撒椒盐或挤柠檬。"], tips: ["水分吸不干就一定会粘锅破皮。", "油要够热（六成），温油下锅会吸油发软。"] },
    "糖醋带鱼": { t: "30 分钟", s: ["带鱼 2 条（约 600 克）处理干净切段，用盐、料酒、姜腌 15 分钟，吸干水拍薄淀粉。", "调糖醋汁：香醋 3 汤匙 + 白糖 3 汤匙 + 生抽 1 汤匙 + 番茄酱 1 汤匙 + 水 4 汤匙 + 淀粉 1 茶匙，搅匀。", "平底锅中火 3 汤匙油，鱼段两面各煎 2—3 分钟至金黄盛出。", "锅中留 1 汤匙油，下蒜末 2 瓣炒 20 秒，倒入糖醋汁小火煮 1 分钟至微稠冒泡。", "放入带鱼轻推裹汁 1 分钟，撒白芝麻出锅。"], tips: ["醋和糖 1:1，酸甜才平衡；尝了再调。", "汁先煮稠再放鱼，鱼不容易散。"] },
    "清蒸鲈鱼": { t: "20 分钟", s: ["鲈鱼 1 条约 500 克，去鳞去鳃去内脏，刮净腹内黑膜和贴骨血（腥味主要来源），洗净擦干。", "鱼身两侧各斜划 3 刀，抹少许盐和料酒，鱼肚塞姜片葱段，腌 10 分钟。", "盘底垫姜片和两根筷子把鱼架空，蒸锅水完全烧开、上汽后再放鱼。", "大火蒸 8 分钟，关火不开盖虚蒸 2 分钟（鱼每重 100 克加 1 分钟）。", "取出倒掉盘里的腥水，拣掉旧葱姜，铺新葱丝姜丝，淋蒸鱼豉油 2 汤匙。", "另起锅把 3 汤匙油烧到微微冒烟，浇在葱丝上激香即可。"], tips: ["必须水开上锅、全程大火，冷水蒸会腥。", "蒸好盘里的汤汁一定要倒掉，那是腥味来源。", "筷子能轻松扎透鱼背最厚处、无血水就是熟了，多蒸 1 分钟就柴。"] },
    "干煸豆角": { t: "20 分钟", s: ["豆角 400 克洗净掰 5 厘米段，一定要擦干水（带水下锅会爆油）。", "锅中火 3 汤匙油，豆角下锅煸 6 分钟，中途翻动，至表皮起皱发白发干，盛出。", "留 1 汤匙油，下肉末 80 克炒 2 分钟出油，加干辣椒 5 个、花椒 1 茶匙、蒜末炒 30 秒。", "倒回豆角，中大火翻炒 1 分钟。", "加盐 2 克、生抽 1 茶匙、少许糖炒匀出锅。"], tips: ["豆角必须彻底炒熟，半生的豆角含皂素会中毒。", "表皮起皱是煸到位的标志，至少 6 分钟。"] },
    "冬瓜虾皮汤": { t: "15 分钟", s: ["冬瓜 400 克去皮去瓤切 3 毫米薄片，虾皮 1 汤匙冲洗一下，姜 2 片。", "锅中火 1 茶匙油，下姜片、虾皮炒 30 秒出香。", "倒入 700 毫升热水，大火烧开。", "下冬瓜片煮 6—8 分钟至透明变软。", "加盐 2 克、白胡椒、几滴香油，撒葱花出锅。"], tips: ["虾皮先炒一下，汤才鲜不腥。", "冬瓜切薄片 6 分钟就熟，久了会烂。"] }
  };

  var RECIPES = [
    { n: "番茄炒蛋", t: "10 分钟", tg: "快手", e: [["番茄", 2], ["鸡蛋", 3], ["小葱", 1], ["糖", 1]], s: ["番茄去皮切块，鸡蛋加一小撮盐打散。", "热锅倒油，蛋液边缘凝固后推散盛出。", "锅留底油炒番茄，中火压出汁水，加糖调味。", "倒回鸡蛋翻匀，撒葱花出锅。"] },
    { n: "西红柿鸡蛋面", t: "15 分钟", tg: "主食", e: [["番茄", 2], ["鸡蛋", 2], ["面条", 1], ["小葱", 1]], s: ["番茄切块，鸡蛋打散备用。", "炒香番茄出沙，加水煮开成汤底。", "下面条煮至断生。", "淋入蛋液成蛋花，撒葱花。"] },
    { n: "蒜蓉西兰花", t: "8 分钟", tg: "清淡", e: [["西兰花", 1], ["大蒜", 5], ["橄榄油", 1], ["盐", 2]], s: ["西兰花掰小朵，淡盐水泡 5 分钟后冲净。", "沸水焯 60 秒，捞出过冷水。", "冷油下蒜末小火炒香。", "倒入西兰花大火翻炒，加盐出锅。"] },
    { n: "蚝油生菜", t: "7 分钟", tg: "快手", e: [["生菜", 1], ["大蒜", 3], ["蚝油", 1.5], ["橄榄油", 1]], s: ["生菜洗净沥干，掰大片。", "沸水焯 10 秒立刻捞出装盘。", "少油炒香蒜末，加蚝油和小半碗水煮开。", "淋在生菜上即可。"] },
    { n: "土豆炖牛肉", t: "70 分钟", tg: "炖菜", e: [["牛肉", 400], ["土豆", 2], ["胡萝卜", 1], ["洋葱", 1], ["生抽", 2], ["生姜", 2]], s: ["牛肉切块冷水下锅焯去血沫。", "少油炒香洋葱姜片，下牛肉煎到微焦。", "加酱油和热水，小火炖 40 分钟。", "放土豆胡萝卜再炖 20 分钟收汁。"] },
    { n: "黑椒牛柳", t: "20 分钟", tg: "快手", e: [["牛肉", 300], ["洋葱", 1], ["青椒", 1], ["黑胡椒", 2], ["生抽", 1]], s: ["牛肉逆纹切条，用酱油和黑胡椒腌 10 分钟。", "热锅大火快煎牛柳变色盛出。", "炒香洋葱青椒。", "倒回牛柳，再撒黑胡椒翻匀。"] },
    { n: "洋葱炒鸡蛋", t: "8 分钟", tg: "快手", e: [["洋葱", 1], ["鸡蛋", 3], ["盐", 2], ["橄榄油", 1]], s: ["洋葱切丝，鸡蛋打散。", "热油炒蛋至半凝固盛出。", "下洋葱炒到透明微甜。", "倒回鸡蛋，加盐翻匀。"] },
    { n: "青椒土豆丝", t: "10 分钟", tg: "快手", e: [["土豆", 2], ["青椒", 1], ["醋", 1], ["盐", 2], ["大蒜", 2]], s: ["土豆切细丝泡冷水去淀粉，沥干。", "热油爆香蒜末。", "下土豆丝大火快炒，沿锅边淋醋。", "加青椒丝和盐，炒 1 分钟出锅。"] },
    { n: "地三鲜", t: "18 分钟", tg: "家常", e: [["茄子", 1], ["土豆", 1], ["青椒", 1], ["大蒜", 3], ["生抽", 2]], s: ["茄子土豆切滚刀块，青椒切块。", "土豆先煎到金黄，茄子煎软。", "炒香蒜末，倒回所有材料。", "加酱油和少许糖收汁。"] },
    { n: "鱼香茄子", t: "20 分钟", tg: "家常", e: [["茄子", 2], ["大蒜", 3], ["生姜", 1], ["小葱", 1], ["醋", 1.5], ["糖", 1.5], ["生抽", 1]], s: ["茄子切条用盐腌 10 分钟挤干水分。", "煎至表面微焦盛出。", "炒香姜蒜末，加醋糖酱油调成鱼香汁。", "倒回茄子翻匀收汁，撒葱花。"] },
    { n: "麻婆豆腐", t: "15 分钟", tg: "下饭", e: [["豆腐", 1], ["猪肉", 100], ["辣椒酱", 1], ["大蒜", 2], ["花椒", 0], ["小葱", 1]], s: ["豆腐切块，淡盐水浸 5 分钟。", "炒散肉末出香，加蒜末和辣椒酱。", "加水煮开，下豆腐小火煮 5 分钟。", "勾薄芡，撒葱花出锅。"] },
    { n: "豆腐蘑菇汤", t: "15 分钟", tg: "汤", e: [["豆腐", 1], ["香菇", 150], ["小葱", 1], ["生姜", 2], ["盐", 3]], s: ["豆腐切块，蘑菇撕小朵。", "姜片爆香加清水烧开。", "下豆腐蘑菇小火煮 8 分钟。", "加盐，撒葱花。"] },
    { n: "家常豆腐", t: "15 分钟", tg: "家常", e: [["豆腐", 1], ["青椒", 1], ["大蒜", 2], ["生抽", 1.5], ["淀粉", 1]], s: ["豆腐切三角片，两面煎黄。", "炒香蒜末和青椒。", "加酱油和半碗水烧开。", "下豆腐烧 3 分钟，勾芡出锅。"] },
    { n: "虾仁滑蛋", t: "12 分钟", tg: "快手", e: [["虾", 200], ["鸡蛋", 3], ["小葱", 1], ["盐", 1], ["淀粉", 1]], s: ["虾去虾线，用盐和淀粉抓匀腌 5 分钟。", "虾仁滑炒变色盛出。", "蛋液加少许水打散，小火倒入。", "半凝固时放虾仁，轻推成块撒葱花。"] },
    { n: "黄油蒜香虾", t: "12 分钟", tg: "快手", e: [["虾", 300], ["黄油", 20], ["大蒜", 6], ["柠檬", 1], ["欧芹", 1]], s: ["虾开背去虾线，吸干水分。", "黄油化开下蒜末炒到微黄。", "中火两面各煎 90 秒。", "挤柠檬汁撒欧芹碎。"] },
    { n: "白灼虾", t: "10 分钟", tg: "清淡", e: [["虾", 400], ["生姜", 3], ["小葱", 2], ["生抽", 2]], s: ["水加姜片葱段烧开。", "下虾煮到变红卷曲，约 2 分钟。", "捞出过冰水保持弹嫩。", "用酱油、姜末、葱油调蘸料。"] },
    { n: "柠檬蜂蜜三文鱼", t: "20 分钟", tg: "高蛋白", e: [["三文鱼", 250], ["柠檬", 1], ["蜂蜜", 1], ["橄榄油", 1], ["黑胡椒", 1]], s: ["三文鱼用盐和黑胡椒腌 10 分钟。", "蜂蜜加柠檬汁调成酱汁。", "少油鱼皮朝下煎 3 分钟，翻面 2 分钟。", "淋酱汁收汁即成。"] },
    { n: "香煎鳕鱼", t: "15 分钟", tg: "高蛋白", e: [["鳕鱼", 250], ["黄油", 10], ["柠檬", 1], ["黑胡椒", 1], ["面粉", 30]], s: ["鳕鱼吸干水分，薄薄拍一层面粉。", "中火两面煎至金黄。", "下黄油淋在鱼身上。", "撒黑胡椒，配柠檬角。"] },
    { n: "金枪鱼沙拉", t: "10 分钟", tg: "轻食", e: [["金枪鱼", 120], ["生菜", 1], ["番茄", 1], ["黄瓜", 1], ["橄榄油", 2]], s: ["生菜手撕铺底。", "番茄黄瓜切块放上。", "铺金枪鱼。", "淋橄榄油、柠檬汁和盐拌匀。"] },
    { n: "牛油果沙拉", t: "10 分钟", tg: "轻食", e: [["牛油果", 1], ["番茄", 1], ["生菜", 1], ["柠檬", 1], ["橄榄油", 1.5]], s: ["生菜洗净沥干撕块。", "牛油果番茄切块。", "橄榄油柠檬汁盐调成油醋汁。", "淋上拌匀现做现吃。"] },
    { n: "培根奶油意面", t: "18 分钟", tg: "主食", e: [["意面", 100], ["培根", 3], ["大蒜", 2], ["奶油", 150], ["帕玛森", 20]], s: ["沸水加盐煮意面，比包装少 1 分钟。", "培根煸出油，加蒜末炒香。", "倒奶油小火煮 2 分钟，撒帕玛森。", "下意面翻拌到挂汁。"] },
    { n: "番茄肉酱意面", t: "30 分钟", tg: "主食", e: [["意面", 150], ["猪肉", 200], ["番茄", 2], ["洋葱", 1], ["大蒜", 2], ["番茄酱", 0]], s: ["番茄划十字烫皮切碎。", "炒香洋葱蒜末，下肉末炒散。", "加番茄碎小火熬 15 分钟成酱。", "拌入煮好的意面。"] },
    { n: "奶油蘑菇意面", t: "20 分钟", tg: "主食", e: [["意面", 100], ["蘑菇", 200], ["奶油", 150], ["大蒜", 2], ["帕玛森", 20]], s: ["蘑菇切片用黄油煎到微焦。", "加蒜末炒香。", "倒奶油小火煮开。", "拌入意面，撒帕玛森。"] },
    { n: "蒜香橄榄油意面", t: "15 分钟", tg: "素食", e: [["意面", 100], ["大蒜", 5], ["橄榄油", 3], ["辣椒", 1], ["欧芹", 1]], s: ["意面煮到断生，留一碗面水。", "冷油下蒜片和辣椒小火煸香。", "倒入意面和少量面水。", "撒欧芹碎翻拌均匀。"] },
    { n: "鸡蛋三明治", t: "10 分钟", tg: "早餐", e: [["面包", 4], ["鸡蛋", 2], ["蛋黄酱", 2], ["生菜", 1], ["黑胡椒", 1]], s: ["鸡蛋煮熟压碎。", "加蛋黄酱和黑胡椒拌成蛋沙拉。", "面包烤到微脆。", "夹入蛋沙拉和生菜。"] },
    { n: "培根鸡蛋早餐", t: "10 分钟", tg: "早餐", e: [["培根", 2], ["鸡蛋", 2], ["面包", 2], ["番茄", 1], ["黄油", 10]], s: ["培根小火煎到出油脆香。", "用锅里余油煎蛋。", "面包抹黄油烤脆。", "配番茄片装盘。"] },
    { n: "燕麦香蕉早餐碗", t: "8 分钟", tg: "早餐", e: [["燕麦", 50], ["牛奶", 200], ["香蕉", 1], ["蜂蜜", 1], ["核桃", 15]], s: ["燕麦加牛奶小火煮 3 分钟。", "煮到浓稠关火。", "铺香蕉片。", "淋蜂蜜撒核桃碎。"] },
    { n: "香蕉牛奶昔", t: "5 分钟", tg: "饮品", e: [["香蕉", 1], ["牛奶", 250], ["蜂蜜", 1]], s: ["香蕉切段。", "和牛奶蜂蜜一起倒入搅拌机。", "打 30 秒至顺滑。", "倒杯即可。"] },
    { n: "草莓酸奶杯", t: "5 分钟", tg: "甜品", e: [["草莓", 200], ["酸奶", 2], ["燕麦", 30], ["蜂蜜", 1]], s: ["草莓一半压成泥一半切丁。", "杯底铺草莓泥。", "叠入酸奶和燕麦。", "顶部放草莓丁淋蜂蜜。"] },
    { n: "鸡肉蔬菜沙拉", t: "18 分钟", tg: "轻食", e: [["鸡胸肉", 200], ["生菜", 1], ["番茄", 1], ["黄瓜", 1], ["橄榄油", 1]], s: ["鸡胸用盐和黑胡椒腌 10 分钟。", "中火两面各煎 4 分钟，静置切片。", "蔬菜切好铺盘。", "摆上鸡肉，淋油醋汁。"] },
    { n: "咖喱鸡", t: "35 分钟", tg: "下饭", e: [["鸡腿", 400], ["土豆", 1], ["胡萝卜", 1], ["洋葱", 1], ["椰奶", 200]], s: ["鸡腿切块煎上色。", "炒香洋葱。", "加土豆胡萝卜和椰奶，加水没过。", "小火煮 20 分钟到浓稠。"] },
    { n: "可乐鸡翅", t: "30 分钟", tg: "下饭", e: [["鸡翅", 400], ["生抽", 2], ["生姜", 3], ["糖", 1]], s: ["鸡翅两面划刀，焯水去腥。", "少油煎到两面金黄。", "加酱油姜片和糖。", "加热水没过，中火收到浓稠挂汁。"] },
    { n: "宫保鸡丁", t: "20 分钟", tg: "下饭", e: [["鸡腿", 300], ["花生", 50], ["辣椒", 8], ["大蒜", 2], ["生抽", 1], ["醋", 1.5]], s: ["鸡丁用酱油淀粉腌 10 分钟。", "小火炒香辣椒蒜末。", "下鸡丁大火炒到变色。", "加醋糖调汁，撒花生翻匀。"] },
    { n: "香菇滑鸡", t: "25 分钟", tg: "家常", e: [["鸡腿", 400], ["香菇", 100], ["生姜", 3], ["生抽", 1], ["淀粉", 1]], s: ["鸡块用酱油淀粉腌 15 分钟。", "香菇泡软切块。", "全部铺盘放姜片。", "上锅大火蒸 15 分钟。"] },
    { n: "番茄牛腩", t: "90 分钟", tg: "炖菜", e: [["牛腩", 600], ["番茄", 3], ["洋葱", 1], ["生姜", 3], ["盐", 5]], s: ["牛腩切块焯水洗净。", "炒香洋葱姜片。", "加牛腩和一半番茄炒出汁。", "加热水炖 70 分钟，最后放剩余番茄。"] },
    { n: "清炖萝卜牛腩", t: "80 分钟", tg: "汤", e: [["牛腩", 600], ["白萝卜", 1], ["生姜", 3], ["小葱", 2], ["盐", 6]], s: ["牛腩冷水下锅焯净。", "加姜片和足量清水小火炖 60 分钟。", "放萝卜块再炖 20 分钟。", "加盐，撒葱花。"] },
    { n: "冬瓜排骨汤", t: "60 分钟", tg: "汤", e: [["猪肉", 400], ["冬瓜", 400], ["生姜", 3], ["小葱", 2], ["盐", 5]], s: ["排骨焯水冲净。", "加姜片清水小火炖 40 分钟。", "放冬瓜块炖 15 分钟。", "加盐撒葱花。"] },
    { n: "回锅肉", t: "25 分钟", tg: "下饭", e: [["五花肉", 400], ["青椒", 1], ["大蒜", 3], ["生抽", 1], ["辣椒酱", 1]], s: ["五花肉整块煮 15 分钟，切薄片。", "干锅煸到微卷出油。", "加蒜末和辣椒酱炒香。", "放青椒和酱油翻匀。"] },
    { n: "蒜泥白肉", t: "25 分钟", tg: "家常", e: [["五花肉", 300], ["大蒜", 5], ["生抽", 2], ["醋", 1], ["辣椒", 1]], s: ["猪肉整块冷水下锅，加姜葱煮 20 分钟。", "捞出放凉切薄片。", "蒜捣成泥，加酱油醋调汁。", "淋在肉片上。"] },
    { n: "孜然羊肉", t: "18 分钟", tg: "快手", e: [["羊肉", 300], ["洋葱", 1], ["孜然", 2], ["辣椒", 3], ["盐", 2]], s: ["羊肉切薄片。", "大火热锅快炒到变色。", "下洋葱丝炒软。", "撒孜然辣椒和盐，翻匀出锅。"] },
    { n: "红烧肉", t: "70 分钟", tg: "炖菜", e: [["五花肉", 500], ["生姜", 3], ["生抽", 2], ["冰糖", 25], ["八角", 2]], s: ["五花肉切块焯水。", "少油炒糖到枣红色。", "下肉块裹糖色，加酱油姜片八角。", "加热水小火炖 50 分钟收汁。"] },
    { n: "香肠土豆焖饭", t: "35 分钟", tg: "主食", e: [["大米", 2], ["香肠", 2], ["土豆", 1], ["胡萝卜", 1], ["生抽", 1]], s: ["大米淘净加水，比平时略少。", "香肠土豆胡萝卜切丁铺上。", "淋酱油，按下煮饭键。", "跳闸后焖 10 分钟拌匀。"] },
    { n: "蛋炒饭", t: "10 分钟", tg: "主食", e: [["米饭", 2], ["鸡蛋", 2], ["小葱", 1], ["豌豆", 50], ["盐", 2]], s: ["隔夜米饭打散。", "热油炒蛋盛出。", "下米饭大火炒到粒粒分明。", "加蛋和豌豆，加盐撒葱花。"] },
    { n: "蔬菜蛋花汤", t: "10 分钟", tg: "汤", e: [["鸡蛋", 1], ["番茄", 1], ["小葱", 1], ["盐", 3], ["淀粉", 1]], s: ["番茄切小块炒出汁。", "加水烧开。", "淋入蛋液成蛋花。", "勾薄芡，加盐撒葱花。"] },
    { n: "罗宋汤", t: "50 分钟", tg: "汤", e: [["牛腩", 300], ["番茄", 3], ["土豆", 1], ["卷心菜", 1], ["洋葱", 1], ["胡萝卜", 1]], s: ["牛肉切块焯水。", "炒香洋葱，加番茄炒出沙。", "加牛肉和清水炖 30 分钟。", "放土豆卷心菜胡萝卜再炖 15 分钟。"] },
    { n: "南瓜浓汤", t: "25 分钟", tg: "汤", e: [["南瓜", 500], ["洋葱", 1], ["牛奶", 200], ["黄油", 15], ["盐", 3]], s: ["南瓜去皮切块蒸 15 分钟。", "黄油炒香洋葱。", "南瓜洋葱加牛奶打成泥。", "回锅小火煮开，加盐调味。"] },
    { n: "凉拌黄瓜", t: "8 分钟", tg: "凉菜", e: [["黄瓜", 2], ["大蒜", 3], ["醋", 1], ["生抽", 1.5], ["芝麻", 5]], s: ["黄瓜拍裂切段，加盐腌 5 分钟。", "倒掉腌出的水。", "蒜末加醋酱油调汁。", "淋上撒芝麻拌匀。"] },
    { n: "蒜蓉菠菜", t: "8 分钟", tg: "清淡", e: [["菠菜", 1], ["大蒜", 4], ["盐", 2], ["橄榄油", 1]], s: ["菠菜洗净焯水 20 秒，挤干切段。", "热油炒香蒜末。", "下菠菜大火快炒。", "加盐翻匀出锅。"] },
    { n: "清炒芦笋", t: "8 分钟", tg: "清淡", e: [["芦笋", 1], ["大蒜", 2], ["橄榄油", 1], ["盐", 2]], s: ["芦笋去掉老根，斜切段。", "沸水焯 30 秒。", "热油炒香蒜末。", "下芦笋快炒，加盐。"] },
    { n: "烤蔬菜拼盘", t: "35 分钟", tg: "素食", e: [["西葫芦", 1], ["茄子", 1], ["青椒", 1], ["番茄", 2], ["橄榄油", 2], ["盐", 4]], s: ["所有蔬菜切厚片。", "拌橄榄油、盐和黑胡椒。", "平铺烤盘 200℃ 烤 25 分钟。", "中途翻面一次。"] },
    { n: "鹰嘴豆沙拉", t: "12 分钟", tg: "轻食", e: [["鹰嘴豆", 250], ["番茄", 1], ["黄瓜", 1], ["香菜", 1], ["柠檬", 1], ["橄榄油", 2]], s: ["鹰嘴豆煮熟沥干。", "番茄黄瓜切丁。", "柠檬汁橄榄油盐调汁。", "全部拌匀撒香菜。"] },
    { n: "蒜香烤鸡腿", t: "45 分钟", tg: "烤箱", e: [["鸡腿", 2], ["大蒜", 4], ["迷迭香", 2], ["橄榄油", 2], ["盐", 2], ["柠檬", 1]], s: ["鸡腿用盐、蒜末、迷迭香腌 20 分钟。", "表面刷橄榄油。", "200℃ 烤 30 分钟。", "出炉挤柠檬汁。"] },
    { n: "葱烧带鱼", t: "30 分钟", tg: "家常", e: [["带鱼", 2], ["大葱", 2], ["生姜", 3], ["大蒜", 3], ["生抽", 2], ["料酒", 2], ["醋", 1], ["糖", 1]], s: ["带鱼去头去内脏，刮掉腹内黑膜，剪成 6 厘米段。", "用料酒和姜片腌 10 分钟去腥，再用厨房纸彻底吸干水分。", "薄薄拍一层淀粉，中火煎到两面金黄定型，先盛出。", "锅留底油，下姜蒜和一半葱段炒香，加酱油、醋、糖和小半碗水烧开。", "放回带鱼，铺上剩下的葱段，小火焖 8 分钟。", "大火收汁到浓稠挂身，出锅前淋一点明油。"] },
    { n: "红烧带鱼", t: "35 分钟", tg: "下饭", e: [["带鱼", 2], ["生姜", 3], ["大蒜", 3], ["生抽", 2], ["老抽", 1], ["糖", 1], ["料酒", 1]], s: ["带鱼处理干净切段，加料酒姜片腌 10 分钟。", "吸干水分拍淀粉，煎至两面金黄。", "另起锅炒香姜蒜，加酱油、老抽、糖和水烧开。", "放入带鱼小火焖 10 分钟，收汁出锅。"] },
    { n: "香煎带鱼", t: "20 分钟", tg: "快手", e: [["带鱼", 2], ["盐", 3], ["料酒", 2], ["生姜", 2], ["淀粉", 30]], s: ["带鱼切段，加盐、料酒、姜丝腌 15 分钟。", "去掉姜丝，用厨房纸吸到表面发干。", "两面薄薄拍一层淀粉。", "中火每面煎 3 分钟，不要频繁翻动。"] },
    { n: "糖醋带鱼", t: "30 分钟", tg: "下饭", e: [["带鱼", 2], ["醋", 3], ["白糖", 2], ["生抽", 1], ["生姜", 2], ["淀粉", 30]], s: ["带鱼切段腌制后拍淀粉，煎至金黄。", "调糖醋汁：醋、糖、酱油和少许水。", "姜末爆香，倒入糖醋汁烧开。", "放带鱼焖 5 分钟，收汁到发亮。"] },
    { n: "清蒸鲈鱼", t: "20 分钟", tg: "清淡", e: [["鲈鱼", 1], ["生姜", 4], ["小葱", 3], ["料酒", 2], ["酱油", 2]], s: ["鲈鱼两侧各划两刀，用料酒和姜片腌 10 分钟。", "盘底垫姜片葱段，鱼腹也塞一些。", "水开后大火蒸 8 分钟，关火焖 2 分钟。", "倒掉腥水，铺葱丝淋热油和蒸鱼酱油。"] },
    { n: "干煸豆角", t: "20 分钟", tg: "下饭", e: [["豆角", 400], ["猪肉", 100], ["干辣椒", 5], ["大蒜", 3], ["生抽", 1]], s: ["豆角去筋掰段，下油锅中火煸到表皮起皱。", "盛出控油。", "炒散肉末，下蒜末和干辣椒炒香。", "倒回豆角加酱油翻匀。"] },
    { n: "冬瓜虾皮汤", t: "15 分钟", tg: "汤", e: [["冬瓜", 400], ["虾", 50], ["小葱", 1], ["生姜", 2], ["盐", 2]], s: ["冬瓜去皮切片。", "姜片爆香加水烧开。", "下冬瓜煮 8 分钟到透明。", "加虾皮煮 2 分钟，加盐撒葱花。"] }
  ];

  /* ═══════════════════════════════════════════════════════════
     3. 状态与持久化
     ═══════════════════════════════════════════════════════════ */
  var KEY = "xiaozao.v2";
  var state = {
    pantry: [],      // [{id,name,qty,unit,en,cat}]
    shopping: [],    // [{id,name,done,from}]
    photos: {},      // name -> 真实照片 URL（可选增强，不是必需）
    custom: [],      // 导入的菜谱 [{id,n,t,tg,e:[],s:[],from}]
    filter: "all",
    q: ""            // 菜谱页搜索词（按菜名）
  };

  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  function save() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({
        pantry: state.pantry, shopping: state.shopping, photos: state.photos,
        custom: state.custom
      }));
    } catch (e) { /* 隐私模式忽略 */ }
  }

  /* 把详细做法合并进菜谱库：时间取总时长，步骤替换为带分量的详细版，并补上小贴士 */
  (function () {
    RECIPES.forEach(function (r) {
      var d = DETAIL[r.n];
      if (!d) return;
      r.t = d.t;
      r.s = d.s;
      r.tips = d.tips || [];
    });
  })();

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (d && Array.isArray(d.pantry)) state.pantry = d.pantry;
      if (d && Array.isArray(d.shopping)) state.shopping = d.shopping;
      if (d && d.photos) state.photos = d.photos;
      if (d && Array.isArray(d.custom)) state.custom = d.custom;
    } catch (e) { /* 忽略 */ }
  }

  function uid() { return Math.random().toString(36).slice(2, 9); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ═══════════════════════════════════════════════════════════
     4. 图片：第一层「必然渲染」的本地生成插图
        每个食材立刻有一条 data-URI SVG，不依赖网络
     ═══════════════════════════════════════════════════════════ */
  var PALETTE = {
    蔬菜: ["#e8f0dd", "#8fae6e"], 蛋奶: ["#fdf1da", "#e0b463"],
    肉禽: ["#f8e3dd", "#c4785f"], 水产: ["#e2eef3", "#6f9cb3"],
    主食: ["#f6eddc", "#c6a367"], 调味: ["#f3ece0", "#b09a78"],
    香草: ["#e5f0e2", "#7fa372"], 香料: ["#f7e6d6", "#c08453"],
    坚果: ["#f4e8d5", "#b98f5d"], 水果: ["#fde9e6", "#d47f72"],
    豆制品: ["#f1eedd", "#a8a06a"], 豆类: ["#efe8da", "#a89070"],
    果干: ["#f0e3d6", "#a97b52"], 其他: ["#efeae2", "#9c9384"]
  };

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }

  /* 生成一张高对比度的食物插画（实心色块 + 大字），永远可渲染、看得清 */
  function localArt(name) {
    var cat = (DICT[name] && DICT[name][2]) || "其他";
    var pal = PALETTE[cat] || PALETTE.其他;
    var bg = pal[0], ink = pal[1];
    var h = hash(name);
    var rot = (h % 30) - 15;
    /* 缩略图只取一个字：字大、清晰、不会被圆盘裁切（菜名在卡片上已完整显示） */
    var ART = {"五花肉": "肉", "猪肉": "肉", "里脊": "肉", "牛腩": "肉", "排骨": "排", "羊肉": "羊", "牛肉": "牛", "鸡肉": "鸡", "鸡胸肉": "鸡", "鸡腿": "腿", "鸡翅": "翅", "冰糖": "糖", "白糖": "糖", "糖": "糖", "生抽": "酱", "老抽": "酱", "酱油": "酱", "蚝油": "蚝", "醋": "醋", "料酒": "酒", "豆瓣酱": "酱", "番茄酱": "酱", "辣椒酱": "辣", "生姜": "姜", "大蒜": "蒜", "小葱": "葱", "大葱": "葱", "葱": "葱", "干辣椒": "辣", "辣椒": "辣", "花椒": "椒", "八角": "角", "橄榄油": "油", "芝麻油": "油", "香油": "油", "黑胡椒": "椒", "白胡椒": "椒", "淀粉": "粉", "面粉": "粉", "五香粉": "粉", "带鱼": "鱼", "鲈鱼": "鱼", "小黄鱼": "鱼", "鳕鱼": "鱼", "三文鱼": "鱼", "金枪鱼": "鱼", "鲫鱼": "鱼", "草鱼": "鱼", "鱿鱼": "鱿", "香菇": "菇", "蘑菇": "菇", "金针菇": "菇", "木耳": "耳", "西红柿": "柿", "番茄": "茄", "茄子": "茄", "土豆": "豆", "豆角": "豆", "西葫芦": "瓜", "黄瓜": "瓜", "冬瓜": "瓜", "南瓜": "瓜", "白萝卜": "卜", "胡萝卜": "卜", "卷心菜": "菜", "娃娃菜": "菜", "生菜": "菜", "菠菜": "菜", "油菜": "菜", "芹菜": "菜", "韭菜": "菜", "香菜": "菜", "西兰花": "花", "芦笋": "笋", "莲藕": "藕", "山药": "药", "鸡蛋": "蛋", "鸭肉": "鸭", "培根": "培", "香肠": "肠", "火腿": "腿", "牛奶": "奶", "奶油": "油", "黄油": "油", "酸奶": "奶", "奶酪": "酪", "豆腐": "腐", "鹰嘴豆": "豆", "红豆": "豆", "大米": "米", "米饭": "饭", "面条": "面", "意面": "面", "面包": "包", "燕麦": "燕", "虾": "虾", "蛤蜊": "蛤", "青口": "贝", "柠檬": "檬", "香蕉": "蕉", "苹果": "果", "橙子": "橙", "草莓": "莓", "蓝莓": "莓", "芒果": "芒", "菠萝": "菠", "牛油果": "果", "葡萄干": "干", "核桃": "仁", "杏仁": "仁", "花生": "生", "腰果": "果", "松子": "子", "芝麻": "麻", "巧克力": "巧", "蜂蜜": "蜜", "盐": "盐", "罗勒": "勒", "欧芹": "芹", "迷迭香": "香", "百里香": "香", "月桂叶": "叶", "肉桂": "桂", "香叶": "叶", "孜然": "然", "孜然粉": "然", "咖喱粉": "咖", "红椒粉": "椒", "辣椒粉": "椒", "辣椒面": "椒", "姜黄": "黄", "蛋黄酱": "酱", "芥末": "芥", "芝麻酱": "酱", "花生酱": "酱", "椰奶": "椰", "鸡汤": "汤", "玉米": "米", "豌豆": "豆", "蒜苗": "苗", "豆芽": "芽"};
    var ch = ART[name] || name.slice(0, 1);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">' +
          '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="' + bg + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="100" height="100" fill="url(#g)"/>' +
        /* 餐盘 */
        '<circle cx="50" cy="50" r="34" fill="#ffffff" opacity="0.95"/>' +
        '<circle cx="50" cy="50" r="34" fill="none" stroke="' + ink + '" stroke-opacity="0.25" stroke-width="2"/>' +
        /* 实心主色块：保证一眼看到 */
        '<g transform="rotate(' + rot + ' 50 50)">' +
          '<circle cx="50" cy="50" r="27" fill="' + ink + '"/>' +
          '<path d="M50 23 A27 27 0 0 1 50 77 Z" fill="#000000" opacity="0.14"/>' +
          '<ellipse cx="41" cy="36" rx="9" ry="5" fill="#ffffff" opacity="0.30"/>' +
        '</g>' +
        /* 白色大字，压在色块上，对比强烈 */
        '<text x="50" y="50" text-anchor="middle" dominant-baseline="central" ' +
          'font-size="' + (ch.length > 1 ? 22 : 40) + '" ' +
          'letter-spacing="' + (ch.length > 1 ? -1 : 0) + '" ' +
          'font-family="PingFang SC,Hiragino Sans GB,Songti SC,serif" font-weight="700" ' +
          'fill="#ffffff">' + ch + '</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  var ART = {};
  function artFor(name) {
    if (!ART[name]) ART[name] = localArt(name);
    return ART[name];
  }

  /* 当前应显示的图：有真实照片用照片，否则用本地插画 —— 永不为空 */
  function srcFor(name) {
    var p = state.photos[name];
    return p ? p : artFor(name);
  }

  /* ═══════════════════════════════════════════════════════════
     5. 第二层：尝试联网找真实照片（成功就替换，失败静默保留插画）
     ═══════════════════════════════════════════════════════════ */
  var PHOTO_URL = function (en) {
    return "https://www.themealdb.com/images/ingredients/" +
      String(en).trim().replace(/\s+/g, "%20") + "-Small.png";
  };

  var trCache = {}, tried = {}, inflight = {};

  function translate(word) {
    if (trCache[word] !== undefined) return Promise.resolve(trCache[word]);
    var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(word) + "&langpair=zh-CN%7Cen";
    return fetch(url, { mode: "cors" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var t = d && d.responseData && d.responseData.translatedText;
        if (!t || !/[a-zA-Z]{2}/.test(t)) { trCache[word] = null; return null; }
        t = t.replace(/[.,;:!?。，；：！？]+$/, "").trim();
        var out = t.split(/\s+/).map(function (w) {
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }).join(" ");
        trCache[word] = out;
        return out;
      })
      .catch(function () { trCache[word] = null; return null; });
  }

  function probe(url) {
    return new Promise(function (resolve) {
      var img = new Image(), done = false;
      var tm = window.setTimeout(function () { if (!done) { done = true; resolve(false); } }, 8000);
      img.onload = function () { if (!done) { done = true; clearTimeout(tm); resolve(img.naturalWidth > 8); } };
      img.onerror = function () { if (!done) { done = true; clearTimeout(tm); resolve(false); } };
      img.src = url;
    });
  }

  function keysFor(name) {
    var hit = DICT[name];
    /* en 为空字符串 = 该食材没有可靠图源，直接用 AI 插图，不做无效请求 */
    if (hit) return Promise.resolve(hit[0] ? [hit[0]] : []);
    var list = [];
    if (/^[a-zA-Z][a-zA-Z\s'-]*$/.test(name)) {
      list.push(name.replace(/\b\w/g, function (c) { return c.toUpperCase(); }));
    }
    return translate(name).then(function (en) {
      var out = list.slice();
      if (en) { out.push(en); if (/s$/i.test(en)) out.push(en.replace(/s$/i, "")); else out.push(en + "s"); }
      return out;
    });
  }

  /* 返回 Promise<url|null>；只有验证成功的真实图片才 resolve url */
  function findPhoto(name) {
    if (state.photos[name]) return Promise.resolve(state.photos[name]);
    if (tried[name]) return Promise.resolve(null);
    if (inflight[name]) return inflight[name];
    inflight[name] = keysFor(name).then(function (keys) {
      var i = 0;
      function step() {
        if (i >= keys.length) return null;
        var k = keys[i++];
        var u = PHOTO_URL(k);
        return probe(u).then(function (ok) {
          if (ok) return u;
          return step();
        });
      }
      return step();
    }).then(function (u) {
      tried[name] = true;
      delete inflight[name];
      if (u) { state.photos[name] = u; save(); }
      return u || null;
    }).catch(function () {
      tried[name] = true; delete inflight[name]; return null;
    });
    return inflight[name];
  }

  /* 批量补图：成功后重渲染（插画 → 照片） */
  function ensurePhotos(names, after) {
    var list = names.filter(function (n) { return !state.photos[n] && !tried[n]; });
    if (!list.length) return;
    var pending = list.length;
    list.forEach(function (n) {
      findPhoto(n).then(function () {
        pending--;
        if (pending === 0 && after) after();
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     6. 菜品图：本地合成「白盘 + 主料」，同样必然渲染
     ═══════════════════════════════════════════════════════════ */
  var POS2 = [
    { l: 20, t: 27, w: 40 }, { l: 44, t: 32, w: 36 }
  ];
  var POS3 = [
    { l: 17, t: 24, w: 35 }, { l: 45, t: 19, w: 30 }, { l: 33, t: 45, w: 32 }
  ];

  function dishHTML(r, size) {
    /* 大图放 3 样主料，小卡片只放 1 样主料（两张挤在一起字看不清） */
    var keys = r.e.map(function (p) { return p[0]; }).slice(0, size === "lg" ? 3 : 1);
    var pos = keys.length >= 3 ? POS3 : (keys.length === 2 ? POS2 : POS2);
    var imgs = keys.map(function (k, i) {
      var p = pos[i] || pos[pos.length - 1];
      return '<img src="' + esc(srcFor(k)) + '" alt="" style="left:' + p.l + '%;top:' + p.t +
        '%;width:' + p.w + '%;height:' + p.w + '%" />';
    }).join("");
    return '<div class="dish ' + size + '"><i></i>' + imgs + '</div>';
  }

  /* ═══════════════════════════════════════════════════════════
     7. 匹配引擎
     ═══════════════════════════════════════════════════════════ */
  /* 这道菜是不是「我的」（用户导入/自己建的） */
  function isMine(name) {
    return (state.custom || []).some(function (r) { return r.n === name; });
  }
  function myRecipe(name) {
    return (state.custom || []).filter(function (r) { return r.n === name; })[0] || null;
  }

  /* 全部菜谱 = 内置 + 用户导入的（按菜名去重，导入的同名菜谱覆盖内置） */
  function allRecipes() {
    var seen = {}, out = [];
    (state.custom || []).forEach(function (r) {
      if (r && r.n && !seen[r.n]) { seen[r.n] = 1; out.push(r); }
    });
    RECIPES.forEach(function (r) {
      if (!seen[r.n]) { seen[r.n] = 1; out.push(r); }
    });
    return out;
  }

  function haveSet() {
    var m = {};
    state.pantry.forEach(function (it) { m[it.name] = true; });
    return m;
  }
  /* 别名归一：让「鸡腿」也能命中写「鸡肉」的菜谱 */
  var ALIAS = {
    "五花肉": ["猪肉"], "猪肉": ["五花肉"], "生抽": ["酱油"], "老抽": ["酱油"],
    "冰糖": ["糖", "白糖"], "白糖": ["糖", "冰糖"], "鸡翅": ["鸡腿"],
    "香菇": ["蘑菇"], "牛腩": ["牛肉"], "西红柿": ["番茄"],
    "鸡腿": ["鸡肉", "鸡胸肉"], "鸡肉": ["鸡腿", "鸡胸肉"], "鸡胸肉": ["鸡肉", "鸡腿"],
    "香菇": ["蘑菇"], "蘑菇": ["香菇"], "金针菇": ["蘑菇"],
    "小葱": ["韭菜"], "面条": ["意面"], "意面": ["面条"],
    "米饭": ["大米"], "大米": ["米饭"], "糖": ["白糖"], "番茄": ["西红柿"], "西红柿": ["番茄"],
    "青椒": ["辣椒"], "奶酪": ["马苏里拉", "帕玛森"], "香菜": ["欧芹"]
  };

  function scoreRecipe(r, set) {
    var haveNames = [], missNames = [];
    r.e.forEach(function (p) {
      var k = p[0];
      var direct = set[k];
      var viaAlias = !direct && (ALIAS[k] || []).some(function (a) { return set[a]; });
      if (direct || viaAlias) haveNames.push(k); else missNames.push(k);
    });
    var total = r.e.length;
    var have = haveNames.length;
    return {
      r: r, have: have, total: total, missing: missNames,
      p: total ? Math.round(have / total * 100) : 0
    };
  }

  /* 菜名匹配：空格分词，全部命中（顺序不限），不区分大小写 */
  function nameMatches(name) {
    var kw = (state.q || "").trim().toLowerCase();
    if (!kw) return true;
    var nm = String(name || "").toLowerCase();
    return kw.split(/\s+/).filter(Boolean).every(function (t) { return nm.indexOf(t) >= 0; });
  }

  function ranked() {
    var set = haveSet();
    var list = allRecipes().map(function (r) { return scoreRecipe(r, set); });

    list = list.filter(function (x) { return nameMatches(x.r.n); });

    list = list.filter(function (x) {
      if (state.filter === "full") return x.missing.length === 0;
      if (state.filter === "near") return x.missing.length <= 1 && x.have > 0;
      return true;
    });
    list.sort(function (a, b) {
      if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
      if (b.have !== a.have) return b.have - a.have;
      return a.r.n.localeCompare(b.r.n, "zh");
    });
    return list;
  }

  /* ═══════════════════════════════════════════════════════════
     8. 渲染：食材
     ═══════════════════════════════════════════════════════════ */
  function renderPantry() {
    var grid = $("#pantryGrid"), empty = $("#pantryEmpty");
    $("#pantryCount").textContent = String(state.pantry.length);

    if (!state.pantry.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = state.pantry.map(function (it) {
      var isArt = !state.photos[it.name];
      return '' +
        '<div class="card" data-id="' + it.id + '">' +
          '<div class="thumb">' +
            '<img src="' + esc(srcFor(it.name)) + '" alt="' + esc(it.name) + '配图" />' +
            '<span class="badge">' + (isArt ? "AI 插图" : "实拍") + '</span>' +
          '</div>' +
          '<div class="card-name"><strong>' + esc(it.name) + '</strong>' +
            '<em>' + esc(it.en || "") + '</em></div>' +
          '<div class="card-meta">' +
            '<span>' + esc(it.qty + " " + it.unit) + '</span>' +
            '<button class="remove" data-act="remove" data-id="' + it.id + '" aria-label="移除' + esc(it.name) + '">' +
              '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>';
    }).join("");

    ensurePhotos(state.pantry.map(function (x) { return x.name; }), function () {
      renderPantry(); renderRecipes();
    });
  }

  function renderChips() {
    $("#chips").innerHTML = QUICK.map(function (n) {
      var on = state.pantry.some(function (p) { return p.name === n; });
      return '<button class="chip' + (on ? " on" : "") + '" data-quick="' + esc(n) + '">' +
        '<img src="' + esc(srcFor(n)) + '" alt="" />' + esc(n) + '</button>';
    }).join("");
  }

  /* ═══════════════════════════════════════════════════════════
     9. 渲染：菜谱
     ═══════════════════════════════════════════════════════════ */
  function renderRecipes() {
    var set = haveSet();
    var haveCount = state.pantry.length;
    /* 先按菜名搜索缩小范围，再统计各档数量 */
    var pool = allRecipes().filter(function (r) { return nameMatches(r.n); });
    var all = pool.map(function (r) { return scoreRecipe(r, set); });
    var fullN = all.filter(function (x) { return x.missing.length === 0; }).length;
    var nearN = all.filter(function (x) { return x.missing.length === 1 && x.have > 0; }).length;

    /* 筛选条 */
    $("#filters").innerHTML =
      '<button class="fchip' + (state.filter === "all" ? " on" : "") + '" data-filter="all">全部 <b>' + pool.length + '</b></button>' +
      '<button class="fchip' + (state.filter === "near" ? " on" : "") + '" data-filter="near">只差 1 样 <b>' + nearN + '</b></button>' +
      '<button class="fchip' + (state.filter === "full" ? " on" : "") + '" data-filter="full">食材齐全 <b>' + fullN + '</b></button>';

    var kw = (state.q || "").trim();
    $("#recipeHint").textContent = kw
      ? ("搜到 " + pool.length + " 道")
      : (haveCount ? ("按 " + haveCount + " 样食材匹配") : "先加食材，结果更准");

    var list = ranked();
    var box = $("#recipeList");

    if (!list.length) {
      box.innerHTML = "";
      var nmBox = $("#noMatch");
      nmBox.hidden = false;
      var p = nmBox.querySelector("p");
      if (p) {
        p.innerHTML = kw
          ? ("没有找到叫「" + esc(kw) + "」的菜谱。<br />换个菜名试试，或清空搜索看全部。")
          : "这个筛选下暂时没有菜谱。<br />回「食材」多加几样，结果会更多。";
      }
      var btn = nmBox.querySelector("button");
      if (btn) btn.hidden = !!kw;
      return;
    }
    $("#noMatch").hidden = true;

    box.innerHTML = list.map(function (x, i) {
      var missTxt = x.missing.length
        ? '还缺 ' + x.missing.slice(0, 4).map(function (m) { return '<u>' + esc(m) + '</u>'; }).join("")
          + (x.missing.length > 4 ? '<span>等 ' + x.missing.length + ' 样</span>' : '')
        : '食材都齐了，可以直接开火';
      return '' +
        '<button class="recipe' + (x.missing.length === 0 ? " full" : "") + '" data-rk="' + esc(x.r.n) + '">' +
          dishHTML(x.r, "sm") +
          '<div class="recipe-body">' +
            '<h3>' + esc(x.r.n) + (isMine(x.r.n) ? '<span class="mine-tag">我的</span>' : '') + '</h3>' +
            '<p class="line2">' + esc(x.r.t) + ' · ' + esc(x.r.tg) + ' · 已有 <b>' + x.have + '</b>/' + x.total + '</p>' +
            '<p class="missing">' + missTxt + '</p>' +
          '</div>' +
          '<div class="match' + (x.missing.length === 0 ? " done" : "") + '" style="--p:' + x.p + '"><span>' + x.p + '%</span></div>' +
        '</button>';
    }).join("");

    /* 补图：菜品主料 + 缺的食材 */
    var names = [];
    list.forEach(function (x) {
      x.r.e.forEach(function (p) { names.push(p[0]); });
    });
    ensurePhotos(names, function () { renderRecipes(); });
  }

  /* ═══════════════════════════════════════════════════════════
     10. 渲染：清单
     ═══════════════════════════════════════════════════════════ */
  function renderShopping() {
    var list = $("#shopList"), empty = $("#shopEmpty");
    var left = state.shopping.filter(function (s) { return !s.done; }).length;
    $("#shopHint").textContent = state.shopping.length ? (left + " 项待买") : "缺什么买什么";

    if (!state.shopping.length) {
      list.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    list.innerHTML = state.shopping.map(function (s) {
      return '' +
        '<div class="shop-row' + (s.done ? " done" : "") + '">' +
          '<button class="tick" data-shop-done="' + s.id + '" aria-label="标记' + esc(s.name) + '已买">' +
            '<svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg>' +
          '</button>' +
          '<img src="' + esc(srcFor(s.name)) + '" alt="" />' +
          '<div class="shop-body">' +
            '<div class="shop-name">' + esc(s.name) + '</div>' +
            '<div class="shop-sub">' + esc(s.from ? "来自 " + s.from : "手动添加") + '</div>' +
          '</div>' +
          '<button class="remove" data-shop-del="' + s.id + '" aria-label="删除' + esc(s.name) + '">' +
            '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button>' +
        '</div>';
    }).join("");

    ensurePhotos(state.shopping.map(function (s) { return s.name; }), function () { renderShopping(); });
  }

  /* ── 导入状态提示：不再单独列一份菜谱，导入后直接并入「菜谱」 ── */
  function renderCustom() {
    var hint = document.getElementById("customHint");
    var list = state.custom || [];
    if (hint) hint.textContent = list.length ? (list.length + " 道已并入菜谱") : "还没有";
    var box = document.getElementById("customList");
    if (box) { box.innerHTML = ""; box.hidden = true; }
  }

  /* ── 草稿编辑弹层 ── */
  function openDraft(d) {
    window.__draft = d;
    var ingText = d.e.map(function (p) { return p[0] + " " + p[1]; }).join("\n");
    var stepText = d.s.map(function (x, i) { return (i + 1) + ". " + x; }).join("\n");

    var isEdit = !!d.__edit;
    openSheet(
      '<h2 id="sheetTitle">' + (isEdit ? "编辑菜谱" : "确认导入") + '</h2>' +
      '<p class="sub">' + (isEdit
        ? "改完点保存，会直接更新这道菜，不会新增一条"
        : (d.known ? "已在菜谱库中找到同名菜，会更新原菜谱" : "根据分享文案生成，可自行修改")) + '</p>' +
      (d.from ? '<span class="src-chip">' + esc(d.from) + '</span>' : '') +

      '<div class="draft-field">' +
        '<label for="draftName">菜名</label>' +
        '<input class="draft-input" id="draftName" value="' + esc(d.n) + '" />' +
      '</div>' +

      '<div class="draft-field">' +
        '<label for="draftIng">食材（每行一样：名称 数量）</label>' +
        '<textarea class="draft-area" id="draftIng">' + esc(ingText) + '</textarea>' +
        '<p class="draft-hint">数量可只写名称，会自动补默认单位。</p>' +
      '</div>' +

      '<div class="draft-field">' +
        '<label for="draftStep">做法（每行一步）</label>' +
        '<textarea class="draft-area" id="draftStep" style="min-height:150px">' + esc(stepText) + '</textarea>' +
      '</div>' +

      '<div class="sheet-actions">' +
        '<button class="btn btn-ghost" data-close="1">取消</button>' +
        '<button class="btn btn-primary" data-save-draft="1">' + (isEdit ? "保存修改" : "保存到本地") + '</button>' +
      '</div>'
    );
  }

  function saveDraft() {
    var d = window.__draft;
    if (!d) return;
    var nameEl = $("#draftName"), ingEl = $("#draftIng"), stepEl = $("#draftStep");
    var name = (nameEl && nameEl.value.trim()) || d.n || "未命名菜谱";

    var ings = [];
    ((ingEl && ingEl.value) || "").split(/\n+/).forEach(function (line) {
      var t = line.trim();
      if (!t) return;
      var m = t.match(/^([^\s0-9]+)\s*(\d+(?:\.\d+)?)?\s*(.*)$/);
      if (!m) return;
      var nm = m[1];
      var qty = m[2] ? Number(m[2]) : 1;
      ings.push([nm, qty]);
    });
    if (!ings.length) ings = [["盐", 1]];

    var steps = [];
    ((stepEl && stepEl.value) || "").split(/\n+/).forEach(function (line) {
      var t = line.trim().replace(/^\d+[\.、)]\s*/, "");
      if (t) steps.push(t);
    });
    if (!steps.length) steps = d.s.slice();

    var rec = {
      id: d.id || ("c" + uid()),
      n: name,
      t: d.t || "约 30 分钟",
      tg: d.tg || "抖音导入",
      e: ings,
      s: steps,
      from: d.from || "抖音",
      url: d.url || ""
    };

    /* 编辑模式：只替换这一条（按 id），改名字也不会留下旧的重复项 */
    if (d.__edit) {
      state.custom = (state.custom || []).map(function (x) {
        return x.id === rec.id ? rec : x;
      });
    } else {
      /* 新建/导入同名菜：更新原菜谱，不新增重复 */
      state.custom = (state.custom || []).filter(function (x) {
        return x.n !== name && x.id !== rec.id;
      });
      state.custom.unshift(rec);
    }
    save();

    /* 食材顺带补进我的食材，方便立刻匹配 */
    var have = haveSet();
    var added = 0;
    ings.forEach(function (p) {
      if (!have[p[0]] && DICT[p[0]]) { added++; }
    });

    renderCustom();
    renderRecipes();
    renderChips();
    closeSheet();
    toast("已保存「" + name + "」到本地" + (added ? "，可直接匹配" : ""));
  }

  /* ═══════════════════════════════════════════════════════════
     11. 交互
     ═══════════════════════════════════════════════════════════ */
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  function metaOf(name) {
    var m = DICT[name];
    if (m) return { en: m[0], unit: m[1], cat: m[2] };
    return { en: "", unit: "份", cat: "其他" };
  }

  function addIngredient(raw) {
    var n = String(raw || "").trim().replace(/\s+/g, " ");
    if (!n) return;
    var found = null;
    state.pantry.forEach(function (it) {
      if (it.name.toLowerCase() === n.toLowerCase()) found = it;
    });
    if (found) {
      found.qty += 1;
      save(); renderPantry(); renderChips(); renderRecipes();
      toast("「" + found.name + "」数量 +1");
      return;
    }
    var m = metaOf(n);
    state.pantry.unshift({
      id: uid(), name: n, qty: 1, unit: m.unit, en: m.en, cat: m.cat
    });
    save();
    renderPantry(); renderChips(); renderRecipes();
    toast("已加入「" + n + "」，正在匹配菜谱");
    findPhoto(n).then(function (u) {
      if (u) { renderPantry(); renderRecipes(); }
    });
  }

  function suggestFor(q) {
    var box = $("#suggest");
    var query = (q || "").trim();
    if (!query) { box.classList.remove("open"); box.innerHTML = ""; return; }
    var low = query.toLowerCase();
    var hits = [];
    Object.keys(DICT).forEach(function (zh) {
      var en = DICT[zh][0];
      if (zh.indexOf(query) >= 0 || en.toLowerCase().indexOf(low) >= 0) {
        hits.push({ zh: zh, en: en, exact: zh === query });
      }
    });
    hits.sort(function (a, b) {
      if (a.exact !== b.exact) return a.exact ? -1 : 1;
      var ai = a.zh.indexOf(query), bi = b.zh.indexOf(query);
      if (ai !== bi) return ai - bi;
      return a.zh.length - b.zh.length;
    });
    hits = hits.slice(0, 6);

    if (!hits.length) {
      box.innerHTML = '<button class="suggest-row" data-new="' + esc(query) + '">' +
        '<img src="' + esc(artFor(query)) + '" alt="" />' +
        '<span><span class="s-name">添加「' + esc(query) + '」</span><br />' +
        '<span class="s-en">会自动生成插图，并联网找实拍图</span></span>' +
        '<span class="s-go">添加</span></button>';
      box.classList.add("open");
      return;
    }
    box.innerHTML = hits.map(function (h) {
      return '<button class="suggest-row" data-pick="' + esc(h.zh) + '">' +
        '<img src="' + esc(srcFor(h.zh)) + '" alt="" />' +
        '<span><span class="s-name">' + esc(h.zh) + '</span><br />' +
        '<span class="s-en">' + esc(h.en) + '</span></span>' +
        '<span class="s-go">添加</span></button>';
    }).join("");
    box.classList.add("open");
  }

  /* ── 弹层 ── */
  function openSheet(html) {
    $("#sheetBody").innerHTML = html;
    $("#sheet").classList.add("open");
    $("#scrim").classList.add("open");
    $("#sheetBody").scrollTop = 0;
  }
  function closeSheet() {
    $("#sheet").classList.remove("open");
    $("#scrim").classList.remove("open");
  }

  function openIngredient(id) {
    var it = null;
    state.pantry.forEach(function (x) { if (x.id === id) it = x; });
    if (!it) return;
    openSheet(
      '<div class="thumb" style="aspect-ratio:16/9;border-radius:16px;margin-bottom:14px">' +
        '<img src="' + esc(srcFor(it.name)) + '" alt="" style="padding:14px" />' +
        '<span class="badge">' + (state.photos[it.name] ? "实拍" : "AI 插图") + '</span>' +
      '</div>' +
      '<h2 id="sheetTitle">' + esc(it.name) + '</h2>' +
      '<p class="sub">' + esc(it.en || it.cat) + ' · ' + esc(it.cat) + '</p>' +
      '<div class="qty-row">' +
        '<span style="font-size:13px;color:var(--muted)">数量</span>' +
        '<span class="stepper">' +
          '<button data-qty="-1" data-id="' + it.id + '" aria-label="减少"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>' +
          '<b>' + esc(it.qty + " " + it.unit) + '</b>' +
          '<button data-qty="1" data-id="' + it.id + '" aria-label="增加"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>' +
        '</span>' +
      '</div>' +
      '<div class="sheet-actions">' +
        '<button class="btn btn-ghost" data-refind="' + esc(it.name) + '">换个图</button>' +
        '<button class="btn btn-primary" data-close="1">完成</button>' +
      '</div>'
    );
  }

  /* 把「3 分钟」「大火」这类关键量词高亮，一眼能抓到火候和时间 */
  function hl(s) {
    return esc(s)
      .replace(/(\d+(?:\.\d+)?\s*(?:分钟|小时|秒))/g, '<em class="tm">$1</em>')
      .replace(/(中大火|中小火|最小火|大火|中火|小火)/g, '<em class="fire">$1</em>');
  }

  function openRecipe(r) {
    var set = haveSet();
    var x = scoreRecipe(r, set);
    var mine = isMine(r.n);
    openSheet(
      dishHTML(r, "lg") +
      '<h2 id="sheetTitle" style="margin-top:14px">' + esc(r.n) + '</h2>' +
      '<p class="sub">' + esc(r.t) + ' · ' + esc(r.tg) + ' · 已有 ' + x.have + '/' + x.total + ' 样食材</p>' +
      '<h4>食材</h4>' +
      '<div class="ing-list">' + r.e.map(function (p) {
        var k = p[0];
        var unit = DICT[k] ? DICT[k][1] : "份";
        var has = set[k] || (ALIAS[k] || []).some(function (a) { return set[a]; });
        return '<div class="ing-line ' + (has ? "have" : "lack") + '">' +
          '<img src="' + esc(srcFor(k)) + '" alt="" />' +
          '<span class="nm">' + esc(k) + '</span>' +
          '<span class="amt">' + esc(p[1] + " " + unit) + '</span></div>';
      }).join("") + '</div>' +
      '<h4>做法 <span class="h4-note">' + r.s.length + ' 步 · 约 ' + esc(r.t) + '</span></h4>' +
      '<div class="steps">' + r.s.map(function (s, i) {
        return '<div class="step"><b>' + (i + 1) + '</b><span>' + hl(s) + '</span></div>';
      }).join("") + '</div>' +
      (r.tips && r.tips.length
        ? '<div class="tips"><div class="tips-hd">小贴士</div>' +
          r.tips.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join("") + '</div>'
        : '') +
      '<div class="sheet-actions">' +
        '<button class="btn btn-ghost" data-edit="' + esc(r.n) + '">编辑</button>' +
        (mine
          ? '<button class="btn btn-ghost" data-delrecipe="' + esc(r.n) + '">删除</button>'
          : '<button class="btn btn-ghost" data-close="1">关闭</button>') +
        '<button class="btn btn-primary" data-fill="' + esc(r.n) + '">' +
          (x.missing.length ? "把缺的 " + x.missing.length + " 样加入清单" : "食材齐全") +
        '</button>' +
      '</div>'
    );
  }

  function switchTab(name) {
    $$(".screen").forEach(function (s) { s.classList.toggle("active", s.dataset.screen === name); });
    $$(".tab").forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle("active", on);
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    if (name === "recipes") renderRecipes();
    if (name === "list") renderShopping();
    if (name === "import") renderCustom();
  }


  /* ═══════════════════════════════════════════════════════════
     11.5 抖音分享文案 → 菜谱草稿
          网页无法读取视频口播，因此从分享文案里提取
          【作者的作品】+ 菜名，再按菜名还原食材与做法
     ═══════════════════════════════════════════════════════════ */

  /* 烹饪手法词库：按顺序匹配，长的优先 */
  var METHODS = [
    "葱烧", "红烧", "糖醋", "清蒸", "香煎", "干煸", "回锅", "水煮", "麻辣",
    "蒜蓉", "干锅", "小炒", "爆炒", "凉拌", "酸汤", "番茄", "可乐", "孜然",
    "红烧", "酱爆", "椒盐", "醋溜", "白灼", "焖", "炖", "炒", "蒸", "烧",
    "煎", "烤", "拌", "卤", "炸", "煮", "煲", "焗", "烩"
  ];

  /* 手法 → 通用做法模板 */
  var TEMPLATES = {
    "烧": [
      "主料处理干净，切成合适的块，用料酒和姜片腌 10 分钟去腥。",
      "表面水分吸干，热锅少油煎到两面定型上色。",
      "另起锅炒香姜蒜，加酱油、料酒和一小碗热水烧开。",
      "放入主料小火焖 8 到 10 分钟，让味道进去。",
      "大火收汁到浓稠挂身，出锅前撒葱花。"
    ],
    "炒": [
      "所有食材洗净切好，肉类提前用盐、料酒和淀粉抓匀腌 10 分钟。",
      "热锅冷油，先把肉炒散变色盛出。",
      "锅留底油爆香蒜末，下配菜大火快炒到断生。",
      "倒回肉，加盐和酱油调味，翻匀出锅。"
    ],
    "炖": [
      "主料冷水下锅焯去血沫，捞出冲洗干净。",
      "少油炒香姜片和葱段，下主料煎出香味。",
      "加料酒、酱油和足量热水，烧开后转小火。",
      "炖 40 分钟到软烂，中途加配菜。",
      "加盐调味，收汁到喜欢的浓度。"
    ],
    "蒸": [
      "主料处理干净，两侧划刀便于入味，用料酒和盐腌 10 分钟。",
      "盘底垫姜片和葱段，主料放上去，腹内也塞一些。",
      "水开后大火蒸 8 到 12 分钟，关火再焖 2 分钟。",
      "倒掉盘里的腥水，撤掉旧葱姜。",
      "铺上新鲜葱丝，淋一勺热油和蒸鱼酱油。"
    ],
    "煎": [
      "主料切段或片，用盐、料酒和姜片腌 15 分钟。",
      "去掉姜片，用厨房纸把表面水分彻底吸干。",
      "两面薄薄拍一层淀粉，锁住水分。",
      "中火每面煎 3 到 4 分钟，定型前不要翻动。",
      "出锅前撒椒盐或淋柠檬汁。"
    ],
    "烤": [
      "主料用盐、蒜末、油和香料腌 20 分钟以上。",
      "表面刷一层油，摆上烤盘。",
      "200℃ 烤 25 到 30 分钟，中途翻面一次。",
      "出炉静置 5 分钟再切，肉汁不会流失。"
    ],
    "拌": [
      "主料洗净，需要焯水的沸水下锅断生，捞出过冷水。",
      "彻底沥干水分，太湿会稀释调味。",
      "蒜末加醋、酱油、香油和一点糖调成料汁。",
      "淋在主料上拌匀，静置 5 分钟更入味。"
    ],
    "炸": [
      "主料切好，用盐、料酒和姜片腌 15 分钟。",
      "调一个薄糊，把主料裹匀。",
      "油温六成热下锅，中小火炸到定型捞出。",
      "升高油温复炸 30 秒，外壳更脆。",
      "出锅沥油，趁热撒椒盐。"
    ],
    "煮": [
      "主料洗净切块，冷水下锅焯去浮沫。",
      "加姜片和清水，大火烧开转小火。",
      "煮 20 到 30 分钟到熟软。",
      "加盐调味，撒葱花或香菜。"
    ],
    "卤": [
      "主料焯水去腥，冲洗干净。",
      "锅中放酱油、冰糖、八角、桂皮、香叶和姜片，加水烧开。",
      "放入主料，小火卤 40 分钟。",
      "关火后泡在卤汁里 2 小时，更入味。"
    ]
  };

  function pickTemplate(name) {
    for (var i = 0; i < METHODS.length; i++) {
      if (name.indexOf(METHODS[i]) >= 0) {
        var key = METHODS[i];
        if (TEMPLATES[key]) return TEMPLATES[key];
        if (TEMPLATES[key.slice(-1)]) return TEMPLATES[key.slice(-1)];
        return TEMPLATES[key.charAt(key.length - 1)] || TEMPLATES["炒"];
      }
    }
    return TEMPLATES["炒"];
  }

  /* 从分享文案里抓 URL */
  function pickUrl(text) {
    var m = text.match(/https?:\/\/[^\s，,"'）)]+/);
    if (!m) return "";
    return m[0].replace(/[。，,、；;：:]+$/, "");
  }

  /* 抓作者：【范大厨来了的作品】 */
  function pickAuthor(text) {
    var m = text.match(/【([^】]{1,20}?)的作品】/);
    if (m) return m[1];
    m = text.match(/@([\w\u4e00-\u9fa5.-]{1,20})/);
    if (m) return m[1];
    m = text.match(/【([^】]{1,20})】/);
    if (m) return m[1];
    return "";
  }

  /* 清洗标题：去掉序号、口令、URL、标签 */
  function cleanTitle(text) {
    var t = text;
    t = t.replace(/https?:\/\/[^\s，,"'）)]+/g, " ");
    t = t.replace(/【[^】]*】/g, " ");
    t = t.replace(/\d+\.\d+/g, " ");                 // 3.51
    t = t.replace(/[a-zA-Z]{1,4}:\/\S*/g, " ");       // v@S.lC :3pm
    t = t.replace(/复制打开抖音[^，,。]*/g, " ");
    t = t.replace(/复制此链接[^，,。]*/g, " ");
    t = t.replace(/看看/g, " ");
    t = t.replace(/打开抖音[^，,。]*/g, " ");
    t = t.replace(/[#＃][^\s#＃]+/g, " ");              // 话题
    t = t.replace(/[|｜·•]+/g, " ");
    t = t.replace(/\s+/g, " ").trim();
    return t;
  }

  /* 从标题里推断菜名 */
  function pickDish(text, cleaned) {
    /* 1) 先和已有菜谱名做最长命中 */
    var pool = allRecipes().map(function (r) { return r.n; });
    var best = "";
    pool.forEach(function (n) {
      if (cleaned.indexOf(n) >= 0 && n.length > best.length) best = n;
    });
    if (best) return { name: best, known: true };

    /* 2) 手法词 + 食材 → 组合菜名 */
    var ingWords = Object.keys(DICT).filter(function (k) { return k.length >= 1 && cleaned.indexOf(k) >= 0; });
    ingWords.sort(function (a, b) { return b.length - a.length; });
    var mainIng = ingWords[0] || "";

    for (var i = 0; i < METHODS.length; i++) {
      var mw = METHODS[i];
      var at = cleaned.indexOf(mw);
      if (at < 0) continue;
      /* 手法词后面紧跟的 1-3 个汉字，尝试拼成菜名 */
      var after = cleaned.slice(at, at + Math.min(mw.length + 3, cleaned.length - at));
      after = after.replace(/[^\u4e00-\u9fa5]/g, "");
      /* 优先使用「手法 + 已知食材」 */
      if (mainIng) {
        if (after.indexOf(mainIng) >= 0) return { name: mw + mainIng, known: false };
        return { name: mw + mainIng, known: false };
      }
      if (after.length >= 2) return { name: after, known: false };
    }

    /* 3) 标题里冒号/逗号前的一段 */
    var head = cleaned.split(/[，,。！!？?：:；;]/)[0].trim();
    head = head.replace(/(这样做|的做法|教程|家常版|太好吃了|太好吃啦|简单又?好吃|外焦里嫩|香|好吃).*$/, "").trim();
    if (head.length >= 2 && head.length <= 12) return { name: head, known: false };

    return { name: "", known: false };
  }

  /* 由菜名推出食材（已知食材 + 常用调料） */
  function draftIngredients(name, knownRecipe) {
    if (knownRecipe) {
      return knownRecipe.e.map(function (p) { return [p[0], p[1]]; });
    }
    var out = [], seen = {};
    Object.keys(DICT).sort(function (a, b) { return b.length - a.length; }).forEach(function (k) {
      if (name.indexOf(k) >= 0 && !seen[k]) { seen[k] = 1; out.push([k, 2]); }
    });
    /* 补常用底味，保证做法能落地 */
    var base = ["盐", "酱油", "料酒", "大蒜", "生姜"];
    base.forEach(function (k) {
      if (!seen[k]) { seen[k] = 1; out.push([k, k === "盐" ? 1 : 2]); }
    });
    if (!out.length) out = [["盐", 1]];
    return out;
  }

  function draftSteps(name) {
    return pickTemplate(name).slice();
  }

  /* 主函数：解析分享文案 → 草稿对象 */
  function parseShare(text) {
    var raw = String(text || "").trim();
    if (!raw) return null;
    var url = pickUrl(raw);
    var author = pickAuthor(raw);
    var cleaned = cleanTitle(raw);
    var dish = pickDish(raw, cleaned);

    var known = null;
    if (dish.name) {
      known = allRecipes().filter(function (r) { return r.n === dish.name; })[0] || null;
    }

    var name = dish.name || (cleaned.slice(0, 10) || "未命名菜谱");
    if (known) name = known.n;

    return {
      id: "c" + uid(),
      n: name,
      t: known ? known.t : "约 30 分钟",
      tg: known ? known.tg : "抖音导入",
      e: draftIngredients(name, known),
      s: known ? known.s.slice() : draftSteps(name),
      from: author ? (author + " · 抖音") : "抖音",
      url: url,
      known: !!known
    };
  }

  /* ── 事件 ── */
  function bind() {
    var input = $("#searchInput"), addBtn = $("#addBtn");

    /* 菜谱页：按菜名搜索 */
    var rs = $("#recipeSearch"), rsClear = $("#recipeSearchClear");
    if (rs) {
      rs.addEventListener("input", function () {
        state.q = rs.value;
        if (rsClear) rsClear.style.display = rs.value ? "grid" : "none";
        renderRecipes();
      });
      rs.addEventListener("search", function () {
        state.q = rs.value;
        if (rsClear) rsClear.style.display = rs.value ? "grid" : "none";
        renderRecipes();
      });
    }
    if (rsClear) {
      rsClear.addEventListener("click", function () {
        if (rs) rs.value = "";
        state.q = "";
        rsClear.style.display = "none";
        renderRecipes();
        if (rs) rs.focus();
      });
    }

    input.addEventListener("input", function () {
      addBtn.disabled = !input.value.trim();
      suggestFor(input.value);
    });
    input.addEventListener("focus", function () {
      if (input.value.trim()) suggestFor(input.value);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        addIngredient(v);
        input.value = ""; addBtn.disabled = true;
        $("#suggest").classList.remove("open");
      } else if (e.key === "Escape") {
        $("#suggest").classList.remove("open");
      }
    });
    addBtn.addEventListener("click", function () {
      var v = input.value.trim();
      if (!v) return;
      addIngredient(v);
      input.value = ""; addBtn.disabled = true;
      $("#suggest").classList.remove("open");
    });

    $("#shopInput").addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var v = this.value.trim();
      if (!v) return;
      state.shopping.unshift({ id: uid(), name: v, done: false, from: "" });
      this.value = "";
      save(); renderShopping();
      toast("已加入「" + v + "」");
    });

    $("#scrim").addEventListener("click", closeSheet);

    document.addEventListener("click", function (e) {
      var el;

      el = e.target.closest("[data-pick]");
      if (el) { addIngredient(el.dataset.pick); input.value = ""; addBtn.disabled = true; $("#suggest").classList.remove("open"); return; }

      el = e.target.closest("[data-new]");
      if (el) { addIngredient(el.dataset.new); input.value = ""; addBtn.disabled = true; $("#suggest").classList.remove("open"); return; }

      el = e.target.closest("[data-quick]");
      if (el) { addIngredient(el.dataset.quick); return; }

      if (!e.target.closest(".search-wrap")) $("#suggest").classList.remove("open");

      el = e.target.closest("[data-act='remove']");
      if (el) {
        state.pantry = state.pantry.filter(function (x) { return x.id !== el.dataset.id; });
        save(); renderPantry(); renderChips(); renderRecipes();
        return;
      }

      el = e.target.closest("[data-filter]");
      if (el) { state.filter = el.dataset.filter; renderRecipes(); return; }

      el = e.target.closest("[data-goto]");
      if (el) { switchTab(el.dataset.goto); return; }

      el = e.target.closest(".card");
      if (el) { openIngredient(el.dataset.id); return; }

      el = e.target.closest("[data-rk]");
      if (el) {
        var rk = el.dataset.rk;
        var target = allRecipes().filter(function (r) { return r.n === rk; })[0];
        if (target) openRecipe(target);
        return;
      }

      /* 编辑某道菜：把现有内容回填到草稿弹层 */
      el = e.target.closest("[data-edit]");
      if (el) {
        var en = el.dataset.edit;
        var mr = myRecipe(en);
        var src = mr || allRecipes().filter(function (r) { return r.n === en; })[0];
        if (src) {
          openDraft({
            __edit: !!mr,
            id: mr ? mr.id : "",
            n: src.n,
            t: src.t,
            tg: src.tg,
            e: src.e.map(function (p) { return [p[0], p[1]]; }),
            s: src.s.slice(),
            from: src.from || "",
            url: src.url || "",
            known: true
          });
        }
        return;
      }

      /* 删除「我的」菜谱 */
      el = e.target.closest("[data-delrecipe]");
      if (el) {
        var dn = el.dataset.delrecipe;
        if (!window.confirm("删除「" + dn + "」？删除后无法恢复。")) return;
        state.custom = (state.custom || []).filter(function (x) { return x.n !== dn; });
        save();
        renderRecipes(); renderCustom();
        closeSheet();
        toast("已删除「" + dn + "」");
        return;
      }

      el = e.target.closest("[data-qty]");
      if (el) {
        var d = Number(el.dataset.qty);
        state.pantry.forEach(function (x) {
          if (x.id === el.dataset.id) x.qty = Math.max(1, x.qty + d);
        });
        save(); renderPantry(); renderRecipes();
        var cur = null;
        state.pantry.forEach(function (x) { if (x.id === el.dataset.id) cur = x; });
        if (cur) openIngredient(cur.id);
        return;
      }

      el = e.target.closest("[data-refind]");
      if (el) {
        var nm = el.dataset.refind;
        delete state.photos[nm];
        delete tried[nm];
        save();
        renderPantry(); renderRecipes(); renderShopping();
        toast("重新找图中…");
        findPhoto(nm).then(function (u) {
          toast(u ? "已换成实拍图" : "没找到实拍图，保留 AI 插图");
          renderPantry(); renderRecipes();
        });
        closeSheet();
        return;
      }

      el = e.target.closest("[data-fill]");
      if (el) {
        var rn = el.dataset.fill;
        var rec = RECIPES.filter(function (r) { return r.n === rn; })[0];
        if (rec) {
          var set = haveSet();
          var added = 0;
          rec.e.forEach(function (p) {
            var k = p[0];
            var has = set[k] || (ALIAS[k] || []).some(function (a) { return set[a]; });
            if (has) return;
            if (state.shopping.some(function (s) { return s.name === k; })) return;
            state.shopping.unshift({ id: uid(), name: k, done: false, from: rec.n });
            added++;
          });
          save(); renderShopping();
          closeSheet();
          toast(added ? ("已加入 " + added + " 样待购食材") : "这些食材你都已经有了");
        }
        return;
      }

      el = e.target.closest("[data-shop-done]");
      if (el) {
        state.shopping.forEach(function (s) { if (s.id === el.dataset.shopDone) s.done = !s.done; });
        save(); renderShopping();
        return;
      }

      el = e.target.closest("[data-shop-del]");
      if (el) {
        state.shopping = state.shopping.filter(function (s) { return s.id !== el.dataset.shopDel; });
        save(); renderShopping();
        return;
      }

      if (e.target.closest("[data-close]")) { closeSheet(); return; }

      el = e.target.closest(".tab");
      if (el) { switchTab(el.dataset.tab); return; }
    });

    /* ── 抖音导入 ── */
    var impText = $("#impText"), impGo = $("#impGo"), impStage = $("#impStage");

    function refreshImpBtn() {
      if (!impText || !impGo) return;
      impGo.disabled = !impText.value.trim();
    }
    if (impText) {
      impText.addEventListener("input", function () {
        refreshImpBtn();
        if (impStage && !impText.value.trim()) { impStage.classList.remove("show"); }
      });
      /* 支持直接粘贴（含移动端长按粘贴） */
      impText.addEventListener("paste", function () {
        setTimeout(refreshImpBtn, 30);
      });
    }

    function doParse() {
      if (!impText) return;
      var raw = impText.value.trim();
      if (!raw) { toast("先把抖音的分享内容粘贴进来"); return; }

      var draft = parseShare(raw);
      if (!draft) { toast("没能读出菜名，检查一下文案"); return; }

      if (impStage) {
        impStage.innerHTML = '已识别菜名：<b>' + esc(draft.n) + '</b>' +
          (draft.from ? '　作者：' + esc(draft.from) : '') +
          (draft.known ? '<br />菜谱库里已有同名菜，做法已完整填好。' : '<br />按菜名推出食材和做法，可自己改。');
        impStage.classList.add("show");
      }
      openDraft(draft);
    }

    if (impGo) impGo.addEventListener("click", doParse);

    /* 在导入列表里点开已保存的菜谱 */
    document.addEventListener("click", function (e) {
      var el2 = e.target.closest("[data-custom]");
      if (el2) {
        var r = (state.custom || [])[Number(el2.dataset.custom)];
        if (r) openRecipe(r);
        return;
      }
      if (e.target.closest("[data-save-draft]")) {
        saveDraft();
        return;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     12. 启动
     ═══════════════════════════════════════════════════════════ */
  load();

  /* 预置：把「葱烧带鱼」直接放进本地菜谱，打开就有，不需要手动导入 */
  function seedBuiltins() {
    var SEEDS = [
      {
        n: "葱烧带鱼", t: "30 分钟", tg: "家常",
        e: [["带鱼", 2], ["大葱", 2], ["生姜", 3], ["大蒜", 3], ["酱油", 2], ["料酒", 2], ["醋", 1], ["糖", 1]],
        s: ["带鱼去头去内脏，刮掉腹内黑膜，剪成 6 厘米段。",
            "用料酒和姜片腌 10 分钟去腥，再用厨房纸彻底吸干水分。",
            "薄薄拍一层淀粉，中火煎到两面金黄定型，先盛出。",
            "锅留底油，下姜蒜和一半葱段炒香，加酱油、醋、糖和小半碗水烧开。",
            "放回带鱼，铺上剩下的葱段，小火焖 8 分钟。",
            "大火收汁到浓稠挂身，出锅前淋一点明油。"],
        from: "抖音 · 范大厨来了"
      }
    ];
    var changed = false;
    SEEDS.forEach(function (sd) {
      var dup = (state.custom || []).some(function (x) { return x.n === sd.n; });
      if (!dup) {
        state.custom.unshift({
          id: "seed-" + sd.n, n: sd.n, t: sd.t, tg: sd.tg,
          e: sd.e, s: sd.s, from: sd.from, url: "https://v.douyin.com/E1DZXcaizi0/"
        });
        changed = true;
      }
    });
    if (changed) save();
  }
  seedBuiltins();

  /* 图片兜底：任何一张图加载失败，立刻换成本地生成的插图，绝不空白 */
  window.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && !t.dataset.fb) {
      t.dataset.fb = "1";
      var nm = (t.getAttribute("alt") || "").replace(/配图$/, "").trim() || "菜";
      t.src = artFor(nm);
    }
  }, true);

  renderChips();
  renderPantry();
  renderRecipes();
  renderShopping();
  renderCustom();
  bind();

  if (!state.pantry.length) {
    setTimeout(function () { toast("输入食材名，立刻匹配出能做的菜"); }, 900);
  }
})();
</script>
</body>
</html>
