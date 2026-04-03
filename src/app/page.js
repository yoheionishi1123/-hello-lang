'use client';

import { useState, useRef } from 'react';
import { Mic, Send, Volume2, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { usePhrases } from '@/hooks/usePhrases';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const { savePhrase } = usePhrases();
  const recognitionRef = useRef(null);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("お使いのブラウザは音声入力に対応していません。Safariをご利用いただくか、テキストで入力してください。");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('マイクへのアクセスが拒否されています。スマホの「設定」アプリや、URL横のアイコンからマイクの使用を【許可】してください。');
        } else if (event.error !== 'no-speech') {
          alert('マイクのエラーが発生しました: ' + event.error);
        }
      };

      recognition.onend = () => setIsRecording(false);
      
      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      alert('マイクの初期化に失敗しました。iPhoneのChromeやLINEではマイクが使えない場合があります、Safariでお試しください。');
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      
      const data = await res.json();
      if (data.translation) {
        setResult(data);
        savePhrase(inputText, data.translation, data.category);
        playAudio(data.translation);
      }
    } catch (e) {
      console.error(e);
      alert('翻訳に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hello Lang</h1>
      </div>

      <div className={styles.inputSection}>
        <textarea
          className={styles.textArea}
          placeholder="これって英語でなんて言うんだろう？&#13;&#10;音声かテキストで入力してください。"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className={styles.actionRow}>
          <button 
            className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
            onClick={toggleRecording}
          >
            <Mic size={24} />
          </button>
          
          <button 
            className={styles.submitButton}
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? <Loader2 className={styles.spin} size={20} /> : <Send size={20} />}
            <span>翻訳</span>
          </button>
        </div>
      </div>

      {result && (
        <div className={styles.resultSection}>
          <span className={styles.categoryTag}>{result.category}</span>
          <p className={styles.translationText}>{result.translation}</p>
          
          <button className={styles.playButton} onClick={() => playAudio(result.translation)}>
            <Volume2 size={24} />
            もう一度聞く
          </button>
        </div>
      )}
    </div>
  );
}
