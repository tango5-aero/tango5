import Link from 'next/link';
import { getScenarios } from '~/lib/db';

export default async function App() {
    const scenarios = await getScenarios();

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <ul>
                {scenarios.map((scenario) => (
                    <li key={scenario.id}>
                        <Link href={`/map/${scenario.id}`}>{`Scenario #${scenario.id}`}</Link>
                    </li>
                ))}
            </ul>
            <p>or</p>
            <Link href="/scenarios/upload">{'Upload scenario'}</Link>
        </main>
    );
}
