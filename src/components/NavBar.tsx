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
    <div className="flex items-center justify-between border-b p-3">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/">Главная</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/edit/habit">+ Привычка</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/edit/mood">+ Настроение</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm">
            {user.displayName ? user.displayName : user.email}
          </span>
        )}
        {user && (
          <Button variant="outline" onClick={() => dispatch(logout())}>
            Выйти
          </Button>
        )}
      </div>
    </div>
  );
}
