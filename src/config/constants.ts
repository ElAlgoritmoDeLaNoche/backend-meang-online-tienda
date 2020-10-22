import environment from './environments';

if (process.env.NODE_ENV !== 'production') {
  const env = environment;
}

export const SECRET_KEY = process.env.SECRET || '%JImJGqx6Jm0bOSP6aHZLvOKR'; 

export enum COLLECTIONS {
  USERS = 'users',
  
}

export enum MESSAGES {
  TOKEN_VERIFICATION_FAILED = 'Token no valido inicia sesión de nuevo'
}

// %JImJGqx6Jm0bOSP6aHZLvOKR 

/* 
H = Horas
M = Minutos
D = Dias
*/

export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 / 4,
  M20 = H1 / 3,
  D3 = H24 * 3
}