'use client';

import { PropsWithoutRef, startTransition, useActionState, useEffect, useState } from 'react';
import { Button } from '~/components/backstage/ui/button';
import { resetUserProgress } from '~/lib/actions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '~/components/backstage/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TimerReset } from 'lucide-react';

export const UserResetAction = (props: PropsWithoutRef<{ id: string }>) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [state, action, pending] = useActionState(resetUserProgress, {
        message: '',
        error: false
    });

    useEffect(() => {
        if (state.message && state.error) toast.error(state.message);
        if (state.message && !state.error) {
            toast.success(state.message);
            router.push('/');
        }
    }, [state, router]);

    useEffect(() => {
        if (pending) toast.info('Resetting progress...');
    }, [pending, props.id]);

    const handleReset = () => {
        startTransition(async () => {
            action(props.id);
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <TimerReset />
                    <span>{'Reset my progress'}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{'Reset progress'}</DialogTitle>
                    <DialogDescription>
                        {`This action cannot be undone, are you sure you want to proceed?`}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant={'destructive'} disabled={pending} onClick={handleReset}>
                        {pending ? 'Processing' : 'Confirm'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant={'outline'}>{'Cancel'}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
