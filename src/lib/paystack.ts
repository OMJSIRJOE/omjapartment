const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }
  return key;
}

/** Prices are stored in NGN. Paystack expects amount in kobo. */
export function toPaystackAmountKobo(totalNgn: number): number {
  return Math.max(100, Math.round(totalNgn * 100));
}

export async function initializePaystackPayment(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      currency: "NGN",
      metadata: input.metadata,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || "Unable to initialize Paystack payment");
  }

  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyPaystackPayment(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${secretKey()}`,
    },
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw new Error(data.message || "Unable to verify Paystack payment");
  }

  return data.data as {
    status: string;
    reference: string;
    amount: number;
    customer: { email: string };
  };
}

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
}
