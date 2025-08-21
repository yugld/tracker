import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Calendar } from '@/components/ui/calendar';
import { dateToString, stringToDate } from '@/lib/dateConverting';
import { setSelectedDate } from '@/features/date/dateSlice';

function CalendarForMainPage() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(
    (state: RootState) => state.date.selectedDate,
  );

  function handleOnChangeDate(date: Date | undefined) {
    if (!date) {
      return;
    }

    dispatch(setSelectedDate(dateToString(date)));
  }

  return (
    <div className="mx-4 flex w-full flex-col items-center">
      <Calendar
        mode="single"
        className="w-full"
        onSelect={handleOnChangeDate}
        selected={stringToDate(selectedDate)}
        required
      />
    </div>
  );
}

export default CalendarForMainPage;
