export const uploadFile = async (file: File, boatName: string, id: string ,slag: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("boatName", boatName);
    formData.append("id", id);
    formData.append("slag", slag);

    const response = await fetch("/api/googleDrive", {
      method: "POST",
      body: formData // Sending FormData object directly
      // Note: Don't set Content-Type header when using FormData, as the browser sets it automatically with the correct boundary string
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error retrieving data", error);
    return undefined;
  }
}