import {
  ADD_DICHROMACY_CONFIGURATION,
  Actions,
  AddDichromacyConfigurationAction,
  DeleteDichromacyConfigurationAction,
  EditDichromacyConfigurationAction,
} from "./actionTypes";
import { ConfigurationList } from "./types";

export const initialState: ConfigurationList = [];

export const reducer = (
  state: ConfigurationList = initialState,
  action: Actions
) => {
  switch (action.type) {
    case "ADD_DICHROMACY_CONFIGURATION":
      var addAction = action as AddDichromacyConfigurationAction;
      return [...state, addAction.payload];
    case "EDIT_DICHROMACY_CONFIGURATION":
      var editAction = action as EditDichromacyConfigurationAction;
      var index = state.findIndex(
        (config) => (config.Name = editAction.payload.oldName)
      );
      if (index != -1) state[index] = editAction.payload.config;
      return state;

    case "DELETE_DICHROMACY_CONFIGURATION":
      var deleteAction = action as DeleteDichromacyConfigurationAction;
      var newState = state.filter(
        (config) => config.Name != deleteAction.payload.Name
      );
      return newState;
    default:
      return state;
  }
};
