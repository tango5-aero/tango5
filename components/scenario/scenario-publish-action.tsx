'use client';

import { PropsWithoutRef, startTransition, useActionState, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import revalidateCacheTag, { publishScenario } from '~/lib/actions';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { CalendarCog } from 'lucide-react';
import { cacheTags } from '~/lib/constants';
import { toast } from 'sonner';
import { DatePicker } from '../ui/date-picker';

export const ScenarioPublishAction = (props: PropsWithoutRef<{ id: number; releaseDate: string | undefined }>) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(props.releaseDate ? new Date(props.releaseDate) : undefined);
    const [state, action, pending] = useActionState(publishScenario, { message: '', error: false });

    useEffect(() => {
        if (state.message && state.error) toast.error(state.message);
        if (state.message && !state.error) toast.success(state.message);
        revalidateCacheTag(cacheTags.scenarios);
    }, [state]);

    useEffect(() => {
        if (pending) toast.info(`Publishing scenario #${props.id}...`);
    }, [pending, props.id, date]);

    const publishCurrentScenario = () => {
        if (!date) return;
        startTransition(async () => {
            action({ id: props.id, releaseDate: date });
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <CalendarCog size={'1rem'} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{'Publish scenario'}</DialogTitle>
                </DialogHeader>

                <DatePicker date={date} onSelect={setDate} />

                <DialogFooter>
                    <Button variant={'default'} disabled={pending} onClick={publishCurrentScenario}>
                        {pending ? 'Processing...' : 'Confirm'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant={'outline'}>{'Cancel'}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
