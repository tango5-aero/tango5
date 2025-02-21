'use client';

import { PropsWithoutRef, useEffect, useRef } from 'react';
import { ScenarioSelect } from '~/lib/types';
import { PopupWindow } from '~/components/ui/popup-window';
import { GameLayout } from '~/components/game/game-layout';
import { LoadingSpinner } from '~/components/ui/loading-spinner';

type GameSolutionViewerProps = {
    open: boolean;
    onClose: () => void;
    scenario: ScenarioSelect | undefined;
    loading: boolean;
};

export const GameSolutionViewer = (props: PropsWithoutRef<GameSolutionViewerProps>) => {
    const popupRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const popup = popupRef.current;
        if (!popup) return;
        popup.addEventListener('close', props.onClose);
        return () => {
            popup.removeEventListener('close', props.onClose);
        };
    }, [props.onClose]);

    useEffect(() => {
        if (props.open) {
            popupRef.current?.showModal();
        }
    }, [props.open]);

    return (
        <PopupWindow ref={popupRef}>
            <div className="flex min-w-[800px] flex-col gap-6">
                <h3 className="text-2xl">
                    Solution for scenario {props.scenario && <span>#{props.scenario.id}</span>}
                </h3>
                {props.loading && (
                    <div className="flex h-[60vh] items-center justify-center">
                        <LoadingSpinner size={36} />
                    </div>
                )}
                {!props.loading && props.scenario && <GameLayout scenario={props.scenario} revealSolution />}
                {!props.loading && !props.scenario && <span>{'Error loading scenario'}</span>}
            </div>
        </PopupWindow>
    );
};
