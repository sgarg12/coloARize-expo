import { Text } from "react-native";
import styled, { css } from "styled-components";

export const StyledText = styled(Text)`
  ${({ theme }) => css`
    font-size: 16px;
    font-weight: 800;
  `}
`;
