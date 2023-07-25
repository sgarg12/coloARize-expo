import {
    Actions,
    AddDichromacyConfigurationAction,
    DeleteDichromacyConfigurationAction,
    EditDichromacyConfigurationAction,
} from "./actionTypes";
import { ConfigurationState } from "./types";

export const initialState: ConfigurationState = {
    configurations: [],
};

export const reducer = (
    state: ConfigurationState = initialState,
    action: Actions
) => {
    switch (action.type) {
        case "ADD_DICHROMACY_CONFIGURATION":
            var addAction = action as AddDichromacyConfigurationAction;
            return {
                ...state,
                configurations: state.configurations.concat(addAction.payload),
            };
        case "EDIT_DICHROMACY_CONFIGURATION":
            var editAction = action as EditDichromacyConfigurationAction;
            var index = state.configurations.findIndex(
                (config) => config.Name === editAction.payload.oldName
            );
            let new_configs = state.configurations.filter(() => true);
            if (index != -1) new_configs[index] = editAction.payload.config;
            return { ...state, configurations: new_configs };

        case "DELETE_DICHROMACY_CONFIGURATION":
            var deleteAction = action as DeleteDichromacyConfigurationAction;
            var newState = state.configurations.filter(
                (config) => config.Name != deleteAction.payload.Name
            );
            return { ...state, configurations: newState };
        default:
            return state;
    }
};
