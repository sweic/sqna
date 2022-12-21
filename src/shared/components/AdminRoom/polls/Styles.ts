import styled from "styled-components";
import { color } from "styles/constants";

export const ResponsivePollsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1em;
  gap: 2em;

  @media (max-width: 800px) {
    display: block;
    flex-direction: column;
    gap: 1.5em;
    align-items: center;
    justify-content: center;
    width: 100%:
  }
`;

export const PollsBox = styled.div`
  width: 100%;
  max-width: 500px;
  display: block;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  max-height: 80vh;
  gap: 1em;
  margin: 0 auto;

  @media (max-width: 800px) {
  }
`;

export const PollContainer = styled.div`
  width: 100%;
  border: 1px #404040 solid;
  border-radius: 4px;
  background-color: ${color.secondary};
  padding: 1em;
  margin-top: 1em;
`;

export const ActivePollContainer = styled.div`
  display: flex;
  background-color: ${color.secondary};
  border-radius: 8px;
  border: 1px gray solid;
  width: 100%;
  min-height: 600px;
  @media (max-width: 800px) {
    margin-bottom: 1.5em;
  }
`;

export const ActivePollBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: min(1.2em, 3vw);
  width: 100%;
  gap: 1em;
  height: 100%;
`;

export const ActivePollContent = styled.div`
  padding: 1.5em 0.5em 1.5em 0.5em;
  display: block;
  justify-content: center;
  width: 100%;
  gap: 2em;
  flex-grow: 1;
  height: 460px;
  min-height: 0;
  overflow-y: auto !important;
`;

export const PinnedQuestionControl = styled.div`
  padding-top: 1em;
  padding-bottom: 1em;
  width: 100%;
  height: 100%;
  max-height: 54px;
`;
