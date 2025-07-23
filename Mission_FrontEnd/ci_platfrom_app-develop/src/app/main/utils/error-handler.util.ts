/**
 * Utility function to safely extract error messages from HTTP error responses
 * @param err - The error object from HTTP requests
 * @param defaultMessage - Default message to show if no error message is found
 * @returns A safe error message string
 */
export function getErrorMessage(err: any, defaultMessage: string = 'An error occurred'): string {
  if (!err) {
    return defaultMessage;
  }
  
  // Try to get error message from different possible locations
  const errorMessage = err?.error?.message || 
                      err?.error?.error || 
                      err?.message || 
                      err?.statusText ||
                      err?.error ||
                      defaultMessage;
  
  return errorMessage;
} 