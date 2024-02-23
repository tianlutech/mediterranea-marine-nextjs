export async function verifyValue(value: string, compareTo: string, itemID?: string) {
  try {
    const response = await fetch("/api/verifyValue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemID, value, compareTo}),
    });

    const res = await response.json();
    if (res === false) {
      return false;
    }
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
