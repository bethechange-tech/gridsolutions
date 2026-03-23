/* ──────────────────────────────────────────────
 *  Order Store (Zustand)
 *  Centralised state for the entire pricing flow.
 *  No providers needed — just import useOrderStore.
 * ────────────────────────────────────────────── */

import { create } from "zustand";

import type {
  OrderConfig,
  FlowStep,
  QualityTier,
  TurnaroundSpeed,
  ProductCategory,
  OrderType,
  ContactInfo,
} from "@/types/pricing";

import { DEFAULT_ORDER_CONFIG } from "@/data/products";

// ─── Store interface ────────────────────────

export interface OrderStore {
  // State
  step: FlowStep;
  config: OrderConfig;
  contactInfo: ContactInfo;
  activeCategory: ProductCategory;
  searchQuery: string;
  isProcessing: boolean;
  transactionId: string | null;

  // Actions
  setStep: (step: FlowStep) => void;
  setContactInfo: (field: keyof ContactInfo, value: string) => void;
  selectProduct: (productId: string, orderType: OrderType) => void;
  setOrderType: (orderType: OrderType) => void;
  setQuantity: (quantity: number) => void;
  setWordCount: (wordCount: number) => void;
  setImages: (images: number) => void;
  setQuality: (quality: QualityTier) => void;
  setTurnaround: (turnaround: TurnaroundSpeed) => void;
  setCategory: (category: ProductCategory) => void;
  setSearch: (query: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  setTransactionId: (transactionId: string) => void;
  reset: () => void;
}

const initialContactInfo: ContactInfo = { name: "", email: "", phone: "" };

const initialState = {
  step: "select" as FlowStep,
  config: { ...DEFAULT_ORDER_CONFIG },
  contactInfo: { ...initialContactInfo },
  activeCategory: "all" as ProductCategory,
  searchQuery: "",
  isProcessing: false,
  transactionId: null as string | null,
};

// ─── Store ──────────────────────────────────

export const useOrderStore = create<OrderStore>()((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setContactInfo: (field, value) =>
    set((s) => ({ contactInfo: { ...s.contactInfo, [field]: value } })),

  selectProduct: (productId, orderType) =>
    set((s) => ({
      config: { ...s.config, productId, orderType },
      step: orderType === "consultation" ? "review" : "configure",
    })),

  setOrderType: (orderType) =>
    set((s) => ({
      config: { ...s.config, orderType },
    })),

  setQuantity: (quantity) =>
    set((s) => ({
      config: { ...s.config, quantity: Math.max(1, quantity) },
    })),

  setWordCount: (wordCount) =>
    set((s) => ({
      config: { ...s.config, wordCount: Math.max(0, wordCount) },
    })),

  setImages: (images) =>
    set((s) => ({
      config: { ...s.config, images: Math.max(0, images) },
    })),

  setQuality: (quality) =>
    set((s) => ({
      config: { ...s.config, quality },
    })),

  setTurnaround: (turnaround) =>
    set((s) => ({
      config: { ...s.config, turnaround },
    })),

  setCategory: (category) => set({ activeCategory: category }),

  setSearch: (query) => set({ searchQuery: query }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setTransactionId: (transactionId) => set({ transactionId }),

  reset: () => set({ ...initialState, config: { ...DEFAULT_ORDER_CONFIG }, contactInfo: { ...initialContactInfo } }),
}))
