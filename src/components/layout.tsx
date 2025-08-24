import type { PropsWithChildren } from 'react';

import Footer from './Footer';
import NavBar from './navbar/NavBar';

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
