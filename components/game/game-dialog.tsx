import { Dialog } from '~/components/ui/dialog';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { PropsWithoutRef } from 'react';

type GameDialogProps = {
    title: string;
    text: string;
    onAccept: () => void;
    open: boolean;
    setOpen: (state: boolean) => void;
};

export const GameDialog = (props: PropsWithoutRef<GameDialogProps>) => {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    <DialogDescription>{props.text}</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={props.onAccept}>{'Accept'}</Button>
                    <DialogClose asChild>
                        <Button variant="outline">{'Cancel'}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
