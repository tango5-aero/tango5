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
    const [filesData, setFilesData] = useState<string[]>([]);
    const [filesName, setFilesName] = useState<string[]>([]);

    useEffect(() => {
        if (state.message && state.error) toast.error(state.message);
        if (state.message && !state.error) toast.success(state.message);
        revalidateCacheTag(cacheTags.scenarios);
    }, [state]);

    useEffect(() => {
        if (!open) setFilesData([]);
    }, [open]);

    useEffect(() => {
        if (pending) toast.info(`Creating new scenario from ${filesName}`);
    }, [filesName, pending]);

    const uploadScenario = () => {
        if (filesData) {
            startTransition(async () => {
                action({ filesData, filesName });
                setOpen(false);
            });
        }
    };

    const updateFilesContents = (files: FileList) => {
        startTransition(() => {
            const newFilesName: string[] = [];
            const newFilesData: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (!file) return;
                file.text().then((fileData) => {
                    newFilesData.push(fileData);
                });
                newFilesName.push(file.name);
            }
            setFilesName(newFilesName);
            setFilesData(newFilesData);
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
                    <DialogDescription>{'Create a new scenario from a JSON file'}</DialogDescription>
                </DialogHeader>

                <Input
                    type="file"
                    multiple={true}
                    onChange={({ target: { files } }) => {
                        if (!files) return;
                        updateFilesContents(files);
                    }}
                />

                <DialogFooter>
                    <Button disabled={filesData.length > 0 || pending} onClick={() => uploadScenario()}>
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
