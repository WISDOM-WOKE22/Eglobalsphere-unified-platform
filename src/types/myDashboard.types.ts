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

export interface MyDashboardOverviewResponse {
  statistics: {
    total_employees: number;
    total_visitors: number;
    total_zones: number;
    total_security_guards: number;
    active_employees: number;
    inactive_employees: number;
  };
  recent_logs: Array<{
    id: string;
    fullname: string;
    department: string | null;
    role: string | null;
    note: string;
    time: string;
    access_point: string | null;
    zone: string | null;
    verification_method: string | null;
    license_plate: string | null;
    image: string | null;
  }>;
  spherexStats: Array<{
    day: string;
    checkins: number;
    checkouts: number;
    total: number;
  }>;
}