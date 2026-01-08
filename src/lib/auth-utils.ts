/**
 * Authentication Utility Functions
 * Handles cookie management and token operations
 */

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

/**
 * Set authentication cookies
 * @param tokens - Access token and refresh token
 * @param options - Cookie options
 */
export function setAuthCookies(
  tokens: AuthTokens,
  options: { rememberMe?: boolean; role?: string } = {}
): void {
  if (typeof document === 'undefined') return;

  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? '; secure' : '';
    const expires = options.rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString() // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString(); // 7 days

    // Set auth token
    document.cookie = `auth-token=${tokens.token}; path=/; expires=${expires};${secureFlag} SameSite=Strict`;
    
    // Set refresh token
    document.cookie = `refresh-token=${tokens.refreshToken}; path=/; expires=${expires};${secureFlag} SameSite=Strict`;
    
    // Set role if provided
    if (options.role) {
      document.cookie = `role=${options.role.toUpperCase()}; path=/; expires=${expires};${secureFlag} SameSite=Strict`;
    }
  } catch (error) {
    console.error('Error setting auth cookies:', error);
  }
}

/**
 * Get a specific cookie value
 * @param name - Cookie name
 * @returns Cookie value or null
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  try {
    const value = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];
    return value || null;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies(): void {
  if (typeof document === 'undefined') return;

  const cookiesToClear = ['auth-token', 'refresh-token', 'role'];
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; secure' : '';

  cookiesToClear.forEach((cookieName) => {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;${secureFlag} SameSite=Strict`;
  });
}

/**
 * Check if user has valid auth token
 * @returns boolean
 */
export function hasAuthToken(): boolean {
  return !!getCookie('auth-token');
}

/**
 * Get refresh token from cookies
 * @returns Refresh token or null
 */
export function getRefreshToken(): string | null {
  return getCookie('refresh-token');
}

/**
 * Get auth token from cookies
 * @returns Auth token or null
 */
export function getAuthToken(): string | null {
  return getCookie('auth-token');
}

/**
 * Parse JWT token to get expiration time
 * @param token - JWT token
 * @returns Expiration timestamp or null
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

/**
 * Check if token is expired or about to expire
 * @param token - JWT token
 * @param bufferMinutes - Minutes before expiration to consider as expired (default: 5)
 * @returns boolean
 */
export function isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  const bufferMs = bufferMinutes * 60 * 1000;
  return Date.now() >= expiration - bufferMs;
}

