import styled from "styled-components";
import { color } from "styles/constants";

export const UserRoomsContainer = styled.div`
  padding-top: 1.5em;
  padding-left: min(3em, 4vw);
  padding-right: min(3em, 4vw);
  overflow-y: auto;
`;

export const RoomInfoContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  gap: 1.5em;
  margin-top: 1em;
  @media (max-width: 800px) {
    justify-content: center;
  }
`;

export const RoomInfo = styled.div`
  padding: 1em 0.5em 1em 0.5em;
  flex-basis: 300px;
  height: 280px;
  border: 2px gray solid;
  border-radius: 8px;
  background-color: ${color.secondary};
`;

export const ActiveRoomInfo = styled(RoomInfo)``;

export const CreateRoomContainer = styled.div`
  width: 100%;
`;
