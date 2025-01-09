import { ScenarioUploadDialog } from '~/components/scenario/scenario-upload-dialog';
import { ScenariosTable } from '~/components/scenario/scenario-table';
import { getScenarios } from '~/lib/db/queries';

export default async function App() {
    const scenarios = await getScenarios();

    return (
        <main className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <ScenariosTable scenarios={scenarios} />
            <ScenarioUploadDialog />
        </main>
    );
}
