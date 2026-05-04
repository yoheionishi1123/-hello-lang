'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhrases } from '@/hooks/usePhrases';
import { Volume2, ChevronLeft, ChevronRight, CheckCircle, RefreshCcw, Repeat, PlaySquare } from 'lucide-react';
import styles from './Cards.module.css';

export default function CardsPage() {
  const { phrases, isLoaded, updatePhraseStatus } = usePhrases();
  const [deck, setDeck] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [isLooping, setIsLooping] = useState(false);
  const [isAutoPlayNext, setIsAutoPlayNext] = useState(false);
  
  const deckRef = useRef(deck);
  const isLoopingRef = useRef(isLooping);
  const isAutoPlayNextRef = useRef(isAutoPlayNext);
  const [exitDirection, setExitDirection] = useState(0);
  const topCardRef = useRef(null);

  useEffect(() => { deckRef.current = deck; }, [deck]);
  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);
  useEffect(() => { isAutoPlayNextRef.current = isAutoPlayNext; }, [isAutoPlayNext]);

  const playAudio = useCallback(function playAudioImpl(text, isAutoSequence = false) {
    if (!('speechSynthesis' in window)) return;

    if (!isAutoSequence) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    utterance.onend = () => {
      if (isLoopingRef.current) {
        setTimeout(() => playAudioImpl(text, true), 800);
      } else if (isAutoPlayNextRef.current) {
        const currentDeck = deckRef.current;
        if (currentDeck.length > 0) {
          const topCard = currentDeck[currentDeck.length - 1];

          if (currentDeck.length > 1) {
            setExitDirection(-1);

            setDeck(prev => {
              const newArray = prev.filter(c => c.id !== topCard.id);
              return [topCard, ...newArray];
            });

            const nextCard = currentDeck[currentDeck.length - 2];
            setTimeout(() => playAudioImpl(nextCard.translation, true), 600);
          } else {
            setTimeout(() => playAudioImpl(text, true), 1500);
          }
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (isLoaded && !hasInitialized) {
      const learningPhrases = phrases.filter(p => p.status !== 'mastered');
      const timeoutId = window.setTimeout(() => {
        setDeck([...learningPhrases].reverse());
        setHasInitialized(true);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [isLoaded, phrases, hasInitialized]);

  useEffect(() => {
    if (deck.length > 0) {
      const topCard = deck[deck.length - 1];
      if (topCardRef.current !== topCard.id) {
        topCardRef.current = topCard.id;
        
        if (!isAutoPlayNext) {
          setTimeout(() => {
            playAudio(topCard.translation, false);
          }, 300);
        }
      }
    } else {
      topCardRef.current = null;
    }
  }, [deck, isAutoPlayNext, playAudio]);

  const handleManualSwipe = (id, direction) => {
    // 手動でスワイプしたときは現在の音声を強制停止する
    window.speechSynthesis.cancel();
    if (direction === 'mastered') {
      updatePhraseStatus(id, 'mastered');
      setDeck(prev => prev.filter(c => c.id !== id));
    } else {
      // 「復習する」：現在のカードを山の一番下（配列の先頭）に回す
      setDeck(prev => {
        const newDeck = prev.filter(c => c.id !== id);
        const card = prev.find(c => c.id === id);
        if (card) return [card, ...newDeck];
        return newDeck;
      });
    }
  };

  if (!isLoaded) return <div className={styles.container}>Loading...</div>;

  if (hasInitialized && deck.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <CheckCircle size={64} className={styles.emptyIcon} />
        <h2 className={styles.emptyTitle}>全部覚えました！</h2>
        <p className={styles.emptyText}>現在設定されているフレーズはすべて学習済みです。</p>
        <button 
          className={styles.resetButton}
          onClick={() => {
            phrases.forEach(p => updatePhraseStatus(p.id, 'learning'));
            setDeck([...phrases].reverse());
          }}
        >
          <RefreshCcw size={20} />
          <span>リセットして最初から</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hello Lang</h1>
        <p className={styles.subtitle}>残り {deck.length} フレーズ</p>
        
        <div className={styles.controls}>
          <button 
            className={`${styles.controlBtn} ${isLooping ? styles.activeCtrl : ''}`}
            onClick={() => {
              const nextState = !isLooping;
              setIsLooping(nextState);
              if (isAutoPlayNext) setIsAutoPlayNext(false); 
              if (nextState && deckRef.current.length > 0) {
                 playAudio(deckRef.current[deckRef.current.length - 1].translation);
              } else {
                 window.speechSynthesis.cancel();
              }
            }}
          >
            <Repeat size={16} />
            <span>ループ</span>
          </button>
          <button 
            className={`${styles.controlBtn} ${isAutoPlayNext ? styles.activeCtrl : ''}`}
            onClick={() => {
              const nextState = !isAutoPlayNext;
              setIsAutoPlayNext(nextState);
              if (nextState) {
                 setIsLooping(false);
                 if (deckRef.current.length > 0) {
                    playAudio(deckRef.current[deckRef.current.length - 1].translation);
                 }
              } else {
                 window.speechSynthesis.cancel();
              }
            }}
          >
            <PlaySquare size={16} />
            <span>連続再生</span>
          </button>
        </div>
      </div>

      <div className={styles.cardArea}>
        <AnimatePresence mode="popLayout">
          {deck.map((card, index) => {
            const isTop = index === deck.length - 1;
            
            return (
              <motion.div
                key={card.id}
                className={styles.card}
                style={{ zIndex: index }}
                initial={{ scale: 0.95, opacity: 0, x: -20 }}
                animate={{ 
                  scale: isTop ? 1 : 0.95 - (deck.length - 1 - index) * 0.02, 
                  opacity: 1, 
                  x: isTop ? 0 : 0,
                  y: isTop ? 0 : (deck.length - 1 - index) * -12 
                }}
                exit={{ scale: 0.9, opacity: 0, x: exitDirection === -1 ? -300 : 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset }) => {
                  const swipeThreshold = 70;
                  if (offset.x > swipeThreshold) {
                    setExitDirection(1);
                    handleManualSwipe(card.id, 'mastered');
                  } else if (offset.x < -swipeThreshold) {
                    setExitDirection(-1);
                    handleManualSwipe(card.id, 'review');
                  }
                }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardCategory}>{card.category}</div>
                  <div className={styles.nativeText}>{card.original}</div>
                  <div className={styles.divider} />
                  <div className={styles.englishText}>{card.translation}</div>
                  
                  {isTop && (
                    <button 
                      className={styles.audioButton} 
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        playAudio(card.translation);
                      }}
                    >
                      <Volume2 size={28} />
                    </button>
                  )}
                </div>

                <div className={styles.swipeHints}>
                  <div className={styles.hintLeft}>
                    <ChevronLeft size={18} /> 復習する
                  </div>
                  <div className={styles.hintRight}>
                    覚えた！ <ChevronRight size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
