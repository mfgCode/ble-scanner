// Generated by CoffeeScript 1.4.0
var Scanner, bleScanner, callback;

Scanner = require("../../ble-scanner");

callback = function(packet) {
  return console.log("Received Packet" + packet);
};

bleScanner = new Scanner("hci0", callback);
