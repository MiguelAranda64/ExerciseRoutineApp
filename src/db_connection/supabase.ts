import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseurl = "https://kblypeoouzuqazzchtfg.supabase.co"
const api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtibHlwZW9vdXp1cWF6emNodGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDQ0MDAsImV4cCI6MjA4Nzk4MDQwMH0.Rrn6H_H8abqW8R_dAzpQcTCJ-M12g9vRKscB4Uuh6jI"

export const supabase = createClient(supabaseurl, api_key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})