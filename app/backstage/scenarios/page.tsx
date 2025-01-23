import { ScenarioUploadDialog } from '~/components/scenario/scenario-upload-dialog';
import { ScenariosTable } from '~/components/scenario/scenario-table';

export default async function App() {
    return (
        <main className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <ScenariosTable />
            <ScenarioUploadDialog />
        </main>
    );
}
