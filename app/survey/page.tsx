import { SignedOut, SignIn } from '@clerk/nextjs';

export default async function Page() {
    return (
        <main className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <p>{'Welcome to Tango5'}</p>
            <SignedOut>
                <SignIn routing="hash" />
            </SignedOut>
        </main>
    );
}
