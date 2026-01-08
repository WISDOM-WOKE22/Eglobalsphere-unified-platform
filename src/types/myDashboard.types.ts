export interface MyDashboardStatsType {
  totalQuestions: number;
  totalPassedQuestions: number;
  totalAttemptedQuestions: number;
  totalSkippedQuestions: number;
  totalFailedQuestions: number;
  averageScore: number;
}

export interface MyDashboardType {
  stats: MyDashboardStatsType;
}

export interface MyDashboardDataType {
  doc: MyDashboardType;
}

// Weekly stats interfaces
export interface SphereXStatsEntry {
  day: string;
  checkins: number;
  checkouts: number;
  total: number;
}

export interface LPRStatsEntry {
  day: string;
  authorized: number;
  unauthorized: number;
  total: number;
}

export interface FarouqStatsEntry {
  day: string;
  checkins: number;
  checkouts: number;
  total: number;
}

// Dashboard overview data structure
export interface DashboardOverviewData {
  activeServices: number;
  totalSphereXEmployees: number;
  totalLicensePlates: number;
  totalFmsEmployees: number;
  totalClosedTickets: number;
  totalLprGates: number;
  spherexStats: SphereXStatsEntry[];
  lprStats: LPRStatsEntry[];
  farouqStats: FarouqStatsEntry[];
}

// API response wrapper
export interface MyDashboardOverviewResponse {
  status: string;
  message: string;
  doc: DashboardOverviewData;
}