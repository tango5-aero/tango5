'use client';

import Image from 'next/image';
import { PropsWithoutRef, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '~/lib/utils';

type BoxInfoProps = {
    title: string;
    subTitle: string;
    description: string;
    image: string;
};

export const BoxInfo = (props: PropsWithoutRef<BoxInfoProps>) => {
    const [showDescription, setShowDescription] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    return (
        <div
            className="max-h-fit max-w-[420px] flex-1 cursor-pointer rounded-3xl bg-translucent p-4 hover:brightness-125"
            onClick={toggleDescription}>
            <div className="flex items-center gap-4">
                <Image
                    src={props.image}
                    alt={props.title}
                    className="h-14 w-14 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24"
                    width="64"
                    height="64"
                />
                <div>
                    <div className="font-barlow text-lg font-bold text-background dark:text-foreground xl:text-xl 2xl:text-2xl">
                        {props.title}
                    </div>
                    <div className="text-md text-balance font-barlow font-light text-background dark:text-foreground xl:text-xl 2xl:text-2xl">
                        {props.subTitle}
                    </div>
                </div>
            </div>
            <ChevronDown
                className={cn(
                    'accordion-icon mx-auto size-6 transition-transform duration-300 ease-in-out',
                    showDescription ? 'rotate-180 transform' : undefined
                )}
            />
            <div
                ref={contentRef}
                className={cn(
                    'mt-5 text-pretty font-barlow font-light leading-6 text-background dark:text-foreground xl:text-lg xl:leading-7',
                    'transition-max-height overflow-hidden duration-300 ease-in-out',
                    showDescription ? 'max-h-screen' : 'max-h-0'
                )}
                style={{
                    maxHeight: showDescription ? contentRef.current?.scrollHeight : 0,
                    marginTop: showDescription ? undefined : 0
                }}
                dangerouslySetInnerHTML={{ __html: props.description }}></div>
        </div>
    );
};
