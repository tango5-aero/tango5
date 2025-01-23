'use client';

import {
    CalendarBody,
    CalendarDate,
    CalendarDatePagination,
    CalendarDatePicker,
    CalendarHeader,
    CalendarItem,
    CalendarMonthPicker,
    CalendarProvider
} from '@/components/ui/kibo-ui/calendar';

export function Calendar() {
    return (
        <CalendarProvider>
            <CalendarDate>
                <CalendarDatePicker>
                    <CalendarMonthPicker />
                </CalendarDatePicker>
                <CalendarDatePagination />
            </CalendarDate>
            <CalendarHeader />
            <CalendarBody features={[]}>
                {({ feature }) => <CalendarItem key={feature.id} feature={feature} />}
            </CalendarBody>
        </CalendarProvider>
    );
}

export default Calendar;
