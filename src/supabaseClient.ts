// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kxbjsyuhceggsyvxdkof.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YmpzeXVoY2VnZ3N5dnhka29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDg5OTYsImV4cCI6MjA2Njc4NDk5Nn0.4kO_I2gZ_MKdtydkRCyzVcP2UgD0kxjXs2NItInCeCk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)