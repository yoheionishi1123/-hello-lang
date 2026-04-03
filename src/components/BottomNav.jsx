'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, List, Layers, User } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  const getStyle = (path) => {
    return pathname === path ? `${styles.navItem} ${styles.active}` : styles.navItem;
  };

  return (
    <nav className={`${styles.bottomNav} glass`}>
      <Link href="/" className={getStyle('/')}>
        <Mic className={styles.icon} />
        <span className={styles.label}>翻訳</span>
      </Link>
      <Link href="/cards" className={getStyle('/cards')}>
        <Layers className={styles.icon} />
        <span className={styles.label}>カード</span>
      </Link>
      <Link href="/list" className={getStyle('/list')}>
        <List className={styles.icon} />
        <span className={styles.label}>単語帳</span>
      </Link>
      <Link href="/login" className={getStyle('/login')}>
        <User className={styles.icon} />
        <span className={styles.label}>アカウント</span>
      </Link>
    </nav>
  );
}
