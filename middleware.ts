import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isBackstageRoute = createRouteMatcher(['/backstage(.*)']);
const isAuthenticatedRoute = createRouteMatcher(['/end-game(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (
        (isBackstageRoute(req) || isAuthenticatedRoute(req)) &&
        (await auth()).sessionClaims?.metadata?.backstage !== true
    ) {
        const url = new URL('/', req.url);
        return NextResponse.redirect(url);
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)'
    ]
};
