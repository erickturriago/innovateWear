// src/patterns/builder/CustomTshirtBuilder.ts
import type { Print } from '../../models/Print';
import type { TShirtSize, CustomCartItem } from '../../models/CartItem';
import type { BaseGarment } from '../../models/Garment';

// Esta clase irá guardando cada pieza de la personalización
export class CustomTshirtBuilder {
  private garment?: BaseGarment;
  private color: string = '#FFFFFF';
  private size?: TShirtSize;
  private print?: Print;
  private quantity: number = 1;

  // Cada método "set" actualiza una parte y devuelve "this" para poder encadenar llamadas
  public setGarment(garment: BaseGarment): this {
    this.garment = garment;
    console.log('Builder: Prenda seleccionada ->', garment.name);
    return this;
  }

  public setColor(color: string): this {
    this.color = color;
    console.log('Builder: Color seleccionado ->', color);
    return this;
  }
  
  public setSize(size: TShirtSize): this {
    this.size = size;
    console.log('Builder: Talla seleccionada ->', size);
    return this;
  }
  
  public setQuantity(quantity: number): this {
    this.quantity = quantity > 0 ? quantity : 1;
    console.log('Builder: Cantidad seleccionada ->', this.quantity);
    return this;
  }
  
  public setPrint(print: Print): this {
    this.print = print;
    console.log('Builder: Estampa seleccionada ->', print.title);
    return this;
  }

  // El método final que construye el objeto para el carrito
  public build(): CustomCartItem | null {
    if (!this.garment || !this.size || !this.print) {
      alert("Por favor, selecciona una prenda, talla y estampa para continuar.");
      console.error("Faltan detalles para construir la camiseta.", {
        garment: this.garment,
        size: this.size,
        print: this.print,
      });
      return null;
    }

    const customId = `${this.garment.id}-${this.color}-${this.print.id}-${this.size}`;
    
    // TODO: Implementar Patrón Decorator para el precio
    const finalPrice = this.garment.price + 15000; // Precio base + costo de la estampa (ejemplo)

    const item: CustomCartItem = {
      id: customId,
      type: 'custom',
      baseTshirt: {
        name: this.garment.name,
        color: this.color,
      },
      print: this.print,
      size: this.size,
      quantity: this.quantity,
      price: finalPrice,
    };
    
    console.log('Builder: ¡Producto construido!', item);
    return item;
  }
}