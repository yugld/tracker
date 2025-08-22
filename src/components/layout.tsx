import type { PropsWithChildren } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

export const Layout = ({ children, ...rest }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex-grow">
        <NavBar />
        <main className="py-6" {...rest}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
