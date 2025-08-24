import { Link } from 'react-router-dom';

export const Logo = () => (
  <Link
    to="/"
    className="flex flex-row items-center justify-center gap-2 font-bold"
  >
    <img src="/public/Logo.svg" alt="logo" className="h-8" /> Habit
  </Link>
);
