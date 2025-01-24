import { getRandom, getUnplayedScenarios } from '~/lib/db/queries';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { DateString } from '~/types';

type PlayPageSarchParams = {
    day?: string;
};

type PlayPageProps = {
    params: object;
    searchParams: PlayPageSarchParams;
};

export default async function Page(props: PlayPageProps) {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const { day } = props.searchParams;

    const unplayedScenarios =
        day && isValidDate(day) ? await getUnplayedScenarios(user.id, day) : await getUnplayedScenarios(user.id);

    if (unplayedScenarios.length === 0) {
        redirect('/games');
    }

    const scenario = await getRandom(unplayedScenarios.map((s) => s.id));

    if (!scenario) {
        redirect('/games');
    }

    redirect(`/play/${scenario.id}`);
}

const isValidDate = (date: string | null): date is DateString => {
    if (!date) return false;

    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!regex.test(date)) return false;

    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getFullYear() === year && dateObj.getMonth() + 1 === month && dateObj.getDate() === day;
};
