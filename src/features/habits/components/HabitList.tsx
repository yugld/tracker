import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import HabitCard from './HabitCard';
import HabitDialog from '@/features/habits/components/HabitDialog';
import { useListHabitsQuery } from '@/features/habits/habitsApi';
import { AnimatePresence, motion } from 'framer-motion';
import { getCategoryLabel } from '@/constants/categoryOptions';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';

export default function HabitList() {
  const { data: habits = [], isLoading } = useListHabitsQuery();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const selectedDate = useAppSelector(
    (state: RootState) => state.date.selectedDate,
  );

  const categories = useMemo(
    () => [
      'Все',
      ...Array.from(new Set(habits.map((h) => h.category).filter(Boolean))),
    ],
    [habits],
  );

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const visibleHabits = useMemo(() => {
    return habits
      .filter(
        (h) => selectedCategory === 'Все' || h.category === selectedCategory,
      )
      .filter((h) => h.title.toLowerCase().includes(search.toLowerCase()));
  }, [habits, selectedCategory, search]);

  const isToday = selectedDate === today;
  const isPast = selectedDate < today;

  const habitsToDo = isToday
    ? visibleHabits.filter((h) => !h.doneDates?.includes(selectedDate))
    : !isPast
      ? visibleHabits.filter((h) => !h.doneDates?.includes(selectedDate))
      : [];

  const habitsDone =
    isPast || isToday
      ? visibleHabits.filter(
          (h) => h.doneDates?.includes(selectedDate) && !h.archived,
        )
      : [];

  const archivedHabits = useMemo(() => {
    return habits
      .filter((h) => h.archived)
      .filter(
        (h) => selectedCategory === 'Все' || h.category === selectedCategory,
      )
      .filter((h) => h.title.toLowerCase().includes(search.toLowerCase()));
  }, [habits, selectedCategory, search]);

  if (isLoading) {
    return (
      <p className="text-center text-sm text-muted-foreground">Загрузка...</p>
    );
  }

  const renderArchivedHabits = archivedHabits.map((habit) => (
    <HabitCard key={habit.id} habit={habit} today={today} />
  ));

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Input
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <HabitDialog trigger={null} />
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          {categories
            .filter((cat): cat is string => !!cat)
            .map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {getCategoryLabel(cat)}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>

      <AnimatePresence>
        <motion.div layout className="space-y-4">
          {habitsToDo.length === 0 &&
            habitsDone.length === 0 &&
            archivedHabits.length === 0 && (
              <p className="text-center text-muted-foreground">Нет найдено</p>
            )}
          {habitsToDo.length > 0 && (
            <>
              {habitsToDo.map((habit) => (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <HabitCard habit={habit} today={today} />
                </motion.div>
              ))}
            </>
          )}

          {habitsDone.length > 0 && (
            <>
              <h2 className="text-lg font-semibold">Выполненные</h2>
              {habitsDone.map((habit) => (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <HabitCard habit={habit} today={today} />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {archivedHabits.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="text-lg font-semibold">Архив</h2>
          {renderArchivedHabits}
        </div>
      )}
    </div>
  );
}
