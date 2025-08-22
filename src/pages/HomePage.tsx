import HabitSideBar from '@/features/habits/components/HabitSideBar/HabitSideBar';
import HabitList from '@/features/habits/components/HabitList';

export default function HomePage() {
  return (
    <div className="flex w-full flex-row gap-0">
      <div className="flex-grow">
        <HabitList />
      </div>

      <HabitSideBar />
    </div>
  );
}
