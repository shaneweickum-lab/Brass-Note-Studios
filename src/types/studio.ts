export type ResultCode = "PASS" | "FAIL" | "PARTIAL" | "ANOMALY";
export type Recurrence = "monthly" | "annual" | "one-time";

export const RESULT_CODE_LABELS: Record<ResultCode, string> = {
  PASS: "Pass",
  FAIL: "Fail",
  PARTIAL: "Partial",
  ANOMALY: "Anomaly",
};

export const EXPERIMENT_IDS = [
  "EXP001", "EXP002", "EXP003", "EXP004",
  "EXP005", "EXP006", "EXP007", "EXP008",
  "EXP009", "EXP010", "EXP011", "EXP012",
] as const;

export const EXPENSE_CATEGORIES = [
  "Software",
  "AI Tools",
  "Music",
  "Marketing",
  "Infrastructure",
  "Legal",
  "Other",
] as const;

export interface LabsExperiment {
  bnlId: string;
  studioId: string;
  experimentId?: string;
  experimentName?: string;
  labsGlobalNumber?: number;
  displayNumber?: string;
  sunoVersion?: string;
  weirdnessPct?: number;
  constraintPct?: number;
  stylePrompt?: string;
  lyricPrompt?: string;
  tier2SymbolsUsed?: string;
  tier3Applied: boolean;
  hypothesis?: string;
  expectedResult?: string;
  actualResult?: string;
  resultCode?: ResultCode;
  keyFinding?: string;
  integrationStatus?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  studioId: string;
  expenseName: string;
  recurrence: Recurrence;
  nextDueDate?: string;
  monthlyCost?: number;
  annualCost?: number;
  category?: string;
  autoRenew: boolean;
  active: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardFinancials {
  totalRevenue: number;
  revenueThisMonth: number;
  totalMonthlyExpenses: number;
  netThisMonth: number;
  totalLabsExperiments: number;
  labsPassRate: number; // 0–100
}
