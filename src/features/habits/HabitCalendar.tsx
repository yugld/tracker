import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';

import { startOfMonth } from 'date-fns';

interface HabitCalendarProps {
  habitCreatedAt: Date | string;
  completionDatesISO: string[];
  onSelectDay: (date: Date | undefined) => void;
}

export function HabitCalendar({
  habitCreatedAt,
  completionDatesISO,
  onSelectDay,
}: HabitCalendarProps) {
  const createdAtDate = useMemo(
    () => new Date(habitCreatedAt),
    [habitCreatedAt],
  );
  const startMonth = useMemo(
    () => startOfMonth(createdAtDate),
    [createdAtDate],
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(startMonth);

  return (
    <Calendar
      mode="multiple"
      defaultMonth={startMonth}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      showOutsideDays
      fixedWeeks
      onSelect={(dates) => {
        const last = dates?.[dates.length - 1];

        onSelectDay(last);
      }}
      selected={completionDatesISO.map((d) => new Date(d))}
      disabled={{ after: new Date() }}
    />
  );
}
