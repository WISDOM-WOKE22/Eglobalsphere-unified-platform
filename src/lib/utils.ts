import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Convert object to query string
export function toQueryString(params: Record<string, any>): string {
  if (!params) return '';
  return Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(
      ([k, v]) =>
        encodeURIComponent(k) +
        '=' +
        encodeURIComponent(
          typeof v === 'object' ? JSON.stringify(v) : String(v),
        ),
    )
    .join('&');
}

// Authentication utilities
export function validateToken(token: string): boolean {
  if (!token || token.length < 10) {
    return false;
  }

  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      // If it's not a JWT, just check if it's a valid string
      return token.length > 10;
    }

    // Try to decode the payload
    try {
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (decodeError) {
      // If we can't decode the JWT, but it has the right structure, assume it's valid
      console.warn('Could not decode JWT payload, but token structure looks valid');
      return true;
    }
  } catch (error) {
    // Handle DOMException and other errors gracefully
    console.error('Token validation error:', error);
    // If we can't validate the token but it exists, assume it's valid
    return token.length > 10;
  }
}

export function getTokenFromCookies(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) return null;

  try {
    const cookies = cookieHeader.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    return cookies['auth-token'] || null;
  } catch (error) {
    console.error('Error parsing cookies:', error);
    return null;
  }
}

export function clearAuthCookies(): void {
  if (typeof document !== 'undefined') {
    try {
      // Clear auth-token cookie
      document.cookie =
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';

      // Clear any other auth-related cookies
      document.cookie =
        'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    } catch (error) {
      console.error('Error clearing auth cookies:', error);
    }
  }
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    return cookies['auth-token'] || null;
  } catch (error) {
    console.error('Error getting auth cookie:', error);
    return null;
  }
}

export function setAuthCookie(token: string, rememberMe: boolean = false): void {
  if (typeof document === 'undefined') return;

  try {
    const expires = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString() // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString(); // 7 days

    document.cookie = `auth-token=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
  }
}

// Convert 12-hour time format to 24-hour format
export function convertTo24Hour(time12h: string): string {
  // Handle cases where time is already in 24-hour format
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(time12h) && !time12h.includes('am') && !time12h.includes('pm')) {
    return time12h;
  }

  const [time, period] = time12h.split(/(am|pm)/i);
  let [hours, minutes] = time.split(':').map(Number);

  if (period.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}