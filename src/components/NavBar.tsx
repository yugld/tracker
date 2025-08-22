import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  return (
    <div className="sticky top-2 z-50 flex items-center justify-between rounded-lg border bg-white px-4 py-2 pl-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/">Главная</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm">
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
