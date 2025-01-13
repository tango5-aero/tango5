import { useEffect, useState } from 'react';
import { GAME_TIMEOUT_MS as initialCount } from './game';

const GameCountdown = ({ running }: { running: boolean }) => {
    const [count, setCount] = useState(initialCount / 1000);

    useEffect(() => {
        if (!running || count <= 0) return;
        const tid = setTimeout(() => {
            setCount((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(tid);
    }, [count, running]);

    return (
        <div
            className={`fixed right-16 top-5 z-10 flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-base shadow-md transition-all hover:scale-110 ${count < 10 ? 'text-red-500' : 'text-primary'} select-none`}>
            {`${count} ${count > 1 ? 'secs' : 'sec'}`}
        </div>
    );
};

export { GameCountdown };
