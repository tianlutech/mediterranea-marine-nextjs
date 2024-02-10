import axios from "axios";

const makeKey = process.env.MAKE_KEY;

const BASE_URL = "https://eu2.make.com/api/v2/";
const headers = {
  Authorization: `Token ${makeKey}`,
  "Content-Type": "application/json;",
};

type MakeError = {
  detail: string;
  message: string;
  code: string;
};
export const runScenario = async (
  scenarioId: number,
  data: Record<string, unknown> = {}
) => {
  try {
    const response = await axios.post<{ executionId: string }>(
      `${BASE_URL}/scenarios/${scenarioId}/run`,
      { data },
      { headers }
    );

    if ("message" in response.data) {
      return { error: response.data.message };
    }

    return { result: response.data.executionId };
  } catch (error: any) {
    // Axios Error
    if (error.response) {
      return {
        error: (error.response.data as MakeError).message,
        code: error.response.status,
      };
    }
    return { error: error, code: 500 };
  }
};
