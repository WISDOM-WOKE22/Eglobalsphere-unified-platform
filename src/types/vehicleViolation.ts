export type ViolationDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ViolationStatsEntry {
  day: ViolationDay;
  speed: number;
  oneway: number;
  total: number;
}

export interface ViolationOverviewData {
  total_violations: number;
  total_oneway_violations: number;
  total_speed_violations: number;
  violations_today: number;
  violationsStats: ViolationStatsEntry[];
}

export interface ViolationOverviewResponse {
  success: boolean;
  data: ViolationOverviewData;
}

export type ViolationType = 'SPEED' | 'ONEWAY';

export interface ViolationLog {
  id: string;
  license_plate: string;
  vehicle_owner: string;
  gate: string;
  violation_date: string;      // Formatted as "06 Nov 2025"
  violation_type: ViolationType;
  violation_time: string;       // Formatted as "10:43:37"
  image: string;                // File path
  is_registered: boolean;
  created_at: string;           // ISO timestamp
}

export interface ViolationPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ViolationLogsResponse {
  success: boolean;
  data: ViolationLog[];
  pagination: ViolationPagination;
}