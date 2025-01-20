import { notFound, redirect } from 'next/navigation';
import { getRandom } from '~/lib/db/queries';

export default async function Page() {
    const scenario = await getRandom();

    if (!scenario) notFound();
    redirect(`/play/${scenario.id}`);
}
