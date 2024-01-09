import { toast } from "react-toastify";

export async function validateAddress(address: string) {
  try {
    const response = await fetch("/api/google", {
      // Ensure the path is correct based on your file structure
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
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
