import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">Страница не найдена</p>
      <Link to="/" className="rounded px-4 py-2 text-white transition">
        На главную
      </Link>
    </div>
  );
}
