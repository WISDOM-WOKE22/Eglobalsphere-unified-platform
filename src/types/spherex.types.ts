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
  department: string | null;
  phone: string | null;
  zone: string | null;
  role: string | null;
  status: string;
  email: string;
  last_access: string; // ISO timestamp
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