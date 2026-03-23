/* ──────────────────────────────────────────────
 *  /charities — Free Branding for Charities
 *  Application form + info about the programme.
 * ────────────────────────────────────────────── */

"use client";

import { useActionState, useState, useEffect } from "react";
import { submitCharityApplication, type ActionState } from "@/lib/actions";
import Link from "next/link";

const initialState: ActionState = { success: false };

const SERVICES = [
  { key: "needsLogo", label: "Logo Design", icon: "🎨", desc: "Custom logo & brand mark" },
  { key: "needsColours", label: "Colour Scheme", icon: "🌈", desc: "Full colour palette & guidelines" },
  { key: "needsWebsite", label: "Website", icon: "🌐", desc: "Modern responsive website" },
  { key: "needsDonations", label: "Donations Portal", icon: "💝", desc: "Online donation system" },
  { key: "needsPayments", label: "Payment Portal", icon: "💳", desc: "Stripe payment integration" },
];

export default function CharitiesPage() {
  const [state, formAction, isPending] = useActionState(submitCharityApplication, initialState);
  const [sent, setSent] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.success) setSent(true);
  }, [state]);

  const errors = state.errors || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <span className="inline-flex items-center gap-2 bg-white text-[11px] font-bold text-[#1a8d1a] uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border border-[#1a8d1a]/15 shadow-sm mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a8d1a] animate-pulse" />
          100% Free Service
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
          Free Branding for <span className="text-[#1a8d1a]">Charities</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
          We believe every charity deserves a professional brand. We donate our skills — logo, website, donations portal &amp; more — completely free.
        </p>
      </div>

      {/* What&apos;s included */}
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 sm:mb-16">
        {SERVICES.map((s) => (
          <div
            key={s.key}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow group"
          >
            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{s.icon}</span>
            <h3 className="text-sm font-bold text-gray-900 mb-1">{s.label}</h3>
            <p className="text-xs text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-12 sm:mb-16">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">How It Works</h2>
        <div className="grid sm:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Apply", desc: "Fill out the form below with your charity details" },
            { step: "2", title: "Review", desc: "Our team reviews your application within 48 hours" },
            { step: "3", title: "Build", desc: "We design and build everything you need, for free" },
            { step: "4", title: "Launch", desc: "Your new brand goes live and starts making an impact" },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <span className="w-10 h-10 rounded-xl bg-[#1a8d1a]/10 text-[#1a8d1a] font-bold text-lg flex items-center justify-center mx-auto mb-3">
                {s.step}
              </span>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Capacity notice */}
      <div className="flex items-center justify-center gap-3 mb-8 px-4">
        <div className="flex -space-x-1.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="w-6 h-6 rounded-full bg-[#1a8d1a]/20 border-2 border-white flex items-center justify-center text-[8px] font-bold text-[#1a8d1a]">
              {i + 1}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          We take on <span className="font-bold text-gray-900">5 charities at a time</span> to ensure quality. Applications are always open.
        </p>
      </div>

      {/* Application Form */}
      <div className="max-w-2xl mx-auto">
        {sent ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a8d1a]/10 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-sm text-gray-400 mb-6">
              Thank you for applying. Our team will review your application and get back to you within 48 hours.
            </p>
            <button
              onClick={() => { setSent(false); setFormKey((k) => k + 1); }}
              className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form
            key={formKey}
            action={formAction}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-1">Apply for Free Branding</h2>
            <p className="text-sm text-gray-400 mb-6">Tell us about your charity and what you need.</p>

            {state.message && !state.success && (
              <div className="mb-4 flex items-start gap-2.5 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
                <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                {state.message}
              </div>
            )}

            {/* Charity info */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Charity Name *" name="charityName" error={errors.charityName} placeholder="Hope for Homeless UK" />
              <Field label="Charity Registration No." name="charityNumber" error={errors.charityNumber} placeholder="e.g. 1198765" />
            </div>

            {/* Contact info */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Your Name *" name="contactName" error={errors.contactName} placeholder="John Smith" />
              <Field label="Email *" name="contactEmail" type="email" error={errors.contactEmail} placeholder="john@charity.org" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Phone (optional)" name="contactPhone" type="tel" error={errors.contactPhone} placeholder="+44 7700 900000" />
              <Field label="Current Website (optional)" name="website" error={errors.website} placeholder="https://yourcharity.org" />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label htmlFor="description" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Tell us about your charity *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="What does your charity do? What impact does it have? What do you need help with?"
                className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a] transition-all resize-none ${
                  errors.description ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Services needed */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What do you need?</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {SERVICES.map((s) => (
                  <label key={s.key} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#1a8d1a]/30 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      name={s.key}
                      defaultChecked={s.key !== "needsPayments"}
                      className="w-4 h-4 rounded border-gray-300 text-[#1a8d1a] focus:ring-[#1a8d1a]/20"
                    />
                    <span className="text-lg group-hover:scale-110 transition-transform">{s.icon}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{s.label}</span>
                      <span className="text-[11px] text-gray-400 block">{s.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-[#1a8d1a] text-white text-sm font-bold rounded-xl hover:bg-[#157a15] transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                  Submitting…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                  Submit Application
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-3">
              Applications are reviewed within 48 hours. All services are 100% free for registered charities.
            </p>
          </form>
        )}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-12 sm:mt-16">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: "Is this really free?", a: "Yes, 100%. We donate our skills to charities — no hidden costs, no strings attached." },
            { q: "Do we need to be a registered charity?", a: "A UK charity registration number helps, but we'll consider community interest companies and social enterprises too." },
            { q: "How long does the process take?", a: "Typically 4–8 weeks depending on scope. We keep you updated at every stage via our project portal." },
            { q: "Why only 5 at a time?", a: "We want to give every charity our full attention. Limiting active projects ensures top-quality results." },
            { q: "Can we track progress?", a: "Absolutely! Once accepted, you'll see your project on our tracking board with real-time status updates." },
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm group">
              <summary className="px-5 py-4 text-sm font-semibold text-gray-900 cursor-pointer flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors">
                {faq.q}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2"><polyline points="6 9 12 15 18 9" /></svg>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <p className="text-sm text-gray-400 mb-3">Have questions before applying?</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a8d1a] hover:text-[#157a15] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          Contact Us First
        </Link>
      </div>
    </div>
  );
}

/* ─── Reusable Field Component ─── */

function Field({
  label,
  name,
  type = "text",
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a] transition-all ${
          error ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
