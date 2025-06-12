// src/patterns/decorator/PriceDecorator.ts

import type { BaseGarment } from "../../models/Garment";
import type { Print } from "../../models/Print";

/**
 * La interfaz Componente declara una operación común tanto para los
 * objetos simples como para los "decorados" (envueltos).
 */
export interface PricedItem {
  getPrice(): number;
  getDescription(): string;
}

/**
 * El Componente Concreto es la clase base que vamos a decorar.
 * Representa el costo inicial y la descripción de la prenda base.
 */
export class BaseGarmentPrice implements PricedItem {
  constructor(private garment: BaseGarment) {}

  public getPrice(): number {
    return this.garment.price;
  }

  public getDescription(): string {
    return this.garment.name;
  }
}

/**
 * El Decorador base abstracto. Sigue la misma interfaz que los otros
 * componentes. Su propósito principal es definir la interfaz de envoltura
 * para todos los decoradores concretos.
 */
export abstract class PriceDecorator implements PricedItem {
  protected wrappedItem: PricedItem;

  constructor(item: PricedItem) {
    this.wrappedItem = item;
  }

  /**
   * El Decorador delega todo el trabajo al componente envuelto.
   */
  public getPrice(): number {
    return this.wrappedItem.getPrice();
  }

  public getDescription(): string {
    return this.wrappedItem.getDescription();
  }
}

/**
 * Decorador Concreto para añadir el costo de la estampa.
 * Los decoradores concretos ejecutan su comportamiento (añadir costo)
 * antes o después de llamar al método del objeto envuelto.
 */
export class PrintPriceDecorator extends PriceDecorator {
  private print: Print;
  private printCost: number = 15000; // Costo fijo por estampar

  constructor(item: PricedItem, print: Print) {
    super(item);
    this.print = print;
  }

  public getPrice(): number {
    // Llama al getPrice() del objeto envuelto (la prenda base)
    // y le suma el costo de la estampa.
    return super.getPrice() + this.printCost;
  }

  public getDescription(): string {
    return `${super.getDescription()} con estampa "${this.print.title}"`;
  }
}

// Podríamos añadir más decoradores en el futuro, por ejemplo:
/*
export class PremiumMaterialDecorator extends PriceDecorator {
  private extraCost: number = 10000;

  public getPrice(): number {
    return super.getPrice() + this.extraCost;
  }
  public getDescription(): string {
    return `${super.getDescription()} en material premium`;
  }
}
*/