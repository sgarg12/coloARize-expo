import { Configuration, DichromacyType } from "./types";

export type ADD_DICHROMACY_CONFIGURATION = "ADD_DICHROMACY_CONFIGURATION";
export type EDIT_DICHROMACY_CONFIGURATION = "EDIT_DICHROMACY_CONFIGURATION";
export type DELETE_DICHROMACY_CONFIGURATION = "DELETE_DICHROMACY_CONFIGURATION";

export type ActionTypes =
  | ADD_DICHROMACY_CONFIGURATION
  | EDIT_DICHROMACY_CONFIGURATION
  | DELETE_DICHROMACY_CONFIGURATION;

export type AddDichromacyConfigurationAction = {
  type: ActionTypes;
  payload: Configuration;
};

export type EditDichromacyConfigurationAction = {
  type: ActionTypes;
  payload: {
    config: Configuration;
    oldName: string;
  };
};

export type DeleteDichromacyConfigurationAction = {
  type: ActionTypes;
  payload: {
    Name: string;
  };
};

export type Actions =
  | AddDichromacyConfigurationAction
  | EditDichromacyConfigurationAction
  | DeleteDichromacyConfigurationAction;
