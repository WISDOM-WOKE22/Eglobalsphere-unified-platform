export interface SpherexStatistics {
  total_employees: number;
  total_visitors: number;
  total_zones: number;
  total_security_guards: number;
  active_employees: number;
  inactive_employees: number;
}

export interface SpherexRecentLog {
  id: string;
  fullname: string;
  department: string | null;
  role: string | null;
  note: string;
  time: string; // ISO timestamp
  access_point: string | null;
  zone: string | null;
  verification_method: string | null;
  license_plate: string | null;
  image: string | null;
}

export interface SpherexStatsEntry {
  day: string;
  checkins: number;
  checkouts: number;
  total: number;
}

export interface SpherexDashboardResponse {
  statistics: SpherexStatistics;
  recent_logs: SpherexRecentLog[];
  spherexStats: SpherexStatsEntry[];
}


export interface SpherexEmployee {
  employee_id: string;
  fullname: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  department: string | null;
  profile_picture: string | null;
  pass_status: string | null;
  valid_from: string | null; // ISO timestamp or null
  valid_till: string | null; // ISO timestamp or null
  enabled: boolean;
  presence: string;
  allow_visitor_invites: boolean;
  zones: string | null;
  status: string;
  created_at_source: string | null;
  modified_at_source: string | null;
  synced_at: string; // ISO timestamp
  recent_access_logs: any[]; // Better type if available
  // legacy/extra fields
  phone?: string | null;
  zone?: string | null;
  role?: string | null;
  last_access?: string; // ISO timestamp
}

export interface SpherexEmployeesResponse {
  total: number;
  skip: number;
  limit: number;
  employees: SpherexEmployee[];
}

export interface SpherexVisitor {
  visitor_id: string;
  fullname: string;
  phone: string | null;
  zone: string | null;
  status: string;
  email: string;
  address: string | null;
  last_access: string; // ISO timestamp
}

export interface SpherexVisitorsResponse {
  total: number;
  skip: number;
  limit: number;
  visitors: SpherexVisitor[];
}

export interface SpherexLog {
  id: string;
  log_type: string;
  license_plate: string;
  authorized: boolean;
  image: string;
  time: string; // ISO timestamp
  status: string;
}

export interface SpherexLogsResponse {
  total: number;
  page: number;
  total_pages: number;
  page_size: number;
  logs: SpherexLog[];
}