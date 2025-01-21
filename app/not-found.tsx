import Link from 'next/link';
import { Button } from '~/components/backstage/ui/button';

export default function Status404() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="mb-4 text-6xl font-bold">404</h1>
            <p className="mb-8 text-xl text-muted-foreground">Nothing here yet</p>
            <Button variant="outline">
                <Link href="/">{'Get me to a safe place'} </Link>
            </Button>
        </div>
    );
}
