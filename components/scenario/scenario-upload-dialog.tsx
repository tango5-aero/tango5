'use client';

import { startTransition, useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { createScenario } from '~/lib/actions';
import { FilePlus2 } from 'lucide-react';
import { cacheTags } from '~/lib/constants';
import { ActionDialog } from '../ui/action-dialog';
import { useDialogAction } from '~/hooks/use-dialog-action';
import { Button } from '../ui/button';

export function ScenarioUploadDialog() {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState('');
    const [fileName, setFileName] = useState('');

    const { action, pending } = useDialogAction(
        `Creating new scenario from ${fileName}`,
        createScenario,
        cacheTags.scenarios
    );

    useEffect(() => {
        if (!open) setData('');
    }, [open]);

    const handleConfirm = () => {
        if (data)
            startTransition(async () => {
                action({ data, fileName });
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
        <ActionDialog
            open={open}
            openHandler={setOpen}
            title={'Scenario Upload'}
            pending={pending}
            triggerAsChild
            dialogTrigger={
                <Button variant={'outline'}>
                    <FilePlus2 size={'1rem'} /> {'New'}
                </Button>
            }
            onConfirm={handleConfirm}>
            <Input
                type="file"
                onChange={({ target: { files } }) => {
                    const file = files?.item(0);
                    if (file) updateFileContents(file);
                }}
            />
        </ActionDialog>
    );
}
