import { ReactNode } from "react";
import { createContext } from "react";

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credential: SignInCredentials): Promise<void>;
  isAuthenticated: false;
}

type AuthProvider = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProvider){
  const isAuthenticated = false;

  async function signIn({ email, password }: SignInCredentials){
    console.log({ email, password })
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}