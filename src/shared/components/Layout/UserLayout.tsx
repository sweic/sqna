import { Button } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthStore, useDataStore } from "shared/state/store";
import { UserData } from "../../types/data";
import { trpc } from "../../utils/trpc";
import LoadingPage from "../Loading/LoadingPage";

function UserLayout({
  children,
  title,
}: {
  children: (data: UserData) => React.ReactNode;
  title: string;
}) {
  const { data: session, status } = useSession();
  const { user, loginUser } = useAuthStore();
  const { setRooms, rooms } = useDataStore();
  const { data: userData, refetch } = trpc.proxy.data.fetchAll.useQuery(
    session?.username!,
    {
      onError: (error) => {
        router.replace("/");
        console.log(error);
      },
      onSuccess: (data) => {
        setRooms(data);
      },
      enabled: false,
      retry: false,
    }
  );

  const fetchDataAsync = async () => {
    await refetch();
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      signOut({ callbackUrl: "/" });
      return;
    }
    if (session?.error!) {
      signOut({ callbackUrl: "/error" });
      return;
    }
    loginUser(session?.username!);
    fetchDataAsync();
  }, [session]);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {userData && session ? (
        children({ ...userData, user: session.username })
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

export default UserLayout;
