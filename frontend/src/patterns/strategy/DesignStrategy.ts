// src/patterns/strategy/AuthStrategy.ts
import { FirebaseFacade } from "../facade/FirebaseFacade";

// 1. La Interfaz de la Estrategia
export interface AuthStrategy {
  // Pasamos 'any' para flexibilidad, aunque podríamos crear tipos más específicos.
  execute(...args: any[]): Promise<boolean>;
}

// 2. Estrategia Concreta para Google
export class GoogleAuthStrategy implements AuthStrategy {
  public async execute(): Promise<boolean> {
    console.log("Ejecutando estrategia de Google...");
    const user = await FirebaseFacade.signInWithGoogle();
    return !!user; // Devuelve true si el usuario no es null
  }
}

// 3. Estrategia Concreta para Email y Contraseña
export class EmailPasswordAuthStrategy implements AuthStrategy {
  public async execute(email: string, pass: string): Promise<boolean> {
    console.log("Ejecutando estrategia de Email/Password...");
    const user = await FirebaseFacade.signInWithEmail(email, pass);
    return !!user;
  }
}

// Podríamos añadir una estrategia de registro si fuera necesario
export class EmailPasswordSignUpStrategy implements AuthStrategy {
    public async execute(email: string, pass: string): Promise<boolean> {
        console.log("Ejecutando estrategia de Registro con Email/Password...");
        const user = await FirebaseFacade.signUpWithEmail(email, pass);
        return !!user;
    }
}