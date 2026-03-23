/* ──────────────────────────────────────────────
 *  /contact — Contact Page
 *  Contact form + office info + FAQ.
 *  Uses Server Action via useActionState.
 * ────────────────────────────────────────────── */

"use client";

import { useActionState, useState, useEffect } from "react";
import { submitContactForm, type ActionState } from "@/lib/actions";

const initialState: ActionState = { success: false };

export default function ContactPage() {
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
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
                    Get in Touch
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
                    Let&apos;s talk about your project
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
                    Have a question or ready to get started? Fill out the form and our team will respond within 24 hours.
                </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                {/* Form — wider */}
                <div className="lg:col-span-3">
                    {sent ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#1a8d1a]/10 flex items-center justify-center mx-auto mb-5">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                            <p className="text-sm text-gray-400 mb-6">
                                We&apos;ll be in touch within 24 hours. A confirmation email has been sent.
                            </p>
                            <button
                                onClick={() => { setSent(false); setFormKey((k) => k + 1); }}
                                className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form key={formKey} action={formAction} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-300">
                            {state.message && !state.success && (
                                <div className="mb-4 flex items-start gap-2.5 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
                                    <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                    {state.message}
                                </div>
                            )}
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <Field label="Full Name" name="name" error={errors.name} placeholder="John Smith" />
                                <Field label="Email Address" name="email" type="email" error={errors.email} placeholder="john@example.com" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <Field label="Phone (optional)" name="phone" type="tel" error={errors.phone} placeholder="+44 7700 900000" />
                                <div>
                                    <label htmlFor="subject" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        defaultValue=""
                                        className={`w-full px-4 py-3 text-sm rounded-xl border bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${errors.subject ? "border-red-300" : "border-gray-200"
                                            }`}
                                    >
                                        <option value="">Select a topic…</option>
                                        <option value="General Enquiry">General Enquiry</option>
                                        <option value="Consultation Booking">Consultation Booking</option>
                                        <option value="Technical Support">Technical Support</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Careers">Careers</option>
                                    </select>
                                    {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    placeholder="Tell us about your project or question…"
                                    className={`w-full px-4 py-3 text-sm rounded-xl border bg-gray-50 text-gray-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${errors.message ? "border-red-300" : "border-gray-200"
                                        }`}
                                />
                                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 rounded-full bg-[#1a8d1a] text-white text-sm font-bold hover:bg-[#157a15] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1a8d1a]/20 flex items-center justify-center gap-2.5"
                            >
                                {isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Sidebar info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Office card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                        <h3 className="font-bold text-gray-900 mb-4">Our Office</h3>
                        <div className="space-y-4">
                            <InfoRow icon={<LocationIcon />} label="Address" value="71 Shelton Street, Covent Garden, London WC2H 9JQ" />
                            <InfoRow icon={<EmailIcon />} label="Email" value="hello@tenuq.com" />
                            <InfoRow icon={<PhoneIcon />} label="Phone" value="+44 20 7946 0958" />
                            <InfoRow icon={<ClockIcon />} label="Hours" value="Mon – Fri, 9:00 – 18:00 GMT" />
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                        <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
                        <div className="space-y-2">
                            {[
                                { label: "View Pricing & Book", href: "/pricing" },
                                { label: "Track Your Order", href: "/track" },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 group"
                                >
                                    {link.label}
                                    <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1a8d1a] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Response time */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-6 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                        <div className="relative">
                            <p className="text-xs text-gray-400 uppercase tracking-[0.15em] mb-1 font-bold">Average Response Time</p>
                            <p className="text-3xl font-extrabold text-white mb-1">&lt; 4 hours</p>
                            <p className="text-xs text-gray-500">During business hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Reusable Field ───────────────────────── */

function Field({
    label, name, type = "text", error, placeholder,
}: {
    label: string; name: string; type?: string; error?: string; placeholder: string;
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
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${error ? "border-red-300" : "border-gray-200"
                    }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

/* ─── Info Row ─────────────────────────────── */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a8d1a]/10 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-700">{value}</p>
            </div>
        </div>
    );
}

/* ─── Icons ────────────────────────────────── */

function LocationIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function EmailIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
