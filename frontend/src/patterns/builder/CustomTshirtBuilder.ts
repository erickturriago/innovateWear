// src/patterns/builder/CustomTshirtBuilder.ts
import type { Print } from '../../models/Print';
import type { TShirtSize } from '../../models/CartItem';
import type { TShirt } from '../../models/TShirt';

// La interfaz de lo que el builder produce
export interface CustomTshirtProduct {
  id: string;
  baseGarment: TShirt;
  prints: Print[];
  size: TShirtSize;
  quantity: number;
  price: number;
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
    if (!this.garment || !this.size || this.prints.length === 0) {
      throw new Error("Por favor, selecciona una prenda, talla y al menos una estampa.");
    }

    const printIds = this.prints.map(p => p.id).join('-');
    const customId = `${this.garment.id}-${this.garment.color}-${printIds}-${this.size}`;
    
    let finalPrice = this.garment.price;
    this.prints.forEach(() => {
        finalPrice += 15000; // Asumimos un costo de 15000 por cada estampa
    });

    return {
      id: customId,
      baseGarment: this.garment,
      prints: this.prints,
      size: this.size,
      quantity: this.quantity,
      price: finalPrice * this.quantity,
    };
  }
}