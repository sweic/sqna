import styled from "styled-components";
import { color } from "styles/constants";
interface SidebarContainerProps {
  expanded: boolean;
}
interface SidebarItemProps {
  hovered: boolean;
}
export const SidebarContainer = styled.div<SidebarContainerProps>`
  border-right: 1px gray solid;
  height: calc(100vh - 64px);
  overflow-y: auto;
  padding-top: 1em;
  min-width: 280px;
  background-color: ${color.bg};
  z-index: 999;
  @media (max-width: 800px) {
    position: absolute;
    width: ${(props) => (props.expanded ? "280px" : "0px")} !important;
    transform: translateX(-100%);
    transform: ${(props) =>
      props.expanded ? "translateX(0%)" : "translateX(-100%)"};
    transition: 350ms ease-out;
  }
`;

export const SidebarItems = styled.div`
  display: block;
  height: 100%;
`;
export const SidebarItem = styled.div<SidebarItemProps>`
  width: 100%;
  height: 64px;
  display: flex;
  gap: 1em;
  cursor: pointer;
  padding-left: 1em;
  align-items: center;
  &:hover {
    background-color: ${color.highlight};
    color: white;
  }
  ${(props) =>
    props.hovered && `background-color: ${color.highlight}; color: white`}
`;
