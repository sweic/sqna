import React from "react";
import { SidebarContainer, SidebarItems } from "./Styles";
import SidebarItem from "./SidebarItem";
interface SidebarProps {
  children: React.ReactNode;
  expanded: boolean;
}
function Sidebar({ children, expanded }: SidebarProps) {
  return (
    <SidebarContainer expanded={expanded}>
      <SidebarItems>{children}</SidebarItems>
    </SidebarContainer>
  );
}

Sidebar.Item = SidebarItem;
export default Sidebar;
