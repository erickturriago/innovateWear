// src/patterns/decorator/PriceDecorator.ts
import type { TShirt } from "../../models/TShirt";
import type { Print } from "../../models/Print";

export interface PricedItem {
  getPrice(): number;
  getDescription(): string;
}

export class BaseGarmentPrice implements PricedItem {
  constructor(private garment: TShirt) {}

  public getPrice(): number {
    return this.garment.price;
  }

  public getDescription(): string {
    return this.garment.title;
  }
}

export abstract class PriceDecorator implements PricedItem {
  protected wrappedItem: PricedItem;
  constructor(item: PricedItem) { this.wrappedItem = item; }
  public getPrice(): number { return this.wrappedItem.getPrice(); }
  public getDescription(): string { return this.wrappedItem.getDescription(); }
}

export class PrintPriceDecorator extends PriceDecorator {
  private print: Print;

  constructor(item: PricedItem, print: Print) {
    super(item);
    this.print = print;
  }

  public getPrice(): number {
    // CAMBIO CLAVE: Suma el precio del objeto base + el precio de ESTA estampa
    return super.getPrice() + this.print.price;
  }

  public getDescription(): string {
    return `${super.getDescription()} + ${this.print.title}`;
  }
}