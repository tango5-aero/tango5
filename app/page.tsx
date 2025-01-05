import { ScenarioUploadDialog } from '~/components/scenario-upload-dialog';
import { ScenarioTable } from '~/components/scenario-table';

import { unstable_cache } from 'next/cache';
import { getScenarios } from '~/lib/db/queries';

const getScenariosCached = unstable_cache(
    async () => {
        return await getScenarios();
    },
    ['scenarios'],
    { revalidate: 3600, tags: ['scenarios'] }
);
export default async function App() {
    const scenarios = await getScenariosCached();

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <ScenarioTable scenarios={scenarios} />
            <ScenarioUploadDialog />
        </main>
    );
}
