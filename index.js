// Generated by CoffeeScript 1.4.0
var BleScanner, spawn;

spawn = require('child_process').spawn;

BleScanner = (function() {
  var filterHciDump, hciconfig, hcidump, hcitool, init, instance;

  instance = void 0;

  hciconfig = {};

  hcidump = {};

  hcitool = {};

  init = function(hcidev, callback) {
    hciconfig = spawn('hciconfig', [hcidev, 'up']);
    hcidump = spawn('hcidump', ['-R']);
    return hciconfig.on("exit", function(code) {
      var clearHciDump, clearHciTool;
      if (code !== 0) {
        return console.log("HCICONFIG: failed to bring up device " + hcidev);
      } else {
        console.log("HCICONFIG: succesfully brought up device " + hcidev);
        clearHciDump = spawn("killall", ["hcidump"]);
        clearHciTool = spawn("killall", ["hcitool"]);
        clearHciTool.on("exit", function(code) {
          console.log("HCITOOL: cleared (code " + code + ")");
          hcitool = spawn('hcitool', ['lescan']);
          return hcitool.on("exit", function(code) {
            if (code === 1) {
              return console.log("HCITOOL: exited, already running? (code 1)");
            } else {
              console.log("HCITOOL: exited (code " + code + ")");
              return instance = void 0;
            }
          });
        });
        return clearHciDump.on("exit", function(code) {
          console.log("HCIDUMP: cleared (code " + code + ")");
          hcidump = spawn('hcidump', ['-R']);
          hcidump.on("exit", function(code) {
            console.log("HCIDUMP: exited (code " + code + ")");
            return instance = void 0;
          });
          return hcidump.stdout.on('data', function(data) {
            if (data.split(" ")[0] !== ">") {
              data = filterHciDump(data);
              return callback(data);
            }
          });
        });
      }
    });
  };

  BleScanner.prototype.destroy = function() {
    try {
      hcidump.kill();
      return hcitool.kill();
    } finally {
      instance = void 0;
    }
  };

  function BleScanner(hcidev, callback) {
    if (!instance) {
      instance = init(hcidev, callback);
    }
    instance;

  }

  filterHciDump = function(data) {
    var output;
    output = (data.slice(2)).toString('ascii').trim();
    output = output.replace(/(\r\n|\n|\r)/gm, "");
    output = output.replace(/\s+/g, "");
    return output = output.split(" ");
  };

  return BleScanner;

})();

module.exports = BleScanner;
