import { Spoiler, Button, Text } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import React from "react";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import { ThumbUp } from "tabler-icons-react";
import { QuestionContainer } from "./Styles";
import superjson from "superjson";
import { useLocalStorage } from "@mantine/hooks";
import LoadingPage from "shared/components/Loading/LoadingPage";

function UserRoomQuestionsView() {
  const { questions } = useRoomStore();
  const [liked, setLiked] = useLocalStorage<Set<string>>({
    key: "liked",
    defaultValue: new Set(),
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? new Set() : superjson.parse(str),
  });
  const { mutate: likeQuestion, isLoading: _likeLoading } =
    trpc.proxy.question.likeQuestion.useMutation({
      onMutate: (id) => {
        setLiked(liked.add(id.toString()));
      },
    });
  const { mutate: unlikeQuestion, isLoading: _unlikeLoading } =
    trpc.proxy.question.unlikeQuestion.useMutation({
      onMutate: (id) => {
        liked.delete(id.toString());
        setLiked(new Set(liked));
      },
    });

  const isLoading = _likeLoading || _unlikeLoading;
  if (!liked) return <LoadingPage />;
  return (
    <Flex direction="column" gap={32}>
      {questions.map((question) => (
        <Spoiler
          key={question.id}
          showLabel="Reveal Answer"
          hideLabel="Hide Answer"
          maxHeight={68}
          styles={{
            control: { alignSelf: "end" },
            root: {
              display: "flex",
              width: "100%",
              flexDirection: "column",
            },
          }}
        >
          <QuestionContainer>
            <Flex direction="column" gap={24}>
              <Flex justify="between" align="center">
                <Text>Q: {question.query}</Text>
                <Button
                  leftIcon={<ThumbUp />}
                  variant={
                    liked.has(question.id.toString()) ? "filled" : "default"
                  }
                  color="green"
                  onClick={() => {
                    if (isLoading) return;
                    liked.has(question.id.toString())
                      ? unlikeQuestion(question.id)
                      : likeQuestion(question.id);
                  }}
                >
                  {question.votes}
                </Button>
              </Flex>
              {question.answer && (
                <Text style={{ overflowWrap: "anywhere" }}>
                  A: {question.answer}
                </Text>
              )}
            </Flex>
          </QuestionContainer>
        </Spoiler>
      ))}
    </Flex>
  );
}

export default React.memo(UserRoomQuestionsView);
