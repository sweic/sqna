import React from "react";
import Sidebar from "shared/components/Sidebar/Sidebar";

interface UserSidebarProps {
  mode: "questions" | "polls";
  setMode: React.Dispatch<React.SetStateAction<"questions" | "polls">>;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
function UserSidebar({
  mode,
  setMode,
  expanded,
  setExpanded,
}: UserSidebarProps) {
  return (
    <Sidebar expanded={expanded}>
      <Sidebar.Item
        onClick={() => {
          setMode("questions");
          setExpanded(false);
        }}
        hovered={mode === "questions"}
      >
        Questions
      </Sidebar.Item>
      <Sidebar.Item
        onClick={() => {
          setMode("polls");
          setExpanded(false);
        }}
        hovered={mode === "polls"}
      >
        Polls
      </Sidebar.Item>
    </Sidebar>
  );
}

export default UserSidebar;
