// Adapted from https://clerk.com/docs/quickstarts/nextjs#add-clerk-provider-and-clerk-components-to-your-app

import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';

const UserBadge = () => {
    return (
        <div className="fixed right-4 top-5 z-10">
            <SignedOut>
                <SignIn routing="hash" />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    );
};

export { UserBadge };
