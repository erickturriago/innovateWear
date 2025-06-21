// src/patterns/composite/Filter.ts

/**
 * Helper para obtener de forma segura un valor de una propiedad anidada.
 * Ej: getNestedProperty(obj, 'creator.name')
 */
function getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
}

/**
 * La interfaz Componente (Filter) define el contrato.
 */
export interface Filter<T> {
  apply(items: T[]): T[];
}

/**
 * Hoja (Leaf): Filtra por inclusión de texto en una propiedad (incluso anidada).
 */
export class StringIncludesPropertyFilter<T> implements Filter<T> {
  constructor(private key: string, private query: string) {}

  apply(items: T[]): T[] {
    if (!this.query) return items;
    const lowerCaseQuery = this.query.toLowerCase();
    return items.filter(item => {
      const value = getNestedProperty(item, this.key); // <-- MEJORA
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseQuery);
      }
      return false;
    });
  }
}

/**
 * Hoja (Leaf): Filtra por coincidencia exacta en una propiedad (incluso anidada).
 */
export class ExactPropertyFilter<T> implements Filter<T> {
    constructor(private key: string, private value: any) {}
  
    apply(items: T[]): T[] {
        if (this.value === null || this.value === undefined || this.value === 'TODOS') {
            return items;
        }
        return items.filter(item => {
            const propValue = getNestedProperty(item, this.key); // <-- MEJORA
            return propValue === this.value;
        });
    }
}

/**
 * Decorador (Decorator): Invierte el resultado de un filtro.
 */
export class NotFilter<T> implements Filter<T> {
    constructor(private filter: Filter<T>) {}

    apply(items: T[]): T[] {
        const itemsToExclude = this.filter.apply(items);
        const itemsToExcludeIds = new Set(itemsToExclude.map(item => item.id));
        return items.filter(item => !itemsToExcludeIds.has(item.id));
    }
}

/**
 * Compuesto (Composite): Aplica filtros con lógica AND.
 */
export class AndFilter<T> implements Filter<T> {
  private filters: Filter<T>[] = [];
  public add(filter: Filter<T>): void { this.filters.push(filter); }
  public apply(items: T[]): T[] {
    return this.filters.reduce((currentItems, filter) => filter.apply(currentItems), items);
  }
}

/**
 * Compuesto (Composite): Aplica filtros con lógica OR.
 */
export class OrFilter<T> implements Filter<T> {
    private filters: Filter<T>[] = [];
    public add(filter: Filter<T>): void { this.filters.push(filter); }
    public apply(items: T[]): T[] {
        if (this.filters.length === 0) return items;
        const allResults = this.filters.flatMap(filter => filter.apply(items));
        const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
        return uniqueResults;
    }
}