export async function generateCheckoutId(amount: string) {
  try {
    const response = await fetch(
      "/api/sumupPayment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount })
      }
    );
    const res = await response.json();
    return res
  } catch (error) {
    console.error("Error while processing payment", error);
    return undefined;
  }
}