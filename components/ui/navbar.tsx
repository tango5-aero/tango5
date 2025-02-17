'use client';

import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { LinkButton } from './link-button';
import { usePathname } from 'next/navigation';
import { PropsWithoutRef } from 'react';
import Link from 'next/link';

const Navbar = (props: PropsWithoutRef<{ backstageAccess: boolean }>) => {
    const pathname = usePathname();

    return (
        <nav className="fixed z-30 w-full">
            <div className="flex h-[80px] flex-col justify-center bg-navbarBG">
                <div className="flex items-center justify-between px-10 text-xl">
                    <div>
                        <Link href="/">
                            <Image src="/images/tango5-logo.svg" width={30} height={37} alt={'Tango5'} />
                        </Link>
                    </div>
                    <div className="flex flex-row gap-1">
                        {props.backstageAccess && (
                            <LinkButton
                                href="/backstage"
                                className={`font-barlow text-xl uppercase text-white ${pathname.includes('/backstage') ? 'font-bold' : 'font-light'}`}
                                variant="link">
                                Backstage
                            </LinkButton>
                        )}
                        <LinkButton
                            href="/app/tutorial"
                            className={`font-barlow text-xl uppercase text-white ${pathname === '/app/tutorial' ? 'font-bold' : 'font-light'}`}
                            variant="link">
                            Tutorial
                        </LinkButton>
                        <LinkButton
                            href="/app/scores"
                            className={`font-barlow text-xl uppercase text-white ${pathname === '/app/scores' ? 'font-bold' : 'font-light'}`}
                            variant="link">
                            Scores
                        </LinkButton>
                        <LinkButton href="/app/play" className="ml-2 mr-6 text-xl uppercase" variant="map">
                            Play
                        </LinkButton>
                        <SignedOut>
                            <SignIn routing="hash" />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export { Navbar };
