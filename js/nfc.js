function updateText(text) {
    $('#new_devices').append('<p>' + text + '</p>');
}

function NfcActivityHandler(activity) {
    var activityName = activity.source.name;
    var data = activity.source.data;

    switch (activityName) {
        case 'nfc-ndef-discovered': // This is where we detect the data
            updateText('XX Received Activity: nfc ndef message(s): ' +
                JSON.stringify(data.records));
            updateText('XX Received Activity: data: ' + JSON.stringify(data));
            break;
        case 'nfc-tech-discovered':
            updateText('XX Received Activity: nfc technology message(s): ' +
                JSON.stringify(data.records));
            break;
        case 'nfc-tag-discovered':
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
    //file1 = appStorage.get("local/webapps/webapps.json");
    //var file = appStorage.get("local/webapps/{6283d35f-e5ca-462c-a7d6-eed7eef7c343}/application.zip");

    var ndef = nfcText.createTextNdefRecord_Utf8('Dummy Text', 'en');
    records.push(ndef);
    //records.push(file);

    var req = nfcPeer.sendNDEF(records);
    req.onsuccess = (function() {
        updateText('Sent file successfully');
    });
    req.onerror = (function() {
        updateText('Unable to send file');
    });
}

window.onload = function onload() {
    navigator.mozSetMessageHandler('activity', NfcActivityHandler);

    window.navigator.mozNfc.onpeerready = function(event) {
        var nfcdom = window.navigator.mozNfc;
        var nfcPeer = nfcdom.getNFCPeer(event.detail);

        updateText('New Device Found!');

        //send_file(nfcPeer);

        var records = new Array();

        var appStorage = navigator.getDeviceStorage('apps');
        //file1 = appStorage.get("local/webapps/webapps.json");
        //var file = appStorage.get("local/webapps/{6283d35f-e5ca-462c-a7d6-eed7eef7c343}/application.zip");

        var ndef = nfcText.createTextNdefRecord_Utf8('Dummy Text', 'en');
        records.push(ndef);
        //records.push(file);

        var req = nfcPeer.sendNDEF(records);
        req.onsuccess = (function() {
            updateText('Sent file successfully');
        });
        req.onerror = (function() {
            updateText('Unable to send file');
        });
    };
}
