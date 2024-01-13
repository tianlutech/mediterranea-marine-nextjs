export const checkIdValidity = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/edenAI", {
      method: "POST",
      body: formData
    });

    const json = await response.json();

    console.log(">>>>>>jsonPart", json)
    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return undefined;
  }
}