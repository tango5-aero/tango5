import Link from 'next/link';
import { LogOutIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { PropsWithoutRef } from 'react';
import { cn } from '~/lib/utils';

type GameExitButtonProps = {
    href: string;
    className?: string;
};

export const GameExitButton = (props: PropsWithoutRef<GameExitButtonProps>) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <Link href={props.href}>
                    <TooltipTrigger asChild>
                        <LogOutIcon className={cn(props.className)} />
                    </TooltipTrigger>
                </Link>
                <TooltipContent className="bg-gray-700/60" side="bottom" sideOffset={10} align="center">
                    <span className="text-sm text-white">{'Leave game'}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
