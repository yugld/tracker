import { motion } from 'framer-motion';
import HabitCard from './HabitCard';
import { Habit } from '@/lib/types';

interface AnimatedHabitCardProps {
  habit: Habit;
  today: string;
}

export default function AnimatedHabitCard({
  habit,
  today,
}: AnimatedHabitCardProps) {
  return (
    <motion.div
      layout
      key={habit.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <HabitCard habit={habit} today={today} />
    </motion.div>
  );
}
