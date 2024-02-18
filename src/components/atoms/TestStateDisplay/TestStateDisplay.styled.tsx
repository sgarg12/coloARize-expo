import { View } from "react-native";
import styled, { css } from "styled-components";
import { AppText } from "../AppText/AppText";

export const Container = styled(View)`
  ${({ theme }) => css`
    border-bottom-width: 1px;
    border-bottom-color: red;
    padding-bottom: 5px;
    margin: 10px 0px;
  `}
`;

export const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

export const Label = styled(AppText)`
  flex: 1;
  margin-right: 12px;
`;
