#!/usr/bin/env node
/**
 * Publish Hello Lang strategy docs to Notion.
 *
 * Required env vars:
 * - NOTION_TOKEN
 * - NOTION_PAGE_ID
 *
 * Usage:
 *   node scripts/publish-plans-to-notion.js
 *   node scripts/publish-plans-to-notion.js --dry-run
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = path.resolve(__dirname, '..');
const DOCS = [
  { title: 'Hello Lang Current Product Spec', file: path.join(ROOT, 'docs', 'current-product-spec.md') },
  { title: 'Hello Lang Business Plan', file: path.join(ROOT, 'docs', 'business-plan.md') },
  { title: 'Hello Lang Product Roadmap', file: path.join(ROOT, 'docs', 'roadmap.md') },
];

function readFile(file) {
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').trim();
}

function splitRichText(content) {
  const chunks = [];
  for (let i = 0; i < content.length; i += 1800) {
    chunks.push({
      type: 'text',
      text: { content: content.slice(i, i + 1800) },
    });
  }
  return chunks.length ? chunks : [{ type: 'text', text: { content: '' } }];
}

function makeBlock(type, content) {
  return {
    object: 'block',
    type,
    [type]: { rich_text: splitRichText(content) },
  };
}

function markdownToBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let paragraph = [];
  let numberedGroup = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push(makeBlock('paragraph', paragraph.join(' ').trim()));
    paragraph = [];
  }

  function flushNumbered() {
    if (!numberedGroup.length) return;
    for (const item of numberedGroup) {
      blocks.push(makeBlock('numbered_list_item', item));
    }
    numberedGroup = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushNumbered();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushNumbered();
      blocks.push(makeBlock('heading_1', line.slice(2).trim()));
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushNumbered();
      blocks.push(makeBlock('heading_2', line.slice(3).trim()));
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushNumbered();
      blocks.push(makeBlock('heading_3', line.slice(4).trim()));
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      flushNumbered();
      blocks.push(makeBlock('bulleted_list_item', line.slice(2).trim()));
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      numberedGroup.push(line.replace(/^\d+\.\s/, '').trim());
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushNumbered();

  return blocks;
}

async function appendChildren(notion, blockId, blocks) {
  for (let i = 0; i < blocks.length; i += 100) {
    await notion.blocks.children.append({
      block_id: blockId,
      children: blocks.slice(i, i + 100),
    });
  }
}

async function createDocPage(notion, parentId, title, markdown) {
  const page = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentId },
    properties: {
      title: {
        title: [{ type: 'text', text: { content: title } }],
      },
    },
  });

  const blocks = markdownToBlocks(markdown);
  await appendChildren(notion, page.id, blocks);
  return page;
}

async function main() {
  const docs = DOCS.map((doc) => ({
    ...doc,
    markdown: readFile(doc.file),
  }));

  if (DRY_RUN) {
    const summary = docs.map((doc) => ({
      title: doc.title,
      blocks: markdownToBlocks(doc.markdown).length,
      file: path.relative(ROOT, doc.file),
    }));
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  const token = process.env.NOTION_TOKEN;
  const parentPageId = process.env.NOTION_PAGE_ID;

  if (!token || !parentPageId) {
    throw new Error('NOTION_TOKEN and NOTION_PAGE_ID are required');
  }

  const notion = new Client({ auth: token });
  const today = new Date().toISOString().slice(0, 10);

  const indexPage = await notion.pages.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🧭' },
    properties: {
      title: {
        title: [{ type: 'text', text: { content: `Hello Lang Strategy Docs — ${today}` } }],
      },
    },
  });

  await appendChildren(
    notion,
    indexPage.id,
    [
      makeBlock('paragraph', 'This page groups the latest Hello Lang strategy documents created from the current repository state.'),
    ]
  );

  for (const doc of docs) {
    const page = await createDocPage(notion, indexPage.id, doc.title, doc.markdown);
    console.log(`${doc.title}: ${page.url}`);
  }

  console.log(`Index page: ${indexPage.url}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
