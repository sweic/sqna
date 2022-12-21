import React from "react";
import Sidebar from "shared/components/Sidebar/Sidebar";
interface AdminRoomSidebarProps {
  mode: "questions" | "polls";
  setMode: React.Dispatch<React.SetStateAction<"questions" | "polls">>;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

function AdminSidebar({
  mode,
  setMode,
  expanded,
  setExpanded,
}: AdminRoomSidebarProps) {
  return (
    <Sidebar expanded={expanded}>
      <Sidebar.Item
        hovered={mode === "questions"}
        onClick={() => {
          setMode("questions");
          setExpanded(false);
        }}
      >
        Questions
      </Sidebar.Item>
      <Sidebar.Item
        hovered={mode === "polls"}
        onClick={() => {
          setMode("polls");
          setExpanded(false);
        }}
      >
        Polls
      </Sidebar.Item>
    </Sidebar>
  );
}

export default AdminSidebar;
