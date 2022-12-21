import { Button, Progress, Radio, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Flex } from "@sweic/scomponents";
import { useState } from "react";
import { useRoomStore } from "shared/state/store";
import { PollType } from "shared/types/data";
import { trpc } from "shared/utils/trpc";
import { Pin } from "tabler-icons-react";
import {
  ActivePollChoice,
  UserActivePollContainer,
  UserPollsContainer,
  UserPollsView,
} from "./Styles";
import superjson from "superjson";

function UserRoomPolls() {
  const { polls, meta } = useRoomStore();
  const _activePoll = polls.find((poll) => poll.active);

  return (
    <UserPollsContainer>
      <UserPollsView>
        <Flex direction="column" gap={16}>
          <UserActivePoll poll={_activePoll} roomid={meta!.id} />
        </Flex>
      </UserPollsView>
    </UserPollsContainer>
  );
}

export default UserRoomPolls;

// set activepoll as voted

const UserActivePoll = ({
  poll,
  roomid,
}: {
  poll?: PollType;
  roomid: number;
}) => {
  const [answered, setAnswered] = useLocalStorage<Set<string>>({
    key: "answered",
    defaultValue: new Set(),
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? new Set() : superjson.parse(str),
  });
  const totalVotes = poll?.choices.reduce((p, c) => p + c.votes, 0);
  const { setRoom } = useRoomStore((state) => state);
  const { mutate: votePoll } = trpc.proxy.poll.votePoll.useMutation({
    onSuccess: (room) => {
      setRoom(room.room);
      setAnswered(answered.add(poll!.id.toString()));
    },
  });
  const [checked, setChecked] = useState<number[]>([]);
  const onSelectionChange = (choiceid: number) => {
    if (checked.length === 1 && poll?.selections === 1) {
      setChecked([choiceid]);
      return;
    }
    if (checked.includes(choiceid)) {
      const tmp = checked;
      tmp.splice(tmp.indexOf(choiceid), 1);
      setChecked([...tmp]);
      return;
    }
    if (checked.length >= poll?.selections!) return;

    setChecked([...checked, choiceid]);
  };
  return (
    <UserActivePollContainer>
      <Flex direction="column" gap={18}>
        <Flex gap={16}>
          <Pin />
          <Text>{!poll ? "No active poll currently" : "Poll Open"}</Text>{" "}
        </Flex>
        {poll && (
          <Flex direction="column" gap={16}>
            <Text style={{ overflowWrap: "anywhere" }}>Q: {poll.query}</Text>
            <Flex direction="column" gap={16} style={{ paddingLeft: ".5em" }}>
              {poll.choices.map((choice) =>
                answered.has(poll.id.toString()) ? (
                  <Flex direction="column" gap={6} key={choice.id}>
                    <Text>{choice.title}</Text>
                    <Progress
                      value={(choice.votes / totalVotes!) * 100}
                      size="xl"
                    />
                  </Flex>
                ) : (
                  <ActivePollChoice key={choice.id}>
                    <Radio
                      value={choice.id.toString()}
                      label={choice.title}
                      checked={checked.includes(choice.id)}
                      onClick={() => onSelectionChange(choice.id)}
                      style={{
                        overflowWrap: "anywhere",
                      }}
                    />
                  </ActivePollChoice>
                )
              )}
            </Flex>
            {!answered.has(poll.id.toString()) ? (
              <Button
                onClick={() =>
                  votePoll({
                    choiceids: checked,
                    pollid: poll.id,
                    roomid: roomid,
                  })
                }
              >
                Submit
              </Button>
            ) : (
              <Text align="center">You have voted!</Text>
            )}
          </Flex>
        )}
      </Flex>
    </UserActivePollContainer>
  );
};
