interface IGraphData {
  totalCost: number,
  allocation: number[][],
  graph: Record<string, (string | number)[]>
}