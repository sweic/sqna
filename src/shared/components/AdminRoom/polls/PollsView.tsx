import { ActionIcon, Text } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { useState } from "react";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import { PlayerPlay } from "tabler-icons-react";
import { PollViewControl } from "../Styles";
import CreatePollModal from "./CreatePollModal";
import { PollContainer, PollsBox } from "./Styles";

const PollsView = () => {
  const { polls } = useRoomStore();
  const { mutate: startPoll, isLoading: startLoading } =
    trpc.proxy.poll.startPoll.useMutation({});
  const { mutate: endPoll, isLoading: endLoading } =
    trpc.proxy.poll.endPoll.useMutation({});
  const { mutate: startAndEndPoll, isLoading: startAndEndLoading } =
    trpc.proxy.poll.startAndEndPoll.useMutation({});
  const isLoading = startLoading || endLoading || startAndEndLoading;
  const _activePoll = polls.find((poll) => poll.active);
  const [opened, setOpened] = useState(false);
  return (
    <PollsBox>
      <CreatePollModal />
      <Flex direction="column" gap={24}>
        {polls.map((poll) => {
          if (poll.active) return;
          const totalVotes = poll.choices.reduce((p, c) => p + c.votes, 0);
          return (
            <PollContainer>
              <Flex direction="column" key={poll.id} gap={32}>
                <Text align="start">{poll.query}</Text>
                <Flex justify="between">
                  <Text>
                    {poll.choices.length} choices, {totalVotes} votes
                  </Text>
                  <PollViewControl>
                    {_activePoll ? (
                      <ActionIcon
                        radius="lg"
                        loading={isLoading}
                        onClick={async () =>
                          startAndEndPoll({
                            end: _activePoll.id,
                            start: poll.id,
                          })
                        }
                      >
                        <PlayerPlay />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        variant="filled"
                        radius="lg"
                        loading={isLoading}
                        onClick={() =>
                          poll.active ? endPoll(poll.id) : startPoll(poll.id)
                        }
                      >
                        <PlayerPlay />
                      </ActionIcon>
                    )}
                  </PollViewControl>
                </Flex>
              </Flex>
            </PollContainer>
          );
        })}
      </Flex>
    </PollsBox>
  );
};

export default PollsView;
