import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { LogOutIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640); // например, 640px для "маленьких" экранов

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <span className="xs:max-w-[100px] max-w-[10px] truncate sm:max-w-[350px]">
              {user.displayName ? user.displayName : user.email}
            </span>
            <Button variant="outline" onClick={() => dispatch(logout())}>
              {isMobile ? (
                <LogOutIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                'Выйти'
              )}
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
