# Hello Lang Design System
> Pinterest Design System をベースにした Hello Lang 独自のデザインガイドライン

---

## 1. Visual Theme & Atmosphere

Pinterest のデザインを参考に、**温かみのある発見・閲覧体験**をベースにしています。
コーポレートな冷たさではなく、手作り感・生活感のある UI を目指します。

- **背景**: 暖かみのあるウォームホワイト — 冷たいクリーンホワイトではない
- **アクセント**: Hello Lang レッド（`#e60023` — Pinterest Red）を単独のブランドカラーとして使用
- **グレー系**: オリーブ/サンドトーン（`#91918c`, `#62625b`, `#e5e5e0`）— スチールグレーは使わない
- **タイポグラフィ**: `Plus Jakarta Sans` / `Noto Sans JP`（Pinterest の Pin Sans に相当）

---

## 2. Color Palette

### ブランドカラー
| 役割 | カラー名 | HEX | 用途 |
|------|---------|-----|------|
| **Primary CTA** | Pinterest Red | `#e60023` | 主要ボタン・ブランドアクセント |
| **Success** | Green 700 | `#103c25` | 成功状態・学習完了 |

### テキストカラー
| 役割 | HEX | 用途 |
|------|-----|------|
| **Primary** | `#211922` | 本文（プラムブラック — 純粋な黒より温かい） |
| **Secondary** | `#62625b` | 説明文・ミュートテキスト（オリーブグレー） |
| **Disabled** | `#91918c` | 無効状態・ボーダー（ウォームシルバー） |
| **On dark/colored** | `#ffffff` | ダーク背景上のテキスト |

### サーフェス & ボーダー
| 役割 | HEX | 用途 |
|------|-----|------|
| **Background** | `#f8fafc` | ページ背景（現行: やや青みがかり — ウォームホワイトに近づけること） |
| **Surface** | `#ffffff` | カード・フォーム背景 |
| **Sand Gray** | `#e5e5e0` | セカンダリボタン背景・温かいサーフェス |
| **Warm Light** | `#e0e0d9` | 丸形ボタン背景・バッジ |
| **Warm Wash** | `hsla(60, 20%, 98%, 0.5)` | 薄い温かみのあるバッジ背景 |
| **Border** | `#91918c` | インプット・カードのボーダー |
| **Dark Surface** | `#33332e` | フッター・ダークセクション背景 |

### インタラクティブ
| 役割 | HEX | 用途 |
|------|-----|------|
| **Focus Ring** | `#435ee5` | フォーカス状態のアウトライン |
| **Link** | `#2b48d4` | リンクテキスト |
| **Error** | `#9e0a0a` | フォームエラー |

---

## 3. Typography

### フォントスタック
```css
font-family: 'Plus Jakarta Sans', 'Noto Sans JP',
  -apple-system, system-ui, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial,
  'ヒラギノ角ゴ Pro W3', 'メイリオ', Meiryo, 'ＭＳ Ｐゴシック',
  sans-serif;
```

### タイポグラフィスケール
| 役割 | サイズ | Weight | Line Height | Letter Spacing | 備考 |
|------|--------|--------|-------------|----------------|------|
| **Display Hero** | `70px / 4.38rem` | 600 | normal | normal | 最大インパクト |
| **Section Heading** | `28px / 1.75rem` | 700 | normal | -1.2px | ネガティブトラッキング |
| **Body** | `16px / 1.00rem` | 400 | 1.40 | normal | 標準読み文 |
| **Caption Bold** | `14px / 0.88rem` | 700 | normal | normal | 強調メタデータ |
| **Caption** | `12px / 0.75rem` | 400–500 | 1.50 | normal | 小テキスト・タグ |
| **Button** | `12px / 0.75rem` | 400 | normal | normal | ボタンラベル |

### 原則
- **コンパクトなスケール**: 大半の UI テキストは 12〜16px — アプリライクな密度
- **細いウェイトは使わない**: 最低 400 weight を維持。常に実体感を持たせる
- **ヘディングにネガティブトラッキング**: 28px のヘディングは -1.2px でコージーな印象

---

## 4. Component Styling

### Buttons

#### Primary Red（主要アクション）
```css
background: #e60023;
color: #000000; /* 赤上の黒テキスト — Pinterest 流 */
padding: 6px 14px;
border-radius: 16px;
border: 2px solid rgba(255, 255, 255, 0);
```

#### Secondary Sand（副次アクション）
```css
background: #e5e5e0; /* ウォームサンドグレー */
color: #000000;
padding: 6px 14px;
border-radius: 16px;
```

#### Circular Action（アイコンボタン）
```css
background: #e0e0d9;
color: #211922;
border-radius: 50%;
```

#### Ghost / Transparent（第三の選択肢）
```css
background: transparent;
color: #000000;
border: none;
```

### Input Fields
```css
background: #ffffff;
border: 1px solid #91918c;
border-radius: 16px;
padding: 11px 15px;
/* focus: セマンティックボーダー + Focus Blue (#435ee5) アウトライン */
```

### Cards
- 背景: `#ffffff` またはウォームフォグ
- Border-radius: `12px`〜`20px`（小さくしない）
- シャドウ: 最小限〜なし（コンテンツが深度を作る）
- 写真ファースト: カード上部に画像

---

## 5. Border Radius Scale
| 用途 | サイズ |
|------|--------|
| **Standard** (小カード・リンク) | `12px` |
| **Button / Input** (ボタン・インプット・中カード) | `16px` |
| **Comfortable** (フィーチャーカード) | `20px` |
| **Large** (大サイズコンテナ) | `28px` |
| **Section** (タブ・大パネル) | `32px` |
| **Hero** (ヒーロー・大フィーチャーブロック) | `40px` |
| **Circle** (アクションボタン・タブインジケーター) | `50%` |

---

## 6. Spacing System

### ベースユニット: 8px

```
4px, 6px, 7px, 8px, 10px, 11px, 12px,
16px, 18px, 20px, 22px, 24px, 32px, 80px, 100px
```

- セクション間: 32px → 80px → 100px（大きなジャンプ）
- コンテンツ密度: Pinterest のマソンリーグリッドのように、コンテンツ内は密に、セクション間は広く

---

## 7. Depth & Elevation

| Level | Treatment | 用途 |
|-------|-----------|------|
| **Flat (0)** | シャドウなし | デフォルト — コンテンツが深度を作る |
| **Subtle (1)** | 最小シャドウ | ドロップダウン・オーバーレイ |
| **Focus** | `#435ee5` フォーカスリング | アクセシビリティ |

> **哲学**: Pinterest はシャドウを最小化する。マソンリーグリッドは写真（コンテンツ）で視覚的な興味を作り、エレベーションに依存しない。深度はサーフェスカラーの温かみと、コンテナの寛大な角丸から生まれる。

---

## 8. Layout Principles

### グリッド
- **スワイプカード**: センタリング + 最大幅制限
- **リスト**: 垂直積み + 内部密度重視
- **フル幅**: ダークフッター・ヒーロー

### レスポンシブブレークポイント
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <576px | シングルカラム・コンパクト |
| Mobile Large | 576–768px | 2カラム |
| Tablet | 768–890px | 拡張グリッド |
| Desktop Small | 890–1312px | 標準レイアウト |
| Desktop | 1312–1440px | フルレイアウト |
| Large Desktop | 1440–1680px | 拡張グリッドカラム |
| Ultra-wide | >1680px | 最大グリッド密度 |

### 現行設定
```css
.main-container {
  max-width: 480px; /* モバイルシミュレーション */
  margin: 0 auto;
}
```

---

## 9. Do's and Don'ts

### ✅ Do
- ウォームニュートラルを使う（`#e5e5e0`, `#e0e0d9`, `#91918c`）— オリーブ/サンドトーン
- Pinterest Red（`#e60023`）は主要 CTA にのみ使用 — 太く、単独で
- ボタン/インプットに `16px`、カードに `20px+` の border-radius を使う
- 本文テキストにプラムブラック（`#211922`）— 純粋な黒より温かい
- 写真・ビジュアルをデザインの主役にする

### ❌ Don't
- クールグレー（スチールグレー）を使わない — 常にウォーム/オリーブトーン
- 主要テキストに純粋な黒（`#000000`）を使わない — プラムブラック（`#211922`）を使う
- ピル型ボタン（完全な角丸）にしない — `16px` は丸いが pill ではない
- 重いシャドウを入れない — Pinterest はフラットデザイン、深度はコンテンツから
- カードの border-radius を `12px` 以下にしない
- 細いフォントウェイトを使わない（`400` 以上を守る）

---

## 10. CSS Variables（現行 globals.css との対応）

```css
:root {
  /* ブランドカラー */
  --color-primary: #e60023;          /* Pinterest Red */
  --color-primary-hover: #c0001e;    /* Darker Red */
  --color-primary-light: #ffe4e8;    /* Light Red Wash */

  --color-secondary: #103c25;        /* Green 700 (success) */
  --color-secondary-light: #d1fae5;  /* Green Light */

  /* テキスト */
  --color-text-main: #211922;        /* Plum Black */
  --color-text-muted: #62625b;       /* Olive Gray */
  --color-text-inverse: #ffffff;

  /* サーフェス */
  --color-background: #faf9f7;       /* Warm White (現行 #f8fafc より温かく) */
  --color-surface: #ffffff;
  --color-surface-warm: #e5e5e0;     /* Sand Gray */
  --color-surface-light: #e0e0d9;    /* Warm Light */

  /* ボーダー */
  --color-border: #91918c;           /* Warm Silver */

  /* シャドウ */
  --shadow-sm: 0 1px 2px 0 rgb(33 25 34 / 0.05);   /* プラムベース */
  --shadow-md: 0 4px 6px -1px rgb(33 25 34 / 0.08);
  --shadow-lg: 0 10px 15px -3px rgb(33 25 34 / 0.08);

  /* Border Radius */
  --radius-sm: 12px;
  --radius-md: 16px;    /* ボタン・インプット標準 */
  --radius-lg: 20px;    /* カード標準 */
  --radius-xl: 28px;
  --radius-2xl: 40px;
  --radius-full: 9999px;
}
```

---

## 11. コンポーネント別クイックリファレンス

### ヒーローセクション
> 白背景。`70px` `weight:600` のプラムブラック見出し。赤 CTA ボタン（`#e60023`, `16px` radius）。セカンダリサンドボタン（`#e5e5e0`, `16px` radius）。

### カード（フレーズカード等）
> 白背景・`16px` radius・シャドウ最小。上部に画像/ビジュアル。`16px` `weight:400` `#62625b` の説明テキスト。

### 丸形アクションボタン
> `#e0e0d9` 背景・`50%` radius・`#211922` アイコン。

### インプットフィールド
> 白背景・`1px solid #91918c`・`16px` radius・`11px 15px` padding。フォーカス: `#435ee5` アウトライン。

### ダークフッター
> `#33332e` 背景。ロゴ白。`12px` リンクテキスト `#91918c`。
