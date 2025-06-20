// src/patterns/builder/CustomTshirtBuilder.ts
import type { Print } from '../../models/Print';
import type { TShirtSize } from '../../models/CartItem';
import type { TShirt } from '../../models/TShirt';

// La interfaz de lo que el builder produce ya no incluye 'id' ni 'price'.
// Solo contiene las partes esenciales del producto.
export interface CustomTshirtProduct {
  baseGarment: TShirt;
  prints: Print[];
  size: TShirtSize;
  quantity: number;
}

export class CustomTshirtBuilder {
  private garment?: TShirt;
  private size?: TShirtSize;
  private prints: Print[] = [];
  private quantity: number = 1;

  public setGarment(garment: TShirt): this {
    this.garment = garment;
    return this;
  }

  public setSize(size: TShirtSize): this {
    this.size = size;
    return this;
  }

  public setQuantity(quantity: number): this {
    this.quantity = quantity > 0 ? quantity : 1;
    return this;
  }

  public addPrint(print: Print): this {
    this.prints.push(print);
    return this;
  }
  
  public resetPrints(): this {
    this.prints = [];
    return this;
  }

  public build(): CustomTshirtProduct {
    if (!this.garment || !this.size) {
      throw new Error("Faltan datos para construir el producto (prenda o talla).");
    }

    // El builder ya no calcula el precio ni un ID complejo.
    // Su única responsabilidad es ensamblar las partes del objeto.
    return {
      baseGarment: this.garment,
      prints: this.prints,
      size: this.size,
      quantity: this.quantity,
    };
  }
}