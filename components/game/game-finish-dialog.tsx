'use client';

import { Dialog } from '@radix-ui/react-dialog';

const GameFinishDialog = ({ open, score }: { open: boolean; score: number }) => {
    return (
        <Dialog open={open} onOpenChange={() => console.log('test dialog close')}>
            {`Congratulations! You have finished the game with a score of ${score}`}
        </Dialog>
    );
};

export { GameFinishDialog };
