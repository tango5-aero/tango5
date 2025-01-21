import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isUserRegisteredRoute = createRouteMatcher(['/games(.*)', '/play(.*)']);
const isBackstageRoute = createRouteMatcher(['/backstage(.*)']);

export default clerkMiddleware(async (auth, req) => {
    const rootUrl = new URL('/', req.url);

    if (isBackstageRoute(req) && (await auth()).sessionClaims?.metadata?.backstage !== true) {
        return NextResponse.redirect(rootUrl);
    }

    if (isUserRegisteredRoute(req))
        await auth.protect({ unauthorizedUrl: rootUrl.toString(), unauthenticatedUrl: rootUrl.toString() });
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)'
    ]
};
