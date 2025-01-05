'use client';

import { useActionState, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { createScenario } from '~/lib/actions';

export function ScenarioUpload() {
    const [state, formAction, pending] = useActionState(createScenario, { message: '', error: false });

    const [data, setData] = useState('');

    return (
        <form className="grid w-full max-w-sm items-center gap-1.5" action={formAction}>
            <Label htmlFor="file">Upload scenario data</Label>
            <Input
                disabled={state.error}
                id="file"
                type="file"
                onChange={(e) => e.target.files?.item(0)?.text().then(setData)}
            />
            <Input className="hidden" name="data" value={data} onChange={() => {}} />
            <p className={state.error ? 'text-red-400' : 'text-green-400'}>{state.message}</p>
            <Button type="submit" disabled={!data || pending || state.error}>
                {pending ? 'Loading' : 'Submit'}
            </Button>
        </form>
    );
}
