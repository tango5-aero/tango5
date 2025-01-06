'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import revalidateCacheTag, { createScenario } from '~/lib/actions';
import { toast } from 'sonner';

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
    const [state, action, pending] = useActionState(createScenario, { message: '', error: false });
    const [data, setData] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (state.message && state.error) toast.error(state.message);
        if (state.message && !state.error) toast.success(state.message);
        revalidateCacheTag(cacheTags.scenarios);
    }, [state]);

    useEffect(() => {
        if (!open) setData('');
    }, [open]);

    useEffect(() => {
        if (pending) toast.info(`Creating new scenario from ${fileName}`);
    }, [fileName, pending]);

    const uploadScenario = () => {
        if (data)
            startTransition(async () => {
                action(data);
                setOpen(false);
            });
    };

    const updateFileContents = (file: File) => {
        startTransition(() => {
            setFileName(file.name);
            file.text().then(setData);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'outline'}>
                    <FilePlus2 size={'1rem'} /> {'New'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{'Scenario Upload'}</DialogTitle>
                    <DialogDescription>{'New scenario from a JSON file'}</DialogDescription>
                </DialogHeader>

                <Input
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files?.item(0);
                        if (file) updateFileContents(file);
                    }}
                />

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
