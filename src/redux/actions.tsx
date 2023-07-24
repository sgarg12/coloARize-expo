import {
  ADD_DICHROMACY_CONFIGURATION,
  AddDichromacyConfigurationAction,
} from "./actionTypes";
import { Configuration, DichromacyType } from "./types";

export const addDichromacyConfiguration = (
  config: Configuration
): AddDichromacyConfigurationAction => ({
  type: "ADD_DICHROMACY_CONFIGURATION",
  payload: config,
});

export const editDichromacyConfiguration = (
  config: Configuration
): AddDichromacyConfigurationAction => ({
  type: "EDIT_DICHROMACY_CONFIGURATION",
  payload: config,
});

export const deleteDichromacyConfiguration = (
  config: Configuration
): AddDichromacyConfigurationAction => ({
  type: "DELETE_DICHROMACY_CONFIGURATION",
  payload: config,
});
