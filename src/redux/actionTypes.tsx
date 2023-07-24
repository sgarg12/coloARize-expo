import {
  ColourMapping,
  DichromacyConfigurationState,
  DichromacyType,
} from './types';

export const ADD_COLOUR_MAPPING = 'ADD_COLOUR_MAPPING';
export const ADD_DICHROMACY_TYPE = 'ADD_DICHROMACY_TYPE';
export const ADD_DICHROMACY_CONFIGURATION = 'ADD_DICHROMACY_CONFIGURATION';

export type AddColourMappingAction = {
  type: string;
  mapping: ColourMapping;
};
export type AddDichromacyTypeAction = {
  type: string;
  dichromacyType: DichromacyType;
};
export type AddDichromacyConfigurationAction = {
  type: string;
  config: DichromacyConfigurationState;
};

export type Actions =
  | AddColourMappingAction
  | AddDichromacyConfigurationAction
  | AddDichromacyTypeAction;
