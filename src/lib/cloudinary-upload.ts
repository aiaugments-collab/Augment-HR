/**
 * Cloudinary upload utility for client-side uploads
 */
export async function uploadFileToCloudinary({
  file,
  uploadUrl,
  uploadParams,
}: {
  file: File;
  uploadUrl: string;
  uploadParams: {
    timestamp: number;
    signature: string;
    api_key: string;
    folder: string;
  };
}) {
  try {
    const formData = new FormData();
    
    // Add the file
    formData.append('file', file);
    
    // Add all the upload parameters
    Object.entries(uploadParams).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}
