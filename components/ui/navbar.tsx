import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="relative z-30">
            <div className="bg-gray-800 p-4">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/app" className="text-2xl font-bold text-white">
                                Game
                            </Link>
                        </div>
                        <div className="flex flex-row gap-4">
                            <Link href="/" className="text-white">
                                Tango5
                            </Link>
                            <Link href="/app/tutorial" className="text-white">
                                Tutorial
                            </Link>
                            <Link href="/app/tutorial#faq" className="text-white">
                                FAQ
                            </Link>
                            <Link href="/app/scores" className="text-white">
                                Scores
                            </Link>
                            <Link href="/app/play" className="text-white">
                                Play
                            </Link>
                            <Link href="/backstage" className="text-white">
                                Backstage
                            </Link>
                            <SignedOut>
                                <SignIn routing="hash" />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export { Navbar };
