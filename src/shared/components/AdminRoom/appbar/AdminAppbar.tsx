import {
  Burger,
  Button,
  Divider,
  Popover,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import router from "next/router";
import React from "react";
import { AppbarContainer } from "shared/components/Appbar/Styles";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import { ArrowDown, Copy, ExternalLink } from "tabler-icons-react";

interface AppbarProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  mobile: boolean;
  setMode: React.Dispatch<React.SetStateAction<"questions" | "polls">>;
}
function Appbar({ expanded, setExpanded, mobile, setMode }: AppbarProps) {
  const { setRoom, meta } = useRoomStore((state) => state);
  if (!meta) return <></>;
  const { mutate: startActiveRoom } =
    trpc.proxy.data.startActiveRoom.useMutation({
      onSuccess: (room) => setRoom(room.room),
    });
  const { mutate: endActiveRoom } = trpc.proxy.data.endActiveRoom.useMutation({
    onSuccess: (room) => setRoom(room.room),
  });
  const url = `http://localhost:3000/room/${meta.code}`;
  return (
    <AppbarContainer>
      <Flex justify="between" align="center" style={{ width: "100%" }}>
        <Flex gap={16}>
          {mobile && (
            <Burger
              size={"sm"}
              opened={expanded}
              onClick={() => setExpanded(!expanded)}
            />
          )}
          {!mobile && (
            <Title
              order={2}
              onClick={() => router.push("/admin")}
              style={{ cursor: "pointer" }}
            >
              sQnA
            </Title>
          )}
        </Flex>

        <Tabs defaultValue={"questions"}>
          <Tabs.List>
            <Tabs.Tab value="questions" onClick={() => setMode("questions")}>
              <Title order={4}>Q&As</Title>
            </Tabs.Tab>
            <Tabs.Tab value="polls" onClick={() => setMode("polls")}>
              <Title order={4}>Polls</Title>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Popover width={260} shadow="md" zIndex={99999}>
          <Popover.Target>
            <Button
              style={{ textOverflow: "ellipsis" }}
              rightIcon={<ArrowDown />}
            >
              <Text
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                Room
              </Text>
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Flex direction="column" gap={12} style={{ zIndex: "99999" }}>
              <Flex style={{ width: "100%" }} justify="between">
                <Text>Room State</Text>
                <Text color="app" weight="bold">
                  {meta.code ? "ACTIVE" : "INACTIVE"}
                </Text>
              </Flex>
              <Flex style={{ width: "100%" }} justify="between">
                <Text>Room Code</Text>
                <Text color="app" weight="bold">
                  {meta.code ?? "-"}
                </Text>
              </Flex>
              <Divider />
              <Button
                leftIcon={<ExternalLink />}
                variant="default"
                onClick={() => window.open(url)}
                disabled={!meta.code}
              >
                Open participant app
              </Button>
              <Button
                leftIcon={<Copy />}
                variant="default"
                onClick={() => navigator.clipboard.writeText(url)}
                disabled={!meta.code}
              >
                Copy participant link
              </Button>
              <Button
                onClick={() =>
                  meta.code ? endActiveRoom(meta.id) : startActiveRoom(meta.id)
                }
              >
                {meta.code ? "END" : "START"}
              </Button>
            </Flex>
          </Popover.Dropdown>
        </Popover>
      </Flex>
    </AppbarContainer>
  );
}

export default Appbar;
