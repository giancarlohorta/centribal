import styled from "@emotion/styled";
import { Paper } from "@mui/material";

export const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 20px auto;
`;

export const FormContainer = styled(Paper)`
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 15px;
`;
export const ArticleContainer = styled(Paper)`
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 10px;
`;
