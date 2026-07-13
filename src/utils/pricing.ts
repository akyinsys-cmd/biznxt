export function calculateBizNxtPrice(benchmarkPrice: number, enableAutomatedAdjustment: boolean = true): number {
  if (!enableAutomatedAdjustment) return benchmarkPrice;

  const rawPremium = benchmarkPrice * 1.5;

  const remainder = rawPremium % 1000;
  if (remainder < 500) {
    return Math.floor(rawPremium / 1000) * 1000 + 499;
  } else {
    return Math.floor(rawPremium / 1000) * 1000 + 999;
  }
}
