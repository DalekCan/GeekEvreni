import { createServerSupabase } from './supabase-server';

export interface TrackerData {
  id: string;
  user_id: string;
  show_id: string;
  show_type: 'tv' | 'movie';
  last_watched_season: number | null;
  last_watched_episode: number | null;
  updated_at: string;
}

export async function getUserUpNext(): Promise<TrackerData[]> {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('user_shows')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracker data:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Tracker Auth/Fetch Error:', err);
    return [];
  }
}
