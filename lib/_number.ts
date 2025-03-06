import { BitpinDecimal } from "./decimal";

export function formatNumber(
  num: BitpinDecimal | number | string,
  decimals = 2,
): string {
  const decimalNum = new BitpinDecimal(num);
  const billion = new BitpinDecimal(1_000_000_000);
  const million = new BitpinDecimal(1_000_000);
  const thousand = new BitpinDecimal(1_000);

  if (decimalNum.greaterThanOrEqualTo(billion)) {
    return decimalNum.dividedBy(billion).toFixed(2) + "B";
  }

  if (decimalNum.greaterThanOrEqualTo(million)) {
    return decimalNum.dividedBy(million).toFixed(2) + "M";
  }

  if (decimalNum.greaterThanOrEqualTo(thousand)) {
    return decimalNum.dividedBy(thousand).toFixed(2) + "K";
  }

  return decimalNum.toFixed(decimals);
}
