import { useMediaQuery } from "@mantine/hooks";
import { Flex } from "@sweic/scomponents";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sortRoom } from "server/utils/sortRoom";
import Layout from "shared/components/Layout/Layout";
import LoadingPage from "shared/components/Loading/LoadingPage";
import UserRoomAppbar from "shared/components/UserRoom/appbar/UserRoomAppbar";
import UserRoomPolls from "shared/components/UserRoom/polls/UserRoomPolls";
import UserRoomQuestions from "shared/components/UserRoom/questions/UserRoomQuestions";
import UserSidebar from "shared/components/UserRoom/sidebar/UserSidebar";
import { useRoomStore } from "shared/state/store";
import { RoomData } from "shared/types/data";
import { nextRedirect } from "shared/utils/redirect";
import { trpc } from "shared/utils/trpc";
import { prisma } from "../../server/db/client";

interface UserRoomProps {
  _room?: RoomData;
}

function UserRoom({ _room }: UserRoomProps) {
  const { setRoom } = useRoomStore((state) => state);
  useEffect(() => {
    if (!_room) return;
    _room.questions.sort(() => -1);
    setRoom(_room);
  }, [_room]);
  if (!_room) return <LoadingPage />;

  return <RoomWrapper roomid={_room.id} />;
}

export default UserRoom;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { code } = query;
  const roomCode = parseInt(code as string);
  const _cRoom = await prisma.room.findFirst({
    where: {
      code: roomCode,
    },
    include: {
      polls: {
        include: {
          choices: true,
        },
      },
      questions: true,
    },
  });
  if (!_cRoom) return nextRedirect({ to: "/", res });
  const _room = sortRoom(_cRoom);

  const props: UserRoomProps = JSON.parse(
    JSON.stringify({
      _room: _room.room,
    })
  );
  return {
    props,
  };
};

const RoomWrapper = ({ roomid }: { roomid: number }) => {
  const { meta, setRoom, setPinnedQuestion, setActivePoll } = useRoomStore(
    (state) => state
  );
  const router = useRouter();
  const mobile = useMediaQuery("(max-width: 800px)");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [mode, setMode] = useState<"questions" | "polls">("questions");
  trpc.useSubscription(["room.updateRoom", roomid], {
    next: (data) => {
      if (!data.room.code) router.replace("/end");
      data.room.questions.sort(() => -1);
      setRoom(data.room);
      setPinnedQuestion(data.pinnedQuestion);
      setActivePoll(data.activePoll);
    },
  });
  if (!meta) {
    return <LoadingPage />;
  }
  return (
    <Layout title={`sQnA / Room - ${meta.title}`}>
      <Flex direction="column" style={{ width: "100%", overflowY: "hidden" }}>
        {/* // appbar placeholder */}
        <UserRoomAppbar
          expanded={expanded}
          setExpanded={setExpanded}
          mobile={mobile}
        />

        <Flex style={{ overflowY: "auto", width: "100%", height: "100%" }}>
          <UserSidebar
            mode={mode}
            setMode={setMode}
            expanded={expanded}
            setExpanded={setExpanded}
          />
          {mode === "questions" ? <UserRoomQuestions /> : <UserRoomPolls />}
        </Flex>
      </Flex>
    </Layout>
  );
};
