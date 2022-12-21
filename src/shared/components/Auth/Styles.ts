import styled from "styled-components";

export const AuthFormContainer = styled.div`
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;

  @media (max-height: 480px) {
    display: block !important;
  }
`;
