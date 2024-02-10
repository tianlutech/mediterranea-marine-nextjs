import { MAKE_SCENARIOS } from "@/models/constants";
import { Booking, Boat, Captain } from "@/models/models";

export async function runSavePDFScenario() {
  try {
    const body = { scenarioId: MAKE_SCENARIOS.SAVE_PDF, data: {} };
    const response = await fetch("/api/make", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const res = await response.json();

    return res;
  } catch (error) {
    console.error(error);
    return { error };
  }
}
