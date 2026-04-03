'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, UserPlus, Loader2, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('登録確認メールを送信しました。メール内のリンクをクリックしてください。');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>ログイン中</h1>
          <p className={styles.subtitle}>{session.user.email} でログインしています</p>
        </div>
        <div className={styles.formCard} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={() => router.push('/')} className={styles.submitBtn}>
            学習を始める
          </button>
          <button 
            onClick={handleLogout} 
            className={styles.submitBtn} 
            style={{ backgroundColor: 'transparent', color: 'var(--color-secondary)', border: '1px solid var(--color-secondary)' }}
          >
            <LogOut size={20} />
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isSignUp ? 'アカウント作成' : 'おかえりなさい'}</h1>
        <p className={styles.subtitle}>
          {isSignUp 
            ? 'クラウドに単語帳を保存してどこでも学習' 
            : 'ログインして学習の続きを始めましょう'}
        </p>
      </div>

      <div className={styles.formCard}>
        {successMsg && (
          <div className={styles.errorBox} style={{ backgroundColor: 'var(--color-success-light)', borderLeftColor: 'var(--color-success)', color: 'var(--color-success)' }}>
            {successMsg}
          </div>
        )}
        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>メールアドレス</label>
            <div className={styles.inputWrapper}>
              <Mail size={20} className={styles.icon} />
              <input
                type="email"
                placeholder="you@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>パスワード</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.icon} />
              <input
                type="password"
                placeholder="6文字以上"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className={styles.spin} size={20} /> : (isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />)}
            <span>{isSignUp ? '登録する' : 'ログイン'}</span>
          </button>
        </form>

        <div className={styles.toggleSwitch}>
          {isSignUp ? 'すでにアカウントをお持ちですか？' : 'アカウントを持っていませんか？'}
          <button 
            type="button"
            className={styles.toggleLink}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
          >
            {isSignUp ? 'ログイン' : '新規登録'}
          </button>
        </div>
      </div>
    </div>
  );
}
