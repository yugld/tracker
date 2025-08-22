import HabitSideBar from '@/components/habits/HabitSideBar/HabitSideBar';
import HabitList from '@/components/habits/HabitList';

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
