export function base64toBlob(base64Data: string): Blob | null {
  const parts = base64Data.split(",");
  if (!parts) {
    console.error("Invalid base64 data");
    return null;
  }

  const byteCharacters = atob(parts[1] ?? "");
  const arrayBuffer = new ArrayBuffer(byteCharacters.length);
  const byteArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: "image/png" }); // Specify the image type here
}
