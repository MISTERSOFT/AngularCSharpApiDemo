import { HttpErrorResponse } from "@angular/common/http";

/**
 * Extract error from rfc9110 server response
 */
export function extractResponseErrors(response: HttpErrorResponse, defaultErrorMessage: string = ''): string[] {
  if (!response['error']) {
    return [defaultErrorMessage]
  }

  if (response.error['error']) {
    return Object.values(response.error['error'])
  }

  return Object.values(response.error['errors'])
}
