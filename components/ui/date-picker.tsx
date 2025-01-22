'use client';

import { Dispatch, PropsWithoutRef, SetStateAction } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { CalendarIcon } from 'lucide-react';

type DatePickerProps = {
    date: Date | undefined;
    onSelect: Dispatch<SetStateAction<Date | undefined>>;
};

export const DatePicker = ({ date, onSelect }: PropsWithoutRef<DatePickerProps>) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 size-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
            </PopoverContent>
        </Popover>
    );
};
