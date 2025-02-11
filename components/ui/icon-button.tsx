import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { PropsWithChildren } from 'react';

type IconButtonProps = {
    href: string;
    hoverText: string;
};

export const IconButton = (props: PropsWithChildren<IconButtonProps>) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <Link href={props.href}>
                    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                </Link>
                <TooltipContent className="bg-gray-700/60" side="bottom" sideOffset={10} align="center">
                    <span className="text-sm text-white">{props.hoverText}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
