import Link from 'next/link';
import { LogOutIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { PropsWithoutRef } from 'react';

export const GameExitButton = (props: PropsWithoutRef<{ href: string }>) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <Link href={props.href}>
                    <TooltipTrigger asChild>
                        <LogOutIcon className="fixed right-16 top-5 z-10 cursor-pointer text-white" />
                    </TooltipTrigger>
                </Link>
                <TooltipContent side="bottom" sideOffset={10} align="center">
                    <span className="text-sm text-white">{'Leave game'}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
