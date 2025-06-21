// src/patterns/memento/Memento.ts

/**
 * La interfaz Memento proporciona una forma de recuperar el estado del originator,
 * pero no permite modificarlo.
 */
export interface Memento<T> {
  getState(): T;
  getDate(): Date;
}

/**
 * El Memento Concreto contiene la infraestructura para almacenar el estado del Originator.
 */
export class ConcreteMemento<T> implements Memento<T> {
  private readonly state: T;
  private readonly date: Date;

  constructor(state: T) {
    // Usamos clonación profunda para asegurar que el estado sea inmutable
    this.state = JSON.parse(JSON.stringify(state));
    this.date = new Date();
  }

  public getState(): T {
    return this.state;
  }

  public getDate(): Date {
    return this.date;
  }
}