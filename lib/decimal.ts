import Decimal from "decimal.js";

export class BitpinDecimal {
  private value: Decimal;

  constructor(value: number | string | Decimal | BitpinDecimal) {
    this.value = new Decimal(
      value instanceof BitpinDecimal ? value.toString() : value,
    );
  }

  plus(value: BitpinDecimal | number | string): BitpinDecimal {
    return new BitpinDecimal(
      this.value.plus(
        value instanceof BitpinDecimal ? value.toString() : value,
      ),
    );
  }

  times(value: BitpinDecimal | number | string): BitpinDecimal {
    return new BitpinDecimal(
      this.value.times(
        value instanceof BitpinDecimal ? value.toString() : value,
      ),
    );
  }

  minus(value: BitpinDecimal | number | string): BitpinDecimal {
    return new BitpinDecimal(
      this.value.minus(
        value instanceof BitpinDecimal ? value.toString() : value,
      ),
    );
  }

  dividedBy(value: BitpinDecimal | number | string): BitpinDecimal {
    return new BitpinDecimal(
      this.value.dividedBy(
        value instanceof BitpinDecimal ? value.toString() : value,
      ),
    );
  }

  toString(): string {
    return this.value.toString();
  }

  toNumber(): number {
    return this.value.toNumber();
  }

  toFixed(decimalPlaces: number): string {
    return this.value.toFixed(decimalPlaces);
  }

  gte(value: BitpinDecimal | number | string): boolean {
    return this.value.gte(
      value instanceof BitpinDecimal ? value.toString() : value,
    );
  }

  lte(value: BitpinDecimal | number | string): boolean {
    return this.value.lte(
      value instanceof BitpinDecimal ? value.toString() : value,
    );
  }

  greaterThanOrEqualTo(value: BitpinDecimal | number | string): boolean {
    return this.value.greaterThanOrEqualTo(
      value instanceof BitpinDecimal ? value.toString() : value,
    );
  }
}
