import { Waitlist } from '@clerk/nextjs';

export default function Page() {
    return (
        <main className="flex h-[100dvh] flex-col items-center justify-center gap-6 px-5">
            <Waitlist />
        </main>
    );
}
