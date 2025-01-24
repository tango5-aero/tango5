import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import revalidateCacheTag, { ActionState } from '~/lib/actions';

export function useDialogAction<TData>(
    loadingMessage: string,
    dialogAction: (_prevState: ActionState, payload: TData) => Promise<ActionState>,
    cacheTag?: string
) {
    const [state, action, pending] = useActionState(dialogAction, { message: '', error: false });
    const toastId = useRef<string | number | undefined>(undefined);

    useEffect(() => {
        if (state.message && state.error) toast.error(state.message, { id: toastId.current });
        if (state.message && !state.error) toast.success(state.message, { id: toastId.current });
        if (cacheTag) revalidateCacheTag(cacheTag);
    }, [state, cacheTag]);

    useEffect(() => {
        if (pending) toastId.current = toast.loading(loadingMessage);
    }, [pending, loadingMessage]);

    return { action, pending };
}
