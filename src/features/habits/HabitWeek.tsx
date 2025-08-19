import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface HabitCalendarProps {
  habits: any[];
}

export default function HabitWeek({ habits }: HabitCalendarProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const isAllDone = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];

    return habits.every((h) => !h.archived && h.doneDates?.includes(dateStr));
  };

  return (
    <div className="mb-4 flex justify-between">
      {days.map((day) => {
        const done = isAllDone(day);
        const isToday = day.toDateString() === today.toDateString();

        return (
          <div key={day.toISOString()} className="flex flex-col items-center">
            <span className="text-xs">{format(day, 'EEE')}</span>
            <span
              className={`h-6 w-6 rounded-full transition-all duration-300 ${done ? 'bg-green-700' : 'bg-gray-300'} ${isToday ? 'ring-2 ring-blue-900' : ''} `}
            />
            <span className="text-xs">{format(day, 'd')}</span>
          </div>
        );
      })}
    </div>
  );
}
