import { Buffer } from "buffer";
import { BleManager, Device, Service } from "react-native-ble-plx";
import { BLEService } from "../services/BLEService";
import { deviceTimeService } from "../data/nRFDeviceConsts";
import { Configuration } from "../redux/types";
import { Alert } from "react-native";

class DeviceConnectDisconnect {
  deviceId: string;
  isConnected: boolean;

  constructor() {
    this.deviceId = "";
    this.isConnected = false;
  }

  startConnectOnly = async (config: Configuration) => {
    console.log("bluetooth connection process started:", Date.now());
    await BLEService.initializeBLE();
    BLEService.scanDevices(
      (device: Device) => {
        console.info(`connecting to ${device.id}`);
        this.startConnectToDevice(device, config);
      },
      [deviceTimeService]
    );
  };

  sendToHeadset = (config: Configuration) => {
    if (!this.isConnected) {
      this.startConnectOnly(config);
    } else {
      const value = JSON.stringify(config);
      console.log("sending to headset", value, this.deviceId, Date.now());
      this.sendstuff(value);
    }
  };

  startConnectToDevice = (device: Device, config: Configuration) => {
    BLEService.connectToDevice(device.id).then(() => {
      this.isConnected = true;
      this.deviceId = device.id;
      const value = JSON.stringify(config);
      this.sendstuff(value);
    });
  };

  sendstuff = async (config: string) => {
    const d = await BLEService.discoverAllServicesAndCharacteristicsForDevice();
    const s = await d.services();
    if (s.length > 0) {
      console.log("id", this.deviceId);
      const s_ID = s.find(
        (val) => val.uuid == "37200001-7638-4216-b629-96ad40f79aa1"
      );
      if (s_ID) {
        const c = await d.characteristicsForService(s_ID.uuid);
        const res = BLEService.writeCharacteristicWithResponseForDevice(
          s_ID.uuid,
          c[0].uuid,
          Buffer.from(config).toString("base64")
        );
        res.then(() => {
          Alert.alert("Configuration sent");
          console.log("config sent at", Date.now());
        });
      }
    }
  };
}

export const BLESendService = new DeviceConnectDisconnect();
