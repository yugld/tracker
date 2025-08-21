import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import HabitDialog from '@/features/habits/components/HabitDialog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  useToggleHabitDoneMutation,
  useDeleteHabitMutation,
} from '@/features/habits/habitsApi';
import { Habit } from '@/lib/types';
import { toastError } from '@/lib/toastError';
import { getCategoryLabel } from '@/constants/categoryOptions';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';

interface HabitCardProps {
  habit: Habit;
  today: string;
}

export default function HabitCard({ habit, today }: HabitCardProps) {
  const selectedDate = useAppSelector(
    (state: RootState) => state.date.selectedDate,
  );
  const [toggleDone] = useToggleHabitDoneMutation();
  const [deleteHabit] = useDeleteHabitMutation();

  const isDone = habit.doneDates?.includes(selectedDate);

  const handleToggle = async (id: string) => {
    try {
      await toggleDone({ id: habit.id, date: selectedDate }).unwrap;
    } catch (e: unknown) {
      toastError(e, 'Ошибка обновления');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id).unwrap();
      toast.success('Привычка удалена');
    } catch (e: unknown) {
      toastError(e, 'Ошибка удаления привычки');
    }
  };

  return (
    <Card className={isDone ? 'border-green-500' : ''}>
      <CardHeader>
        <CardTitle>
          <Link to={`/habit/${habit.id}`}>{habit.title}</Link>
        </CardTitle>
        {habit.description && (
          <CardDescription>{habit.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isDone}
            onCheckedChange={() => handleToggle(habit.id)}
          />
          <span>Выполнено</span>
        </div>

        <Progress value={(habit.completedDays / habit.targetDays) * 100} />
        <p className="text-sm text-muted-foreground">
          Прогресс: {habit.completedDays}/{habit.targetDays} дней
        </p>
        {habit.category && (
          <p className="text-xs text-muted-foreground">
            Категория: {getCategoryLabel(habit.category)}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <HabitDialog
          habitId={habit.id}
          trigger={<Button variant="outline">Редактировать</Button>}
        />
        <Button variant="destructive" onClick={handleDelete}>
          Удалить
        </Button>
      </CardFooter>
    </Card>
  );
}
