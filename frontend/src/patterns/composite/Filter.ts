// src/patterns/composite/Filter.ts

/**
 * La interfaz Componente (Filter) define el contrato.
 * Todos los filtros deben poder aplicar sus reglas a un array de items.
 */
export interface Filter<T> {
  apply(items: T[]): T[];
}

/**
 * La Hoja (Leaf): Un criterio de filtro individual y genérico que busca un texto
 * en una propiedad específica de un objeto.
 */
export class TextPropertyFilter<T> implements Filter<T> {
  constructor(
    private key: keyof T, // La propiedad del objeto a filtrar (ej: 'title')
    private query: string // El texto a buscar
  ) {}

  apply(items: T[]): T[] {
    if (!this.query) return items; // Si no hay texto, no filtra nada

    const lowerCaseQuery = this.query.toLowerCase();

    return items.filter(item => {
      const value = item[this.key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseQuery);
      }
      return false;
    });
  }
}

/**
 * El Compuesto (Composite): Agrupa varios filtros y los aplica en conjunto.
 * Este AndFilter se asegura de que un item cumpla con TODOS los filtros hijos.
 */
export class AndFilter<T> implements Filter<T> {
  private filters: Filter<T>[] = [];

  public add(filter: Filter<T>): void {
    this.filters.push(filter);
  }

  public apply(items: T[]): T[] {
    // Aplica cada filtro hijo en secuencia sobre el resultado del anterior
    return this.filters.reduce(
        (currentItems, filter) => filter.apply(currentItems), 
        items
    );
  }
}