# Eglobalsphere Unified Platform - Backend API Specification

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Development Guide](#development-guide)

---

## Project Overview

The **Eglobalsphere Unified Platform** is a comprehensive enterprise management system that integrates multiple security and access control modules:

- **SphereX**: Employee and visitor management with face recognition
- **LPR (License Plate Recognition)**: Vehicle access control and gate management
- **Farouq**: Factory workforce management with attendance tracking
- **Violations**: Traffic and security violation monitoring

This repository contains the **frontend application** built with Next.js 15. This document serves as the complete API specification for backend engineers to implement the required endpoints.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: TailwindCSS 4, Sass
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

### Expected Backend Stack
- RESTful API
- WebSocket support (Socket.IO)
- Authentication: JWT tokens
- File uploads support (multipart/form-data)

---

## Getting Started

### Prerequisites
- Node.js v20+
- pnpm

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Set environment variables
# Create .env.local file with:
# NEXT_PUBLIC_BASE_API_URL=<your-backend-url>

# Run development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── 2fa/               # Two-factor authentication
│   ├── dashboard/         # Main dashboard
│   ├── spherex-employees/ # SphereX employee management
│   ├── spherex-visitors/  # SphereX visitor management
│   ├── lpr-gates/         # LPR gate management
│   ├── lpr-plates/        # License plate management
│   ├── farouq-employees/  # Farouq employee management
│   └── ...
├── modules/               # Feature modules
│   ├── login/
│   │   ├── services/     # API integration
│   │   ├── schema/       # Zod validation schemas
│   │   └── types/        # TypeScript types
│   ├── 2fa/
│   ├── onBoarding/
│   ├── dashboard/
│   └── ...
├── core/                  # Shared utilities
│   ├── services/
│   │   └── api.ts        # Axios instance
│   ├── commons/          # Shared components
│   └── constants/        # App constants
├── components/           # Reusable UI components
├── constants/            # Data structures and mock data
└── types/                # Global TypeScript types
```

---

## API Endpoints

### Base Configuration
- **Base URL**: Configured via `NEXT_PUBLIC_BASE_API_URL` environment variable
- **Authentication**: JWT tokens (stored in cookies)
- **Content-Type**: `application/json` (default), `multipart/form-data` (file uploads)

---

### 1. Authentication & Authorization

#### 1.1 User Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string (email format, required)",
  "password": "string (min 8 characters, required)"
}
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Login successful",
  "doc": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "USER | ADMIN | SUB_ADMIN"
    },
    "token": "string (JWT)",
    "refreshToken": "string"
  }
}
```

**Response (203 - 2FA Required):**
```json
{
  "status": "success",
  "message": "2FA required",
  "doc": {
    "token": "string (temporary token for 2FA)",
    "role": "string"
  }
}
```

**Response (406 - Email Verification Required):**
```json
{
  "status": "error",
  "message": "Email verification required",
  "doc": {
    "token": "string (temporary token for OTP)"
  }
}
```

---

#### 1.2 Two-Factor Authentication
```
POST /auth/login-2fa/:token
```

**URL Parameters:**
- `token`: Temporary token from login response

**Request Body:**
```json
{
  "twoFactorVerificationCode": "string (required)"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "2FA verification successful",
  "doc": {
    "user": { /* user object */ },
    "token": "string (JWT)",
    "refreshToken": "string"
  }
}
```

---

#### 1.3 Resend 2FA Code
```
POST /auth/resend-2fa-code/:token
```

**URL Parameters:**
- `token`: Temporary token

**Response (200):**
```json
{
  "status": "success",
  "message": "2FA code sent successfully"
}
```

---

#### 1.4 Email Verification (OTP)
```
POST /auth/verify-email/:token
```

**URL Parameters:**
- `token`: Temporary token from login response

**Request Body:**
```json
{
  "verificationCode": "string (required)"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Email verified successfully",
  "doc": {
    "user": { /* user object */ },
    "token": "string (JWT)"
  }
}
```

---

#### 1.5 Resend Email Verification Code
```
POST /auth/resend-email-verification-code/:token
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Verification code sent successfully"
}
```

---

#### 1.6 Forgot Password
```
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "string (email format, required)"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Password reset link sent to email"
}
```

---

### 2. Onboarding

#### 2.1 Create Admin Account
```
POST /auth/create-admin
```

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (email format, optional)",
  "code": "string (optional)",
  "password": "string (min 8 characters, required)",
  "confirmPassword": "string (min 8 characters, required)"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Admin account created successfully",
  "doc": {
    "user": { /* user object */ },
    "token": "string (JWT)",
    "refreshToken": "string"
  }
}
```

---

#### 2.2 Update Organization
```
PATCH /organization
```

**Content-Type:** `multipart/form-data`

**Request Body (FormData):**
```
image: File (max 5MB, JPEG/PNG, optional)
name: string (required)
isOnboarded: boolean (optional)
description: string (required for details step)
usersRange: string (required for details step)
phone: string (required for details step)
country: string (required for details step)
staffRange: string (required for details step)
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Organization updated successfully",
  "doc": {
    "organization": {
      "id": "string",
      "name": "string",
      "image": "string (URL)",
      "description": "string",
      "usersRange": "string",
      "phone": "string",
      "country": "string",
      "staffRange": "string",
      "isOnboarded": "boolean"
    }
  }
}
```

---

### 3. SphereX Module

#### 3.1 Get Employees
```
GET /spherex/employees
```

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)
- `search`: string (optional)
- `department`: string (optional)
- `status`: "active" | "blocked" (optional)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "fullname": "string",
      "department": "string",
      "phone": "string",
      "zone": "string",
      "email": "string",
      "role": "Employee | Security guard",
      "status": "active | blocked"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
}
```

---

#### 3.2 Get Employee by ID
```
GET /spherex/employees/:id
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "fullname": "string",
    "department": "string",
    "phone": "string",
    "zone": "string",
    "email": "string",
    "role": "string",
    "status": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

---

#### 3.3 Create Employee
```
POST /spherex/employees
```

**Request Body:**
```json
{
  "fullname": "string (required)",
  "department": "string (required)",
  "phone": "string (required)",
  "zone": "string (required)",
  "email": "string (email format, required)",
  "role": "Employee | Security guard (required)",
  "status": "active | blocked (optional, default: active)"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Employee created successfully",
  "data": { /* employee object */ }
}
```

---

#### 3.4 Update Employee
```
PATCH /spherex/employees/:id
```

**Request Body:** Same as Create Employee (all fields optional)

**Response (200):**
```json
{
  "status": "success",
  "message": "Employee updated successfully",
  "data": { /* employee object */ }
}
```

---

#### 3.5 Delete Employee
```
DELETE /spherex/employees/:id
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Employee deleted successfully"
}
```

---

#### 3.6 Get Visitors
```
GET /spherex/visitors
```

**Query Parameters:** Same as employees

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "fullname": "string",
      "department": "string",
      "phone": "string",
      "zone": "string",
      "email": "string",
      "addedBy": "string",
      "status": "accepted | rejected | pending"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

#### 3.7 Create Visitor
```
POST /spherex/visitors
```

**Request Body:**
```json
{
  "fullname": "string (required)",
  "department": "string (required)",
  "phone": "string (required)",
  "zone": "string (required)",
  "email": "string (email format, required)",
  "addedBy": "string (required)"
}
```

---

#### 3.8 Update Visitor Status
```
PATCH /spherex/visitors/:id
```

**Request Body:**
```json
{
  "status": "accepted | rejected | pending (required)"
}
```

---

#### 3.9 Get SphereX Logs
```
GET /spherex/logs
```

**Query Parameters:**
- `page`: number
- `limit`: number
- `startDate`: string (ISO 8601)
- `endDate`: string (ISO 8601)
- `type`: "employee | visitor | security_guard"
- `activity`: "normal | alert | exit"

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "timestamp": "string (ISO 8601)",
      "fullname": "string",
      "department": "string",
      "zone": "string",
      "note": "string",
      "activity": "normal | alert | exit",
      "ID": "string (employee/visitor ID)",
      "type": "employee | visitor | security_guard"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

### 4. LPR (License Plate Recognition) Module

#### 4.1 Get Gates
```
GET /lpr/gates
```

**Query Parameters:**
- `page`: number
- `limit`: number
- `project_name`: string
- `type`: "Entry | Exit | Both"
- `enabled`: boolean
- `agent_status`: "Running | Offline | Not Started"

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "name": "string",
      "project_name": "string",
      "gate_number": "number",
      "type": "Entry | Exit | Both",
      "entry_camera_url": "string | null",
      "exit_camera_url": "string | null",
      "enabled": "number (0 or 1)",
      "agent_status": "Running | Offline | Not Started",
      "creation": "string (ISO 8601)",
      "modified": "string (ISO 8601)"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

#### 4.2 Create Gate
```
POST /lpr/gates
```

**Request Body:**
```json
{
  "project_name": "string (required)",
  "gate_number": "number (required)",
  "type": "Entry | Exit | Both (required)",
  "entry_camera_url": "string (optional)",
  "exit_camera_url": "string (optional)",
  "enabled": "boolean (optional, default: true)"
}
```

---

#### 4.3 Update Gate
```
PATCH /lpr/gates/:name
```

**Request Body:** Same as Create Gate (all fields optional)

---

#### 4.4 Delete Gate
```
DELETE /lpr/gates/:name
```

---

#### 4.5 Get License Plates
```
GET /lpr/license-plates
```

**Query Parameters:**
- `page`: number
- `limit`: number
- `search`: string (search by license plate or house number)
- `enabled`: boolean

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "name": "string",
      "vehicle_model": "string",
      "vehicle_owner": "string",
      "license_plate": "string",
      "enabled": "number (0 or 1)",
      "valid_till": "string (ISO 8601) | null",
      "house_no": "string",
      "creation": "string (ISO 8601)",
      "modified": "string (ISO 8601)"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

#### 4.6 Create License Plate
```
POST /lpr/license-plates
```

**Request Body:**
```json
{
  "vehicle_model": "string (required)",
  "vehicle_owner": "string (required)",
  "license_plate": "string (required)",
  "house_no": "string (required)",
  "valid_till": "string (ISO 8601, optional)",
  "enabled": "boolean (optional, default: true)"
}
```

---

#### 4.7 Update License Plate
```
PATCH /lpr/license-plates/:name
```

---

#### 4.8 Delete License Plate
```
DELETE /lpr/license-plates/:name
```

---

#### 4.9 Get LPR Logs
```
GET /lpr/logs
```

**Query Parameters:** Similar to SphereX logs

**Response:** Similar structure to SphereX logs with LPR-specific fields

---

### 5. Farouq Module

#### 5.1 Get Employees
```
GET /farouq/employees
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string (UUID)",
      "employee_id": "string",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "phone": "string",
      "department": "string | null",
      "position": "SUPERVISOR | ADMIN",
      "shift_schedule": "Day | Night",
      "zone_preferences": "string | null",
      "productivity_target": "number",
      "idle_threshold": "number",
      "rfid_card_id": "string | null",
      "is_active": "boolean",
      "role": "SUPERVISOR | ADMIN",
      "status": "ACTIVE | TERMINATED",
      "created_at": "string (ISO 8601)",
      "updated_at": "string (ISO 8601)",
      "date_registered": "string (ISO 8601)",
      "face_embeddings": "string | null",
      "zone_assignments": [
        {
          "id": "string (UUID)",
          "zone_id": "string (UUID)",
          "zone_name": "string",
          "zone_type": "PRODUCTION | OFFICE | WAREHOUSE",
          "zone_status": "ACTIVE | INACTIVE",
          "can_enter": "boolean",
          "can_exit": "boolean",
          "can_work": "boolean",
          "requires_escort": "boolean",
          "allowed_hours": "string | null",
          "allowed_days": "string | null",
          "access_level": "string",
          "reason": "string | null",
          "is_active": "boolean",
          "authorization_date": "string (ISO 8601)",
          "authorization_expires": "string (ISO 8601) | null",
          "created_at": "string (ISO 8601)",
          "updated_at": "string (ISO 8601) | null"
        }
      ]
    }
  ]
}
```

---

#### 5.2 Create Farouq Employee
```
POST /farouq/employees
```

**Request Body:**
```json
{
  "first_name": "string (required)",
  "last_name": "string (required)",
  "email": "string (email format, required)",
  "phone": "string (required)",
  "department": "string (optional)",
  "position": "SUPERVISOR | ADMIN (required)",
  "shift_schedule": "Day | Night (required)",
  "productivity_target": "number (optional, default: 100)",
  "idle_threshold": "number (optional, default: 30)"
}
```

---

#### 5.3 Get Farouq Logs
```
GET /farouq/logs
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string (UUID)",
      "log_type": "audit | check_in_out | attendance",
      "user_id": "string (UUID)",
      "user_name": "string",
      "zone_id": "string (UUID) | null",
      "zone_name": "string | null",
      "agent_id": "string | null",
      "timestamp": "string (ISO 8601)",
      "method": "face_recognition | CREATE_SETTING",
      "status": "check_in | check_out | present | SystemSettings",
      "confidence_score": "number | null",
      "is_authorized": "boolean | null",
      "duration_seconds": "number | null",
      "productivity_score": "number | null",
      "movement_score": "number | null",
      "idle_time_minutes": "number | null",
      "notes": "string",
      "created_at": "string (ISO 8601)"
    }
  ]
}
```

---

### 6. Violations Module

#### 6.1 Get Violations
```
GET /violations
```

**Query Parameters:**
- `page`: number
- `limit`: number
- `violation_type`: "ONEWAY | SPEED"
- `startDate`: string (ISO 8601)
- `endDate`: string (ISO 8601)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "name": "string (violation ID, e.g., VVL-00459)",
      "license_plate": "string",
      "violation_type": "ONEWAY | SPEED",
      "image": "string (file path)",
      "gate": "string | null",
      "description": "string | null",
      "creation": "string (ISO 8601)",
      "modified": "string (ISO 8601)",
      "owner": "string (user email)",
      "modified_by": "string (user email)"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

#### 6.2 Create Violation
```
POST /violations
```

**Content-Type:** `multipart/form-data`

**Request Body:**
```
license_plate: string (required)
violation_type: "ONEWAY" | "SPEED" (required)
image: File (required)
gate: string (optional)
description: string (optional)
```

---

### 7. Notifications

#### 7.1 Get Notifications
```
GET /notifications
```

**Query Parameters:**
- `page`: number
- `limit`: number
- `type`: "system | activity | alert"
- `isRead`: boolean
- `priority`: "high | medium | low"

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "content": "string",
      "type": "system | activity | alert",
      "category": "string",
      "isRead": "boolean",
      "createdAt": "string (ISO 8601)",
      "priority": "high | medium | low"
    }
  ]
}
```

---

#### 7.2 Mark Notification as Read
```
PATCH /notifications/:id
```

**Request Body:**
```json
{
  "isRead": "boolean (required)"
}
```

---

### 8. Support

#### 8.1 Get Support Tickets
```
GET /support
```

**Query Parameters:**
- `status`: "open | pending | closed"

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "content": "string",
      "status": "open | pending | closed",
      "sentBy": "string (email)",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

#### 8.2 Create Support Ticket
```
POST /support
```

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "content": "string (required)"
}
```

---

### 9. Reports

#### 9.1 Get Report Recipients
```
GET /reports/recipients
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "email": "string",
      "added_by": "string (UUID)",
      "added_by_name": "string",
      "added_at": "string (ISO 8601)"
    }
  ]
}
```

---

#### 9.2 Add Report Recipient
```
POST /reports/recipients
```

**Request Body:**
```json
{
  "email": "string (email format, required)"
}
```

---

### 10. Dashboard & Settings

#### 10.1 Get Dashboard Stats
```
GET /dashboard/stats
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "totalEmployees": "number",
    "activeEmployees": "number",
    "totalVisitors": "number",
    "totalGates": "number",
    "activeGates": "number",
    "totalViolations": "number",
    "recentActivity": [ /* activity array */ ]
  }
}
```

---

#### 10.2 Update User Preferences
```
PATCH /settings/preferences
```

**Content-Type:** `multipart/form-data`

**Request Body:** User preference fields (to be defined based on requirements)

---

#### 10.3 Update Security Settings
```
PATCH /settings/security
```

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (min 8 characters, required)",
  "confirmPassword": "string (required)"
}
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN" | "SUB_ADMIN";
  organizationId: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Organization
```typescript
interface Organization {
  id: string;
  name: string;
  image?: string; // URL
  description?: string;
  usersRange?: string;
  phone?: string;
  country?: string;
  staffRange?: string;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### SphereX Employee
```typescript
interface SphereXEmployee {
  id: string;
  fullname: string;
  department: string;
  phone: string;
  zone: string;
  email: string;
  role: "Employee" | "Security guard";
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
}
```

### SphereX Visitor
```typescript
interface SphereXVisitor {
  id: string;
  fullname: string;
  department: string;
  phone: string;
  zone: string;
  email: string;
  addedBy: string;
  status: "accepted" | "rejected" | "pending";
  createdAt: string;
  updatedAt: string;
}
```

### LPR Gate
```typescript
interface LPRGate {
  name: string; // Unique identifier
  project_name: string;
  gate_number: number;
  type: "Entry" | "Exit" | "Both";
  entry_camera_url?: string;
  exit_camera_url?: string;
  enabled: boolean;
  agent_status: "Running" | "Offline" | "Not Started";
  creation: string;
  modified: string;
  owner: string;
  modified_by: string;
}
```

### License Plate
```typescript
interface LicensePlate {
  name: string; // Unique identifier (license plate number)
  vehicle_model: string;
  vehicle_owner: string;
  license_plate: string;
  enabled: boolean;
  valid_till?: string; // ISO 8601
  house_no: string;
  creation: string;
  modified: string;
}
```

### Farouq Employee
```typescript
interface FarouqEmployee {
  id: string; // UUID
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department?: string;
  position: "SUPERVISOR" | "ADMIN";
  shift_schedule: "Day" | "Night";
  zone_preferences?: string;
  productivity_target: number;
  idle_threshold: number;
  rfid_card_id?: string;
  is_active: boolean;
  role: "SUPERVISOR" | "ADMIN";
  status: "ACTIVE" | "TERMINATED";
  created_at: string;
  updated_at: string;
  date_registered: string;
  face_embeddings?: string;
  zone_assignments: ZoneAssignment[];
}

interface ZoneAssignment {
  id: string; // UUID
  zone_id: string; // UUID
  zone_name: string;
  zone_type: "PRODUCTION" | "OFFICE" | "WAREHOUSE";
  zone_status: "ACTIVE" | "INACTIVE";
  can_enter: boolean;
  can_exit: boolean;
  can_work: boolean;
  requires_escort: boolean;
  allowed_hours?: string;
  allowed_days?: string;
  access_level: string;
  reason?: string;
  is_active: boolean;
  authorization_date: string;
  authorization_expires?: string;
  created_at: string;
  updated_at?: string;
}
```

### Violation
```typescript
interface Violation {
  name: string; // Violation ID (e.g., VVL-00459)
  license_plate: string;
  violation_type: "ONEWAY" | "SPEED";
  image: string; // File path
  gate?: string;
  description?: string;
  creation: string;
  modified: string;
  owner: string;
  modified_by: string;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  title: string;
  description: string;
  content: string;
  type: "system" | "activity" | "alert";
  category: string;
  isRead: boolean;
  createdAt: string;
  priority: "high" | "medium" | "low";
}
```

---

## Development Guide

### For Backend Engineers

#### 1. Authentication Flow
1. User submits credentials via `POST /auth/login`
2. Backend validates credentials
3. If 2FA is enabled, return `203` with temporary token
4. If email is not verified, return `406` with temporary token
5. Otherwise, return `200` with JWT token and user data
6. Frontend stores JWT in cookies and uses it for subsequent requests

#### 2. Authorization
- All endpoints (except auth endpoints) require a valid JWT token
- Token should be sent in the `Authorization` header: `Bearer <token>`
- Backend should verify token and extract user information
- Implement role-based access control (RBAC) based on user role

#### 3. Error Handling
All error responses should follow this format:
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": [ // Optional, for validation errors
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### 4. Pagination
All list endpoints should support pagination:
- Query parameters: `page` (default: 1), `limit` (default: 10)
- Response should include pagination metadata

#### 5. File Uploads
- Use `multipart/form-data` for file uploads
- Validate file types and sizes on the backend
- Return file URLs in responses

#### 6. WebSocket Events (Socket.IO)
The frontend expects the following Socket.IO events:
- `employee:checkin` - Employee check-in event
- `employee:checkout` - Employee check-out event
- `visitor:status` - Visitor status update
- `gate:status` - Gate status change
- `violation:new` - New violation detected
- `notification:new` - New notification

#### 7. Environment Variables
Backend should support the following environment variables:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRATION` - JWT expiration time (e.g., "7d")
- `SMTP_HOST` - SMTP server for emails
- `SMTP_PORT` - SMTP port
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `FRONTEND_URL` - Frontend URL for CORS
- `UPLOAD_DIR` - Directory for file uploads

---

## Additional Notes

### Security Considerations
1. **Password Hashing**: Use bcrypt or argon2 for password hashing
2. **Rate Limiting**: Implement rate limiting on auth endpoints
3. **CORS**: Configure CORS to allow requests from the frontend domain
4. **Input Validation**: Validate all inputs on the backend
5. **SQL Injection**: Use parameterized queries or ORM
6. **XSS Protection**: Sanitize user inputs

### Performance Considerations
1. **Database Indexing**: Index frequently queried fields
2. **Caching**: Implement caching for frequently accessed data
3. **Pagination**: Always paginate large datasets
4. **Lazy Loading**: Load related data only when needed

### Testing
1. Write unit tests for all service functions
2. Write integration tests for all API endpoints
3. Test authentication and authorization flows
4. Test file upload functionality
5. Test WebSocket events

---

## Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Last Updated**: December 5, 2026
**Version**: 1.0.0
