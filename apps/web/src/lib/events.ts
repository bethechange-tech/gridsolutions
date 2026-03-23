/* ──────────────────────────────────────────────
 *  Application Event Bus (Node EventEmitter)
 *  Decouples side-effects (emails, logging, etc.)
 *  from request handlers. Emit an event anywhere;
 *  listeners in listeners.ts handle the rest.
 *
 *  ★ Server-side only — runs in Node.js runtime.
 * ────────────────────────────────────────────── */

import { EventEmitter } from "events";

/* ─── Event Payload Types ──────────────────── */

export interface PaymentSuccessEvent {
  sessionId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  orderType: string;
  quantity: number;
  quality: string;
  turnaround: string;
  totalPrice: number;
  currency: string;
  deliveryDays: number;
}

export interface ContactSubmittedEvent {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/* ─── Event Map ────────────────────────────── */

export interface AppEvents {
  "payment.success": PaymentSuccessEvent;
  "contact.submitted": ContactSubmittedEvent;
}

/* ─── Typed Emitter ────────────────────────── */

class AppEventBus extends EventEmitter {
  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): boolean {
    return super.emit(event, payload);
  }

  on<K extends keyof AppEvents>(event: K, listener: (payload: AppEvents[K]) => void): this {
    return super.on(event, listener);
  }
}

/**
 * Process-wide singleton via globalThis.
 * Node module caching doesn't guarantee a single instance
 * across Next.js bundled contexts (instrumentation vs route),
 * so we pin the bus to globalThis to ensure emit() and on()
 * always hit the same EventEmitter.
 */
const globalKey = "__tenuq_event_bus__";

function getEventBus(): AppEventBus {
  if (!(globalThis as Record<string, unknown>)[globalKey]) {
    (globalThis as Record<string, unknown>)[globalKey] = new AppEventBus();
  }
  return (globalThis as Record<string, unknown>)[globalKey] as AppEventBus;
}

export const appEvents = getEventBus();
