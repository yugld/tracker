import type { PropsWithChildren } from 'react';

export const Layout = ({ children, ...rest }: PropsWithChildren) => {
  return (
    <main
      className="grid min-h-screen min-w-[100vw] place-items-center bg-[#282c34] text-[calc(5px+2vmin)] text-[white]"
      {...rest}
    >
      <div className="flex min-h-screen min-w-[90%] max-w-[90%] flex-col gap-[20px]">
        {children}
      </div>
    </main>
  );
};
