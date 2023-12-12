export const getData = async () => {
  try {
    const response = await fetch("/api/googleDrive");
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return undefined;
  }
}