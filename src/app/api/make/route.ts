import * as make from "./make.api";

export async function POST(request: Request) {
  try {
    const { scenarioId, data } = await request.json();
    const response = await make.runScenario(scenarioId, data);
    console.log({ response });
    if (response.error) {
      return new Response(JSON.stringify(response), {
        status: response.code || 424,
      });
    }
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
