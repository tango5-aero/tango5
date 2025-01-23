'use client';

import { PropsWithoutRef, startTransition, useActionState, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import revalidateCacheTag, { setScenarioReleaseDate } from '~/lib/actions';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { CalendarCog } from 'lucide-react';
import { cacheTags } from '~/lib/constants';
import { toast } from 'sonner';
import { DatePicker } from '../ui/date-picker';
import { ScenarioParsed } from '~/lib/types';

export const ScenarioReleaseDateDialog = (props: PropsWithoutRef<Pick<ScenarioParsed, 'id' | 'releaseDate'>>) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(props.releaseDate ? new Date(props.releaseDate) : undefined);
    const [state, action, pending] = useActionState(setScenarioReleaseDate, { message: '', error: false });

    useEffect(() => {
        if (state.message && state.error) toast.error(state.message);
        if (state.message && !state.error) toast.success(state.message);
        revalidateCacheTag(cacheTags.scenarios);
    }, [state]);

    useEffect(() => {
        if (pending) toast.info(`Setting release date for scenario #${props.id}...`);
    }, [pending, props.id]);

    const setCurrentScenarioReleaseDate = () => {
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
                    <DialogTitle>{'Scenario Release Date'}</DialogTitle>
                </DialogHeader>

                <DatePicker date={date} onSelect={setDate} />

                <DialogFooter>
                    <Button variant={'default'} disabled={pending} onClick={setCurrentScenarioReleaseDate}>
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
