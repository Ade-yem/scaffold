"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { axiosInstance } from "@/services/axios";
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
  // const router = useRouter();

  // useEffect(() => {
  //   const getUser = async () => {
  //     const res = await axiosInstance.get("/auth/get-user");
  //       if (res.status !== 200) {
  //         if (!["/about", "/login", "/register", "/"].includes(usePathname()))
  //           router.push("/login");
  //       }
  //     const data = await res.data;
  //     setUser({
  //       email: data.email, firstName: data.firstName, lastName: data.lastName
  //     })
  //   }
  //   getUser();
  // }, []);
  
  return(
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};


