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