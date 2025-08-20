import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import HabitCard from './HabitCard';
import HabitDialog from '@/features/habits/HabitDialog';
import { useListHabitsQuery } from '@/features/habits/habitsApi';
// import HabitWeek from './HabitWeek';
import { AnimatePresence, motion } from 'framer-motion';
import { getCategoryLabel } from '@/constants/categoryOptions';

export default function HabitList() {
  const { data: habits = [], isLoading } = useListHabitsQuery();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = useMemo(
    () => [
      'Все',
      ...Array.from(new Set(habits.map((h) => h.category).filter(Boolean))),
    ],
    [habits],
  );

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredHabits = useMemo(() => {
    return habits
      .filter(
        (h) => selectedCategory === 'Все' || h.category === selectedCategory,
      )
      .filter((h) => h.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const aDone = a.doneDates?.includes(today) ? 1 : 0;
        const bDone = b.doneDates?.includes(today) ? 1 : 0;

        return aDone - bDone;
      });
  }, [habits, selectedCategory, search, today]);

  const archivedHabits = useMemo(
    () => habits.filter((h) => h.archived),
    [habits],
  );

  if (isLoading) {
    return (
      <p className="text-center text-sm text-muted-foreground">Загрузка...</p>
    );
  }

  const renderActiveHabits = filteredHabits.map((habit) => (
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
  ));

  const renderArchivedHabits = archivedHabits.map((habit) => (
    <HabitCard key={habit.id} habit={habit} today={today} />
  ));

  return (
    <div className="space-y-4">
      {/* <HabitWeek habits={habits} /> */}

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
          {filteredHabits.length === 0 && (
            <p className="text-center text-muted-foreground">Нет привычек.</p>
          )}
          {renderActiveHabits}
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
