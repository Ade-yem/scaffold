/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "./services/axios";

const openRoutes = ["/login", "/register", "/"];

function checkOpenRoute(route: string) {
  openRoutes.forEach(element => {
    if (route.startsWith(element)) return true;
  });
  return false;
}

async function checkAuthentication() {
  const res = await axiosInstance.get("/auth/verify");
  if (res.status === 200) return true;
  return false;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // const isAuthenticated = await checkAuthentication();
  // if (!checkOpenRoute(request.nextUrl.pathname) && !isAuthenticated) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  return NextResponse.next();
}

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
