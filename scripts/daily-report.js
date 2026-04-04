#!/usr/bin/env node
/**
 * Hello Lang — Daily Report Generator
 * Notionに日次レポートページを自動作成し、Slackに通知します。
 */

const { Client } = require('@notionhq/client');
const { execSync } = require('child_process');
const https = require('https');
const config = require('./report-config.json');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = process.env.NOTION_PAGE_ID;
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ── 日付ユーティリティ ──────────────────────────────
function getJSTDate(offsetDays = 0) {
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000 + offsetDays * 86400000);
  return d.toISOString().slice(0, 10);
}

function formatDateJP(dateStr) {
  const [y, m, day] = dateStr.split('-');
  return `${y}年${Number(m)}月${Number(day)}日`;
}

// ── Gitコミット取得（昨日分）──────────────────────────
function getYesterdayCommits() {
  const yesterday = getJSTDate(-1);
  const today = getJSTDate(0);
  try {
    const log = execSync(
      `git log --oneline --after="${yesterday} 00:00" --before="${today} 00:00" 2>/dev/null || echo ""`,
      { encoding: 'utf8', cwd: process.cwd() }
    ).trim();
    if (!log) return ['（コミットなし）'];
    return log.split('\n').map(l => l.trim()).filter(Boolean);
  } catch {
    return ['（git log 取得失敗）'];
  }
}

// ── Supabase ユーザー数取得 ───────────────────────────
async function getSupabaseStats() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { users: null, phrases: null };
  return new Promise((resolve) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/phrases?select=count`);
    const req = https.request(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'count=exact',
      }
    }, (res) => {
      const count = res.headers['content-range']?.split('/')[1];
      resolve({ users: null, phrases: count ? Number(count) : null });
    });
    req.on('error', () => resolve({ users: null, phrases: null }));
    req.end();
  });
}

// ── プログレスバー生成 ────────────────────────────────
function progressBar(current, target, width = 10) {
  if (current === null || target === 0) return '▒'.repeat(width);
  const ratio = Math.min(current / target, 1);
  const filled = Math.round(ratio * width);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  const pct = Math.round(ratio * 100);
  return `${bar} ${pct}%`;
}

// ── Notion ページ作成 ────────────────────────────────
async function createNotionReport({ today, commits, stats }) {
  const title = `📅 Daily Report — ${formatDateJP(today)}`;
  const { users, phrases } = stats;

  const goalUsers = config.goals.users;
  const goalPhrases = config.goals.phrases;
  const goalMRR = config.goals.mrr;
  const costs = Object.values(config.costs);
  const totalCostUSD = costs.reduce((sum, c) => sum + c.amount, 0);

  const commitBlocks = commits.map(c => ({
    object: 'block', type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: c } }]
    }
  }));

  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: PAGE_ID },
    icon: { type: 'emoji', emoji: '📋' },
    properties: {
      title: {
        title: [{ type: 'text', text: { content: title } }]
      }
    },
    children: [
      // ── ヘッダー
      {
        object: 'block', type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '🚀' },
          rich_text: [{ type: 'text', text: { content: `Hello Lang — ${formatDateJP(today)} の日次レポート` }, annotations: { bold: true } }],
          color: 'orange_background'
        }
      },
      // ── 昨日のGitコミット
      {
        object: 'block', type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '✅ 昨日やったこと（Git commits）' } }] }
      },
      ...commitBlocks,
      // ── 目標と進捗
      {
        object: 'block', type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '🎯 目標と進捗' } }] }
      },
      {
        object: 'block', type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `${goalUsers.label}: ${users ?? '—'} / ${goalUsers.target}${goalUsers.unit}　${progressBar(users, goalUsers.target)}` }, annotations: { code: true } }]
        }
      },
      {
        object: 'block', type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `${goalPhrases.label}: ${phrases ?? '—'} / ${goalPhrases.target}${goalPhrases.unit}　${progressBar(phrases, goalPhrases.target)}` }, annotations: { code: true } }]
        }
      },
      {
        object: 'block', type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `${goalMRR.label}: ¥${config.revenue.current_mrr} / ¥${goalMRR.target}${goalMRR.unit}　${progressBar(config.revenue.current_mrr, goalMRR.target)}` }, annotations: { code: true } }]
        }
      },
      // ── 収支
      {
        object: 'block', type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '💰 今月の収支' } }] }
      },
      ...costs.map(c => ({
        object: 'block', type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: `${c.label}: $${c.amount} ${c.currency}` } }]
        }
      })),
      {
        object: 'block', type: 'paragraph',
        paragraph: {
          rich_text: [
            { type: 'text', text: { content: `合計コスト: $${totalCostUSD}/月` }, annotations: { bold: true } }
          ]
        }
      },
      // ── GA4（プレースホルダー）
      {
        object: 'block', type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '📊 GA4 指標（設定後に自動化）' } }] }
      },
      {
        object: 'block', type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'セッション数: —\n新規ユーザー数: —\n直帰率: —', }, annotations: { code: true } }]
        }
      },
      // ── 明日のタスク（手動記入エリア）
      {
        object: 'block', type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '📝 明日やること' } }] }
      },
      {
        object: 'block', type: 'to_do',
        to_do: { checked: false, rich_text: [{ type: 'text', text: { content: '（ここに追記してください）' }, annotations: { color: 'gray' } }] }
      },
      // ── メモ
      {
        object: 'block', type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '💬 メモ・気づき' } }] }
      },
      {
        object: 'block', type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: '' } }] }
      }
    ]
  });

  return page.url;
}

// ── Slack通知 ─────────────────────────────────────────
async function sendSlack(notionUrl, today) {
  if (!SLACK_WEBHOOK) return;
  const payload = JSON.stringify({
    text: `📋 *Hello Lang Daily Report — ${formatDateJP(today)}*\n今日のレポートが作成されました！\n${notionUrl}`
  });
  return new Promise((resolve) => {
    const url = new URL(SLACK_WEBHOOK);
    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, resolve);
    req.on('error', console.error);
    req.write(payload);
    req.end();
  });
}

// ── メイン ────────────────────────────────────────────
async function main() {
  const today = getJSTDate(0);
  console.log(`📅 Generating report for ${today}...`);

  const commits = getYesterdayCommits();
  console.log(`📝 Commits: ${commits.length} found`);

  const stats = await getSupabaseStats();
  console.log(`👥 Stats: users=${stats.users}, phrases=${stats.phrases}`);

  const notionUrl = await createNotionReport({ today, commits, stats });
  console.log(`✅ Notion page created: ${notionUrl}`);

  await sendSlack(notionUrl, today);
  console.log('🔔 Slack notified');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
