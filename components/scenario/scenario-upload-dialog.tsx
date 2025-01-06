'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import revalidateCacheTag, { createScenario } from '~/lib/actions';
import { toast } from '~/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '~/components/ui/dialog';
import { FilePlus2 } from 'lucide-react';
import { cacheTags } from '~/lib/constants';

export function ScenarioUploadDialog() {
    const [open, setOpen] = useState(false);
    const [state, action, pending] = useActionState(createScenario, { message: '' });
    const [data, setData] = useState('');

    useEffect(() => {
        if (state.message) toast({ description: state.message });
        revalidateCacheTag(cacheTags.scenarios);
    }, [state]);

    useEffect(() => {
        if (!open) setData('');
    }, [open]);

    useEffect(() => {
        if (pending) toast({ description: 'Loading...' });
    }, [pending]);

    const uploadScenario = () => {
        if (data)
            startTransition(async () => {
                action(data);
                setOpen(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <>
                    <Button variant={'outline'}>
                        <FilePlus2 size={'1rem'} /> New
                    </Button>
                </>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{'Scenario Upload'}</DialogTitle>
                    <DialogDescription>{'New scenario from a JSON file'}</DialogDescription>
                </DialogHeader>

                <Input type="file" onChange={(e) => e.target.files?.item(0)?.text().then(setData)} />

                <DialogFooter>
                    <Button disabled={data === '' || pending} onClick={uploadScenario}>
                        {pending ? 'Loading' : 'Submit'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">{'Cancel'}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
