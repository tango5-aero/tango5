'use client';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from '~/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { ChevronRight, Moon, Palette, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeSetting() {
    const { setTheme } = useTheme();

    return (
        <SidebarMenu>
            <Collapsible asChild className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={'theme'}>
                            <Palette />
                            <span>{'Theme'}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                    <button type="button" onClick={() => setTheme('light')}>
                                        <Sun />
                                        <span>{'Light'}</span>
                                    </button>
                                </SidebarMenuSubButton>
                                <SidebarMenuSubButton asChild>
                                    <button type="button" onClick={() => setTheme('dark')}>
                                        <Moon />
                                        <span>{'Dark'}</span>
                                    </button>
                                </SidebarMenuSubButton>
                                <SidebarMenuSubButton asChild>
                                    <button type="button" onClick={() => setTheme('system')}>
                                        <SunMoon />
                                        <span>{'System'}</span>
                                    </button>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        </SidebarMenu>
    );
}
