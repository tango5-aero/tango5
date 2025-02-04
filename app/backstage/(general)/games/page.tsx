import { UserGamesTable } from '~/components/usergame/usergames-table';

export default async function App() {
    return (
        <main className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div>
                <h3>Games by User</h3>
                <UserGamesTable adminAccess={true} />
            </div>
        </main>
    );
}
