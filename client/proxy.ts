import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define which roles can access which paths
const roleAccess: Record<string, string[]> = {
	"/dashboard": ["admin"], // accessible by both admin and regular users
	"/edit": ["admin"], // only admin
	"/export": ["admin"], // only admin
};

export async function proxy(req: NextRequest) {
	const url = req.nextUrl.clone();
	const pathname = url.pathname;
	console.log("test");
	// Get JWT from cookies
	const jwt = req.cookies.get("jwt")?.value;
	console.log(jwt);
	// If no JWT and accessing protected page → redirect to login
	if (
		!jwt &&
		Object.keys(roleAccess).some((path) => pathname.startsWith(path))
	) {
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	if (jwt) {
		try {
			const res = await fetch(
				`${process.env.BACKEND_URL}/authentication/userInfo`,
				{
					method: "GET",
					credentials: "include",
					headers: { "Content-Type": "application/json", Cookie: "jwt=" + jwt },
				}
			);

			const data = await res.json();
			console.log(data);
			// Check role for current path
			for (const path in roleAccess) {
				if (pathname.startsWith(path)) {
					if (!roleAccess[path].includes(data.role)) {
						url.pathname = "/not-authorized";
						return NextResponse.redirect(url);
					}
					break;
				}
			}
		} catch (err) {
			console.error("JWT validation failed", err);
			url.pathname = "/login";
			return NextResponse.redirect(url);
		}
	}

	// Allow request to continue
	return NextResponse.next();
}

// Specify paths to run middleware on
export const config = {
	matcher: ["/dashboard/:path*", "/edit/:path*", "/export/:path*"],
};
