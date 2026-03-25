import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseurl = "https://kblypeoouzuqazzchtfg.supabase.co"
const api_key = "sb_publishable_YN9LI7__P9j3WR3CFHQMVw_NEPY7dnc"

export const supabase = createClient(supabaseurl, api_key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})