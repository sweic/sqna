import { Button, ThemeIcon, Text, Divider } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { useRouter } from "next/router";
import React from "react";
import { CalendarStats, ChartBar, ZoomQuestion } from "tabler-icons-react";
import { UserData } from "../../types/data";
import { RoomInfo as RoomInfoBox } from "./Styles";
function RoomInfo({
  room,
  isActive,
}: {
  room: UserData["rooms"][0];
  isActive?: boolean;
}) {
  const router = useRouter();
  const qlen = room.questions.length;
  const plen = room.polls.length;
  const vlen = room.polls.reduce(
    (p, v) => p + v.choices.reduce((a, c) => a + c.votes, 0),
    0
  );
  return (
    <RoomInfoBox>
      <Flex direction="column" gap={20}>
        <Flex gap={16}>
          <ThemeIcon color="primary">
            <CalendarStats />
          </ThemeIcon>
          <Text>{room.title}</Text>
        </Flex>
        <Divider />
        <Flex gap={16}>
          <ZoomQuestion />
          <Text fz="sm">
            {qlen} {qlen != 1 ? "questions" : "question"}
          </Text>
        </Flex>
        <Flex gap={16}>
          <ChartBar />
          <Text fz="sm">
            {plen} {plen != 1 ? "polls" : "poll"}
          </Text>
        </Flex>
        <Flex gap={16}>
          <ChartBar />
          <Text fz="sm">
            {vlen} {vlen != 1 ? "votes" : "vote"}
          </Text>
        </Flex>
        <Button onClick={() => router.push(`/admin/room/${room.id}`)}>
          Visit Room
        </Button>
      </Flex>
    </RoomInfoBox>
  );
}
export default RoomInfo;
