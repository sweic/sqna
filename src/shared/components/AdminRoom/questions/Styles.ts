import styled from "styled-components";
import { color } from "styles/constants";

export const ResponsiveQuestionContainer = styled.div`
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

export const QuestionsBox = styled.div`
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

export const QuestionContainer = styled.div`
  width: 100%;
  border: 1px #404040 solid;
  border-radius: 4px;
  background-color: ${color.secondary};
  padding: 1em;
  margin-top: 1em;
`;

export const PinnedQuestionContainer = styled.div`
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

export const PinnedQuestionBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: min(1.2em, 3vw);
  width: 100%;
  gap: 1em;
  min-height: 100%;
`;

export const PinnedQuestionContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`;

export const PinnedQuestionControl = styled.div`
  padding-top: 1em;
  padding-bottom: 1em;
  width: 100%;
  height: 100%;
  max-height: 54px;
`;
