import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://orvylybfqusjtqvieauk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydnlseWJmcXVzanRxdmllYXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzUwMTAsImV4cCI6MjA2OTIxMTAxMH0.PLoFz_BiByB9_Gs74ghyMfeX71O7bUjkceBS9pleL2A"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // 👈 THIS IS CRITICAL
  },
})