import {
  ActionIcon,
  Badge,
  Modal,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Question } from "@prisma/client";
import { Flex } from "@sweic/scomponents";
import React, { useEffect, useMemo, useState } from "react";
import {
  InfiniteLoader as _InfiniteLoader,
  InfiniteLoaderProps,
  List as _List,
  ListProps,
} from "react-virtualized";
import LoadingPage from "shared/components/Loading/LoadingPage";
import { useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";
import superjson from "superjson";
import { Pin, Send, ThumbUp, Trash } from "tabler-icons-react";
import { QuestionContainer, QuestionsBox } from "./Styles";

function QuestionsView() {
  const [responsiveWidth, setResponsiveWidth] = useState<number>(500);
  const List = _List as unknown as React.FC<ListProps>;
  const InfiniteLoader =
    _InfiniteLoader as unknown as React.FC<InfiniteLoaderProps>;
  const [mode, setMode] = useState<"recent" | "pinned">("recent");
  const [forceUpdate, setForceUpdate] = useState(0);
  const [opened, setOpened] = useState(false);
  const { questions, pinnedQuestion } = useRoomStore();
  const [currentAnswer, setCurrentAnswer] = useState<{
    id: number;
    answer: string;
  }>({ id: 0, answer: "" });
  const [pinnedCache, setPinnedCache] = useLocalStorage<Set<string>>({
    key: "pinned",
    defaultValue: new Set(),
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? new Set() : superjson.parse(str),
  });
  const { mutate: deleteQuestion } =
    trpc.proxy.question.deleteQuestion.useMutation({
      onSuccess: (room) => {},
    });
  const { mutate: pinQuestion } = trpc.proxy.question.pinQuestion.useMutation({
    onSuccess: (room, { toPin }) => {
      setPinnedCache(pinnedCache.add(toPin.toString()));
      setForceUpdate(forceUpdate + 1);
    },
  });

  useEffect(() => {
    setForceUpdate(forceUpdate + 1);
  }, []);

  const { mutate: answerQuestion } =
    trpc.proxy.question.answerQuestion.useMutation({
      onSuccess: (room) => {
        setForceUpdate(forceUpdate + 1);
      },
    });

  const pinn = useMemo(
    () =>
      questions.filter((question) => pinnedCache.has(question.id.toString())),
    [questions, forceUpdate]
  );

  const unpinn = useMemo(
    () =>
      questions
        .filter((question) => !pinnedCache.has(question.id.toString()))
        .sort((a, b) => -1),
    [questions, forceUpdate]
  );

  const isRowLoaded = ({ index }: { index: any }) => {
    if (mode === "pinned") return !!pinn[index];
    else return !!unpinn[index];
  };

  const loadMoreRows: (ada: any) => any = ({ startIndex }: any) => {
    return;
  };

  const getHeight = ({ index }: any) => {
    const question = mode === "pinned" ? pinn[index] : unpinn[index];
    if (!question) return 125;
    const qnlen = question.query.length / 40 + 1;
    const anslen = question.answer ? question.answer.length / 40 : 1;
    return qnlen * 20 + 125 + anslen * 20;
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 600) setResponsiveWidth(window.innerWidth - 90);
      else if (window.innerWidth <= 800) setResponsiveWidth(400);
      else if (window.innerWidth <= 1150)
        setResponsiveWidth(window.innerWidth / 2 - 80);
      else setResponsiveWidth(500);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const renderItem = useMemo(
    () =>
      (questions: Question[]) =>
      ({ index, key, style, parent }: any) => {
        const question = questions[index];

        return (
          <QuestionContainer key={key} style={style}>
            <Flex direction="column" gap={16}>
              <Flex justify="end" align="center" style={{ width: "100%" }}>
                <Flex gap={16} align="center">
                  <Badge
                    size="lg"
                    leftSection={<ThumbUp style={{ paddingTop: ".5em" }} />}
                  >
                    {question.votes}
                  </Badge>
                  <ActionIcon>
                    <Pin
                      onClick={() =>
                        pinQuestion({
                          toPin: question.id,
                          toUnpin: pinnedQuestion?.id,
                        })
                      }
                    />
                  </ActionIcon>
                  <ActionIcon onClick={() => deleteQuestion(question.id)}>
                    <Trash />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() =>
                      setCurrentAnswer({ id: question.id, answer: "" })
                    }
                  >
                    <Send />
                  </ActionIcon>
                </Flex>
              </Flex>
              <Text style={{ overflowWrap: "anywhere" }}>
                Q: {question.query}
              </Text>
              {question.answer && (
                <Text style={{ overflowWrap: "anywhere" }}>
                  A: {question.answer}
                </Text>
              )}
            </Flex>
          </QuestionContainer>
        );
      },
    [forceUpdate, questions]
  );
  return (
    <QuestionsBox>
      <Modal
        opened={currentAnswer.id != 0}
        withCloseButton
        closeOnClickOutside
        closeOnEscape
        onClose={() => setCurrentAnswer({ id: 0, answer: "" })}
        centered
        title="Answer question"
      >
        <Flex direction="column" gap={24}>
          <Text>
            Q:{" "}
            {
              questions.find((question) => question.id == currentAnswer.id)
                ?.query
            }
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              answerQuestion({
                questionid: currentAnswer.id,
                answer: currentAnswer.answer,
              });
              setCurrentAnswer({
                id: 0,
                answer: "",
              });
            }}
          >
            <TextInput
              rightSection={
                <ActionIcon type="submit">
                  <Send />
                </ActionIcon>
              }
              rightSectionWidth={50}
              placeholder="Answer"
              value={currentAnswer.answer}
              onChange={(e) =>
                setCurrentAnswer({
                  ...currentAnswer,
                  answer: e.currentTarget.value,
                })
              }
            />
          </form>
        </Flex>
      </Modal>
      <Title order={3}>Questions</Title>
      <Tabs
        orientation="horizontal"
        style={{ display: "flex", marginTop: ".6em" }}
      >
        <Tabs.Tab
          value="recent"
          onClick={() => {
            setMode("recent");
          }}
        >
          Recent
        </Tabs.Tab>
        <Tabs.Tab
          value="pinned"
          onClick={() => {
            setMode("pinned");
          }}
        >
          Previously pinned
        </Tabs.Tab>
      </Tabs>

      {forceUpdate > 0 ? (
        <InfiniteLoader
          rowCount={10000}
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              ref={registerChild}
              onRowsRendered={onRowsRendered}
              rowCount={mode === "pinned" ? pinn.length : unpinn.length}
              rowHeight={(index) => getHeight(index)}
              rowRenderer={renderItem(mode === "pinned" ? pinn : unpinn)}
              width={responsiveWidth}
              height={525}
              data={[...questions]}
              pinned={pinnedCache}
              forceUpdate={forceUpdate}
            />
          )}
        </InfiniteLoader>
      ) : (
        <LoadingPage />
      )}
    </QuestionsBox>
  );
}

export default QuestionsView;
