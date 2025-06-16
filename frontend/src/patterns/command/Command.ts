// src/patterns/command/Command.ts
import designApi from '../../api/designApi';
import type { Print } from '../../models/Print';

export interface Command {
  execute(): Promise<any>;
}

// Payload unificado para Crear/Actualizar Diseños
export interface DesignPayload {
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Opcional en la actualización
  categoryId: number;
  artistId: number;
}

export class CreateDesignCommand implements Command {
  private payload: DesignPayload & { imageUrl: string };
  private notifier: (design: Print) => void;

  constructor(payload: DesignPayload & { imageUrl: string }, notifier: (design: Print) => void) {
    this.payload = payload;
    this.notifier = notifier;
  }

  public async execute(): Promise<Print | null> {
    const newDesign = await designApi.create(this.payload);
    if (newDesign) {
      this.notifier(newDesign);
    }
    return newDesign;
  }
}

export class DeleteDesignCommand implements Command {
  private designId: string;
  private notifier: (id: string) => void;

  constructor(designId: string, notifier: (id: string) => void) {
    this.designId = designId;
    this.notifier = notifier;
  }

  public async execute(): Promise<boolean> {
    const success = await designApi.deleteById(this.designId);
    if (success) {
      this.notifier(this.designId);
    }
    return success;
  }
}

export class UpdateDesignCommand implements Command {
  private id: string;
  private payload: Partial<DesignPayload>;
  private notifier: (id: string, updatedDesign: Print) => void;

  constructor(id: string, payload: Partial<DesignPayload>, notifier: (id: string, updatedDesign: Print) => void) {
    this.id = id;
    this.payload = payload;
    this.notifier = notifier;
  }

  public async execute(): Promise<Print | null> {
    const updatedDesign = await designApi.update(this.id, this.payload);
    if (updatedDesign) {
      this.notifier(this.id, updatedDesign);
    }
    return updatedDesign;
  }
}