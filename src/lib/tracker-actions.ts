'use server';

import { createServerSupabase } from './supabase-server';
import { revalidatePath } from 'next/cache';

export async function startTrackingShow(showId: string, showType: 'tv' | 'movie' = 'tv') {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const payload = {
      user_id: user.id,
      show_id: showId,
      show_type: showType,
      last_watched_season: 1,
      last_watched_episode: 0,
    };

    const { error } = await supabase
      .from('user_shows')
      .upsert(payload, { onConflict: 'user_id, show_id, show_type' });

    if (error) throw error;
    
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function markAsWatched({
  showId,
  showType,
  season,
  episode
}: {
  showId: string;
  showType: 'tv' | 'movie';
  season?: number;
  episode?: number;
}) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const payload = {
      user_id: user.id,
      show_id: showId,
      show_type: showType,
      last_watched_season: season || null,
      last_watched_episode: episode || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_shows')
      .upsert(payload, { 
        onConflict: 'user_id, show_id, show_type'
      })
      .select();

    if (error) {
      console.error('Error upserting tracker data:', error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/');
    return { success: true, data };
  } catch (err: any) {
    console.error('Tracker Upsert Catch Error:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}
