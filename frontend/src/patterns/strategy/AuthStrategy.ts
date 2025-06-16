// src/patterns/strategy/AuthStrategy.ts
import { FirebaseFacade } from "../facade/FirebaseFacade";
import authApi from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { UserFactory } from "../factory/UserFactory";

export interface AuthStrategy {
  execute(...args: any[]): Promise<boolean>;
}

export class GoogleAuthStrategy implements AuthStrategy {
  public async execute(): Promise<boolean> {
    const firebaseUser = await FirebaseFacade.signInWithGoogle();
    return !!firebaseUser;
  }
}

export class EmailPasswordAuthStrategy implements AuthStrategy {
  public async execute(email: string, pass: string): Promise<boolean> {
    const appUser = await authApi.login({ email, password: pass });
    if (appUser) {
      useAuthStore.getState().setUser(UserFactory.createUser(appUser));
      return true;
    }
    return false;
  }
}

export class EmailPasswordSignUpStrategy implements AuthStrategy {
  public async execute(email: string, pass: string): Promise<boolean> {
    const firebaseUser = await FirebaseFacade.signUpWithEmail(email, pass);
    return !!firebaseUser;
  }
}