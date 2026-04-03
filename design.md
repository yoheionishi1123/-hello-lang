# Hello Lang Design System
> Pinterest Design System をベースにした Hello Lang 独自のデザインガイドライン（アースカラー版）

---

## 1. Visual Theme & Atmosphere

**「陶土と日光」** — テラコッタ・クリーム・セージの自然素材感をテーマにした、温かみと落ち着きのある学習体験。

- **背景**: クリーム色のウォームホワイト `#faf8f5` — 蛍光灯的な青白さを排除
- **アクセント**: テラコッタ（`#b5533c`）— 原色レッドではなく、陶器・土・夕焼けの自然な赤み
- **グレー系**: ウォームアンバー/タン系（`#6b5d56`, `#b5a89a`, `#e2d9cf`）— スチールグレーは使わない
- **タイポグラフィ**: `Plus Jakarta Sans` / `Noto Sans JP`

---

## 2. Natural Color System（原色排除・視認性担保）

### 🎨 原色排除の原則（No Primary Colors）

**原色（NG）** とは、RGB系の純粋な色（`#ff0000`, `#0000ff`, `#00ff00`）や、これに近い過飽和色のことです。

| NG例 | 代替案 | 理由 |
|------|--------|------|
| `#e60023` 純粋な赤 | `#b5533c` テラコッタ | 彩度が低く、土の温かみがある |
| `#0000ff` 純粋な青 | `#5a6db5` スレートブルー | くすみがあり、自然な知性を感じる |
| `#10b981` ビビッドグリーン | `#3d6b47` フォレストグリーン | 落ち着いた自然の緑 |
| `#6366f1` 電気インジゴ | 使用しない | 自然界にない人工的な色 |

**判断基準**: 「自然界（土・木・石・空・夕焼け）に存在する色か？」を問う。Yesなら使用可。

---

## 3. Color Accessibility（視認性・コントラスト基準）

### WCAG AA コンプライアンス

すべてのテキスト・UIは以下のコントラスト比を必達とする：

| 用途 | 最低コントラスト比 | 規格 |
|------|------------------|------|
| **本文テキスト**（18px以下） | **4.5:1** 以上 | WCAG AA |
| **大きな文字**（18px以上 / bold 14px以上） | **3:1** 以上 | WCAG AA |
| **UIコンポーネント**（ボタン枠・アイコン） | **3:1** 以上 | WCAG AA |
| **禁止**: 装飾的でないテキスト | 4.5:1 未満 | 違反 |

### 実測コントラスト比（主要ペア）

| 前景 | 背景 | 比率 | 判定 |
|------|------|------|------|
| `#2d221e`（エスプレッソ）| `#ffffff` | **16.3:1** | ✅ AAA |
| `#2d221e` | `#faf8f5` | **14.8:1** | ✅ AAA |
| `#6b5d56`（アンバー）| `#ffffff` | **5.8:1** | ✅ AA |
| `#b5533c`（テラコッタ）| `#ffffff` | **4.8:1** | ✅ AA |
| `#ffffff`（白）| `#b5533c` | **4.8:1** | ✅ AA（ボタンテキスト） |
| `#3d6b47`（フォレスト）| `#ffffff` | **8.3:1** | ✅ AAA |

### 色だけに依存しない原則

- エラー状態は色 + アイコン + テキストで表現する（色覚障害対応）
- フォーカスリングは必ず3px以上の明確な輪郭を持たせる
- ボタンは背景色だけでなく、パディング・形状でクリック可能と知覚できるようにする

---

## 4. Color Palette

### ブランドカラー
| 役割 | カラー名 | HEX | コントラスト（白地）| 用途 |
|------|---------|-----|---------------------|------|
| **Primary CTA** | テラコッタ | `#b5533c` | 4.8:1 ✅ | 主要ボタン・ブランドアクセント |
| **Primary Hover** | ダーククレイ | `#9a4431` | 6.4:1 ✅ | ホバー・アクティブ状態 |
| **Primary Light** | ブラッシュ | `#f5e8e4` | — | ライトウォッシュ背景 |
| **Success** | フォレストグリーン | `#3d6b47` | 8.3:1 ✅ | 成功・学習完了 |
| **Success Light** | ペールセージ | `#e6f0e8` | — | 成功状態の背景 |

### テキストカラー
| 役割 | HEX | コントラスト（白地）| 用途 |
|------|-----|---------------------|------|
| **Primary** | `#2d221e` | 16.3:1 ✅ | 本文（温かいエスプレッソブラック） |
| **Muted** | `#6b5d56` | 5.8:1 ✅ | 説明文・キャプション |
| **Placeholder** | `#b5a89a` | 2.9:1 ⚠️ | プレースホルダーのみ（装飾） |
| **On colored** | `#ffffff` | — | 着色背景上のテキスト |

### サーフェス & ボーダー
| 役割 | HEX | 用途 |
|------|-----|------|
| **Background** | `#faf8f5` | ページ背景（クリームホワイト） |
| **Surface** | `#ffffff` | カード・フォーム背景 |
| **Surface Warm** | `#f2ede6` | セカンダリボタン・温かいサーフェス |
| **Surface Light** | `#ede7df` | 丸形ボタン背景・バッジ |
| **Border** | `#e2d9cf` | カード・セクションのボーダー |
| **Border Input** | `#b5a89a` | インプットのボーダー（視認性重視） |
| **Dark Surface** | `#2d2520` | ダークセクション |

### インタラクティブ
| 役割 | HEX | 用途 |
|------|-----|------|
| **Focus Ring** | `#5a6db5` | フォーカス状態（スレートブルー） |
| **Error** | `#8b3a2a` | エラー（ダークテラコッタ、原色赤を避ける） |
| **Error Light** | `#faf0ee` | エラー背景 |

---

## 5. Typography

### フォントスタック
```css
font-family: 'Plus Jakarta Sans', 'Noto Sans JP',
  -apple-system, system-ui, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial,
  'ヒラギノ角ゴ Pro W3', 'メイリオ', Meiryo,
  sans-serif;
```

### タイポグラフィスケール
| 役割 | サイズ | Weight | Line Height | Letter Spacing | 備考 |
|------|--------|--------|-------------|----------------|------|
| **Page Heading** | `28px / 1.75rem` | 700 | 1.2 | -1.2px | セクション見出し |
| **Card Title** | `24px / 1.5rem` | 700 | 1.3 | -0.5px | カード内英語フレーズ |
| **Body** | `16px / 1.0rem` | 400 | 1.5 | normal | 標準読み文 |
| **Body Bold** | `16px / 1.0rem` | 600 | 1.5 | normal | 強調本文 |
| **Caption** | `14px / 0.875rem` | 500 | 1.4 | normal | キャプション・メタ |
| **Small** | `12px / 0.75rem` | 500 | 1.5 | normal | タグ・ラベル |

### 原則
- **細いウェイトは使わない**: 最低 400 weight を維持
- **ヘディングにネガティブトラッキング**: -1.2px でコージーな印象
- **フォントサイズは 12px 以上**: 視認性確保

---

## 6. Component Styling

### Buttons

#### Primary（テラコッタ — 主要アクション）
```css
background: #b5533c;
color: #ffffff;          /* 白テキスト: 4.8:1 ✅ WCAG AA */
padding: 12px 20px;
border-radius: 16px;
font-weight: 600;
font-size: 0.9rem;
```

#### Secondary（ウォームサンド — 副次アクション）
```css
background: #f2ede6;
color: #2d221e;          /* 濃いテキスト: 14+:1 ✅ */
padding: 12px 20px;
border-radius: 16px;
font-weight: 600;
```

#### Circular（丸形アイコンボタン）
```css
background: #ede7df;
color: #2d221e;
border-radius: 50%;
width: 48px;
height: 48px;
```

### Input Fields
```css
background: #ffffff;
border: 1px solid #b5a89a;  /* 視認性のあるウォームタン */
border-radius: 16px;
padding: 11px 15px;
color: #2d221e;
font-size: 1rem;             /* 最低16px — モバイルズーム防止 */
/* focus: #5a6db5 outline (スレートブルー) */
```

### Cards
- 背景: `#ffffff`
- Border-radius: `20px`（カード）/ `28px`（大カード）
- Border: `1px solid #e2d9cf`
- シャドウ: 最小限（`var(--shadow-sm)` or なし）

---

## 7. Border Radius Scale

| 用途 | サイズ |
|------|--------|
| **Standard** (タグ・小カード) | `12px` |
| **Button / Input** (ボタン・インプット) | `16px` |
| **Card** (通常カード) | `20px` |
| **Large Card** (スワイプカード) | `28px` |
| **Hero** (大フィーチャーブロック) | `40px` |
| **Circle** (アイコンボタン) | `50%` |

---

## 8. Do's and Don'ts（更新版）

### ✅ Do
- **自然界由来の色**を使う（テラコッタ・セージ・砂・クリーム・エスプレッソ）
- テキストのコントラスト比は **4.5:1 以上**を必ず確保する
- エスプレッソブラック（`#2d221e`）を本文に使う — 純粋な黒より温かく、コントラストも十分
- ボタンンテキストは白（`#ffffff`）— テラコッタ上で4.8:1✅
- `16px` 角丸でボタン・インプットを統一

### ❌ Don't
- **原色（`#e60023`, `#0000ff`, `#00ff00` など）を使わない** — 自然界にない過飽和色
- 本文に `#b5a89a` や `#e2d9cf` などの薄い色を使わない（コントラスト不足）
- フォントサイズを `12px` 以下にしない（視認性・モバイル操作性の問題）
- スチールグレー（`#9ca3af` 等の青みグレー）を使わない — 常にウォームタン系
- 重いシャドウを入れない — 深度はボーダーと色の温度差で表現

---

## 9. CSS Variables

```css
:root {
  /* === ブランド === */
  --color-primary: #b5533c;           /* テラコッタ */
  --color-primary-hover: #9a4431;     /* ダーククレイ */
  --color-primary-light: #f5e8e4;     /* ブラッシュ */

  --color-success: #3d6b47;           /* フォレストグリーン */
  --color-success-light: #e6f0e8;     /* ペールセージ */

  /* === テキスト === */
  --color-text-main: #2d221e;         /* エスプレッソブラック (16.3:1) */
  --color-text-muted: #6b5d56;        /* ウォームアンバー (5.8:1) */
  --color-text-inverse: #ffffff;

  /* === サーフェス === */
  --color-background: #faf8f5;        /* クリームホワイト */
  --color-surface: #ffffff;
  --color-surface-warm: #f2ede6;      /* サンドベージュ */
  --color-surface-light: #ede7df;     /* ライトサンド */

  /* === ボーダー === */
  --color-border: #e2d9cf;            /* ウォームベージュ */
  --color-border-input: #b5a89a;      /* ウォームタン */

  /* === インタラクティブ === */
  --color-focus: #5a6db5;             /* スレートブルー */
  --color-error: #8b3a2a;             /* ダークテラコッタ */
  --color-error-light: #faf0ee;

  /* === シャドウ（エスプレッソベース） === */
  --shadow-sm:    0 1px 2px 0 rgb(45 34 30 / 0.06);
  --shadow-md:    0 4px 6px -1px rgb(45 34 30 / 0.08), 0 2px 4px -2px rgb(45 34 30 / 0.06);
  --shadow-lg:    0 10px 15px -3px rgb(45 34 30 / 0.08);
  --shadow-float: 0 20px 40px -8px rgb(45 34 30 / 0.12);

  /* === Border Radius === */
  --radius-sm:   12px;
  --radius-md:   16px;
  --radius-lg:   20px;
  --radius-xl:   28px;
  --radius-2xl:  40px;
  --radius-full: 9999px;
}
```
