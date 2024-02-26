export async function verifyValue({
  value,
  compareTo,
  itemID,
}: {
  value: string;
  compareTo: string;
  itemID?: string;
}) {
  try {
    const response = await fetch("/api/verifyValue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemID, value, compareTo }),
    });

    const res = await response.json();
    if (res.error) {
      return { error: res.error };
    }
    return { ok: res.ok === true };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
