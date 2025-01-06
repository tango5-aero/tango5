'use server';

import { writeScenario } from '~/lib/db/queries';
import { scenarioSchema } from '~/lib/domain/scenario';
import { deleteScenario as deleteDBScenario } from '~/lib/db/queries';
import { revalidateTag } from 'next/cache';

type ActionState = { message: string };

export async function createScenario(_prevState: ActionState, data: string): Promise<ActionState> {
    let json;

    try {
        json = JSON.parse(data);
    } catch {
        return { message: 'The file must be valid JSON document' };
    }

    const scenarioData = scenarioSchema.safeParse(json);

    if (scenarioData.error) return { message: 'The file must have the correct JSON schema' };

    const result = await writeScenario(scenarioData.data);

    if (result.length === 0) return { message: `Internal database error` };

    return { message: `Scenario saved with id #${result[0].id}` };
}

export async function deleteScenario(_prevState: ActionState, id: number): Promise<ActionState> {
    const result = await deleteDBScenario(id);

    if (result.length === 0) return { message: `Scenario with id #${id} not found` };

    return { message: `Scenario with id #${id} deleted successfully` };
}

export default async function revalidateCacheTag(tag: string) {
    revalidateTag(tag);
}
