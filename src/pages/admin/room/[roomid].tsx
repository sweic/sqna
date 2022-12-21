import { useMediaQuery } from "@mantine/hooks";
import { Flex } from "@sweic/scomponents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { RoomObject } from "server/controllers/room";
import Appbar from "shared/components/AdminRoom/appbar/AdminAppbar";
import AdminRoomPolls from "shared/components/AdminRoom/polls/AdminRoomPolls";
import AdminRoomQuestions from "shared/components/AdminRoom/questions/AdminRoomQuestions";
import AdminSidebar from "shared/components/AdminRoom/sidebar/AdminSidebar";
import UserLayout from "shared/components/Layout/UserLayout";
import LoadingPage from "shared/components/Loading/LoadingPage";
import { useAuthStore, useRoomStore } from "shared/state/store";
import { trpc } from "shared/utils/trpc";

interface AdminRoomProps {
  id?: number;
  _room?: RoomObject;
}

function AdminRoom() {
  const router = useRouter();
  const { roomid } = router.query;

  return (
    <UserLayout title="Room">
      {() => <RoomWrapper roomid={parseInt(roomid as string)} />}
    </UserLayout>
  );
}

export default AdminRoom;

const RoomWrapper = ({ roomid }: { roomid: number }) => {
  const { setRoom, meta, setPinnedQuestion, setActivePoll } = useRoomStore(
    (state) => state
  );
  const router = useRouter();
  const { user } = useAuthStore();
  const { refetch } = trpc.proxy.room.fetchRoom.useQuery(
    { id: roomid, username: user },
    {
      onError: (error) => {
        router.replace("/");
        console.log(error);
      },
      onSuccess: (data) => {
        setRoom(data.room);
        setPinnedQuestion(data.pinnedQuestion);
        setActivePoll(data.activePoll);
      },
    }
  );
  const fetchDataAsync = async () => {
    await refetch();
  };
  const mobile = useMediaQuery("(max-width: 800px)");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [mode, setMode] = useState<"questions" | "polls">("questions");
  trpc.useSubscription(["room.updateRoom", roomid], {
    next: (data) => {
      setRoom(data.room);
      setPinnedQuestion(data.pinnedQuestion);
      setActivePoll(data.activePoll);
      console.log(data.pinnedQuestion);
    },
  });
  if (!meta) return <LoadingPage />;

  return (
    <UserLayout title={`sQnA / Admin - ${meta.title}`}>
      {() => (
        <Flex direction="column" style={{ width: "100%", overflowY: "hidden" }}>
          <Appbar
            expanded={expanded}
            setExpanded={setExpanded}
            mobile={mobile}
            setMode={setMode}
          />
          <Flex style={{ overflowY: "auto", width: "100%", height: "100%" }}>
            {mobile && (
              <AdminSidebar
                mode={mode}
                setMode={setMode}
                expanded={mobile ? expanded : true}
                setExpanded={setExpanded}
              />
            )}
            {mode === "questions" ? <AdminRoomQuestions /> : <AdminRoomPolls />}
          </Flex>
        </Flex>
      )}
    </UserLayout>
  );
};
