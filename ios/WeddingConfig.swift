import Foundation

enum WeddingConfig {
    /// Supabase project URL, e.g. https://xxxx.supabase.co
    static let supabaseURL = URL(string: "https://YOUR_PROJECT.supabase.co")!

    /// Project Settings → API → `anon` `public` key (safe for the app; protected by RLS).
    static let supabaseAnonKey = "YOUR_ANON_KEY"
}
