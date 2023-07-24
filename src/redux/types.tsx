export type Colour = {
  r: number;
  g: number;
  b: number;
};

export type ColourMapping = {
  originalColourRGB: Colour;
  newColourRGB: Colour;
};

export type DichromacyType = 'Protanopia' | 'Deuteranopia' | 'Tritanopia';

export type ColourMappingList = ColourMapping[];

export type DichromacyConfigurationState = {
  type: DichromacyType | '';
  mapping: ColourMappingList | [];
};
