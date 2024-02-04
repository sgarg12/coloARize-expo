import { Button, Container, Toast } from "native-base";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
} from "react-native";
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from "react-native-bluetooth-classic";

export type DeviceListProps = {
  selectDevice: (device: BluetoothDevice) => void;
  bluetoothEnabled: boolean;
};

const DeviceListView = ({
  selectDevice,
  bluetoothEnabled,
}: DeviceListProps) => {
  const [devicesState, setDevices] = useState<BluetoothDevice[]>([]);
  const [accepting, setAccepting] = useState(false);
  const [discovering, setDiscovering] = useState(false);

  useEffect(() => {
    // Anything in here is fired on component mount.
    getBondedDevices(false);
    return () => {
      // Anything in here is fired on component unmount.
      if (accepting) {
        cancelAcceptConnections();
      }

      if (discovering) {
        cancelDiscovery();
      }
    };
  }, []);

  const requestAccessFineLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Access fine location required for discovery",
        message:
          "In order to perform discovery, you must enable/allow " +
          "fine location access.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getBondedDevices = async (unloading: boolean) => {
    console.log("DeviceListScreen::getBondedDevices");
    try {
      let bonded = await RNBluetoothClassic.getBondedDevices();
      console.log("DeviceListScreen::getBondedDevices found", bonded);

      if (!unloading) {
        setDevices(bonded);
      }
    } catch (error: any) {
      setDevices([]);
      console.log("err", error.message);
    }
  };

  /**
   * Starts attempting to accept a connection.  If a device was accepted it will
   * be passed to the application context as the current device.
   */
  const acceptConnections = async () => {
    if (accepting) {
      console.log("Already accepting connections");
      return;
    }

    setAccepting(true);

    try {
      let mapprop = JSON.parse('{ "delimiter": "\r" }');
      let device = await RNBluetoothClassic.accept(
        new Map(Object.entries(mapprop))
      );
      if (device) {
        selectDevice(device);
      }
    } catch (error) {
      // If we're not in an accepting state, then chances are we actually
      // requested the cancellation.  This could be managed on the native
      // side but for now this gives more options.
      if (!accepting) {
        console.log("Attempt to accept connection failed.");
      }
    } finally {
      setAccepting(false);
    }
  };

  /**
   * Cancels the current accept - might be wise to check accepting state prior
   * to attempting.
   */
  const cancelAcceptConnections = async () => {
    if (!accepting) {
      return;
    }

    try {
      let cancelled = await RNBluetoothClassic.cancelAccept();
      setAccepting(!cancelled);
    } catch (error) {
      console.log("Unable to cancel accept connection");
    }
  };

  const startDiscovery = async () => {
    try {
      let granted = await requestAccessFineLocationPermission();

      if (!granted) {
        throw new Error("Access fine location was not granted");
      }

      setDiscovering(true);

      let devices = [...devicesState];

      try {
        let unpaired = await RNBluetoothClassic.startDiscovery();

        let index = devices.findIndex((d) => !d.bonded);
        if (index >= 0) {
          devices.splice(index, devices.length - index, ...unpaired);
        } else {
          devices.push(...unpaired);
        }
        console.log(`Found ${unpaired.length} unpaired devices.`);
      } finally {
        setDevices(devices);
        setDiscovering(false);
      }
    } catch (err: any) {
      console.log(`${err.message}`);
    }
  };

  const cancelDiscovery = async () => {
    try {
    } catch (error) {
      console.log("Error occurred while attempting to cancel discover devices");
    }
  };

  const requestEnabled = async () => {
    try {
    } catch (error: any) {
      console.log(`Error occurred while enabling bluetooth: ${error.message}`);
    }
  };
  let toggleAccept = accepting
    ? () => cancelAcceptConnections()
    : () => acceptConnections();

  let toggleDiscovery = discovering
    ? () => cancelDiscovery()
    : () => startDiscovery();

  return (
    <Container>
      {bluetoothEnabled ? (
        <Button
          onPress={(event) => {
            getBondedDevices(false);
          }}
        >
          <Text>bonded</Text>
        </Button>
      ) : undefined}

      {bluetoothEnabled ? (
        <>
          <DeviceList
            devices={devicesState}
            onPress={selectDevice}
            onLongPress={selectDevice}
          />
          {Platform.OS !== "ios" ? (
            <View>
              <Button onPress={toggleAccept}>
                <Text>
                  {accepting ? "Accepting (cancel)..." : "Accept Connection"}
                </Text>
              </Button>
              <Button onPress={toggleDiscovery}>
                <Text>
                  {discovering ? "Discovering (cancel)..." : "Discover Devices"}
                </Text>
              </Button>
            </View>
          ) : undefined}
        </>
      ) : (
        <>
          <Text>Bluetooth is OFF</Text>
          <Button onPress={() => requestEnabled()}>
            <Text>Enable Bluetooth</Text>
          </Button>
        </>
      )}
    </Container>
    //Other components
  );
};

export const DeviceList = ({
  devices,
  onPress,
  onLongPress,
}: {
  devices: BluetoothDevice[];
  onPress: (device: BluetoothDevice) => void;
  onLongPress: (device: BluetoothDevice) => void;
}) => {
  const renderItem = ({ item }: { item: BluetoothDevice }) => {
    return (
      <DeviceListItem
        device={item}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  };

  return (
    <FlatList
      data={devices}
      renderItem={renderItem}
      keyExtractor={(item) => item.address}
    />
  );
};

export const DeviceListItem = ({
  device,
  onPress,
  onLongPress,
}: {
  device: BluetoothDevice;
  onPress: (device: BluetoothDevice) => void;
  onLongPress: (device: BluetoothDevice) => void;
}) => {
  let icon = device.bonded ? "ios-bluetooth" : "ios-cellular";

  return (
    <TouchableOpacity
      onPress={() => onPress(device)}
      onLongPress={() => onLongPress(device)}
      style={styles.deviceListItem}
    >
      <View style={styles.deviceListItemIcon}>
        <Text>device list</Text>
      </View>
      <View>
        <Text>{device.name}</Text>
        <Text>{device.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deviceListItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  deviceListItemIcon: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeviceListView;
