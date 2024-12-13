"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { axiosInstance } from "@/services/axios";
import { AxiosError } from "axios";
export interface User {
  id?: string | number;
  image?: string;
  email: string;
  firstName: string;
  lastName: string;
}
export interface AuthType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}
export const AuthContext = createContext<AuthType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User>({
    email: "", firstName: "", lastName: ""
  })
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("/user/get-user");
        const data = await res.data.user;
        setUser({
          email: data.email, firstName: data.firstName, lastName: data.lastName
        })
      } catch(error) {
        if (error instanceof AxiosError) console.log(error.cause);
        if (!["/about", "/auth/login", "/auth/register", "/"].includes(pathname)){
          console.log("redirecting you from the context");
          router.push("/auth/login");}
      }
    }
    getUser();
  }, [pathname, router]);
  
  return(
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};


