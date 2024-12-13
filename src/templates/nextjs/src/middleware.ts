/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "./services/axios";
import { AxiosError } from "axios";

const openRoutes = ["/auth/login", "/auth/register", "/"];

function checkOpenRoute(route: string) {
  if (openRoutes.includes(route)) return true;
  return false;
}

async function checkAuthentication() {
  try {
    const res = await axiosInstance.get("/auth/verify");
    console.log(res);
    if (res.status === 200) {
      console.log(res.data.message);
      return true;
    }
    else return false;
  } catch (error) {
    if (error instanceof AxiosError) console.log(error.response?.data.message)
      console.log(error);
    return false;
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // const isAuthenticated = await checkAuthentication();
  // console.log("open route => ", checkOpenRoute(request.nextUrl.pathname));
  // console.log(request.nextUrl.pathname);
  // if (!checkOpenRoute(request.nextUrl.pathname) && !isAuthenticated) {
  //   console.log("Redirecting you now...")
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }
  return NextResponse.next();
}

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
