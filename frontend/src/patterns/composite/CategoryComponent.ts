// src/patterns/composite/CategoryComponent.ts

// 1. La interfaz Componente
// Declara las operaciones comunes para objetos simples (Hojas) y complejos (Compuestos).
export interface CategoryComponent {
  // Un componente padre puede ser opcional
  parent: CategoryComponent | null;
  setParent(parent: CategoryComponent | null): void;

  // Métodos que todas las categorías, simples o compuestas, tendrán
  getName(): string;
  isComposite(): boolean;
  
  // En un sistema real, aquí podrían ir operaciones como 'borrar' o 'actualizar'.
  // Por ahora, nos enfocamos en la estructura.
}

// 2. La clase Hoja (Leaf)
// Representa los objetos finales de la composición. Una hoja no puede tener hijos.
export class Category implements CategoryComponent {
  public parent: CategoryComponent | null = null;
  public name: string;
  public id: number; // ID de la base de datos

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  public setParent(parent: CategoryComponent | null): void {
    this.parent = parent;
  }

  public getName(): string {
    return this.name;
  }
  
  public isComposite(): boolean {
    return false;
  }
}

// 3. La clase Compuesto (Composite)
// Representa los componentes que pueden tener hijos.
export class CategoryGroup implements CategoryComponent {
  public parent: CategoryComponent | null = null;
  protected children: CategoryComponent[] = [];
  public name: string;
  public id: number;

  constructor(id: number, name:string) {
    this.id = id;
    this.name = name;
  }

  public setParent(parent: CategoryComponent | null): void {
    this.parent = parent;
  }

  // Un compuesto puede añadir y quitar componentes.
  public add(component: CategoryComponent): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: CategoryComponent): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);
    component.setParent(null);
  }

  public isComposite(): boolean {
    return true;
  }
  
  public getChildren(): CategoryComponent[] {
    return this.children;
  }
  
  public getName(): string {
    return this.name;
  }
}