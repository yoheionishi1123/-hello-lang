'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export function usePhrases() {
  const [phrases, setPhrases] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      // Check session
      const { data: { session: _session } } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(_session);
      }

      if (_session) {
        // Logged in: Fetch from Supabase
        const { data, error } = await supabase
          .from('phrases')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          if (mounted) setPhrases(data);
          
          // Check for local migration
          const saved = localStorage.getItem('voicePhraseData');
          const localPhrases = saved ? JSON.parse(saved) : [];
          if (localPhrases.length > 0) {
            // Migrate local phrases to cloud
            const toInsert = localPhrases.map(p => ({
              id: p.id,
              user_id: _session.user.id,
              original: p.original,
              translation: p.translation,
              category: p.category,
              status: p.status,
              created_at: p.createdAt || p.created_at || new Date().toISOString()
            }));
            
            await supabase.from('phrases').upsert(toInsert, { onConflict: 'id' });
            localStorage.removeItem('voicePhraseData');
            
            // Refetch after migration
            const { data: newData } = await supabase
              .from('phrases')
              .select('*')
              .order('created_at', { ascending: false });
            if (newData && mounted) setPhrases(newData);
          }
        }
      } else {
        // Not logged in: Use local storage
        const saved = localStorage.getItem('voicePhraseData');
        if (saved && mounted) {
          try {
            setPhrases(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse local phrases', e);
          }
        }
      }

      if (mounted) setIsLoaded(true);
    }

    loadData();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        loadData(); // Reload data when auth state changes (login/logout)
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const savePhrase = async (original, translation, category) => {
    const newPhrase = {
      id: uuidv4(),
      original,       
      translation,    
      category,       
      created_at: new Date().toISOString(),
      status: 'learning',
    };
    
    // Optimistic update
    setPhrases((prev) => {
      const updated = [newPhrase, ...prev];
      if (!session) {
        localStorage.setItem('voicePhraseData', JSON.stringify(updated));
      }
      return updated;
    });

    if (session) {
      newPhrase.user_id = session.user.id;
      await supabase.from('phrases').insert(newPhrase);
    }
    
    return newPhrase;
  };

  const updatePhraseStatus = async (id, newStatus) => {
    // Optimistic update
    setPhrases((prev) => {
      const updated = prev.map((p) => 
        p.id === id ? { ...p, status: newStatus } : p
      );
      if (!session) {
        localStorage.setItem('voicePhraseData', JSON.stringify(updated));
      }
      return updated;
    });

    if (session) {
      await supabase.from('phrases').update({ status: newStatus }).eq('id', id);
    }
  };

  const deletePhrase = async (id) => {
    // Optimistic update
    setPhrases((prev) => {
      const updated = prev.filter(p => p.id !== id);
      if (!session) {
        localStorage.setItem('voicePhraseData', JSON.stringify(updated));
      }
      return updated;
    });

    if (session) {
      await supabase.from('phrases').delete().eq('id', id);
    }
  };

  return {
    phrases,
    isLoaded,
    savePhrase,
    updatePhraseStatus,
    deletePhrase,
  };
}
