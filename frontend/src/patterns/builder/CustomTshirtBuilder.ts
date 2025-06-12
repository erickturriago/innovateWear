// src/patterns/builder/CustomTshirtBuilder.ts
import type { Print } from '../../models/Print';
import type { TShirtSize, CustomCartItem } from '../../models/CartItem';
import type { BaseGarment } from '../../models/Garment';
import { BaseGarmentPrice, PrintPriceDecorator, type PricedItem } from '../decorator/PriceDecorator';

export class CustomTshirtBuilder {
  private garment?: BaseGarment;
  private color: string = '#FFFFFF';
  private size?: TShirtSize;
  private prints: Print[] = []; // <-- Ahora es un array
  private quantity: number = 1;

  public setGarment(garment: BaseGarment): this {
    this.garment = garment;
    return this;
  }

  public setColor(color: string): this {
    this.color = color;
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
    console.log('Builder: Estampa añadida ->', print.title);
    return this;
  }

  public removePrint(printId: string): this {
    this.prints = this.prints.filter(p => p.id !== printId);
    return this;
  }

  public build(): CustomCartItem | null {
    if (!this.garment || !this.size || this.prints.length === 0) {
      alert("Por favor, selecciona una prenda, talla y al menos una estampa.");
      return null;
    }

    const printIds = this.prints.map(p => p.id).join('-');
    const customId = `${this.garment.id}-${this.color}-${printIds}-${this.size}`;
    
    let pricedItem: PricedItem = new BaseGarmentPrice(this.garment);
    for (const print of this.prints) {
      pricedItem = new PrintPriceDecorator(pricedItem, print);
    }
    const finalPrice = pricedItem.getPrice();

    const item: CustomCartItem = {
      id: customId,
      type: 'custom',
      baseTshirt: {
        name: this.garment.name,
        color: this.color,
      },
      prints: this.prints,
      size: this.size,
      quantity: this.quantity,
      price: finalPrice,
    };
    
    console.log('Builder: ¡Producto construido con múltiples estampas!', item);
    return item;
  }
}