import {
  ADD_COLOUR_MAPPING,
  ADD_DICHROMACY_CONFIGURATION,
  ADD_DICHROMACY_TYPE,
  AddColourMappingAction,
  AddDichromacyConfigurationAction,
  AddDichromacyTypeAction,
} from './actionTypes';
import {Colour, DichromacyConfigurationState, DichromacyType} from './types';

export const addColourMapping = (
  oldRGB: Colour,
  newRGB: Colour,
): AddColourMappingAction => ({
  type: ADD_COLOUR_MAPPING,
  mapping: {
    originalColourRGB: oldRGB,
    newColourRGB: newRGB,
  },
});

export const addDichromacyType = (
  dichromacyType: DichromacyType,
): AddDichromacyTypeAction => ({
  type: ADD_DICHROMACY_TYPE,
  dichromacyType,
});

export const addDichromacyConfiguration = (
  config: DichromacyConfigurationState,
): AddDichromacyConfigurationAction => ({
  type: ADD_DICHROMACY_CONFIGURATION,
  config,
});
