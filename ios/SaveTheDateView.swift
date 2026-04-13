import SwiftUI

struct SaveTheDateView: View {
    @State private var name = ""
    @State private var address = ""
    @State private var phone = ""

    @State private var nameError: String?
    @State private var addressError: String?
    @State private var formError: String?

    @State private var submitted = false
    @State private var submitting = false

    @State private var envelopePhase: EnvelopePhase = .closed

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private let service = SupabaseGuestService()

    private enum EnvelopePhase: Equatable {
        case closed
        case opening
        case done
    }

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
        ZStack {
            if envelopePhase == .done {
                heroContentAfterEnvelope
                    .transition(.opacity.combined(with: .scale(scale: 0.99)))
            }

            if envelopePhase != .done {
                envelopeIntroOverlay
                    .transition(.opacity)
            }
        }
        .padding(.top, 56)
        .frame(maxWidth: .infinity)
        .frame(minHeight: 560)
        .task(id: envelopePhase) {
            guard envelopePhase == .opening else { return }
            let nanos: UInt64 = reduceMotion ? 1_050_000_000 : 3_100_000_000
            try? await Task.sleep(nanoseconds: nanos)
            if Task.isCancelled { return }
            await MainActor.run {
                withAnimation(.easeOut(duration: 0.35)) {
                    envelopePhase = .done
                }
            }
        }
    }

    private var heroContentAfterEnvelope: some View {
        VStack(spacing: 14) {
            Text("Save the date!")
                .font(.custom("Times New Roman", size: 30))
                .italic()
                .fontWeight(.regular)
                .multilineTextAlignment(.center)
                .foregroundStyle(Color(red: 0.18, green: 0.17, blue: 0.16))
                .padding(.horizontal, 24)

            Text("Christian")
                .font(.custom("Times New Roman", size: 30))
                .fontWeight(.regular)
                .multilineTextAlignment(.center)
                .foregroundStyle(Color(red: 0.18, green: 0.17, blue: 0.16))

            Text("& Annanikka's Wedding")
                .font(.custom("Times New Roman", size: 30))
                .fontWeight(.regular)
                .multilineTextAlignment(.center)
                .foregroundStyle(Color(red: 0.18, green: 0.17, blue: 0.16))
                .padding(.horizontal, 20)

            Rectangle()
                .fill(Color(red: 0.9, green: 0.89, blue: 0.86))
                .frame(width: 64, height: 1)

            Text("— 12.12.2026 —")
                .font(.custom("Times New Roman", size: 18))
                .fontWeight(.regular)
                .tracking(1.6)
                .foregroundStyle(Color(red: 0.36, green: 0.35, blue: 0.33))

            Text("Save the date, we can’t wait to celebrate with you.")
                .font(.custom("Times New Roman", size: 15))
                .foregroundStyle(Color(red: 0.44, green: 0.42, blue: 0.4))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
    }

    private var envelopeIntroOverlay: some View {
        let opening = envelopePhase == .opening
        let topAngle = opening ? (reduceMotion ? -158.0 : -178.0) : 0.0

        return ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.02, green: 0.25, blue: 0.18).opacity(0.92),
                    Color(red: 0.02, green: 0.35, blue: 0.26).opacity(0.88),
                    Color(red: 0.02, green: 0.25, blue: 0.18).opacity(0.9),
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 20) {
                Text("An invitation for you")
                    .font(.custom("Times New Roman", size: 14))
                    .tracking(3.2)
                    .foregroundStyle(Color.white.opacity(0.9))

                // Landscape envelope (matches web reference)
                ZStack(alignment: .top) {
                    let envW: CGFloat = 320
                    let envH: CGFloat = 206

                    RoundedRectangle(cornerRadius: 3, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.82, green: 0.96, blue: 0.9),
                                    Color(red: 0.88, green: 0.98, blue: 0.93),
                                    Color(red: 0.8, green: 0.94, blue: 0.88),
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: envW, height: envH)
                        .overlay(
                            RoundedRectangle(cornerRadius: 3, style: .continuous)
                                .stroke(Color(red: 0.02, green: 0.37, blue: 0.27).opacity(0.38), lineWidth: 1)
                        )
                        .shadow(color: Color.black.opacity(0.22), radius: 18, y: 10)

                    envelopeRisingCard(opening: opening, envW: envW, envH: envH)
                        .zIndex(opening ? 8 : 1)

                    envelopePocketFront(envW: envW, envH: envH)
                        .zIndex(3)

                    EnvelopeTopTriangularFlap(angle: topAngle, width: envW, flapHeight: envH * 0.58)
                        .zIndex(opening ? 1 : 4)

                    if envelopePhase == .closed {
                        Button(action: openEnvelope) {
                            Color.clear
                                .contentShape(Rectangle())
                                .frame(width: envW, height: envH)
                        }
                        .buttonStyle(.plain)
                        .overlay {
                            Text("Open")
                                .font(.custom("Times New Roman", size: 15))
                                .fontWeight(.regular)
                                .tracking(5.5)
                                .foregroundStyle(Color(red: 0.02, green: 0.22, blue: 0.16).opacity(0.72))
                                .offset(y: envH * 0.06)
                        }
                        .accessibilityLabel("Open save the date envelope")
                        .zIndex(10)
                    }
                }
                .frame(width: 320, height: 206)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 36)
        }
    }

    private func openEnvelope() {
        withAnimation(.spring(response: 0.62, dampingFraction: 0.86)) {
            envelopePhase = .opening
        }
    }

    private func envelopeRisingCard(opening: Bool, envW: CGFloat, envH: CGFloat) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: 3, style: .continuous)
                .fill(Color.white)
                .shadow(
                    color: Color.black.opacity(opening ? 0.18 : 0.06),
                    radius: opening ? 16 : 3,
                    y: opening ? 10 : 2
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 3, style: .continuous)
                        .stroke(Color(red: 0.02, green: 0.37, blue: 0.27).opacity(0.35), lineWidth: 1)
                )

            VStack(spacing: 8) {
                Text("Save the date!")
                    .font(.custom("Times New Roman", size: 18))
                    .italic()
                    .foregroundStyle(Color(red: 0.02, green: 0.25, blue: 0.18))
                Text("Christian")
                    .font(.custom("Times New Roman", size: 24))
                    .foregroundStyle(Color(red: 0.02, green: 0.15, blue: 0.12))
                Text("& Annanikka's Wedding")
                    .font(.custom("Times New Roman", size: 24))
                    .foregroundStyle(Color(red: 0.02, green: 0.15, blue: 0.12))
                    .multilineTextAlignment(.center)
                Text("12.12.2026")
                    .font(.custom("Times New Roman", size: 18))
                    .tracking(1.6)
                    .foregroundStyle(Color(red: 0.02, green: 0.35, blue: 0.26))
            }
            .multilineTextAlignment(.center)
            .padding(.horizontal, 18)
            .padding(.vertical, 22)
            .opacity(opening ? 1 : 0)
        }
        .frame(width: envW * 0.70, height: max(envH * 1.08, 300.0))
        .offset(
            x: envW * 0.15,
            y: envH * 0.14 + (opening ? (reduceMotion ? -40 : -56) : 52)
        )
        .opacity(opening ? 1 : 0)
        .animation(
            .spring(response: reduceMotion ? 0.48 : 0.82, dampingFraction: 0.86).delay(reduceMotion ? 0.12 : 0.44),
            value: opening
        )
    }

    private func envelopePocketFront(envW: CGFloat, envH: CGFloat) -> some View {
        ZStack {
            PocketVBottomShape()
                .fill(
                    LinearGradient(
                        colors: [
                            Color(red: 0.88, green: 0.98, blue: 0.93),
                            Color(red: 0.78, green: 0.94, blue: 0.86),
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .frame(width: envW, height: envH * 0.82)
                .offset(y: envH * 0.12)

            PocketLeftShape()
                .fill(Color(red: 0.8, green: 0.95, blue: 0.9).opacity(0.98))
                .frame(width: envW * 0.5, height: envH * 0.78)
                .offset(x: -envW * 0.25, y: envH * 0.11)
                .overlay(
                    PocketLeftShape()
                        .stroke(Color(red: 0.02, green: 0.37, blue: 0.27).opacity(0.2), lineWidth: 1)
                )

            PocketRightShape()
                .fill(Color(red: 0.86, green: 0.97, blue: 0.92).opacity(0.98))
                .frame(width: envW * 0.5, height: envH * 0.78)
                .offset(x: envW * 0.25, y: envH * 0.11)
                .overlay(
                    PocketRightShape()
                        .stroke(Color(red: 0.02, green: 0.37, blue: 0.27).opacity(0.2), lineWidth: 1)
                )
        }
        .allowsHitTesting(false)
    }

    private var intro: some View {
        Text("We’re getting married on the 12th of December 2026 and we’re so excited to celebrate with you. Please leave your details so we can send your official invitation.")
            .font(.custom("Times New Roman", size: 16))
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
                    .font(.custom("Times New Roman", size: 24))
                    .fontWeight(.medium)
                    .foregroundStyle(Color(red: 0.44, green: 0.52, blue: 0.44))
            }
            Text("Thank you!")
                .font(.custom("Times New Roman", size: 26))
                .fontWeight(.medium)
            Text("We’ll send your official invitation soon 💌")
                .font(.custom("Times New Roman", size: 16))
                .foregroundStyle(Color(red: 0.36, green: 0.35, blue: 0.33))
                .multilineTextAlignment(.center)
            Text("Add our wedding to your calendar so you don’t miss the day.")
                .font(.custom("Times New Roman", size: 14))
                .foregroundStyle(Color(red: 0.44, green: 0.42, blue: 0.4))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 8)
            if let calendarURL = Bundle.main.url(forResource: "event", withExtension: "ics") {
                ShareLink(
                    item: calendarURL,
                    preview: SharePreview(
                        "Christian & Annanikka's Wedding",
                        icon: Image(systemName: "calendar")
                    )
                ) {
                    Text("Save the date in my calendar")
                        .font(.custom("Times New Roman", size: 16))
                        .fontWeight(.semibold)
                        .frame(maxWidth: .infinity)
                        .frame(minHeight: 48)
                }
                .buttonStyle(SagePillButtonStyle())
            } else {
                Text("Add `event.ics` to Copy Bundle Resources in Xcode to enable the calendar button.")
                    .font(.custom("Times New Roman", size: 12))
                    .foregroundStyle(Color(red: 0.55, green: 0.53, blue: 0.5))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 12)
            }
            Text("Shares an .ics file you can open in Calendar, Google Calendar, or Outlook.")
                .font(.custom("Times New Roman", size: 12))
                .foregroundStyle(Color(red: 0.55, green: 0.53, blue: 0.5))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 12)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
    }

    private var formContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            labeledField(title: "Full name", error: nameError) {
                TextField("Your full name", text: $name)
                    .font(.custom("Times New Roman", size: 16))
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
                            .font(.custom("Times New Roman", size: 16))
                            .foregroundStyle(Color(red: 0.6, green: 0.58, blue: 0.56))
                            .padding(.horizontal, 18)
                            .padding(.vertical, 18)
                            .allowsHitTesting(false)
                    }
                    TextEditor(text: $address)
                        .font(.custom("Times New Roman", size: 16))
                        .frame(minHeight: 100)
                        .scrollContentBackground(.hidden)
                        .padding(8)
                        .textInputAutocapitalization(.sentences)
                }
                .background(fieldBackground)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text("Phone (optional)")
                    .font(.custom("Times New Roman", size: 14))
                    .fontWeight(.semibold)
                TextField("For reminders", text: $phone)
                    .font(.custom("Times New Roman", size: 16))
                    .keyboardType(.phonePad)
                    .textContentType(.telephoneNumber)
                    .padding(14)
                    .frame(minHeight: 52)
                    .background(fieldBackground)
            }

            if let formError {
                Text(formError)
                    .font(.custom("Times New Roman", size: 14))
                    .foregroundStyle(Color.red.opacity(0.85))
                    .padding(10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(RoundedRectangle(cornerRadius: 12).fill(Color.red.opacity(0.06)))
            }

            Button(action: submit) {
                Text(submitting ? "Sending…" : "Save My Spot")
                    .font(.custom("Times New Roman", size: 16))
                    .fontWeight(.semibold)
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
                .font(.custom("Times New Roman", size: 14))
                .fontWeight(.semibold)
            content()
            if let error {
                Text(error)
                    .font(.custom("Times New Roman", size: 13))
                    .foregroundStyle(Color.red.opacity(0.85))
            }
        }
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
                : phone.trimmingCharacters(in: .whitespacesAndNewlines)
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

// MARK: - Envelope shapes (classic triangular flap + pocket)

private struct TopFlapTriangle: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.minX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        p.closeSubpath()
        return p
    }
}

private struct EnvelopeTopTriangularFlap: View {
    var angle: Double
    var width: CGFloat
    var flapHeight: CGFloat

    var body: some View {
        TopFlapTriangle()
            .fill(
                LinearGradient(
                    colors: [
                        Color.white,
                        Color(red: 0.86, green: 0.97, blue: 0.92),
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .overlay(
                TopFlapTriangle()
                    .stroke(Color(red: 0.02, green: 0.37, blue: 0.27).opacity(0.28), lineWidth: 1)
            )
            .frame(width: width, height: flapHeight)
            .rotation3DEffect(
                .degrees(angle),
                axis: (x: 1, y: 0, z: 0),
                anchor: .top,
                perspective: 0.55
            )
    }
}

private struct PocketVBottomShape: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        p.addLine(to: CGPoint(x: rect.midX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        p.closeSubpath()
        return p
    }
}

private struct PocketLeftShape: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        p.closeSubpath()
        return p
    }
}

private struct PocketRightShape: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.maxX, y: rect.maxY))
        p.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        p.closeSubpath()
        return p
    }
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
