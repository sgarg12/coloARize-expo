import {DichromacyConfigurationState} from './types';
import {
  ADD_COLOUR_MAPPING,
  ADD_DICHROMACY_CONFIGURATION,
  ADD_DICHROMACY_TYPE,
  Actions,
  AddDichromacyTypeAction,
} from './actionTypes';

export const initialState: DichromacyConfigurationState = {
  type: '',
  mapping: [],
};

export const reducer = (
  state: DichromacyConfigurationState = initialState,
  action: Actions,
) => {
  switch (action.type) {
    case ADD_COLOUR_MAPPING:
      return state;
    case ADD_DICHROMACY_TYPE:
      var payload = action as AddDichromacyTypeAction;
      return {...state, type: payload.dichromacyType};
    case ADD_DICHROMACY_CONFIGURATION:
    default:
      return state;
  }
};
