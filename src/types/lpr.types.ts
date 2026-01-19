export interface LPRStatistics {
  total_license_plates: number;
  total_inactive_plates: number;
  total_gates: number;
  total_entries_today: number;
  total_exits_today: number;
  total_authorized_today: number;
  total_unauthorized_today: number;
  total_access_today: number;
}

export interface LPRStatsEntry {
  day: string;
  authorized: number;
  unauthorized: number;
  total: number;
}

export interface LPRDashboardResponse {
  statistics: LPRStatistics;
  lprStats: LPRStatsEntry[];
}

export type GateAccessType = 'Entry' | 'Exit' | 'Both';
export type GateStatus = 'Not Started' | 'Running' | 'Offline';

export interface Gate {
  id: string;
  project_name: string;
  gate_name: string;
  date_added: string;
  access_type: GateAccessType;
  added_by: string;
  status: GateStatus;
}

export interface LPRGatesResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  gates: Gate[];
}

export type VehicleStatus = 'Enabled' | 'Disabled';

export interface Vehicle {
  id: string;
  license_plate: string;
  vehicle_owner: string;
  vehicle_model: string;
  house_no: string;
  status: VehicleStatus;
  date_added: string;
}

export interface LPRLicensePlatesResponse {
  total: number;
  skip: number;
  limit: number;
  vehicles: Vehicle[];
}

export type AuthorizationStatus = 'Authorized' | 'Unauthorized';

export interface LPRLog {
  id: string;
  license_plate: string;
  vehicle_owner: string;
  gate: string;
  date: string;              // Formatted as "08 Jan 2026"
  gate_access_type: GateAccessType;
  time: string;              // Formatted as "11:42:38"
  authorization_status: AuthorizationStatus;
  image: string;             // URL to vehicle image
}

export interface LPRLogsResponse {
  total: number;
  skip: number;
  limit: number;
  logs: LPRLog[];
}