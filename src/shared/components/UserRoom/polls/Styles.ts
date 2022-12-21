import styled from "styled-components";

export const UserPollsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const UserPollsView = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 1em;
`;

export const UserActivePollContainer = styled.div`
  background: rgb(0, 0, 0, 0.05);
  outline: 1px rgb(0, 0, 0, 0.2) solid;
  width: 100%;
  padding: 0.8em 0.5em;
  padding-bottom: 1.5em;
`;

export const ActivePollChoice = styled.div`
  display: flex;

  border-radius: 1em;
  border: 1px rgb(0, 0, 0, 0.2) solid;
  padding: 0.8em 0.5em;
`;
