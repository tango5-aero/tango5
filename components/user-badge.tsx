import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';

const UserBadge = () => {
    return (
        <div className="fixed right-3 top-3 z-10">
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
