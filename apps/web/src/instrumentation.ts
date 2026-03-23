/* ──────────────────────────────────────────────
 *  Next.js Instrumentation Hook
 *  Runs once when the server starts. We use it
 *  to register our event listeners so they're
 *  active for the lifetime of the process.
 *
 *  https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * ────────────────────────────────────────────── */

export async function register() {
  // Only register listeners on the server (not Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/listeners");
  }
}
