import { ActionIcon, Progress, Text, Title } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import { PlayerStop } from "tabler-icons-react";
import { AdminRoomContent } from "../Styles";
import PollsView from "./PollsView";
import {
  ActivePollBox,
  ActivePollContainer,
  ActivePollContent,
  ResponsivePollsContainer,
} from "./Styles";

function AdminRoomPolls() {
  const { activePoll } = useRoomStore();
  const totalVotes = activePoll
    ? activePoll.choices.reduce((p, c) => p + c.votes, 0)
    : 0;

  const { mutate: endPoll } = trpc.proxy.poll.endPoll.useMutation();
  return (
    <AdminRoomContent>
      <ResponsivePollsContainer>
        <ActivePollContainer>
          <ActivePollBox>
            <Flex direction="row" justify="between" align="center">
              <Flex align="center" gap={16}>
                <Title>Live</Title>
                {activePoll && (
                  <ActionIcon onClick={() => endPoll(activePoll.id)}>
                    <PlayerStop />
                  </ActionIcon>
                )}
              </Flex>
              {activePoll && <Text>{totalVotes} total votes</Text>}
            </Flex>
            <Title style={{ paddingLeft: "0.5em" }} order={3}>
              {activePoll?.query}
            </Title>
            <ActivePollContent>
              {activePoll ? (
                <>
                  {activePoll.choices.map((choice) => {
                    const percent =
                      totalVotes > 0 ? (choice.votes / totalVotes) * 100 : 0;
                    return (
                      <Flex
                        direction="column"
                        gap={6}
                        key={choice.id}
                        style={{ marginBottom: "2em" }}
                      >
                        <Text>{choice.title}</Text>
                        <Progress
                          value={percent}
                          size={22}
                          label={`${percent.toFixed(0)}%`}
                        />
                      </Flex>
                    );
                  })}
                </>
              ) : (
                <Flex
                  style={{ width: "100%", height: "100%" }}
                  justify="center"
                  align="center"
                >
                  <Text>No live poll currently.</Text>
                </Flex>
              )}
            </ActivePollContent>
          </ActivePollBox>
        </ActivePollContainer>
        <PollsView />
      </ResponsivePollsContainer>
    </AdminRoomContent>
  );
}

export default AdminRoomPolls;
