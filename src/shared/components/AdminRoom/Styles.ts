import styled from "styled-components";
import { color } from "styles/constants";

export const AdminRoomContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 1.5em;
  padding-left: 1.5em;
  padding-right: 1.5em;
  overflow-y: auto !important;
  padding-bottom: 1.5em;
`;

export const CreatePollContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: ${color.bg};
`;

export const CreatePollForm = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  width: 100%;
  min-height: 0;
  margin: 0 auto;
  padding-top: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 1.5em;
`;

export const CreatePollOptions = styled.div`
  display: flex;
  min-height: 54px;
  outline: 1px rgb(0, 0, 0, 0.2) solid;
`;

export const CreatePollInput = styled.div`
  display: flex;
  gap: 0.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  align-items: center;
`;

export const PollViewControl = styled.div`
  display: flex;
  gap: 1em;
  align-items: center;

  padding: 1em;
  min-height: 36px;
`;

export const PollChoice = styled.div`
  display: block;
`;
