import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const prompt = `
以下のユーザーの入力（日本語）を、最も自然で日常的な英語のフレーズに翻訳してください。
スラングや乱暴な言葉（例：「あいつマジでぶん殴る」等）が含まれている場合は、そのニュアンスをそのまま汲み取った生の英語（例： "I'm gonna punch that guy." など）に直してください。
同時に、その発言が利用される「シチュエーションカテゴリ」を以下の例のように短く分類して設定してください。
カテゴリの例：日常、怒り / トラブル、料理 / 食事、カラオケ、起床、挨拶、仕事、恋愛 など

出力は必ず以下のJSON形式のみにしてください。
{
  "translation": "英語の翻訳結果",
  "category": "シチュエーションカテゴリ"
}

ユーザー入力: "${text}"
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    });

    const outputText = response.text;
    const jsonResult = JSON.parse(outputText);

    return NextResponse.json({ 
        translation: jsonResult.translation, 
        category: jsonResult.category 
    });

  } catch (error) {
    console.error('Translation error:', error);
    // If it fails, maybe return a fallback
    return NextResponse.json({ 
      error: 'Failed to translate',
      translation: `[Error: 翻訳できませんでした] ${text}`,
      category: 'エラー'
    }, { status: 500 });
  }
}
