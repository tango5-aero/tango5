import { ScenarioSelect } from '~/lib/types';
import revalidateCacheTag from './cache';

export * from './scenarios';
export * from './usergames';

export type ActionState = { message: string; error: boolean };
export type ActionScenarioState =
    | { scenario: ScenarioSelect; pendingScenarios: number; error: false }
    | { scenario: undefined; pendingScenarios: 0; error: false }
    | { error: true; errorMessage: string };

export default revalidateCacheTag;
