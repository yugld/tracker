import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useToggleHabitDoneMutation } from '@/features/habits/habitsApi';
import { Habit } from '@/lib/types';
import { toastError } from '@/lib/toastError';
import { getCategoryLabel } from '@/constants/categoryOptions';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Badge } from '@/components/ui/badge';

import HabitDropDown from './HabitDropDown';

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const selectedDate = useAppSelector(
    (state: RootState) => state.date.selectedDate,
  );
  const [toggleDone] = useToggleHabitDoneMutation();

  const isDone = habit.doneDates?.includes(selectedDate);

  const handleToggle = async () => {
    try {
      await toggleDone({ id: habit.id, date: selectedDate }).unwrap;
    } catch (e: unknown) {
      toastError(e, 'Ошибка обновления');
    }
  };

  return (
    <Card className={isDone ? 'border-accent opacity-70' : ''}>
      <CardHeader className="mt-2 flex w-full flex-row justify-end gap-2 p-2 pr-3">
        {habit.category && (
          <Badge variant="outline" className="bg-accent">
            {getCategoryLabel(habit.category)}
          </Badge>
        )}
        <HabitDropDown habit={habit} />
      </CardHeader>

      <CardContent className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Checkbox
            className="h-10 w-10"
            checked={isDone}
            onCheckedChange={() => handleToggle()}
          ></Checkbox>
          <CardTitle>
            <Link to={`/habit/${habit.id}`}>{habit.title}</Link>
          </CardTitle>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Progress value={(habit.completedDays / habit.targetDays) * 100} />
      </CardFooter>
    </Card>
  );
}
