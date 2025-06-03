export interface BalasResponseStepByStep {
  totalCost?: number,
  Allocation?: number[][],
  Graph?: Record<string, (string | number)[]>,
  supply?: number[],
  demand?: number[],
  balasMatrix?: number[][],
  allocationMatrix?: number[][],
  "Total Cost"?: number,
}