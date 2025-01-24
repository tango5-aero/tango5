import { PropsWithChildren, Dispatch, SetStateAction } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose
} from '~/components/ui/dialog';
import { Button, buttonVariants } from '~/components/ui/button';
import { VariantProps } from 'class-variance-authority';

type ConfirmationDialogProps = {
    open: boolean;
    openHandler: Dispatch<SetStateAction<boolean>>;
    title: string;
    description?: string;
    pending: boolean;
    triggerAsChild?: boolean;
    dialogTrigger: React.ReactNode;
    confirmButtonVariant?: VariantProps<typeof buttonVariants>['variant'];
    onConfirm: () => void;
};

export const ActionDialog = (props: PropsWithChildren<ConfirmationDialogProps>) => {
    return (
        <Dialog open={props.open} onOpenChange={props.openHandler}>
            <DialogTrigger asChild={props.triggerAsChild}>{props.dialogTrigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    {props.description && <DialogDescription>{props.description}</DialogDescription>}
                </DialogHeader>

                {props.children}

                <DialogFooter>
                    <Button variant={props.confirmButtonVariant} disabled={props.pending} onClick={props.onConfirm}>
                        {props.pending ? 'Processing...' : 'Confirm'}
                    </Button>
                    <DialogClose asChild>
                        <Button variant={'outline'}>{'Cancel'}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
