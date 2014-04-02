function NfcActivityHandler(activity) {
    var activityName = activity.source.name;
    var data = activity.source.data;

    switch (activityName) {
        case 'nfc-ndef-discovered':
            debug('XX Received Activity: nfc ndef message(s): ' +
                JSON.stringify(data.records));
            debug('XX Received Activity: data: ' + JSON.stringify(data));
            nfcUI.setConnectedState(true);
            // If there is a pending tag write, apply that write now.
            nfcUI.writePendingMessage();
            handleNdefDiscovered(data);
            break;
        case 'nfc-tech-discovered':
            debug('XX Received Activity: nfc technology message(s): ' +
                JSON.stringify(data.records));
            nfcUI.setConnectedState(true);
            // If there is a pending tag write, apply that write now.
            nfcUI.writePendingMessage();
            handleTechnologyDiscovered(data);
            break;
        case 'nfc-tag-discovered':
            debug('XX Received Activity: nfc tag message(s): ' +
                JSON.stringify(data.records));
            nfcUI.setConnectedState(true);
            // If there is a pending tag write, apply that write now.
            nfcUI.writePendingMessage();
            handleTagDiscoveredMessages(data);
            break;
        case 'nfc-tech-lost':
            debug('XX Received Activity: nfc-tech-lost: ' +
                JSON.stringify(data));
            nfcUI.setConnectedState(false);
            break;
        case 'ndefpush-receive':
            debug('XX Received Activity: ndefpush-receive: ' +
                JSON.stringify(data));
            nfcUI.setConnectedState(true);
            break;
    }
}

window.onload = function onload() {
  window.navigator.mozSetMessageHandler('activity', NfcActivityHandler);

  window.navigator.mozNfc.onpeerready = function(event) {
    var nfcdom = window.navigator.mozNfc;
    var nfcPeer = nfcdom.getNFCPeer(event.detail);

    var new_devices = $('#new_devices');
    new_devices.append('<p>New Device Found!</p>');
   
    var appStorage = navigator.getDeviceStorage('apps');
    file1 = appStorage.get("local/webapps/webapps.json");
    var file = appStorage.get("local/webapps/{6283d35f-e5ca-462c-a7d6-eed7eef7c343}/application.zip");

    var records = new Array();
    var ndef = nfcText.createTextNdefRecord_Utf8('Dummy Text', 'en');
    records.push(ndef);
    records.push(file); 
    var req = nfcPeer.sendNDEF(records);
    req.onsuccess = (function() {
    	debug('SEND NDEF successfully');
    }); 

    req.onerror = (function() {
    	debug('SEND NDEF FAILED');
    });
  };
}
