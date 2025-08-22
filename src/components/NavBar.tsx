import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import {
  NavigationMenu,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  return (
    <div className="sticky top-2 z-50 flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-2 pl-6">
      <NavigationMenu>
        <div className="align-center flex justify-center gap-2">
          <NavigationMenuLink asChild>
            <Link to="/">Главная</Link>
          </NavigationMenuLink>

          <NavigationMenuLink asChild>
            <Link to="/dashboard">Статистика</Link>
          </NavigationMenuLink>
        </div>
      </NavigationMenu>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="xs:w-full xs:max-w-[100px] max-w-[50px] truncate sm:max-w-[350px]">
              {user.displayName ? user.displayName : user.email}
            </span>
            <Button variant="outline" onClick={() => dispatch(logout())}>
              Выйти
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="outline">Войти</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
