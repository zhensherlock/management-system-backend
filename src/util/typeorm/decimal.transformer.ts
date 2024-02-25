import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  /**
   * Used to marshal Decimal when writing to the database.
   */
  to(decimal?: Decimal): number | null {
    return decimal ? new Decimal(decimal).toNumber() : null;
  }
  /**
   * Used to unmarshal Decimal when reading from the database.
   */
  from(decimal?: number): number | null {
    return decimal ? new Decimal(decimal).toNumber() : null;
  }
}
