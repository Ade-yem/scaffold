export interface AuthRequestBody {
  firstName: string,
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface createTokenData {
  email: string;
  userId: string;
}

export interface TokenData {
  token: string;
  userId: string;
}

export interface GoogleData {
  image: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string | number;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}