import { Buffer } from "buffer";
import { BleManager, Device, Service } from "react-native-ble-plx";
import { BLEService } from "../services/BLEService";
import { deviceTimeService } from "../data/nRFDeviceConsts";
import { Configuration } from "../redux/types";

class DeviceConnectDisconnect {
  deviceId: string;
  isConnected: boolean;

  constructor() {
    this.deviceId = "";
    this.isConnected = false;
  }

  startConnectOnly = async (config: Configuration) => {
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
      console.log("value", value, this.deviceId, this.isConnected);
      this.sendstuff(value);
    }
  };

  startConnectToDevice = (device: Device, config: Configuration) => {
    BLEService.connectToDevice(device.id).then(() => {
      this.isConnected = true;
      console.log("isconn");
      console.log("conn", this.isConnected);
      this.deviceId = device.id;
      const value = JSON.stringify(config);
      console.log("value", value, this.deviceId, this.isConnected);
      this.sendstuff(value);
    });
  };

  sendstuff = async (config: string) => {
    const d = await BLEService.discoverAllServicesAndCharacteristicsForDevice();
    const s = await d.services();
    console.log("services", s);
    if (s.length > 0) {
      console.log("id", this.deviceId);
      const s_ID = s.find(
        (val) => val.uuid == "37200001-7638-4216-b629-96ad40f79aa1"
      );
      if (s_ID) {
        const c = await d.characteristicsForService(s_ID.uuid);
        BLEService.writeCharacteristicWithResponseForDevice(
          s_ID.uuid,
          c[0].uuid,
          Buffer.from(config).toString("base64")
        );
      }
    }
  };
}

export const BLESendService = new DeviceConnectDisconnect();
