import * as Sentry from "@sentry/nextjs";

export async function generateCheckoutId({
  amount,
  description,
}: {
  amount: string;
  description: string;
}) {
  try {
    const response = await fetch("/api/sumupPayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, description }),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error while processing payment", error);
    return { error: (error as Error).message };
  }
}

export interface PaymentSentBody {
  cardScheme: string; // 'VISA'
}
export interface PaymentResponseBody {
  amount: number;
  checkout_reference: string;
  currency: string;
  description: string;
  id: string;
  merchant_code: string;
  merchant_name: string;
  status: string; // 'FAILED',
  transaction_code: string;
  transaction_id: string;
}

export type PaymentBody = PaymentSentBody | PaymentResponseBody;
