import {
    ADD_DICHROMACY_CONFIGURATION,
    AddDichromacyConfigurationAction,
    DeleteDichromacyConfigurationAction,
    EditDichromacyConfigurationAction,
} from "./actionTypes";
import { Configuration, DichromacyType } from "./types";

export const addDichromacyConfiguration = (
    config: Configuration
): AddDichromacyConfigurationAction => ({
    type: "ADD_DICHROMACY_CONFIGURATION",
    payload: config,
});

export const editDichromacyConfiguration = (
    config: Configuration,
    oldName: string
): EditDichromacyConfigurationAction => ({
    type: "EDIT_DICHROMACY_CONFIGURATION",
    payload: {
        config: config,
        oldName: oldName,
    },
});

export const deleteDichromacyConfiguration = (
    name: string
): DeleteDichromacyConfigurationAction => ({
    type: "DELETE_DICHROMACY_CONFIGURATION",
    payload: {
        Name: name,
    },
});
