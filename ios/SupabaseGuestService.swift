import Foundation

struct GuestPayload: Encodable {
    let name: String
    let address: String
    let phone: String?
    let plus_one: Bool?
}

enum GuestSubmissionError: LocalizedError {
    case invalidConfiguration
    case server(Int, String?)

    var errorDescription: String? {
        switch self {
        case .invalidConfiguration:
            return "Supabase URL or key is not configured."
        case .server(let code, let body):
            if let body, !body.isEmpty { return "Server error (\(code)): \(body)" }
            return "Server error (\(code))."
        }
    }
}

actor SupabaseGuestService {
    func insertGuest(_ payload: GuestPayload) async throws {
        guard WeddingConfig.supabaseURL.absoluteString != "https://YOUR_PROJECT.supabase.co",
              WeddingConfig.supabaseAnonKey != "YOUR_ANON_KEY"
        else {
            throw GuestSubmissionError.invalidConfiguration
        }

        var components = URLComponents(
            url: WeddingConfig.supabaseURL.appendingPathComponent("rest/v1/guests"),
            resolvingAgainstBaseURL: false
        )
        components?.queryItems = [URLQueryItem(name: "select", value: "id")]

        guard let url = components?.url else {
            throw GuestSubmissionError.invalidConfiguration
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(WeddingConfig.supabaseAnonKey, forHTTPHeaderField: "apikey")
        request.setValue(
            "Bearer \(WeddingConfig.supabaseAnonKey)",
            forHTTPHeaderField: "Authorization"
        )
        request.setValue("return=minimal", forHTTPHeaderField: "Prefer")

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.withoutEscapingSlashes]
        request.httpBody = try encoder.encode(payload)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw GuestSubmissionError.server(-1, nil)
        }

        guard (200 ... 299).contains(http.statusCode) else {
            let text = String(data: data, encoding: .utf8)
            throw GuestSubmissionError.server(http.statusCode, text)
        }
    }
}
