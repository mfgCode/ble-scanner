# basic test
# require class
Scanner = require("../../ble-scanner");

# define callback
callback = (packet) ->
  console.log "Received Packet" + packet

# create new Scanner
bleScanner = new Scanner("hci0",callback);

# terminate scan after 5 second
bleScanner.destroy()