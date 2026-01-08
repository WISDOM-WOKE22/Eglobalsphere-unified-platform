export type FarouqDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface FarouqStatsEntry {
  day: FarouqDay;
  checkins: number;
  checkouts: number;
  total: number;
}

export interface FarouqPerformance {
  average: number;
  efficiency: number;
  quality: number;
}

export interface FarouqDateRange {
  start: string;  // ISO date format: "2026-01-08"
  end: string;    // ISO date format: "2026-01-08"
}

export interface FarouqOverviewData {
  total_employees: number;
  present_today: number;
  absent_today: number;
  violations: number;
  performance: FarouqPerformance;
  shifts: number;
  zones: number;
  cameras: number;
  date_range: FarouqDateRange;
  farouqStats: FarouqStatsEntry[];
}

export interface FarouqOverviewResponse {
  status: string;
  message: string;
  doc: FarouqOverviewData;
}

export type EmployeeRole = 'ADMIN' | 'EMPLOYEE' | 'SUPERVISOR';
export type EmployeeStatus = 'Active' | 'Inactive';

export interface FarouqEmployee {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  date_registered: string; // ISO timestamp
}

export interface FarouqEmployeePagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FarouqEmployeeData {
  employees: FarouqEmployee[];
  pagination: FarouqEmployeePagination;
}

export interface FarouqEmployeeResponse {
  status: string;
  message: string;
  doc: FarouqEmployeeData;
}


export type LogType = 'Check In/Out' | 'Attendance' | 'Audit';
export type LogStatus = 'check_in' | 'check_out' | 'present' | 'absent';
export type LogMethod = 'face_recognition' | 'manual' | null;

export interface FarouqLog {
  id: string;                 // UUID
  user_name: string;
  log_type: LogType;
  method: LogMethod;
  status: LogStatus;
  zone: string;               // Can be "N/A"
  confidence: string;         // Can be "N/A" or percentage
  notes: string;
  timestamp: string;          // ISO timestamp
}

export interface FarouqLogsPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FarouqLogsData {
  logs: FarouqLog[];
  pagination: FarouqLogsPagination;
}

export interface FarouqLogsResponse {
  status: string;
  message: string;
  doc: FarouqLogsData;
}