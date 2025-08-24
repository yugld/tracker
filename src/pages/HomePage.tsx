import HabitList from '@/components/habits/HabitList';
import HabitSideBar from '@/components/habits/HabitSideBar/HabitSideBar';

export default function HomePage() {
  return (
    <div className="flex w-full flex-row gap-0">
      <div className="max-w-[90vw] flex-grow">
        <HabitList />
      </div>

      <HabitSideBar />
    </div>
  );
}
