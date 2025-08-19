import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { useState } from 'react';
import HabitDialog from '@/features/habits/HabitDialog';
import {
  useListHabitsQuery,
  useDeleteHabitMutation,
  useToggleHabitDoneMutation,
} from '@/features/habits/habitsApi';
import { Link } from 'react-router-dom';

export default function HabitList() {
  const { data: habits = [], isLoading } = useListHabitsQuery();
  const [deleteHabit] = useDeleteHabitMutation();
  const [toggleDone] = useToggleHabitDoneMutation();
  const [editingId, setEditingId] = useState<string | undefined>();

  if (isLoading) {
    return (
      <p className="text-center text-sm text-muted-foreground">Загрузка...</p>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const handleDelete = async (id: string) => {
    try {
      await deleteHabit(id).unwrap();
      toast.success('Привычка удалена');
    } catch (e: any) {
      toast.error(e?.message ?? 'Ошибка удаления привычки');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleDone({ id, date: today }).unwrap();
    } catch (e: any) {
      toast.error(e?.message ?? 'Ошибка обновления');
    }
  };

  return (
    <div className="space-y-4">
      {habits.length === 0 && (
        <p className="text-center text-muted-foreground">
          Нет привычек. Добавь первую!
        </p>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Мои привычки</h1>
        <HabitDialog trigger={null} />
      </div>
      {habits.map((habit) => {
        const isDoneToday = habit.doneDates?.includes(today);

        return (
          <Card
            key={habit.id}
            className={isDoneToday ? 'border-green-500' : ''}
          >
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
                  checked={isDoneToday}
                  onCheckedChange={() => handleToggle(habit.id)}
                />
                <span>Выполнено сегодня</span>
              </div>

              <Progress
                value={(habit.completedDays / habit.targetDays) * 100}
              />
              <p className="text-sm text-muted-foreground">
                Прогресс: {habit.completedDays}/{habit.targetDays} дней
              </p>
              {habit.category && (
                <p className="text-xs text-muted-foreground">
                  Категория: {habit.category}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <HabitDialog
                habitId={habit.id}
                trigger={<Button variant="outline">Редактировать</Button>}
                onDone={() => setEditingId(undefined)}
              />
              <Button
                variant="destructive"
                onClick={() => handleDelete(habit.id)}
              >
                Удалить
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
