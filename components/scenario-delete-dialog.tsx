'use client';

import { PropsWithoutRef, useActionState, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import revalidateCacheTag, { deleteScenario } from '~/lib/actions';
import { toast } from '~/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '~/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { Trash2Icon } from 'lucide-react';
import { cacheTags } from '~/lib/constants';

export const ScenarioDeleteDialog = (props: PropsWithoutRef<{ id: number }>) => {
    const [open, setOpen] = useState(false);
    const [state, formAction, pending] = useActionState(deleteScenario, { message: '' });

    useEffect(() => {
        if (state.message) toast({ description: state.message });
        revalidateCacheTag(cacheTags.scenarios);
    }, [state]);

    useEffect(() => {
        if (pending) toast({ description: 'Deleting...' });
    }, [pending]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Trash2Icon size={'1rem'} />
            </DialogTrigger>
            <DialogContent>
                <form
                    className="grid w-full items-center gap-6"
                    action={formAction}
                    onSubmitCapture={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>{'Delete scenario'}</DialogTitle>
                        <DialogDescription>
                            {'Are you sure you want to delete the scenario? This action can not be undone. '}
                        </DialogDescription>
                    </DialogHeader>

                    <Input
                        className="hidden"
                        name="scenarioId"
                        value={props.id}
                        onChange={() => {} /* required to be  controlled */}
                    />

                    <DialogFooter>
                        <Button type="submit" disabled={pending}>
                            {pending ? 'Deleting' : 'Delete'}
                        </Button>
                        <DialogClose asChild>
                            <Button>{'Cancel'}</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
