export async function sendBulkWhatsAppMessage(file: File, message: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);

    const response = await fetch(
      "/api/whatsApp",
      {
        method: "POST",
        body: formData
      }
    );
    const res = await response.json();
    return true
  } catch (error) {
    console.error("Error while sending message", error);
    return undefined;
  }
}