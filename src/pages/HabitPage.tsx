import { useParams } from 'react-router-dom';
import { useListHabitsQuery } from '@/features/habits/habitsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function HabitPage() {
  const { id } = useParams<{ id: string }>();
  const { data: habits = [] } = useListHabitsQuery();

  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return <p className="p-4">Привычка не найдена</p>;
  }

  const { doneDates = [], completedDays = 0, targetDays = 0 } = habit;

  const progressData = [
    { name: 'Выполнено', value: completedDays },
    { name: 'Осталось', value: Math.max(0, targetDays - completedDays) },
  ];

  const COLORS = ['#22c55e', '#e5e7eb'];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">{habit.title}</h1>
      {habit.description && (
        <p className="text-muted-foreground">{habit.description}</p>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Прогресс</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
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
          </PieChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статистика</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Всего выполнено: <b>{completedDays}</b> дней
          </p>
          <p>
            Цель: <b>{targetDays}</b> дней
          </p>
          <p>
            Начало:{' '}
            {habit.doneDates?.length
              ? format(new Date(habit.doneDates[0]), 'dd MMMM yyyy', {
                  locale: ru,
                })
              : 'нет данных'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
