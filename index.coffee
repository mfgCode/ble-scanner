# BLE-SCANNER

spawn = require('child_process').spawn

#class ex.BleScanner
class BleScanner
  # singleton instance
  instance = undefined
  # The class must be constructed with a callback function
  # which will process all packets and it will be constructed
  # by creating all hooks to bluez
  # callback - function, that receives one data parameter
  init = (@hcidev, @callback) ->
    # bring up hci device
    @hciconfig = spawn 'hciconfig', [@hcidev,'up']
    # dump results from scan
    @hcidump = spawn 'hcidump',['-R']

    @hciconfig.on "exit", (code) ->
      if code != 0
        console.log "HCICONFIG: failed to bring up device "+@hcidev
      else
        console.log "HCICONFIG: succesfully brought up device "+@hcidev
        # clear hci-processes
        @clearHciDump = spawn "killall", ["hcidump"]
        @clearHciTool = spawn "killall", ["hcitool"]

        # reset singleton if tool exists
        @clearHciTool.on "exit", (code) ->
          console.log "HCITOOL: cleared (code #{code})"
          # start le scan
          @hcitool = spawn 'hcitool',['lescan']
          @hcitool.on "exit", (code) ->
            if code == 1
              console.log "HCITOOL: exited, already running? (code 1)"
            else
              console.log "HCITOOL: exited (code #{code})"
              instance = undefined

        # dump results from scan
        @clearHciDump.on "exit", (code) ->
          console.log "cleared hcidump (#{code})"
          @hcidump = spawn 'hcidump',['-R']

          # exit handling
          @hcidump.on "exit", (code) ->
            console.log "hcidump exited (#{code}) ... killing instance"
            instance = undefined

          # Set listener for hcidump
          @hcidump.stdout.on('data', (data) ->
            data = filterHciDump(data)
            @callback(data)
          )

  constructor : (hcidev, callback) ->
    instance = init(hcidev, callback) unless instance
    instance
  # Define helper to format BLE packet

  filterHciDump = (data) ->
    # remove the first 5 bytes, they contain "> " from the dumptool
    # convert to ascii to have the original RAW
    output = (data.slice 5).toString('ascii')

    # strip line breaks from string
    output = output.replace(/(\r\n|\n|\r)/gm,"");
    # strip double spaces from string
    output.replace(/\s+/g," ")
    # split into hex array
    output = output.split " "

module.exports = BleScanner