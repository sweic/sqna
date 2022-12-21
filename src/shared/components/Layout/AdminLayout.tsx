import { useMediaQuery } from "@mantine/hooks";
import { Flex } from "@sweic/scomponents";
import Head from "next/head";
import React from "react";
import { AppbarContainer } from "../Appbar/Styles";
interface AdminLayoutProps {
  children?: React.ReactNode;
  title: string;
}
function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
    </>
  );
}

export default AdminLayout;
