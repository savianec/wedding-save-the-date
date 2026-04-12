import SwiftUI

struct SaveTheDateView: View {
    @State private var name = ""
    @State private var address = ""
    @State private var phone = ""
    @State private var plusOne: PlusOneChoice = .unspecified

    @State private var nameError: String?
    @State private var addressError: String?
    @State private var formError: String?

    @State private var submitted = false
    @State private var submitting = false

    private let service = SupabaseGuestService()

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(red: 0.98, green: 0.97, blue: 0.95), Color(red: 0.95, green: 0.93, blue: 0.91)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    hero
                    intro
                    card
                }
                .padding(.bottom, 32)
            }
        }
    }

    private var hero: some View {
        VStack(spacing: 16) {
            Text("Christian & Annanikka")
                .font(.custom("Georgia", size: 34))
                .fontWeight(.medium)
                .multilineTextAlignment(.center)
                .foregroundStyle(Color(red: 0.18, green: 0.17, blue: 0.16))
                .padding(.horizontal, 24)

            Rectangle()
                .fill(Color(red: 0.9, green: 0.89, blue: 0.86))
                .frame(width: 64, height: 1)

            Text("— 12.12.2026 —")
                .font(.custom("Georgia", size: 18))
                .tracking(1.6)
                .foregroundStyle(Color(red: 0.36, green: 0.35, blue: 0.33))

            Text("Save the date, we can’t wait to celebrate with you.")
                .font(.custom("Georgia", size: 15))
                .foregroundStyle(Color(red: 0.44, green: 0.42, blue: 0.4))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
        .frame(maxWidth: .infinity)
        .frame(minHeight: 560)
    }

    private var intro: some View {
        Text("We’re so excited to celebrate with you. Please leave your details so we can send your official invitation.")
            .font(.custom("Georgia", size: 16))
            .foregroundStyle(Color(red: 0.36, green: 0.35, blue: 0.33))
            .multilineTextAlignment(.center)
            .lineSpacing(4)
            .padding(.horizontal, 32)
            .padding(.vertical, 24)
            .frame(maxWidth: 480)
    }

    private var card: some View {
        VStack {
            if submitted {
                success
            } else {
                formContent
            }
        }
        .padding(20)
        .frame(maxWidth: 480)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.05), radius: 24, x: 0, y: 8)
        )
        .padding(.horizontal, 16)
    }

    private var success: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color(red: 0.93, green: 0.95, blue: 0.92))
                    .frame(width: 56, height: 56)
                Text("✓")
                    .font(.system(size: 24, weight: .medium))
                    .foregroundStyle(Color(red: 0.44, green: 0.52, blue: 0.44))
            }
            Text("Thank you!")
                .font(.custom("Georgia", size: 26))
                .fontWeight(.medium)
            Text("We’ll send your official invitation soon 💌")
                .font(.system(size: 16))
                .foregroundStyle(Color(red: 0.36, green: 0.35, blue: 0.33))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
    }

    private var formContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            labeledField(title: "Full name", error: nameError) {
                TextField("Your full name", text: $name)
                    .textContentType(.name)
                    .textInputAutocapitalization(.words)
                    .padding(14)
                    .frame(minHeight: 52)
                    .background(fieldBackground)
            }

            labeledField(title: "Postal address", error: addressError) {
                ZStack(alignment: .topLeading) {
                    if address.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        Text("Your postal address (for your invitation)")
                            .font(.system(size: 16))
                            .foregroundStyle(Color(red: 0.6, green: 0.58, blue: 0.56))
                            .padding(.horizontal, 18)
                            .padding(.vertical, 18)
                            .allowsHitTesting(false)
                    }
                    TextEditor(text: $address)
                        .font(.system(size: 16))
                        .frame(minHeight: 100)
                        .scrollContentBackground(.hidden)
                        .padding(8)
                        .textInputAutocapitalization(.sentences)
                }
                .background(fieldBackground)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text("Phone (optional)")
                    .font(.system(size: 14, weight: .semibold))
                TextField("For reminders", text: $phone)
                    .keyboardType(.phonePad)
                    .textContentType(.telephoneNumber)
                    .padding(14)
                    .frame(minHeight: 52)
                    .background(fieldBackground)
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("Plus one (optional)")
                    .font(.system(size: 14, weight: .semibold))
                HStack(spacing: 24) {
                    radio("Yes", value: .yes)
                    radio("No", value: .no)
                }
            }

            if let formError {
                Text(formError)
                    .font(.system(size: 14))
                    .foregroundStyle(Color.red.opacity(0.85))
                    .padding(10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(RoundedRectangle(cornerRadius: 12).fill(Color.red.opacity(0.06)))
            }

            Button(action: submit) {
                Text(submitting ? "Sending…" : "Save My Spot")
                    .font(.system(size: 16, weight: .semibold))
                    .frame(maxWidth: .infinity, minHeight: 52)
            }
            .buttonStyle(SagePillButtonStyle())
            .disabled(submitting)
        }
    }

    private var fieldBackground: some View {
        RoundedRectangle(cornerRadius: 12, style: .continuous)
            .stroke(Color(red: 0.9, green: 0.89, blue: 0.86), lineWidth: 1)
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous).fill(Color.white)
            )
    }

    private func labeledField<Content: View>(
        title: String,
        error: String?,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
            content()
            if let error {
                Text(error)
                    .font(.system(size: 13))
                    .foregroundStyle(Color.red.opacity(0.85))
            }
        }
    }

    private func radio(_ label: String, value: PlusOneChoice) -> some View {
        Button {
            plusOne = value
        } label: {
            HStack(spacing: 8) {
                Image(systemName: plusOne == value ? "largecircle.fill.circle" : "circle")
                    .imageScale(.large)
                    .foregroundStyle(Color(red: 0.66, green: 0.71, blue: 0.64))
                Text(label)
                    .font(.system(size: 16))
                    .foregroundStyle(Color(red: 0.18, green: 0.17, blue: 0.16))
            }
        }
        .buttonStyle(.plain)
    }

    private func submit() {
        nameError = name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            ? "Please enter your full name."
            : nil
        addressError = address.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            ? "Please enter your postal address."
            : nil
        formError = nil

        if nameError != nil || addressError != nil { return }

        let payload = GuestPayload(
            name: name.trimmingCharacters(in: .whitespacesAndNewlines),
            address: address.trimmingCharacters(in: .whitespacesAndNewlines),
            phone: phone.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                ? nil
                : phone.trimmingCharacters(in: .whitespacesAndNewlines),
            plus_one: plusOne == .yes ? true : plusOne == .no ? false : nil
        )

        submitting = true
        Task {
            do {
                try await service.insertGuest(payload)
                await MainActor.run {
                    submitting = false
                    withAnimation(.easeOut(duration: 0.35)) {
                        submitted = true
                    }
                }
            } catch {
                await MainActor.run {
                    submitting = false
                    formError = error.localizedDescription
                }
            }
        }
    }
}

private enum PlusOneChoice {
    case unspecified
    case yes
    case no
}

private struct SagePillButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(Color.white)
            .background(
                Capsule().fill(Color(red: 0.66, green: 0.71, blue: 0.64))
            )
            .opacity(configuration.isPressed ? 0.92 : 1)
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
    }
}

#Preview {
    SaveTheDateView()
}
