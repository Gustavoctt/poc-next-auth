import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from 'nookies';
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

interface AxiosErrorResponse {
  code?: string;
}

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined){
  let cookies = parseCookies(ctx);
  
  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization:  `Bearer ${cookies['nextauth.token']}` 
    }
  })

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError<AxiosErrorResponse>) => {
    if(error.response.status === 401){
      if(error.response.data?.code === 'token.expired'){
        cookies = parseCookies(ctx);

        const { 'nextauth.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;

        console.log('refreshToken')

        if(!isRefreshing){
          isRefreshing = true;
          
          api.post('/refresh', {
            refreshToken
          }).then(response => {
            const { token } = response.data;
    
            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30, //30 days
              path: '/'
            })
      
            setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, //30 days
              path: '/'
            })
    
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            failedRequestsQueue.forEach(request => request.onSucess(token));
            failedRequestsQueue = [];
          }).catch(err => {
            failedRequestsQueue.forEach(request => request.onFailure(err));
            failedRequestsQueue = [];

            if(typeof window !== 'undefined'){
              signOut()
            }
          }).finally(() => {
            isRefreshing = false;
          })
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSucess: (token: string) => {
              // quando o processo de refresh estver finalizado
              originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              // quando ocorrer algum erro
              reject(err)
            }
          })
        })
      } else {
        // o erro pode n??o ser do tipo token expirado, portanto ele ?? deslogado
        if(typeof window !== 'undefined'){
          signOut()
          // verifica se est?? no browser
        }else{
          return Promise.reject(new AuthTokenError())
        }
      }
    }

    return Promise.reject(error)
  })
  return api;
}