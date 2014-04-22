function updateText(text) {
    $('#new_devices').append('<p>' + text + '</p>');
}

function handleNdefDiscovered(activityData) {
    var nfcdom = window.navigator.mozNfc;
    var nfcTag = nfcdom.getNFCTag(activityData.sessionToken);
    nfcUI.nfcTag = nfcTag;
    if (!nfcTag) {
        updateText('Error: handleNdefDiscovered: can\'t get NFC Tag' +
            ' session for operations.');
        return false;
    }

    switch (activityData.tech) {
        case 'P2P':
            // Process existing message.
            return handleNdefDiscoveredMessages(activityData.records);
            break;
        case 'NDEF':
            // Fall through
        case 'NDEF_FORMATTABLE':
            if (activityData.records === null) {
                // Process unread message.
                return handleNdefType(activityData.sessionToken,
                    activityData.tech);
            } else {
                return handleNdefDiscoveredMessages(activityData.records);
            }
            break;
        case 'NFC_A':
            debug('Not implemented');
        case 'MIFARE_ULTRALIGHT':
            debug('Not implemented');
            break;
  }
  return false;
}

function NfcActivityHandler(activity) {
    var activityName = activity.source.name;
    var data = activity.source.data;

    console.log('XX Received Activity: name: ' + activityName);
    updateText(activityName);

    switch (activityName) {
        case 'nfc-ndef-discovered': // This is where we detect the data
            console.log('XX Received Activity: ndef: ' +
                JSON.stringify(data.records));
            updateText('XX Received Activity: ndef: ' +
                JSON.stringify(data.records));
            updateText('XX Received Activity: data: ' + JSON.stringify(data));
            handleNdefDiscovered(data);
            break;
        case 'nfc-tech-discovered':
            console.log('XX Received Activity: nfc technology message(s): ' +
                JSON.stringify(data.records));

            updateText('XX Received Activity: nfc technology message(s): ' +
                JSON.stringify(data.records));
            break;
        case 'nfc-tag-discovered':
            console.log('XX Received Activity: nfc tag message(s): ' +
                JSON.stringify(data.records));
            updateText('XX Received Activity: nfc tag message(s): ' +
                JSON.stringify(data.records));
            break;
        case 'nfc-tech-lost':
            updateText('XX Received Activity: nfc-tech-lost: ' +
                JSON.stringify(data));
            break;
        case 'ndefpush-receive':
            updateText('XX Received Activity: ndefpush-receive: ' +
                JSON.stringify(data));
            break;
    }
}

function send_file(peer) {
    var records = new Array();

    var appStorage = navigator.getDeviceStorage('apps');
    file1 = appStorage.get('local/webapps/webapps.json');
    var file = appStorage.get(
        'local/webapps/{6283d35f-e5ca-462c-a7d6-eed7eef7c343}/application.zip');

    var ndef = nfcText.createTextNdefRecord_Utf8('Dummy Text', 'en');
    records.push(ndef);
    records.push(file);

    var req = nfcPeer.sendNDEF(records);
    req.onsuccess = (function() {
        updateText('Sent file successfully');
    });
    req.onerror = (function() {
        updateText('Unable to send file');
    });
}

window.onload = function() {
    navigator.mozSetMessageHandler('activity', NfcActivityHandler);

    window.navigator.mozNfc.onpeerready = function(event) {
        console.log('In onpeerready handler' + JSON.stringify(event.detail));
        updateText('New Device Found!');

        var nfcdom = window.navigator.mozNfc;
        var nfcPeer = nfcdom.getNFCPeer(event.detail);

        send_file(nfcPeer);
    };
};
