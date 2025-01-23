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
    const [filesData, setFilesData] = useState<string[]>([]);
    const [filesName, setFilesName] = useState<string[]>([]);

    const { action, pending } = useDialogAction(
        `Creating new scenario from ${filesName}`,
        createScenario,
        cacheTags.scenarios
    );

    useEffect(() => {
        if (!open) setFilesData([]);
    }, [open]);

    const handleConfirm = () => {
        if (filesData)
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
        <ActionDialog
            open={open}
            openHandler={setOpen}
            title={'Scenario Upload'}
            pending={filesData.length > 0 || pending}
            triggerAsChild
            dialogTrigger={
                <Button variant={'outline'}>
                    <FilePlus2 size={'1rem'} /> {'New'}
                </Button>
            }
            onConfirm={handleConfirm}>
            <Input
                type="file"
                multiple
                onChange={({ target: { files } }) => {
                    if (!files) return;
                        updateFilesContents(files);
                }}
            />
        </ActionDialog>
    );
}
