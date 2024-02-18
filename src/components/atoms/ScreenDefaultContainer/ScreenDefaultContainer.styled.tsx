import { SafeAreaView } from "react-native-safe-area-context";
import styled, { css } from "styled-components";

export const Container = styled(SafeAreaView)`
  ${({ theme }) => css`
    flex: 1;
    padding: 15px;
  `}
`;
