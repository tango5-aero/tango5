'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { DialogFooter, DialogHeader } from '../ui/dialog';
import { Button } from '../ui/button';
import { redirect } from 'next/navigation';

const GameFinishDialog = ({ open, score }: { open: boolean; score: number }) => {
    return (
        <Dialog open={open} modal={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{'Game finish'}</DialogTitle>
                    <DialogDescription>
                        {`Congratulations! You have finished the game with a score of ${score}`}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={() => redirect('/play/random')}>{'Next'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export { GameFinishDialog };
