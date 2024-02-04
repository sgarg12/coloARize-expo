import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Container, Text, Button, Icon } from "native-base";
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from "react-native-bluetooth-classic";

export type ConnectionProps = {
  device: BluetoothDevice;
  onBack: () => void;
};

const ConnectionListView = ({ device }: ConnectionProps) => {
  const [text, setText] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [polling, setPolling] = useState(false);
  const [connectionState, setConnection] = useState(false);
  const [connectionOptionsDelimiter, setConnectionOptionsDelimiter] =
    useState("9");
  let readInterval: NodeJS.Timer;
  let readSubscription: BluetoothEventSubscription;

  useEffect(() => {
    // Anything in here is fired on component mount.
    setTimeout(() => connect(), 0);

    async function awaitDisconnect() {
      await device.disconnect();
    }
    return () => {
      // Anything in here is fired on component unmount.
      if (connectionState) {
        try {
          awaitDisconnect();
        } catch (error) {
          // Unable to disconnect from device
          console.error(error);
        }
      }
      uninitializeRead();
    };
  }, []);

  const connect = async () => {
    try {
      let connection = await device.isConnected();
      if (!connection) {
        addData({
          data: `Attempting connection to ${device.address}`,
          timestamp: new Date(),
          type: "error",
        });

        console.log(connectionOptionsDelimiter);
        connection = await device.connect();

        addData({
          data: "Connection successful",
          timestamp: new Date(),
          type: "info",
        });
      } else {
        addData({
          data: `Connected to ${device.address}`,
          timestamp: new Date(),
          type: "error",
        });
      }

      setConnection(connection);
      initializeRead();
    } catch (error: any) {
      addData({
        data: `Connection failed: ${error.message}`,
        timestamp: new Date(),
        type: "error",
      });
    }
  };

  const disconnect = async (disconnected: boolean) => {
    try {
      if (!disconnected) {
        disconnected = await device.disconnect();
      }

      addData({
        data: "Disconnected",
        timestamp: new Date(),
        type: "info",
      });

      setConnection(!disconnected);
    } catch (error: any) {
      addData({
        data: `Disconnect failed: ${error.message}`,
        timestamp: new Date(),
        type: "error",
      });
    }

    // Clear the reads, so that they don't get duplicated
    uninitializeRead();
  };

  const initializeRead = () => {
    const disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() =>
      disconnect(true)
    );

    if (polling) {
      readInterval = setInterval(() => performRead(), 5000);
    } else {
      readSubscription = device.onDataReceived((data) => onReceivedData(data));
    }
  };

  /**
   * Clear the reading functionality.
   */
  const uninitializeRead = () => {
    if (readInterval) {
      clearInterval(readInterval);
    }
    if (readSubscription) {
      readSubscription.remove();
    }
  };

  const performRead = async () => {
    try {
      console.log("Polling for available messages");
      let available = await device.available();
      console.log(`There is data available [${available}], attempting read`);

      if (available > 0) {
        for (let i = 0; i < available; i++) {
          console.log(`reading ${i}th time`);
          let data = await device.read();

          console.log(`Read data ${data}`);
          console.log(data);
          onReceivedData({ data });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handles the ReadEvent by adding a timestamp and applying it to
   * list of received data.
   *
   * @param {ReadEvent} event
   */
  const onReceivedData = async (event: any) => {
    event.timestamp = new Date();
    addData({
      ...event,
      timestamp: new Date(),
      type: "receive",
    });
  };

  const addData = async (message: any) => {
    setData([message, ...data]);
  };

  /**
   * Attempts to send data to the connected Device.  The input text is
   * padded with a NEWLINE (which is required for most commands)
   */
  const sendData = async () => {
    try {
      console.log(`Attempting to send data ${text}`);
      let message = text + "\r";
      await RNBluetoothClassic.writeToDevice(device.address, message);

      addData({
        timestamp: new Date(),
        data: text,
        type: "sent",
      });

      let data = Buffer.alloc(10, 0xef);
      await device.write(data);

      addData({
        timestamp: new Date(),
        data: `Byte array: ${data.toString()}`,
        type: "sent",
      });

      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleConnection = async () => {
    if (connectionState) {
      disconnect(false);
    } else {
      connect();
    }
  };

  const InputArea = ({
    text,
    onChangeText,
    onSend,
    disabled,
  }: {
    text: string;
    onChangeText: (text: any) => void;
    onSend: () => {};
    disabled: boolean;
  }) => {
    let style = disabled ? styles.inputArea : styles.inputAreaConnected;
    return (
      <View style={style}>
        <TextInput
          style={styles.inputAreaTextInput}
          placeholder={"Command/Text"}
          value={text}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onSend}
          returnKeyType="send"
          editable={!disabled}
        />
        <TouchableOpacity
          style={styles.inputAreaSendButton}
          onPress={onSend}
          disabled={disabled}
        >
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container>
      <View>
        <Text>{device.name}</Text>
        <Text>{device.address}</Text>
      </View>

      <Button onPress={() => toggleConnection()}>
        <Text>Toggle</Text>
      </Button>

      <View style={styles.connectionScreenWrapper}>
        <FlatList
          style={styles.connectionScreenOutput}
          contentContainerStyle={{ justifyContent: "flex-end" }}
          inverted
          ref="scannedDataList"
          data={data}
          keyExtractor={(item) => item.timestamp.toISOString()}
          renderItem={({ item }) => (
            <View id={item.timestamp.toISOString()}>
              <Text>{item.timestamp.toLocaleDateString()}</Text>
              <Text>{item.type === "sent" ? " < " : " > "}</Text>
              <Text flexShrink={1}>{item.data.trim()}</Text>
            </View>
          )}
        />
        <InputArea
          text={text}
          onChangeText={(text: any) => setText(text)}
          onSend={() => sendData()}
          disabled={!connectionState}
        />
      </View>
    </Container>
  );
};

export default ConnectionListView;

const styles = StyleSheet.create({
  connectionScreenWrapper: {
    flex: 1,
  },
  connectionScreenOutput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  inputArea: {
    flexDirection: "row",
    alignContent: "stretch",
    backgroundColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  inputAreaConnected: {
    flexDirection: "row",
    alignContent: "stretch",
    backgroundColor: "#90EE90",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  inputAreaTextInput: {
    flex: 1,
    height: 40,
  },
  inputAreaSendButton: {
    justifyContent: "center",
    flexShrink: 1,
  },
});
