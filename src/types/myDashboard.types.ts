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
