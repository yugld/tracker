import { Outlet, useNavigation } from 'react-router-dom';

import Footer from './Footer';
import NavBar from './navbar/NavBar';
import { Loading } from './Loading';

export const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex-grow">
        <NavBar />

        {isLoading && <Loading />}

        <main className="py-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
