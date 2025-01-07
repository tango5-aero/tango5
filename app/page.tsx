import { ScenarioUploadDialog } from '~/components/scenario/scenario-upload-dialog';
import { ScenariosTable } from '~/components/scenario/scenario-table';
import { getScenarios } from '~/lib/db/queries';
import { ThemeToggle } from '../components/theme/theme-toggle';

export default async function App() {
    const scenarios = await getScenarios();

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <ThemeToggle />
            <ScenariosTable scenarios={scenarios} />
            <ScenarioUploadDialog />
        </main>
    );
}
