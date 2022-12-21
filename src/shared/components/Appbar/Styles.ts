import styled from "styled-components";
import { color } from "../../../styles/constants";

export const AppbarContainer = styled.div`
  width: 100%;
  min-height: 72px;
  max-height: 72px;
  display: flex;
  align-items: center;
  padding-left: min(3em, 4vw);
  padding-right: min(3em, 4vw);
  background-color: ${color.bg};
`;
