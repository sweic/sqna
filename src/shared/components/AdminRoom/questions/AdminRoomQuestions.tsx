import { ActionIcon, Text, TextInput, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Question } from "@prisma/client";
import { Flex } from "@sweic/scomponents";
import { useState } from "react";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import superjson from "superjson";
import { Pinned, PinnedOff, PlayerPlay } from "tabler-icons-react";
import { AdminRoomContent } from "../Styles";
import QuestionsView from "./QuestionsView";
import {
  PinnedQuestionBox,
  PinnedQuestionContainer,
  PinnedQuestionContent,
  PinnedQuestionControl,
  ResponsiveQuestionContainer,
} from "./Styles";
interface AdminRoomQuestionsProps {
  questions: Question[];
}
function AdminRoomQuestions() {
  const { setRoom, questions, pinnedQuestion } = useRoomStore((state) => state);
  const [pinnedCache, setPinnedCache] = useLocalStorage<Set<string>>({
    key: "pinned",
    defaultValue: new Set(),
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? new Set() : superjson.parse(str),
  });

  const [pinnedAnswer, setPinnedAnswer] = useState("");

  const nextRoom = questions.find(
    (question) => !question.pinned && !pinnedCache.has(question.id.toString())
  );

  const { mutate: answerQuestion } =
    trpc.proxy.question.answerQuestion.useMutation({
      onSuccess: (room) => {
        setRoom(room.room);
      },
    });

  const { mutate: pinQuestion } = trpc.proxy.question.pinQuestion.useMutation({
    onSuccess: (room, { toPin }) => {
      setPinnedCache(pinnedCache.add(toPin.toString()));
    },
  });

  const { mutate: unpinQuestion } =
    trpc.proxy.question.unpinQuestion.useMutation({});

  return (
    <AdminRoomContent>
      <ResponsiveQuestionContainer>
        <PinnedQuestionContainer>
          <PinnedQuestionBox>
            <Title order={2}>
              <Pinned style={{ paddingTop: "2px" }} /> Pinned
            </Title>
            <PinnedQuestionContent>
              {pinnedQuestion ? (
                <Flex direction="column" gap={24}>
                  <Text style={{ overflowWrap: "anywhere" }}>
                    Q: {pinnedQuestion.query}
                  </Text>
                  <Text style={{ overflowWrap: "anywhere" }}>
                    A: {pinnedQuestion.answer}
                  </Text>
                </Flex>
              ) : (
                <Text>No question pinned</Text>
              )}
            </PinnedQuestionContent>
            <PinnedQuestionControl>
              {pinnedQuestion && (
                <Flex justify="between" align="center">
                  <form
                    style={{ flexGrow: "1", marginRight: ".5em" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      answerQuestion({
                        questionid: pinnedQuestion.id,
                        answer: pinnedAnswer,
                      });
                      setPinnedAnswer("");
                    }}
                  >
                    <TextInput
                      placeholder={
                        pinnedQuestion.answer
                          ? "Change answer"
                          : "Answer this question!"
                      }
                      value={pinnedAnswer}
                      onChange={(e) => setPinnedAnswer(e.currentTarget.value)}
                    />
                  </form>
                  <Flex>
                    <ActionIcon>
                      <PlayerPlay
                        onClick={() =>
                          nextRoom
                            ? pinQuestion({
                                toPin: nextRoom?.id,
                                toUnpin: pinnedQuestion.id,
                              })
                            : unpinQuestion(pinnedQuestion.id)
                        }
                      />
                    </ActionIcon>
                    <ActionIcon>
                      <PinnedOff
                        onClick={() => unpinQuestion(pinnedQuestion.id)}
                      />
                    </ActionIcon>
                  </Flex>
                </Flex>
              )}
            </PinnedQuestionControl>
          </PinnedQuestionBox>
        </PinnedQuestionContainer>
        <QuestionsView />
      </ResponsiveQuestionContainer>
    </AdminRoomContent>
  );
}

export default AdminRoomQuestions;
