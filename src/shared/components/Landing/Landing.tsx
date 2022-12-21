import { Button, TextInput, Title } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { LandingContainer } from "./Styles";

function Landing() {
  const [code, setCode] = useState("");
  const router = useRouter();
  return (
    <LandingContainer>
      <Flex direction="column" gap={16}>
        <Title>Enter Room Code</Title>
        <TextInput
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
        />
        <Button onClick={() => router.push(`/room/${code}`)}>Submit</Button>
      </Flex>
    </LandingContainer>
  );
}

export default Landing;
