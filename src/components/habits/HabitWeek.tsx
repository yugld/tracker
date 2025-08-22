import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { setSelectedDate } from '@/features/date/dateSlice';
import { dateToString, stringToDate } from '@/lib/dateConverting';

function HabitWeek() {
  const dispatch = useAppDispatch();
  const selectedDateStr = useAppSelector(
    (state: RootState) => state.date.selectedDate,
  );
  const selectedDate = stringToDate(selectedDateStr);

  function handleOnChangeDate(date: Date | undefined) {
    if (!date) {
      return;
    }

    dispatch(setSelectedDate(dateToString(date)));
  }

  const today = new Date();
  const currentDayIndex = today.getDay();
  const startOfPeriod = new Date(today);

  startOfPeriod.setDate(today.getDate() - currentDayIndex);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(startOfPeriod);

    date.setDate(startOfPeriod.getDate() + i);

    return date;
  });

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
    };

    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="mb-4 flex flex-row justify-center overflow-x-hidden rounded-lg border bg-white py-2">
      {dates.map((date, index) => {
        const isSelected =
          selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === today.toDateString();

        return (
          <div
            key={index}
            className={`group flex w-full cursor-pointer justify-center rounded-full transition-all duration-300 ${
              isSelected
                ? 'bg-primary shadow-lg'
                : isToday
                  ? 'bg-accent'
                  : 'bg-white'
            }`}
            role="button"
            tabIndex={0}
            onClick={() => handleOnChangeDate(date)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOnChangeDate(date);
              }
            }}
          >
            <div className="flex items-center">
              <div className="text-center">
                <p className="p-2 text-gray-900 transition-all duration-300 group-hover:font-bold group-hover:text-gray-100">
                  {formatDate(date).split(' ')[1]}{' '}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HabitWeek;
