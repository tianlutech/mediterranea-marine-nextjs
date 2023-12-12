export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Assuming 'file' is a File object

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