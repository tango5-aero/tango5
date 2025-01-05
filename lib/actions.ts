'use server';

import { writeScenario } from './db';
import { scenario } from './scenario';
import { redirect } from 'next/navigation';

export async function createScenario(
    prevState: unknown,
    formData: FormData
): Promise<{ message: string; error?: boolean }> {
    const data = formData.get('data');

    if (!data) return { message: 'Internal error', error: true };

    if (typeof data !== 'string') return { message: 'The file must be UTF-8 encoded', error: true };

    let json;

    try {
        json = JSON.parse(data);
    } catch {
        return { message: 'The file must be valid JSON document', error: true };
    }

    const scenarioData = scenario.safeParse(json);

    if (scenarioData.error) return { message: 'The file must have the correct scenario JSON schema', error: true };

    console.log('data', scenarioData.data);

    await writeScenario(scenarioData.data);

    redirect('/scenarios/view');
}
