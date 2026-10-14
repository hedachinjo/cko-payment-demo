
"use client";

import { useEffect, useRef, useState } from "react";
import { loadCheckoutWebComponents } from "@checkout.com/checkout-web-components";

export default function PaymentForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    async function initializeFlow() {
      try {
        const publicKey = process.env.NEXT_PUBLIC_CKO_PUBLIC_KEY;

        if (!publicKey) {
          throw new Error("Missing Checkout.com public key");
        }

        const response = await fetch("/api/payment-session", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(
            `Payment Session request failed: ${response.status}`
          );
        }

        const paymentSession = await response.json();

        if (cancelled) return;

        const checkout = await loadCheckoutWebComponents({
          publicKey,
          environment: "sandbox",
          paymentSession,
          onPaymentCompleted: (_self, paymentResponse) => {
            if (!cancelled) {
              setMessage(
                `Payment submitted: ${paymentResponse.id}. ` +
                "Awaiting server-side confirmation."
              );
            }
          },
        });

        if (cancelled || !container) return;

        const flow = checkout.create("flow");
        flow.mount(container);

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load Flow"
          );
          setLoading(false);
        }
      }
    }

    initializeFlow();

    return () => {
      cancelled = true;
      container?.replaceChildren();
    };
  }, []);

  return (
    <section className="rounded-xl border p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Secure Checkout
      </h2>

      {loading && <p>Loading payment form...</p>}

      {error && (
        <p className="mb-4 text-red-600">{error}</p>
      )}

      {message && (
        <p className="mb-4 text-green-700">{message}</p>
      )}

      <div ref={containerRef} />
    </section>
  );
}
