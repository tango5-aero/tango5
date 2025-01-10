import { useEffect, useState } from 'react';
import { GAME_TIMEOUT_MS } from './game';

const GameCountdown = ({ disabled }: { disabled?: boolean }) => {
    const [counter, setCounter] = useState(GAME_TIMEOUT_MS / 1000);

    useEffect(() => {
        const tid = setTimeout(() => {
            if (counter <= 0 || disabled) return;
            setCounter((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(tid);
    }, [counter, disabled]);

    return (
        <div
            className={`fixed right-16 top-5 z-10 flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-base shadow-md transition-all hover:scale-110 ${counter < 10 ? 'text-red-500' : 'text-primary'} select-none`}>
            {`${counter} ${counter > 1 ? 'secs' : 'sec'}`}
        </div>
    );
};

export { GameCountdown };
