# Authentication & Token Refresh Setup

## Overview
This document describes the comprehensive authentication and token refresh implementation for the eglobalsphere unified platform.

## Architecture

### 1. Authentication Flow

```
Login → Set Tokens → Store in Cookies + Zustand → Access Protected Routes
                                                         ↓
                                                   Token Expired?
                                                         ↓
                                      Yes → Auto Refresh → Continue
                                       ↓
                                      No → Redirect to Login
```

### 2. Components

#### **Auth Utilities** (`src/lib/auth-utils.ts`)
Centralized authentication utility functions:
- `setAuthCookies()` - Set auth and refresh tokens in cookies
- `clearAuthCookies()` - Clear all auth-related cookies
- `getAuthToken()` - Retrieve auth token from cookies
- `getRefreshToken()` - Retrieve refresh token from cookies
- `isTokenExpired()` - Check if token is expired or about to expire
- `getTokenExpiration()` - Parse JWT token expiration time

#### **API Service** (`src/core/services/api.ts`)
Enhanced Axios instance with automatic token refresh:
- **Request Interceptor**: Automatically adds auth token to all requests
- **Response Interceptor**: Handles 401 errors and refreshes tokens automatically
- **Token Refresh Logic**:
  - Prevents multiple simultaneous refresh requests
  - Queues failed requests and retries after refresh
  - Automatically redirects to login if refresh fails

#### **Auth Context** (`src/lib/context/authContext.tsx`)
React context for managing authentication state:
- Initializes auth state from cookies and Zustand store
- Validates token on mount
- Provides authentication status to components
- Does NOT handle token refresh (delegated to API interceptor)

#### **Middleware** (`src/middleware.ts`)
Next.js middleware for route protection:
- Validates tokens on every request
- Protects authenticated routes
- Redirects unauthenticated users to login
- Redirects authenticated users away from auth pages
- Supports role-based authorization
- Clears invalid cookies automatically

#### **Login Services**
Updated to properly set authentication state:
- **Login** (`src/modules/login/services/login.ts`)
- **2FA** (`src/modules/2fa/service/index.ts`)
- **Verify OTP** (`src/modules/verify-otp/services/index.ts`)

All services now:
1. Set cookies using `setAuthCookies()`
2. Update Zustand store with user data
3. Set `isAuthenticated` flag
4. Handle errors properly with toast notifications

#### **Logout Service** (`src/hooks/auth/logout.ts`)
Properly cleans up authentication:
- Clears Zustand store
- Clears all auth cookies
- Redirects to login page
- Handles API logout gracefully

## Token Management

### Cookie Structure
- `auth-token`: JWT access token (7 days default, 30 days with "remember me")
- `refresh-token`: Refresh token for obtaining new access tokens
- `role`: User role (USER, ADMIN, SUB_ADMIN)

### Cookie Security
- **SameSite**: Strict (prevents CSRF attacks)
- **Secure**: Enabled in production
- **Path**: `/` (available across entire app)

### Token Refresh Strategy
1. **Client-Side**: API interceptor automatically refreshes on 401 errors
2. **Server-Side**: Middleware validates token expiration
3. **Silent Refresh**: Users don't see interruptions during refresh
4. **Queue Management**: Multiple failed requests are queued and retried after successful refresh

## Security Features

### 1. Token Validation
- JWT signature validation
- Expiration checking (with 5-minute buffer)
- Automatic cleanup of expired tokens

### 2. Protected Routes
All routes under these paths require authentication:
- `/dashboard`
- `/customizations`
- `/licenses`
- `/notifications`
- `/reports`
- `/support`
- `/spherex-*`
- `/lpr-*`
- `/violation-*`
- `/farouq-*`

### 3. Public Routes
These routes are accessible without authentication:
- `/login`
- `/sign-up`
- `/2fa`
- `/forget-password`
- `/verify-otp`
- `/` (landing page)

### 4. Role-Based Access Control (Optional)
The middleware supports role-based authorization. To enable:
1. Uncomment role validation in middleware
2. Define permission mappings for each role
3. Implement route-specific access rules

## Implementation Details

### Automatic Token Refresh Flow

```typescript
1. User makes API request
2. Request interceptor adds auth token
3. API returns 401 (Unauthorized)
4. Response interceptor catches 401
5. Check if already refreshing
   - Yes: Queue this request
   - No: Start refresh process
6. Call /auth/refresh-token with refresh token
7. Success:
   - Update cookies with new tokens
   - Retry original request
   - Process queued requests
8. Failure:
   - Clear all auth data
   - Redirect to login
```

### Auth Context Initialization

```typescript
1. Component mounts
2. Check for auth token in cookies
3. Validate token expiration
4. If valid:
   - Set isAuthenticated = true
   - Trust API interceptor for refresh
5. If invalid:
   - Clear stale auth state
   - Set isAuthenticated = false
```

## Usage Examples

### Making Authenticated Requests

```typescript
import api from '@/core/services/api';

// Token is automatically added to headers
const response = await api.get('/protected-endpoint');

// Token refresh happens automatically on 401
```

### Checking Authentication Status

```typescript
import { useContext } from 'react';
import { AuthContext } from '@/lib/context/authContext';

function MyComponent() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Login />;
  
  return <Dashboard />;
}
```

### Manual Token Operations

```typescript
import { getAuthToken, isTokenExpired, clearAuthCookies } from '@/lib/auth-utils';

// Check token
const token = getAuthToken();
if (token && isTokenExpired(token)) {
  clearAuthCookies();
  // Redirect to login
}
```

## Testing

### Testing Token Refresh
1. Login to the application
2. Wait for token to expire (or manually expire it)
3. Make any API request
4. Token should refresh automatically
5. Request should succeed

### Testing Protected Routes
1. Clear cookies
2. Navigate to `/dashboard`
3. Should redirect to `/login`
4. Login successfully
5. Should redirect back to `/dashboard`

### Testing Middleware
1. Login with valid credentials
2. Navigate to `/login`
3. Should redirect to `/dashboard`
4. Logout
5. Navigate to `/dashboard`
6. Should redirect to `/login`

## Migration Notes

### Changes from Previous Implementation
1. **Removed**: Client-side SWR token refresh in AuthContext
2. **Added**: Automatic token refresh in API interceptor
3. **Added**: Centralized auth utility functions
4. **Enhanced**: Middleware with token validation
5. **Improved**: Cookie management with proper security flags
6. **Unified**: All login flows (login, 2FA, OTP) use same pattern

### Breaking Changes
None - All existing functionality is preserved and enhanced.

## Troubleshooting

### Issue: Infinite redirect loops
**Solution**: Check that middleware config excludes API routes and static files

### Issue: Token refresh not working
**Solution**: Verify that `/auth/refresh-token` endpoint accepts `refresh_token` parameter

### Issue: User logged out unexpectedly
**Solution**: Check token expiration times and ensure refresh token is valid

### Issue: Cookies not being set
**Solution**: Verify `NEXT_PUBLIC_BASE_API_URL` is correctly configured

## Best Practices

1. **Never expose tokens in URL**: Always use cookies or headers
2. **Short token lifetime**: Keep access tokens short-lived (15-30 minutes ideal)
3. **Secure cookies in production**: Always use secure flag in production
4. **Handle refresh failures gracefully**: Always redirect to login on refresh failure
5. **Clear tokens on logout**: Always clear both cookies and store
6. **Validate tokens server-side**: Middleware should validate token structure

## API Endpoints

### POST /auth/login
Login with email and password
- Returns: `{ doc: { user, token, refreshToken, preferences } }`

### POST /auth/refresh-token
Refresh access token
- Body: `{ refresh_token: string }`
- Returns: `{ doc: { token, refreshToken } }`

### POST /auth/logout
Logout current session
- Headers: `Authorization: Bearer <token>`
- Returns: `{ message: string }`

## Future Enhancements

1. **Server-side session management**: Consider adding server-side session tracking
2. **Token rotation**: Implement refresh token rotation for enhanced security
3. **Device fingerprinting**: Track and validate device signatures
4. **Rate limiting**: Add rate limiting for token refresh endpoints
5. **Biometric authentication**: Add support for WebAuthn/passkeys
6. **Session management UI**: Allow users to view and revoke active sessions

## Security Considerations

1. **XSS Protection**: Tokens in cookies are safer than localStorage
2. **CSRF Protection**: SameSite=Strict provides CSRF protection
3. **Token Leakage**: Never log tokens or include in error messages
4. **Refresh Token Storage**: Consider httpOnly cookies for refresh tokens (server-side implementation)
5. **Token Revocation**: Implement token blacklist on backend for immediate logout

---

**Last Updated**: January 8, 2026
**Version**: 1.0.0

