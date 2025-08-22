import { useListHabitsQuery } from '@/features/habits/habitsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { format, differenceInCalendarDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import BackLink from '@/components/BackLink';

type DaysOfWeek = 'Пн' | 'Вт' | 'Ср' | 'Чт' | 'Пт' | 'Сб' | 'Вс';

export default function DashboardPage() {
  const { data: habits = [] } = useListHabitsQuery();

  if (!habits.length) {
    return <p className="p-4">Привычки не найдены</p>;
  }

  let totalDone = 0;
  let totalTarget = 0;
  let globalMaxStreak = 0;
  const daysOfWeekCount: Record<DaysOfWeek, number> = {
    Пн: 0,
    Вт: 0,
    Ср: 0,
    Чт: 0,
    Пт: 0,
    Сб: 0,
    Вс: 0,
  };

  habits.forEach((habit) => {
    const { doneDates = [], targetDays = 0 } = habit;

    totalDone += doneDates.length;
    totalTarget += targetDays;

    const sortedDates = [...doneDates].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;

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

    if (maxStreak > globalMaxStreak) {
      globalMaxStreak = maxStreak;
    }

    doneDates.forEach((dateStr) => {
      const day = format(new Date(dateStr), 'EEE', {
        locale: ru,
      }) as DaysOfWeek;

      if (Object.prototype.hasOwnProperty.call(daysOfWeekCount, day)) {
        daysOfWeekCount[day]++;
      }
    });
  });

  const progressData = [
    { name: 'Выполнено', value: totalDone },
    { name: 'Осталось', value: Math.max(0, totalTarget - totalDone) },
  ];

  const COLORS = ['#eedafc', '#d0f0ff', '#f0f8d0', '#d1d7fc', '#ffe0f4'];

  const cards = [
    {
      title: 'Привычек',
      content: <p className="text-3xl font-bold">{habits.length}</p>,
    },
    {
      title: 'Общий прогресс',
      content: (
        <p className="text-3xl font-bold">
          {totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0}%
        </p>
      ),
    },
    {
      title: 'Streak',
      content: <p className="text-3xl font-bold">{globalMaxStreak}</p>,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <BackLink />

      <div className="flex flex-wrap gap-4">
        <Card
          className="flex flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105"
          style={{ flex: '1 1 auto' }}
        >
          <CardHeader>
            <CardTitle>Общая статистика по привычкам</CardTitle>
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
              <Legend verticalAlign="bottom" align="center" />
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
      <div className="mt-4 flex flex-wrap gap-4">
        {habits.map((habit) => (
          <Card
            key={habit.id}
            className="flex flex-col p-4 text-center transition-transform hover:scale-105"
            style={{ flex: '1 1 200px' }}
          >
            <CardHeader>
              <CardTitle>{habit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Цель на неделю: {habit.targetDays}</p>
              <p>Выполнено дней: {habit.doneDates.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
