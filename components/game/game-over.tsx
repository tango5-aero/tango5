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
import { redirect } from 'next/navigation';

export const GameOver = (
    props: PropsWithoutRef<{ text: string; nextUrl: string; open: boolean; setOpen: (state: boolean) => void }>
) => {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{'Game is over'}</DialogTitle>
                    <DialogDescription>{props.text}</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={() => redirect(props.nextUrl)}>{'Next'}</Button>
                    <DialogClose asChild>
                        <Button variant="outline">{'Close'}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
