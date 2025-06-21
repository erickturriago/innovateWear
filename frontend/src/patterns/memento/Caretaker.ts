// src/patterns/memento/Caretaker.ts
import { Memento } from './Memento';
import { EditorOriginator } from './Originator';

/**
 * El Caretaker no depende de la clase ConcreteMemento. Por lo tanto, no tiene
 * acceso al estado del originator guardado dentro del memento. Funciona con
 * todos los mementos a través de la interfaz base Memento.
 */
export class HistoryCaretaker<T> {
  private mementos: Memento<T>[] = [];
  private originator: EditorOriginator<T>;
  private pointer: number = -1;

  constructor(originator: EditorOriginator<T>) {
    this.originator = originator;
  }
  
  public backup(): void {
    // Si hemos deshecho acciones, eliminamos el historial "futuro"
    if (this.pointer < this.mementos.length - 1) {
        this.mementos = this.mementos.slice(0, this.pointer + 1);
    }
    this.mementos.push(this.originator.save());
    this.pointer = this.mementos.length - 1;
  }

  public undo(): void {
    if (!this.canUndo()) {
      return;
    }
    this.pointer--;
    this.originator.restore(this.mementos[this.pointer]);
  }

  public redo(): void {
    if (!this.canRedo()) {
      return;
    }
    this.pointer++;
    this.originator.restore(this.mementos[this.pointer]);
  }

  public canUndo(): boolean {
      return this.pointer > 0;
  }

  public canRedo(): boolean {
      return this.pointer < this.mementos.length - 1;
  }
}