var remote = require('electron').remote,
cmdArgs = remote.getGlobal('sharedObject').cmdArgs;
console.log(cmdArgs); // output : ["arg1", "arg2"]