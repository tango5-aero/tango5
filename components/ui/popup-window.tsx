'use client';

import { PropsWithChildren, RefObject } from 'react';
import { X } from 'lucide-react';

import './popup-window.css';

interface PopupWindowProps extends PropsWithChildren {
    ref: RefObject<HTMLDialogElement | null>;
}

export const PopupWindow = (props: PopupWindowProps) => {
    return (
        <dialog ref={props.ref} className="fixed inset-0 z-50 bg-gray-200">
            <div className="flex max-h-[60vh] max-w-[1200px] gap-6 p-6 font-barlow text-gray-900">
                {props.children}
                <X className="size-4 flex-shrink-0 cursor-pointer" onClick={() => props.ref.current?.close()} />
            </div>
        </dialog>
    );
};
