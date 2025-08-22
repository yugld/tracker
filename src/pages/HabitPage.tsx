import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteHabitMutation,
  useListHabitsQuery,
} from '@/features/habits/habitsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { format, differenceInCalendarDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import BackLink from '@/components/BackLink';
import HabitDialog from '@/components/habits/HabitDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toastError } from '@/lib/toastError';

type DaysOfWeek = 'Пн' | 'Вт' | 'Ср' | 'Чт' | 'Пт' | 'Сб' | 'Вс';

export default function HabitPage() {
  const { id } = useParams<{ id: string }>();
  const { data: habits = [] } = useListHabitsQuery();
  const [deleteHabit] = useDeleteHabitMutation();
  const navigate = useNavigate();

  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return <p className="p-4">Привычка не найдена</p>;
  }

  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id).unwrap();
      toast.success('Привычка удалена');
      navigate('/');
    } catch (e: unknown) {
      toastError(e, 'Ошибка удаления привычки');
    }
  };

  const { doneDates = [], createdAt, targetDays = 0 } = habit;

  const sortedDates = [...doneDates].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  let maxStreak = 0;
  let currentStreak = 0;
  let previousDate = null;

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);

    if (previousDate) {
      const diffDays = differenceInCalendarDays(date, previousDate);

      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }

    previousDate = date;
  }

  const creationDate = createdAt ? new Date(createdAt) : null;

  const progressData = [
    { name: 'Выполнено', value: doneDates.length },
    { name: 'Осталось', value: Math.max(0, targetDays - doneDates.length) },
  ];

  const remainingDays = Math.max(0, targetDays - doneDates.length);
  const daysOfWeekCount: Record<DaysOfWeek, number> = {
    Пн: 0,
    Вт: 0,
    Ср: 0,
    Чт: 0,
    Пт: 0,
    Сб: 0,
    Вс: 0,
  };

  doneDates.forEach((dateStr) => {
    const day = format(new Date(dateStr), 'EEE', {
      locale: ru,
    }) as keyof typeof daysOfWeekCount;

    if (Object.prototype.hasOwnProperty.call(daysOfWeekCount, day)) {
      daysOfWeekCount[day]++;
    }
  });

  const COLORS = [
    '#eedafc',
    '#d0f0ff',
    '#f0f8d0',
    '#d1d7fc',
    '#e0f0ff',
    '#ffe0f4',
    '#d0f0e0',
  ];

  const cards = [
    {
      title: 'Дни на неделе с привычкой',
      content: (
        <div>
          {doneDates
            .slice(-7)
            .reverse()
            .map((dateStr) => (
              <p key={dateStr} className="mb-1">
                {format(new Date(dateStr), 'dd MMM yyyy', { locale: ru })}
              </p>
            ))}
        </div>
      ),
    },
    {
      title: 'Streak',
      content: <p className="text-3xl font-bold">{maxStreak}</p>,
    },
    {
      title: 'Осталось',
      content: <p className="text-3xl font-bold">{remainingDays}</p>,
    },
    {
      title: 'Выполнено',
      content: <p className="text-3xl font-bold">{doneDates.length}</p>,
    },
    {
      title: 'Прогресс за месяц',
      content: (
        <p className="text-3xl font-bold">
          {Math.round((doneDates.length / targetDays) * 100)}%
        </p>
      ),
    },
    {
      title: 'Дата создания',
      content: (
        <p className="text-xl font-bold">
          {creationDate && format(creationDate, 'dd MMMM yyyy', { locale: ru })}
        </p>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <BackLink />

      <div className="flex flex-wrap gap-4">
        <Card
          className="flex flex-col items-center justify-center bg-accent p-4 text-center transition-transform hover:scale-105"
          style={{ flex: '1 1 auto' }}
        >
          <CardHeader>
            <CardTitle className="text-2xl">{habit.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {habit.description && (
              <p className="text-muted-foreground">{habit.description}</p>
            )}
          </CardContent>

          <div className="mt-4 flex w-full flex-col justify-end gap-2">
            <HabitDialog
              habitId={habit.id}
              trigger={<Button variant="default">Редактировать</Button>}
            />
            <Button variant="outline" onClick={handleDelete}>
              Удалить
            </Button>
          </div>
        </Card>

        <Card
          className="flex flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105"
          style={{ flex: '1 1 auto' }}
        >
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={250} height={250}>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {progressData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                align="center"
                formatter={(value) => (
                  <span className="text-black">{value} </span>
                )}
              />
            </PieChart>
          </CardContent>
        </Card>
        {cards.map((card, id) => (
          <Card
            key={id}
            className="flex flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105"
            style={{
              backgroundColor: COLORS[id % COLORS.length],
              flex: '1 1 auto',
            }}
          >
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>{card.content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
