import { HttpErrorResponse } from "@angular/common/http";

/**
 * Extract error messages from RFC 9110 server response
 * Handles multiple error response formats:
 * - { error: { field: "message" } }
 * - { errors: { field: "message" } }
 *
 * @param response - The HTTP error response
 * @param defaultErrorMessage - Fallback message if no errors found
 * @returns Array of error message strings
 */
export function extractResponseErrors(
  response: HttpErrorResponse,
  defaultErrorMessage: string = 'An unexpected error occurred'
): string[] {
  // Handle when there is no error
  if (!response['error']) {
    return [defaultErrorMessage]
  }

  // Check for { error: { field: "message" } } format
  if (response.error['error']) {
    return Object.values(response.error['error'])
  }

  // Assume the format is { errors: { field: "message" } }
  return Object.values(response.error['errors'])
}
