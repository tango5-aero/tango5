'use server';

import { ActionState } from '.';
import { ScenarioData, scenarioSchema } from '~/lib/domain/scenario';
import { writeScenarios } from '~/lib/db/queries';
import {
    changeScenarioIsDemo as changeDBScenarioIsDemo,
    deleteScenario as deleteDBScenario,
    getScenariosPage as getDBScenariosPage,
    changeScenarioVisibility as changeDBScenarioVisibility
} from '~/lib/db/queries';
import { unstable_cache } from 'next/cache';
import { cacheTags } from '~/lib/constants';
import { ScenarioSelect } from '~/lib/types';

export async function createScenario(
    _prevState: ActionState,
    payload: { filesData: string[]; filesName: string[] }
): Promise<ActionState> {
    if (payload.filesData.length === 0) {
        return { message: 'No files selected', error: true };
    }

    const scenariosData: ScenarioData[] = [];

    for (let index = 0; index < payload.filesData.length; index++) {
        const fileName = payload.filesName[index];
        const fileData = payload.filesData[index];

        let json;
        try {
            json = JSON.parse(fileData);
        } catch {
            return { message: `${fileName} is not a valid JSON document`, error: true };
        }

        const scenarioData = scenarioSchema.safeParse(json);

        if (scenarioData.error) {
            return { message: `${fileName} does not have the correct JSON schema`, error: true };
        }

        scenariosData.push(scenarioData.data);
    }

    const result = await writeScenarios(scenariosData);

    if (result.length === 0) {
        return { message: `Internal database error when saving scenarios`, error: true };
    }

    return { message: `Scenario${result.length > 1 && 's'} created`, error: false };
}

export async function deleteScenario(_prevState: ActionState, id: ScenarioSelect['id']): Promise<ActionState> {
    const result = await deleteDBScenario(id);

    if (result.length === 0) {
        return { message: `Scenario #${id} not found`, error: true };
    }

    return { message: `Scenario #${id} deleted`, error: false };
}

export async function getScenariosPage(pageIndex: number, pageSize: number) {
    const getCachedScenariosPage = unstable_cache(
        async (pageIndex, pageSize) => getDBScenariosPage(pageIndex, pageSize),
        [cacheTags.scenarios, pageIndex.toString(), pageSize.toString()],
        {
            tags: [cacheTags.scenarios]
        }
    );

    return await getCachedScenariosPage(pageIndex, pageSize);
}

export async function changeScenarioVisibility(
    _prevState: ActionState,
    payload: Pick<ScenarioSelect, 'id' | 'active'>
): Promise<ActionState> {
    const { id, active } = payload;
    const result = await changeDBScenarioVisibility(id, active);

    if (result.length === 0) {
        return { message: `Scenario #${id} not found`, error: true };
    }

    return { message: `Scenario #${id} is now ${active ? 'active' : 'inactive'}`, error: false };
}

export async function changeScenarioIsDemo(
    _prevState: ActionState,
    payload: Pick<ScenarioSelect, 'id' | 'demo'>
): Promise<ActionState> {
    const { id, demo } = payload;
    const result = await changeDBScenarioIsDemo(id, demo);

    if (result.length === 0) {
        return { message: `Scenario #${id} not found`, error: true };
    }

    return { message: `Scenario #${id} is now ${demo ? 'demo' : 'not demo'}`, error: false };
}
