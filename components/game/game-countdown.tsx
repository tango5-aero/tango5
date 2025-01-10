import { useEffect, useState } from 'react';
import { GAME_TIMEOUT_MS } from './game';

const GameCountdown = ({ disabled }: { disabled?: boolean }) => {
    const [counterMs, setCounterMs] = useState(GAME_TIMEOUT_MS);

    useEffect(() => {
        const tid = setTimeout(() => {
            if (counterMs <= 0 || disabled) return;
            setCounterMs((prev) => prev - 1000);
        }, 1000);

        return () => clearTimeout(tid);
    }, [counterMs, disabled]);

    const counter = counterMs / 1000;

    return (
        <div
            className={`fixed right-16 top-5 z-10 flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-lg shadow-md ${counter < 10 ? 'text-red-500' : 'text-primary'}`}>
            {`${counter} ${counter > 1 ? 'secs' : 'sec'}`}
        </div>
    );
};

export { GameCountdown };
