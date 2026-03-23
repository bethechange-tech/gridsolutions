"use client";

import { deleteProduct } from "@/lib/actions";
import { useTransition } from "react";

export default function DeleteProductButton({
  id,
  hasOrders,
}: {
  id: string;
  hasOrders: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (hasOrders) {
    return (
      <span
        className="text-xs text-gray-400 font-medium cursor-not-allowed"
        title="Cannot delete — product has linked orders"
      >
        🔒 In use
      </span>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await deleteProduct(id);
          } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Failed to delete product");
          }
        })
      }
      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
