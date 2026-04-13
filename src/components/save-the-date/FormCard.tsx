"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { SuccessState } from "./SuccessState";

type FieldErrors = Partial<Record<"name" | "address", string>>;

export function FormCard() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Please enter your full name.";
    if (!address.trim()) next.address = "Please enter your postal address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setFormError(
        "This page is not connected to the database yet. Add your Supabase keys in .env.local.",
      );
      return;
    }

    setSubmitting(true);
    const row: Record<string, unknown> = {
      name: name.trim(),
      address: address.trim(),
    };
    if (phone.trim()) row.phone = phone.trim();

    const { error } = await supabase.from("guests").insert(row);

    setSubmitting(false);
    if (error) {
      setFormError(error.message || "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <motion.section
      id="rsvp"
      className="mx-auto w-full max-w-[480px] px-4 pb-12 scroll-mt-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-6">
        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessState key="success" />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="guest-name"
                  className="text-left text-sm font-medium text-[#2F2C28]"
                >
                  Full name
                </label>
                <input
                  id="guest-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className="min-h-[52px] rounded-xl border border-[#E5E2DC] bg-white px-[14px] py-3 text-base text-[#2F2C28] outline-none transition-[box-shadow,border-color] placeholder:text-[#9A9590] focus:border-[#A8B5A2] focus:shadow-[0_0_0_3px_rgba(168,181,162,0.25)]"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "guest-name-error" : undefined}
                />
                {errors.name ? (
                  <p
                    id="guest-name-error"
                    className="text-left text-sm text-red-700/90"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="guest-address"
                  className="text-left text-sm font-medium text-[#2F2C28]"
                >
                  Postal address
                </label>
                <textarea
                  id="guest-address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Your postal address (for your invitation)"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address)
                      setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  rows={4}
                  className="min-h-[100px] resize-y rounded-xl border border-[#E5E2DC] bg-white px-[14px] py-3 text-base text-[#2F2C28] outline-none transition-[box-shadow,border-color] placeholder:text-[#9A9590] focus:border-[#A8B5A2] focus:shadow-[0_0_0_3px_rgba(168,181,162,0.25)]"
                  aria-invalid={!!errors.address}
                  aria-describedby={
                    errors.address ? "guest-address-error" : undefined
                  }
                />
                {errors.address ? (
                  <p
                    id="guest-address-error"
                    className="text-left text-sm text-red-700/90"
                  >
                    {errors.address}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="guest-phone"
                  className="text-left text-sm font-medium text-[#2F2C28]"
                >
                  Phone <span className="font-normal text-[#6F6B66]">(optional)</span>
                </label>
                <input
                  id="guest-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="For reminders"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="min-h-[52px] rounded-xl border border-[#E5E2DC] bg-white px-[14px] py-3 text-base text-[#2F2C28] outline-none transition-[box-shadow,border-color] placeholder:text-[#9A9590] focus:border-[#A8B5A2] focus:shadow-[0_0_0_3px_rgba(168,181,162,0.25)]"
                />
              </div>

              {formError ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-left text-sm text-red-800">
                  {formError}
                </p>
              ) : null}

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.97 }}
                className="mt-1 flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#A8B5A2] px-6 text-base font-medium text-white transition-colors hover:bg-[#96a590] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending…" : "Save My Spot"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
