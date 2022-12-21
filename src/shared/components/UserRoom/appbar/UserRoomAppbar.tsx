import { Box, Burger, Tabs } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import React from "react";
import { AppbarContainer } from "shared/components/Appbar/Styles";
import { RoomData } from "shared/types/data";
interface UserAppbarProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  mobile: boolean;
}
function UserAppbar({ expanded, setExpanded, mobile }: UserAppbarProps) {
  return (
    <AppbarContainer>
      <Flex style={{ width: "100%" }}>
        {mobile && (
          <Burger
            size={"sm"}
            opened={expanded}
            onClick={() => setExpanded(!expanded)}
          />
        )}
      </Flex>
    </AppbarContainer>
  );
}

export default UserAppbar;
