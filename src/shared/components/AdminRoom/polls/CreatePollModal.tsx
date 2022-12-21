import {
  ActionIcon,
  Button,
  NumberInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Flex, Modal } from "@sweic/scomponents";
import { useState } from "react";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import { Plus, Trash } from "tabler-icons-react";
import {
  CreatePollContainer,
  CreatePollForm,
  CreatePollInput,
  CreatePollOptions,
} from "../Styles";

const CreatePollModal = () => {
  const { meta, setPolls, polls } = useRoomStore((state) => state);
  const [opened, setOpened] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [selections, setSelections] = useState<number>(1);
  const [choices, setChoices] = useState<string[]>(["", ""]);
  const { mutate } = trpc.proxy.poll.createPoll.useMutation({
    onSuccess: (poll) => {
      setOpened(false);
      setPolls([...polls, poll]);
    },
  });
  return (
    <>
      <Flex>
        <ActionIcon
          style={{ alignSelf: "end" }}
          onClick={() => setOpened(true)}
        >
          <Plus />
        </ActionIcon>
      </Flex>
      <Modal
        width={600}
        isOpen={opened}
        closeOnEscapePress
        closeOnOutsideClick
        styles={{ body: { padding: "0" } }}
        onClose={() => {
          setOpened(false);
          setTitle("");
        }}
      >
        <CreatePollContainer>
          <Title style={{ padding: "0.5em" }} order={2}>
            Create Poll
          </Title>
          <CreatePollForm>
            <CreatePollInput>
              <TextInput
                value={title}
                label="Poll Title"
                style={{ flex: "1 1 100%" }}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </CreatePollInput>
            <Flex style={{ marginTop: "1em" }} gap={16}>
              <Text>Choices: </Text>
              <ActionIcon
                variant="filled"
                onClick={() => setChoices([...choices, ""])}
              >
                <Plus />
              </ActionIcon>
            </Flex>
            {choices.map((val, idx) => {
              return (
                <CreatePollInput key={idx}>
                  <TextInput
                    style={{ flex: "1 1 100%" }}
                    placeholder={`Choice ${idx + 1}`}
                    onChange={(e) => {
                      const curr = choices;
                      curr[idx] = e.currentTarget.value;
                      setChoices([...curr]);
                    }}
                  />
                  <ActionIcon
                    variant="filled"
                    onClick={() => {
                      if (choices.length <= 2) return;
                      const curr = choices;
                      curr.splice(idx, 1);
                      setChoices([...curr]);
                      setSelections(selections > 1 ? selections - 1 : 1);
                    }}
                  >
                    <Trash size={18} />
                  </ActionIcon>
                </CreatePollInput>
              );
            })}
            <NumberInput
              defaultValue={1}
              value={selections}
              onChange={(val) => setSelections(val!)}
              min={1}
              max={choices.length > 1 ? choices.length - 1 : 1}
              style={{ marginTop: "2em" }}
              label="Number of Selections"
            />
          </CreatePollForm>
          <CreatePollOptions>
            <Flex
              justify="end"
              align="center"
              style={{ width: "100%", paddingRight: "2em" }}
              gap={24}
            >
              <Button
                onClick={() => {
                  const newChoices = choices.filter((choice) => choice !== "");
                  mutate({
                    roomid: meta!.id,
                    selections,
                    title,
                    choices: newChoices,
                  });
                }}
              >
                Create
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpened(false);
                  setTitle("");
                }}
              >
                Cancel
              </Button>
            </Flex>
          </CreatePollOptions>
        </CreatePollContainer>
      </Modal>
    </>
  );
};

export default CreatePollModal;
