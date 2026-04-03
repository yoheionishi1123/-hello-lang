'use client';

import { useState, useEffect, useRef } from 'react';
import { usePhrases } from '@/hooks/usePhrases';
import { Volume2, Trash2, CheckCircle, Search, PlaySquare, Square } from 'lucide-react';
import styles from './List.module.css';

export default function ListPage() {
  const { phrases, isLoaded, deletePhrase } = usePhrases();
  const [searchTerm, setSearchTerm] = useState('');
  const [playingIndex, setPlayingIndex] = useState(-1);
  
  const playingIndexRef = useRef(playingIndex);
  const filteredPhrasesRef = useRef([]);

  useEffect(() => { playingIndexRef.current = playingIndex; }, [playingIndex]);

  if (!isLoaded) return <div className={styles.container}>Loading...</div>;

  const filteredPhrases = phrases.filter(p => 
    p.original.includes(searchTerm) || 
    p.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Keep ref up to date so async onend can read it safely
  useEffect(() => {
    filteredPhrasesRef.current = filteredPhrases;
  }, [filteredPhrases]);

  const playSingleAudio = (text) => {
    if ('speechSynthesis' in window) {
      setPlayingIndex(-1); // 連続再生中なら止める
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSequence = (index = 0) => {
    if (!('speechSynthesis' in window)) return;
    const currentList = filteredPhrasesRef.current;
    
    if (index >= currentList.length) {
       setPlayingIndex(-1);
       return;
    }

    setPlayingIndex(index);
    const phrase = currentList[index];

    // まず日本語を読み上げ（任意）、そのあと英語を読み上げるなどアレンジ可能ですが、今回は英語のみ
    const utterance = new SpeechSynthesisUtterance(phrase.translation);
    utterance.lang = 'en-US';
    
    utterance.onend = () => {
       // Stopボタンが押されていなければ次へ
       if (playingIndexRef.current !== -1) {
          setTimeout(() => {
             playSequence(index + 1);
          }, 600); // 0.6秒あけて次へ
       }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const togglePlayAll = () => {
    if (playingIndex !== -1) {
       setPlayingIndex(-1);
       window.speechSynthesis.cancel();
    } else {
       window.speechSynthesis.cancel();
       if (filteredPhrases.length > 0) playSequence(0);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Phrases</h1>
        <p className={styles.subtitle}>登録したフレーズ一覧 ({phrases.length})</p>
      </div>

      <div className={styles.searchBox}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="検索..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPhrases.length > 0 && (
        <button 
          className={`${styles.playAllBtn} ${playingIndex !== -1 ? styles.playingAll : ''}`}
          onClick={togglePlayAll}
        >
          {playingIndex !== -1 ? (
             <><Square size={18} /> 再生ストップ</>
          ) : (
             <><PlaySquare size={18} /> 一覧を連続再生する</>
          )}
        </button>
      )}

      <div className={styles.list}>
        {filteredPhrases.length === 0 ? (
          <div className={styles.emptyState}>フレーズが見つかりません。</div>
        ) : (
          filteredPhrases.map((phrase, index) => {
            const isPlaying = playingIndex === index;
            
            return (
              <div 
                key={phrase.id} 
                className={`${styles.listItem} ${phrase.status === 'mastered' ? styles.mastered : ''} ${isPlaying ? styles.itemPlaying : ''}`}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.categoryTag}>{phrase.category}</span>
                  {phrase.status === 'mastered' && (
                    <span className={styles.masteredTag}>
                      <CheckCircle size={14} /> 覚えた！
                    </span>
                  )}
                </div>
                
                <div className={styles.nativeText}>{phrase.original}</div>
                <div className={styles.englishText}>{phrase.translation}</div>
                
                <div className={styles.actions}>
                  <button className={`${styles.actionBtn} ${isPlaying ? styles.audioActive : ''}`} onClick={() => playSingleAudio(phrase.translation)}>
                    <Volume2 size={20} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deletePhrase(phrase.id)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
