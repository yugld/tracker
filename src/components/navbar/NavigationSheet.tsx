import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

export const NavigationSheet = () => {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Logo />
        <NavMenu orientation="vertical" className="mt-12" />
        <SheetFooter className="space-y-6">
          {user ? (
            <>
              <Button variant="outline" onClick={() => dispatch(logout())}>
                Выйти
              </Button>
              <span className="pb-6">
                {user.displayName ? user.displayName : user.email}
              </span>
            </>
          ) : (
            <Link to="/auth" className="hidden rounded-full sm:inline-flex">
              <Button variant="outline">Войти</Button>
            </Link>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
