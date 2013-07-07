# BLE-Scanner
An easy to use ble-scanner (bluetooth smart / 4.0) for node. Requires a Linux OS with bluez stack tools (hciconfig, hcitool, hcidump) to be installed.

## Usage
The ble-scanner is designed as a singleton class. It can be used as followed:

    #require module
    Scanner = require("ble-scanner");

    # define input
    device = "hci0";
    callback = (packet) ->
      # packet is an array with hex values
      console.log "Received Packet: " + packet

    # create new Scanner
    bleScanner = new Scanner(device,callback);

The code above will result in every packet received to be logged to the console.

## Notes

1. The device is used to make sure the specific device is up. The scan is not device specific.
2. The callback is handed an array with hex-values as strings. Interpreting the packet is not done by ble-scanner.

## Known issues

1. The first packet will always be invalid as this is the console output of hcidump. Packet validation needs to be done by the callback().