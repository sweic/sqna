import React from "react";
import { SidebarItem as Item } from "./Styles";
interface SidebarItemProps {
  children: React.ReactNode;
  hovered: boolean;
  onClick: () => void;
}
function SidebarItem({ children, hovered, onClick }: SidebarItemProps) {
  return (
    <Item hovered={hovered} onClick={onClick}>
      {children}
    </Item>
  );
}

export default SidebarItem;
