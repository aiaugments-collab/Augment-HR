/**
 * Generate a shareable URL for a job posting
 */
export function generateJobShareableUrl(
  organizationId: string,
  jobId: string,
): string {
  // Get the base URL from environment or current window location
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  // If no environment variable is set, try to get from window location
  if (!baseUrl && typeof window !== "undefined") {
    baseUrl = window.location.origin;
  }
  
  // Fallback to localhost for development
  if (!baseUrl) {
    baseUrl = "http://localhost:3000";
  }
  
  // Ensure we're not using localhost in production
  if (baseUrl.includes("localhost") && typeof window !== "undefined") {
    // If we're in a browser and the current origin is not localhost, use that instead
    const currentOrigin = window.location.origin;
    if (!currentOrigin.includes("localhost")) {
      baseUrl = currentOrigin;
    }
  }
  
  return `${baseUrl}/jobs/${organizationId}/${jobId}`;
}
