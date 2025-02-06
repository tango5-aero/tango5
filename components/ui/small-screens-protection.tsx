'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { BREAKPOINT_SMALL_SCREEN } from '~/lib/constants';

const SmallScreensProtection = (props: PropsWithChildren) => {
    const [screenWidth, setScreenWidth] = useState<number>();

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        const handleWindowResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    if (!screenWidth) return;

    return (
        <>
            {screenWidth > BREAKPOINT_SMALL_SCREEN ? (
                props.children
            ) : (
                <main className="flex h-[100dvh] flex-col items-center justify-center gap-6 px-5">
                    <h2 className="text-xl sm:text-2xl">Screen Size Not Supported</h2>
                    <p className="text-pretty text-sm sm:text-base">
                        This application requires a minimum screen width of 1024 pixels to function properly.
                    </p>
                    <p className="text-pretty text-sm sm:text-base">
                        Please resize your browser window or switch to a device with a larger screen.
                    </p>
                </main>
            )}
        </>
    );
};

export { SmallScreensProtection };
