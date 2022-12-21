import { Button, Title } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { useRouter } from "next/router";
import { AppbarContainer } from "./Styles";

function Appbar() {
  const router = useRouter();
  return (
    <AppbarContainer>
      <Flex align="center" justify="between" style={{ width: "100%" }}>
        <Title order={2}>sQnA</Title>
        <Button
          variant="subtle"
          color="dark"
          onClick={() => router.push("/register")}
        >
          Create
        </Button>
      </Flex>
    </AppbarContainer>
  );
}

export default Appbar;
