import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import Router, { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from 'nookies';

import { api } from "../services/apiClient";

type UserProps = {
  email: string,
  permissions: string[],
  roles: string[]
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn: (credential: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: UserProps;
}

type AuthProvider = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut(sendMessage = true){
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  if(sendMessage) authChannel.postMessage('signOut')

  Router.push('/')
}

export function AuthProvider({ children }: AuthProvider){
  const router = useRouter();
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut(false);
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if(token){
      api.get('/me').then(response => {
        const {email, permissions, roles} = response.data;

        setUser({email, permissions,roles})
      }).catch(() => {
        signOut()
      })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials){
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const {token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: '/'
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: '/'
      })
      
      setUser({
        email,
        permissions,
        roles
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      router.push('/dashboard')

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}