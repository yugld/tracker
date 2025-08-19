import { useParams, Link } from 'react-router-dom';
import { useListHabitsQuery } from '@/features/habits/habitsApi';

export default function HabitPage() {
  const { id } = useParams();
  const { data: habits = [] } = useListHabitsQuery();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return <div className="container">Привычка не найдена</div>;
  }

  return (
    <div className="container">
      <h1>{habit.title}</h1>
      <p>{habit.description}</p>
      <Link to={`/edit/habit/${habit.id}`}>Редактировать</Link>
    </div>
  );
}
