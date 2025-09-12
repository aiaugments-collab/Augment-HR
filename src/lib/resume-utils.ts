/**
 * Convert a file URL to our resume viewer URL
 */
export function getResumeViewerUrl(fileUrl: string): string {
  // Extract the path from our API file URL
  // Example: http://localhost:3000/api/files/resumes/filename.pdf -> /resume/resumes/filename.pdf
  const match = fileUrl.match(/\/api\/files\/(.+)$/);
  if (match) {
    return `/resume/${match[1]}`;
  }
  
  // Fallback: if it's not our API URL format, return the original URL
  return fileUrl;
}

/**
 * Get the direct download URL for a resume
 */
export function getResumeDownloadUrl(fileUrl: string): string {
  // Our API files endpoint serves files directly
  return fileUrl;
}
