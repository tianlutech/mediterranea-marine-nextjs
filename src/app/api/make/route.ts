import * as make from "./make.api";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  try {
    const { scenarioId, data } = await request.json();
    const response = await make.runScenario(scenarioId, data);
    if (response.error) {
      Sentry.captureMessage(JSON.stringify({scenarioId, data, response}))
      return new Response(JSON.stringify(response), {
        status: response.code || 424,
      });
    }
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);

    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
