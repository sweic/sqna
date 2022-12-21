import { Button, TextInput, Title, Divider, Modal } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthStore } from "shared/state/store";
import { UserData } from "../../types/data";
import { trpc } from "../../utils/trpc";
import RoomInfo from "./RoomInfo";
import {
  CreateRoomContainer,
  RoomInfoContainer,
  UserRoomsContainer,
} from "./Styles";

function UserRooms({ rooms }: { rooms: UserData["rooms"] }) {
  const activeRoom = rooms.filter((room) => room.code !== null);
  return (
    <UserRoomsContainer>
      <Flex direction="column" gap={16}>
        <Flex gap={24} align="center">
          <Title>All Rooms {`(${rooms.length})`}</Title>
          <CreateRoomModal />
        </Flex>
        <Divider />
        <RoomInfoContainer>
          {activeRoom.map((room) => (
            <RoomInfo room={room} isActive key={room.id} />
          ))}
          {rooms.map((room) => {
            return <RoomInfo key={room.id} room={room} />;
          })}
        </RoomInfoContainer>
      </Flex>
    </UserRoomsContainer>
  );
}
export default UserRooms;

const CreateRoomModal = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [newRoomName, setNewRoomName] = useState<string>("");
  const { mutate: createRoom } = trpc.proxy.data.createRoom.useMutation({
    onSuccess: (s) => {
      router.push(`/admin/room/${s.id}`);
    },
  });
  console.log("user" + user);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Create</Button>
      <Modal
        opened={opened}
        withCloseButton
        closeOnClickOutside
        closeOnEscape
        centered
        title="Create Room"
        onClose={() => setNewRoomName("")}
      >
        <CreateRoomContainer>
          <Flex direction="column" gap={16}>
            <TextInput
              placeholder="Room Name"
              onChange={(e) => setNewRoomName(e.currentTarget.value)}
            />
            <Button onClick={() => createRoom({ title: newRoomName, user })}>
              Create
            </Button>
          </Flex>
        </CreateRoomContainer>
      </Modal>
    </>
  );
};
