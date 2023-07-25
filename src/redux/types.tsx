export type DichromacyType = "Protanopia" | "Deuteranopia" | "Tritanopia";

export type AlgorithmType = "Simulation" | "Default" | "SimulationRemap";

export type SimulationParams = {
    Severity: number;
};

export type DefaultParams = {
    HueShift: number;
    Phi: number;
};

export type BaseParams = {
    Name: string;
    DichromacyType: DichromacyType;
};

export type DefaultConfig = BaseParams &
    DefaultParams & { AlgorithmType: "Default" };

export type SimulatorConfig = BaseParams &
    SimulationParams & { AlgorithmType: "Simulation" };

export type SimulatorRemapConfig = BaseParams &
    DefaultParams &
    SimulationParams & { AlgorithmType: "SimulationRemap" };

export type Configuration =
    | DefaultConfig
    | SimulatorConfig
    | SimulatorRemapConfig;

export type ConfigurationList = Configuration[];

export type ConfigurationState = {
    configurations: ConfigurationList;
};
