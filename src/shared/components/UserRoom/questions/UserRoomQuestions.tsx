import { TextInput } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import React, { useRef, useState } from "react";
import LoadingPage from "shared/components/Loading/LoadingPage";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import { Messages, Send } from "tabler-icons-react";
import { UserQuestionsContainer, UserQuestionsView } from "./Styles";
import UserRoomQuestionsView from "./UserRoomQuestionsView";

function UserRoomQuestions() {
  return (
    <UserQuestionsContainer>
      <UserQuestionsView>
        <AskQuestion />
      </UserQuestionsView>
    </UserQuestionsContainer>
  );
}

export default UserRoomQuestions;

const AskQuestion = () => {
  const ref = useRef<HTMLFormElement>(null);
  const { meta } = useRoomStore();
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const { mutate: createQuestion, isLoading: _createLoading } =
    trpc.proxy.question.createQuestion.useMutation({
      onMutate: () => {
        setCurrentQuestion("");
      },
    });

  const handleSubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      ref.current?.submit();
    }
  };
  if (!meta) return <LoadingPage />;
  return (
    <Flex direction="column" gap={24}>
      <form
        onKeyDown={handleSubmit}
        onSubmit={(e) => {
          e.preventDefault();
          if (!currentQuestion) return;
          createQuestion({ id: meta!.id, query: currentQuestion });
        }}
      >
        <TextInput
          label="Ask a question"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.currentTarget.value)}
          icon={<Messages />}
          styles={{
            label: { paddingBottom: "0.5em" },
            rightSection: { paddingRight: "1em" },
          }}
          size="md"
          disabled={_createLoading}
          rightSection={
            <Send
              style={{ cursor: "pointer" }}
              onClick={() => {
                createQuestion({
                  id: meta!.id,
                  query: currentQuestion,
                });
              }}
            />
          }
        />
      </form>
      <UserRoomQuestionsView />
    </Flex>
  );
};
