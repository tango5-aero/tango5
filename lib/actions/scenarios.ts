'use server';

import { ActionState } from '.';
import { ScenarioData, scenarioSchema } from '~/lib/domain/scenario';
import { writeScenarios, updateScenarioReleaseDate } from '~/lib/db/queries';
import { deleteScenario as deleteDBScenario, getScenariosPage as getDBScenariosPage } from '~/lib/db/queries';
import { format } from 'date-fns';

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

export async function setScenarioReleaseDate(
    _prevState: ActionState,
    payload: { id: number; releaseDate: Date | undefined }
): Promise<ActionState> {
    const { id, releaseDate } = payload;
    const result = await updateScenarioReleaseDate(id, releaseDate);

    if (result.length === 0) {
        return { message: `Scenario #${id} not found`, error: true };
    }

    return {
        message: releaseDate
            ? `Set a new release date for scenario #${id} - ${format(releaseDate, 'PPP')}`
            : `Cleared release date for scenario #${id}`,
        error: false
    };
}

export async function deleteScenario(_prevState: ActionState, id: number): Promise<ActionState> {
    const result = await deleteDBScenario(id);

    if (result.length === 0) {
        return { message: `Scenario #${id} not found`, error: true };
    }

    return { message: `Scenario #${id} deleted`, error: false };
}

export async function getScenariosPage(pageIndex: number, pageSize: number) {
    return await getDBScenariosPage(pageIndex, pageSize);
}
