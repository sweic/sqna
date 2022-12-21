import { Button, Title } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { AppbarContainer } from "./Styles";
interface UserAppbarProps {
  user: string;
}
function UserAppbar({ user }: UserAppbarProps) {
  const router = useRouter();
  return (
    <AppbarContainer>
      <Flex align="center" justify="between" style={{ width: "100%" }}>
        <Title
          order={2}
          onClick={() => router.push("/admin")}
          style={{ cursor: "pointer" }}
        >
          sQnA
        </Title>
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
      </Flex>
    </AppbarContainer>
  );
}

export default UserAppbar;
