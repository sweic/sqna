import Head from "next/head";
import React from "react";
interface LayoutProps {
  title: string;
  children?: React.ReactNode;
}
function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
}

export default Layout;
