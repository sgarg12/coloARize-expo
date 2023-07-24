export type DichromacyType = "Protanopia" | "Deuteranopia" | "Tritanopia";

export type AlgorithmType = "Simulation" | "Default";

export type SimulationParams = {
  Severity: number;
};

export type DefaultParams = {
  HueShift: number;
  Phi: number;
};

export type Configuration = {
  Name: string;
  DichromacyType: DichromacyType;
  AlgorithmType: AlgorithmType;
  Parameters: SimulationParams | DefaultParams;
};

export type ConfigurationList = Configuration[];
