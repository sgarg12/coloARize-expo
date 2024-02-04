import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from "react-native-bluetooth-classic";
import ConnectionListView from "./ConnectionView";
import DeviceListView from "./DeviceListView";

//import HomeViewModel

const HomeView = () => {
  const [device, setDevice] = useState<BluetoothDevice | undefined>(undefined);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  const selectDevice = (device: BluetoothDevice) => {
    console.log("App::selectDevice() called with: ", device);
    setDevice(device);
  };
  let enabledSubscription: BluetoothEventSubscription;
  let disabledSubscription: BluetoothEventSubscription;

  useEffect(() => {
    // Anything in here is fired on component mount.
    console.log(
      "App::componentDidMount adding listeners: onBluetoothEnabled and onBluetoothDistabled"
    );
    console.log(
      "App::componentDidMount alternatively could use onStateChanged"
    );
    // enabledSubscription = RNBluetoothClassic.onBluetoothEnabled((event) =>
    //   onStateChanged(event)
    // );
    // disabledSubscription = RNBluetoothClassic.onBluetoothDisabled((event) =>
    //   onStateChanged(event)
    // );

    checkBluetootEnabled();
    return () => {
      // Anything in here is fired on component unmount.
      console.log(
        "App:componentWillUnmount removing subscriptions: enabled and distabled"
      );
      console.log(
        "App:componentWillUnmount alternatively could have used stateChanged"
      );
      enabledSubscription.remove();
      disabledSubscription.remove();
    };
  }, []);

  /**
   * Performs check on bluetooth being enabled.  This removes the `setState()`
   * from `componentDidMount()` and clears up lint issues.
   */
  const checkBluetootEnabled = async () => {
    try {
      console.log("App::componentDidMount Checking bluetooth status");
      let enabled = await RNBluetoothClassic.isBluetoothEnabled();

      console.log(`App::componentDidMount Status: ${enabled}`);
      setBluetoothEnabled(enabled);
    } catch (error) {
      console.log("App::componentDidMount Status Error: ", error);
      setBluetoothEnabled(false);
    }
  };

  /**
   * Handle state change events.
   *
   * @param stateChangedEvent event sent from Native side during state change
   */
  const onStateChanged = (stateChangedEvent: {
    enabled: boolean | ((prevState: boolean) => boolean);
  }) => {
    console.log(
      "App::onStateChanged event used for onBluetoothEnabled and onBluetoothDisabled"
    );

    setBluetoothEnabled(stateChangedEvent.enabled);
    setDevice(stateChangedEvent.enabled ? device : undefined);
  };

  return (
    <>
      <View>
        {/* {!device ? (
          <DeviceListView
            bluetoothEnabled={bluetoothEnabled}
            selectDevice={selectDevice}
          />
        ) : (
          <ConnectionListView
            device={device}
            onBack={() => setDevice(undefined)}
          />
        )} */}
      </View>
      {/* <View style={styles.parent_container}>
        <Text style={styles.text_header}>What is ColoARize?</Text>
        <View style={styles.container}>
          <Text style={styles.text}>
            An app to help configure your ColoARize MR headset to custom colour
            mappings
          </Text>
        </View>
        <Text style={styles.text_header}>Types of Dichromacy</Text>
        <View style={styles.container}>
          <Text style={styles.container_header}>
            Red-Green Colour Blindness
          </Text>

          <View style={styles.container_body}>
            <View>
              <Text style={styles.text}>1. Protanopia</Text>
              <Text style={styles.text}>2. Protanomaly</Text>
              <Text style={styles.text}>3. Deuteranopia</Text>
              <Text style={styles.text}>4. Deuteranomaly</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.container_header}>
            Blue-Yellow Colour Blindness
          </Text>

          <View style={styles.container_body}>
            <View>
              <Text style={styles.text}>1. Tritanopia</Text>
              <Text style={styles.text}>2. Tritanomaly</Text>
            </View>
          </View>
        </View>
      </View> */}
    </>
    //Other components
  );
};

export default HomeView;

const styles = StyleSheet.create({
  text_header: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
    margin: 5,
  },
  container: {
    backgroundColor: "#724DC6",
    margin: 10,
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 15,
  },
  container_header: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
    color: "#FFFFFF",
  },
  container_body: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },

  text: {
    color: "#FFFFFF",
  },

  parent_container: {
    paddingTop: 40,
  },
});
