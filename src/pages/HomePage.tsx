import HabitSideBar from '@/features/habits/components/HabitSideBar/HabitSideBar';
import HabitList from '@/features/habits/components/HabitList';

export default function HomePage() {
  return (
    <div className="container mx-auto space-y-2">
      <div className="relative flex w-full flex-row gap-0">
        <div className="flex-grow">
          <HabitList />
        </div>

        <HabitSideBar />
      </div>
    </div>
  );
}
