import { ScenarioUploadDialog } from '~/components/scenario/scenario-upload-dialog';
import { ScenariosTable } from '~/components/scenario/scenario-table';

import { unstable_cache } from 'next/cache';
import { getScenarios } from '~/lib/db/queries';
import { cacheTags } from '~/lib/constants';

const getScenariosCached = unstable_cache(
    async () => {
        return await getScenarios();
    },
    [cacheTags.scenarios],
    { revalidate: 3600, tags: [cacheTags.scenarios] }
);
export default async function App() {
    const scenarios = await getScenariosCached();

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <ScenariosTable scenarios={scenarios} />
            <ScenarioUploadDialog />
        </main>
    );
}
