import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from '~/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import { Sidebar, SidebarContent, SidebarFooter } from '~/components/ui/sidebar';
import { SignedIn } from '@clerk/nextjs';
import { Database, Users, Gamepad2, Play, List, PocketKnife } from 'lucide-react';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navbar } from '~/components/ui/navbar';

export default async function DashBoardLayout({ children }: PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    return (
        <>
            <Navbar backstageAccess={true} />
            <SidebarProvider className="pt-[130px]">
                <Sidebar variant="inset" className="pt-[130px]">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>{'User'}</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip={'play'}>
                                        <Link href={'/app/play'}>
                                            <Play />
                                            <span>{'Play'}</span>
                                        </Link>
                                    </SidebarMenuButton>

                                    <SidebarMenuButton asChild tooltip={'scores'}>
                                        <Link href={'/app/scores'}>
                                            <Gamepad2 />
                                            <span>{'Scores'}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
