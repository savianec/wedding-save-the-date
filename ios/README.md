# Wedding Save the Date — iOS (SwiftUI)

This folder contains SwiftUI source that mirrors the web experience: hero, intro, guest form (name, address, optional phone and plus-one), Supabase insert, and a thank-you state.

## Requirements

- macOS with Xcode 15+ (SwiftUI)
- A Supabase project with the `guests` table from `../supabase/schema.sql`

## Add to a new Xcode project

1. Open Xcode → **File → New → Project** → **App**.
2. Product Name: `WeddingSaveTheDate`, Interface: **SwiftUI**, Language: **Swift**.
3. Save the project (any folder). Copy the `.swift` files from this `ios/` directory into the app target (check **Copy items if needed** and your app target).
4. Open `WeddingConfig.swift` and set `supabaseURL` and `supabaseAnonKey` to your project’s URL and anon key (same values as the web `.env.local`).
5. Build and run on a simulator or device.

## Files

| File | Purpose |
|------|---------|
| `WeddingConfig.swift` | Supabase URL + anon key (replace placeholders). |
| `SupabaseGuestService.swift` | Inserts a row into `guests` via the REST API. |
| `SaveTheDateView.swift` | Full-screen UI matching the landing page flow. |
| `WeddingSaveTheDateApp.swift` | App entry; set `@main` here and remove the template `App` if duplicated. |

If Xcode already created `WeddingSaveTheDateApp.swift`, merge its `@main` entry with the one provided here, or delete the template and use the file from this folder.
