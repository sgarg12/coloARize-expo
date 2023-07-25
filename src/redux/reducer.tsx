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
            console.log("REDUCER: Add: " + addAction.payload.Name);

            return {
                ...state,
                configurations: state.configurations.concat(addAction.payload),
            };
        case "EDIT_DICHROMACY_CONFIGURATION":
            var editAction = action as EditDichromacyConfigurationAction;
            console.log("REDUCER: Edit: " + editAction.payload.oldName);

            var index = state.configurations.findIndex(
                (config) => config.Name === editAction.payload.oldName
            );
            let new_configs = state.configurations.filter(() => true);
            if (index != -1) new_configs[index] = editAction.payload.config;

            console.log("param: " + editAction.payload.oldName);
            console.log(editAction.payload.config);
            console.log("new: " + index);
            console.log(new_configs);

            return { ...state, configurations: new_configs };

        case "DELETE_DICHROMACY_CONFIGURATION":
            var deleteAction = action as DeleteDichromacyConfigurationAction;
            console.log("REDUCER: Delete: " + deleteAction.payload.Name);

            var newState = state.configurations.filter(
                (config) => config.Name != deleteAction.payload.Name
            );
            return { ...state, configurations: newState };
        default:
            return state;
    }
};
