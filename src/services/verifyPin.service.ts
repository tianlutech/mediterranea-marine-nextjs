export async function verifyPin(Pin: string, captainId?: string) {
  try {
    const response = await fetch("/api/verifyPin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ captainId, Pin }),
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
