import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = {
  admin: ["/admin"],
  student: ["/student"],
  auth: ["/login", "/signup"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // Check if route is protected
  const isAdminRoute = protectedRoutes.admin.some((route) =>
    pathname.startsWith(route)
  );
  const isStudentRoute = protectedRoutes.student.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = protectedRoutes.auth.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if ((isAdminRoute || isStudentRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token && userRole) {
    const dashboardUrl =
      userRole === "admin" ? "/admin/dashboard" : "/student/dashboard";
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Enforce role-based access
  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isStudentRoute && userRole !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/login", "/signup"],
};
