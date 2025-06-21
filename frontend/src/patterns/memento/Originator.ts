// src/patterns/memento/Originator.ts
import { Memento, ConcreteMemento } from './Memento';

/**
 * El Originator contiene el estado importante que puede cambiar. También define un
 * método para guardar su estado dentro de un memento y otro para restaurarlo.
 */
export class EditorOriginator<T> {
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }
  
  public setState(state: T): void {
    this.state = state;
  }

  public getState(): T {
    return this.state;
  }

  // Guarda el estado actual dentro de un nuevo memento.
  public save(): Memento<T> {
    return new ConcreteMemento(this.state);
  }

  // Restaura el estado del Originator desde un objeto memento.
  public restore(memento: Memento<T>): void {
    this.state = memento.getState();
  }
}