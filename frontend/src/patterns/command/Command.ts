// src/patterns/command/Command.ts
import designApi from '../../api/designApi';
import type { Print } from '../../models/Print';

export interface Command {
  execute(): Promise<Print | null>;
}

interface CreateDesignPayload {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  artistId: number;
}

export class CreateDesignCommand implements Command {
  private payload: CreateDesignPayload;
  private notifier: (design: Print) => void;

  constructor(payload: CreateDesignPayload, notifier: (design: Print) => void) {
    this.payload = payload;
    this.notifier = notifier; // <-- El comando ahora sabe a quién notificar
  }

  public async execute(): Promise<Print | null> {
    console.log('Executing CreateDesignCommand...');
    const newDesign = await designApi.create(this.payload);
    
    if (newDesign) {
      console.log('CreateDesignCommand executed successfully. Notifying store...');
      // Notifica al store para que el observer (la UI) se actualice
      this.notifier(newDesign);
    } else {
      console.error('CreateDesignCommand failed.');
    }
    
    return newDesign;
  }
}