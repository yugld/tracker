import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { NavigationSheet } from './NavigationSheet';
import { NavMenu } from './NavMenu';
import { logout } from '@/features/auth/authSlice';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  return (
    <>
      <nav
        data-testid="navbar"
        className="sticky top-6 z-50 mx-auto h-16 rounded-full border bg-background"
      >
        <div className="mx-auto flex h-full items-center justify-between px-4">
          <Logo />
          {user && <NavMenu className="hidden md:block" />}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden rounded-full sm:inline-flex">
                  {user.displayName ? user.displayName : user.email}
                </span>
                <Button
                  variant="outline"
                  className="hidden rounded-full sm:inline-flex"
                  onClick={() => dispatch(logout())}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <Link to="/auth" className="hidden rounded-full sm:inline-flex">
                <Button variant="outline">Войти</Button>
              </Link>
            )}

            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
