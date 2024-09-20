import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const subdomainMiddleware = (req: NextRequest) => {
  let hostname = req.headers.get("host");

  if (!hostname) return NextResponse.next();

  // if (
  //   hostname.includes("---") &&
  //   hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  // )
  // hostname = `${hostname.split("---")[0]}.${
  //   process.env.NEXT_PUBLIC_ROOT_DOMAIN
  // }`;

  const searchParams = req.nextUrl.searchParams.toString();

  const path = `${req.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN)
    return NextResponse.rewrite(
      new URL(`/domain${path === "/" ? "" : path}`, req.url),
    );

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
};

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
