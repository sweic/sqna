import { Flex } from "@sweic/scomponents";
import dynamic from "next/dynamic";
import { useState } from "react";
import UserAppbar from "../../shared/components/Appbar/UserAppbar";
import UserLayout from "../../shared/components/Layout/UserLayout";
import UserRooms from "../../shared/components/Rooms/UserRooms";
const LazyRoomsView = dynamic(() => Promise.resolve(UserRooms), { ssr: false });

function Dashboard() {
  return (
    <>
      <UserLayout title="sQnA - User">
        {(data) => (
          <Flex
            direction="column"
            style={{ width: "100%", overflowY: "hidden" }}
          >
            <UserAppbar user={data.user} />
            <LazyRoomsView rooms={data.rooms} />
          </Flex>
        )}
      </UserLayout>
    </>
  );
}

export default Dashboard;
