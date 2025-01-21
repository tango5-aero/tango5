import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { VideoBackground } from '~/components/ui/video-background';
import { tryCreateUser } from '~/lib/db/queries';

export default async function Page() {
    const user = await currentUser();

    if (user) {
        tryCreateUser(user);
        redirect('/games');
    }

    return (
        <>
            <main className="relative z-20 flex h-screen flex-col items-center justify-center gap-2 p-6 md:p-10">
                <h1 className="text-3xl">{'Welcome to Tango5'}</h1>
                <p className="w-[490px] text-center font-BarlowLight text-4xl leading-10">
                    A professional enroute
                    <br />
                    Air Traffic Control training tool
                </p>
                <p className="mb-16 w-[460px] text-left font-Barlow text-xl leading-6">
                    Whether you’re aspiring to be an air traffic controller or just want to understand how air traffic
                    is managed, Tango5 is your ultimate online hub for all things ATC!
                </p>
                <Button variant="map" size="map">
                    LOGIN
                </Button>
            </main>
            <VideoBackground />
        </>
    );
}
